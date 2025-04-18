import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken"


export const verifyJwt = asyncHandler(async (req, res, next) => {
    try {
        console.log("🔐 Access Token from Cookie:", req.cookies?.accessToken);
        console.log("🧠 Headers:", req.headers);
        console.log("🔎 Origin:", req.get('origin'));
        console.log("🌐 req.hostname:", req.hostname);

        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "").trim();
        console.log("token: ", token);


        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        console.log("decoded token: ", decodedToken);


        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }

        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access token")
    }

})