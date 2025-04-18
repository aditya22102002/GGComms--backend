import { asyncHandler } from "../utils/asynchandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        console.error("Token generation error:", error);
        throw new ApiError(500, "Something went wrong while generating refresh and access token");
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation
    //check if user already exist: check via username
    // check for avatar and image
    // upload to cloudinary
    //create user object- create entry in db
    // remove password and referesh token field from response
    // check for user creation 
    // return response 

    const { fullname, email, username, password } = req.body

    if (!fullname || !email || !username || !password) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, "user with this username or email exist")
    }

    const user = await User.create({
        fullname,
        username: username.toLowerCase(), password,

        email,
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong wile registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully",)
    )
})

const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body
    if (!email && !password) {
        throw new ApiError(400, "All Field are Rquired")
    }
    const logUser = await User.findOne({ email })
    if (!logUser) {
        throw new ApiError(404, "Invalid Email")
    }
    const isPasswordValid = await logUser.isPasswordCorrect(password)

    if (!isPasswordValid) {
        console.log("Password did not match");
        throw new ApiError(401, "Invalid password")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(logUser._id)
    const loggedInUser = await User.findById(logUser._id).select("-password -refreshToken")
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None", 
        maxAge: 7 * 24 * 60 * 60 * 1000
    }

    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(new ApiResponse(200, {
        user: loggedInUser,
        accessToken, refreshToken
    }))
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        }, {
        new: true
    }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(new ApiResponse(200, {}, "User Logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)
        if (!user) {
            throw new ApiError(401, "invalid refresh token")
        }
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "refresh token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: true
        }
        const { accessToken, newrefreshToken } = await generateAccessAndRefreshToken(user._id)

        return res.status(200).cookie("accessToken", accessToken).cookie("refreshToken", newrefreshToken).json(new ApiResponse(200, { accessToken, refreshToken: newrefreshToken }, "access token refreshed successfully"))
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid refresh token")
    }
})

// const changeCurentPassorwd = asyncHandler(async (req, res) => {
//     const { oldPassword, newPassword } = req.body
//     const user = await User.findById(req.user?._id)
//     const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
//     if (!isPasswordCorrect) {
//         throw new ApiError(400, "Invalid old password")
//     }

//     user.password = newPassword
//     await user.save({ validateBeforeSave: false })

//     return res.status(200).json(new ApiResponse(200, {}, "password changes successfully"))
// })

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, req.user, "Current user fetched successfully"))
})

// const updateAccountDetails = asyncHandler(async (req, res) => {
//     const { fullname, email } = req.body

//     if (!fullname || !email) {
//         throw new ApiError(400, "All fields are required")
//     }

//     const user = await User.findByIdAndUpdate(
//         req.user?._id,
//         {
//             $set: {
//                 fullname,
//                 email
//             }
//         },
//         { new: true }
//     ).select("-password")

//     return res.status(200).json(new ApiResponse(200, user, "User details updated successfully"))
// })

const sendFriendRequest = async (req, res) => {
    const fromUserId = req.user._id;
    const { toUserId } = req.body;

    if (fromUserId.toString() === toUserId) {
        return res.status(400).json({ message: "You can't add yourself as a friend" });
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) return res.status(404).json({ message: 'User not found' });

    const alreadySent = toUser.friendRequests.find(
        req => req.from.toString() === fromUserId.toString()

    );

    if (alreadySent) {
        return res.status(400).json({ message: 'Friend request already sent' });
    }

    toUser.friendRequests.push({ from: fromUserId });
    await toUser.save();

    res.status(200).json({ message: 'Friend request sent' });
};


const acceptFriendRequest = async (req, res) => {
    const userId = req.user._id;
    const { fromUserId } = req.body;

    const user = await User.findById(userId);
    const fromUser = await User.findById(fromUserId);
    if (!user || !fromUser) return res.status(404).json({ message: 'User not found' });

    const requestIndex = user.friendRequests.findIndex(
        req => req.from.toString() === fromUserId && req.status === 'pending'
    );

    if (requestIndex === -1) {
        return res.status(400).json({ message: 'Friend request not found' });
    }

    // Update request status (optional since we're removing it)
    user.friendRequests[requestIndex].status = 'accepted';

    // Add each other to friends
    user.friends.push(fromUserId);
    fromUser.friends.push(userId);

    // Remove the request from user's friendRequests
    user.friendRequests.splice(requestIndex, 1);

    await user.save();
    await fromUser.save();

    res.status(200).json({ message: 'Friend request accepted' });
};

const declineFriendRequest = async (req, res) => {
    const userId = req.user._id;
    const { fromUserId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const requestIndex = user.friendRequests.findIndex(
        req => req.from.toString() === fromUserId && req.status === 'pending'
    );

    if (requestIndex === -1) {
        return res.status(400).json({ message: 'Friend request not found' });
    }

    // Remove the request
    user.friendRequests.splice(requestIndex, 1);

    await user.save();

    res.status(200).json({ message: 'Friend request declined' });
};


const getFriends = async (req, res) => {
    const user = await User.findById(req.user._id).populate('friends', 'fullname email');
    res.status(200).json({ friends: user.friends });
};
const getFriendRequests = async (req, res) => {

    const user = await User.findById(req.user._id)
        .populate('friendRequests.from', 'fullname _id');

    if (!user) return res.status(404).json({ message: 'User not found' });

    const pendingRequests = user.friendRequests
        .filter(request => request.status === 'pending')
        .map(request => ({
            _id: request.from._id,
            fullname: request.from.fullname
        }));
    res.status(200).json(new ApiResponse(200, { pendingRequests }, "Friend Requests need to be checked"))
}

export { registerUser, loginUser, logoutUser, refreshAccessToken, getCurrentUser, acceptFriendRequest, sendFriendRequest, getFriends, getFriendRequests, declineFriendRequest }