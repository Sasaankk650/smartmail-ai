import { Request, Response } from "express";
import { generateEmail } from "../services/groqService";

export const emailController = async (req: Request, res: Response) => {
  try {
    const { task, tone, text } = req.body;

    if (!task || !tone || !text) {
      return res.status(400).json({
        error: "task, tone and text are required",
      });
    }

    const result = await generateEmail({
      task,
      tone,
      text,
    });

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Failed to generate email",
    });
  }
};