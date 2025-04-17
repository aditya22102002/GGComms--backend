import { Router } from "express";
import { getUsersForSideBar,getMessages,sendMessage} from "../controllers/message.controller.js";
import {verifyJwt} from "../middlewares/auth.middleware.js"

const router=Router()

router.get("/users",verifyJwt,getUsersForSideBar)
router.get("/:id",verifyJwt,getMessages)
router.post("/send/:id",verifyJwt,sendMessage)


export default router