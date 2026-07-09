import express from "express";
import { emailController } from "../controllers/emailController";

const router = express.Router();

router.post("/", emailController);

export default router;