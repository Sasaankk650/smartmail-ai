import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface EmailRequest {
  task: string;
  tone: string;
  text: string;
}

export async function generateEmail(data: EmailRequest) {
  const { task, tone, text } = data;

  let taskInstruction = "";

  switch (task.toLowerCase()) {
    case "generate":
      taskInstruction = `
Generate a brand new professional email based on the user's request.

Understand the user's intent and improve the wording naturally.

If the request already contains enough information to write a meaningful email, generate the complete email.

Use reasonable assumptions for common situations like colleagues, managers, leave requests, interviews, meetings, or work discussions.

Do NOT invent company names, dates, addresses, phone numbers, or factual information.

Only ask for additional information if the user's purpose cannot be understood at all.

Include a professional subject line.
`;
      break;

    case "rewrite":
      taskInstruction = `
Rewrite the provided email.

Rules:
- Preserve the original meaning.
- Improve grammar.
- Improve sentence structure.
- Improve professionalism.
- Keep the same intent.
- Do NOT add new information.

If the provided text is too short to rewrite meaningfully,
respond:

"Please provide a more detailed email so I can rewrite it accurately."
`;
      break;

    case "reply":
      taskInstruction = `
Generate a reply to the provided email.

Rules:
- Understand the context first.
- Keep the tone ${tone}.
- Write naturally.
- Include a subject line only if appropriate.
- Do not invent unnecessary information.

If the email is incomplete,
respond:

"Please provide the complete email so I can generate an appropriate reply."
`;
      break;

    case "summarize":
      taskInstruction = `
Summarize the provided email.

Rules:
- Return only 3-5 concise bullet points.
- Highlight only the important information.
- Do not rewrite the email.

If the content is too short to summarize,
respond:

"Please provide a longer email so I can summarize it."
`;
      break;

    default:
      taskInstruction = `
Generate a professional email.
`;
  }

  const prompt = `
You are SmartMail AI, an expert AI assistant specialized in email writing.

${taskInstruction}

Tone:
${tone}

User Input:
${text}

General Rules:

- Return ONLY the requested output.
- Never invent company names, dates, phone numbers or factual information.
- Avoid placeholders like [Company Name] or [Date].
- Infer obvious context when it is reasonable.
- If the user's intent is clear, generate the email directly.
- Ask for clarification only when the request is genuinely ambiguous.
- Match the requested tone.
- Write naturally like a human.
- Keep the response concise.
- Use proper grammar.
- Do not include markdown.
- Do not explain what you are doing.
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",

    temperature: 0.7,

    messages: [
      {
        role: "system",
        content:
          "You are SmartMail AI, an expert AI assistant that helps users write, rewrite, summarize and reply to professional emails.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return response.choices[0].message.content ?? "";
}