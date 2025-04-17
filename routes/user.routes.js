import { Router } from "express";
import { registerUser,loginUser,logoutUser,refreshAccessToken,getCurrentUser,acceptFriendRequest,sendFriendRequest,getFriends,getFriendRequests,declineFriendRequest} from "../controllers/user.controller.js";
import {verifyJwt} from "../middlewares/auth.middleware.js"

const router=Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJwt,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/getUser").get(verifyJwt,getCurrentUser)
router.post('/send-request', verifyJwt, sendFriendRequest);
router.post('/accept-request', verifyJwt, acceptFriendRequest);
router.get('/list', verifyJwt, getFriends);
router.route("/getFriendRequests").get(verifyJwt,getFriendRequests)
router.route("/decline-request").post(verifyJwt,declineFriendRequest)



export default router