import express from 'express';
import { createServer,joinServer } from '../controllers/server.controller.js';
import {verifyJwt} from "../middlewares/auth.middleware.js"


const router = express.Router();

router.post('/create', verifyJwt, createServer);
router.post('/join/:inviteCode', verifyJwt, joinServer);

export default router;
