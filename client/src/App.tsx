import { useState } from "react";
import axios from "axios";

type Task = "Generate" | "Rewrite" | "Summarize" | "Reply";
type Tone = "Professional" | "Friendly" | "Formal" | "Casual";

const taskOptions: Task[] = [
  "Generate",
  "Rewrite",
  "Summarize",
  "Reply",
];

const toneOptions: Tone[] = [
  "Professional",
  "Friendly",
  "Formal",
  "Casual",
];

const placeholders: Record<Task, string> = {
  Generate:
    "Example: Write an email requesting HR to reschedule my interview because of a family emergency.",

  Rewrite:
    "Paste the email you want AI to improve...",

  Reply:
    "Paste the email you want AI to reply to...",

  Summarize:
    "Paste the email you want AI to summarize...",
};

const buttonLabels: Record<Task, string> = {
  Generate: "Generate Email",
  Rewrite: "Rewrite Email",
  Reply: "Generate Reply",
  Summarize: "Summarize Email",
};

const outputTitles: Record<Task, string> = {
  Generate: "Generated Email",
  Rewrite: "Rewritten Email",
  Reply: "Generated Reply",
  Summarize: "Email Summary",
};

const inputTitles: Record<Task, string> = {
  Generate: "Email Request",
  Rewrite: "Email to Rewrite",
  Reply: "Email to Reply",
  Summarize: "Email to Summarize",
};

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [task, setTask] = useState<Task>("Generate");
  const [tone, setTone] = useState<Tone>("Professional");
  const [text, setText] = useState("");
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError("Please enter some email content.");
      return;
    }

    if (text.trim().length < 20) {
      setError(
        "Please provide more details so AI can generate a meaningful response."
      );
      return;
    }

    setIsLoading(true);
    setError("");
    setGeneratedEmail("");

    try {
      const response = await axios.post<{ result: string }>(
        `${API_URL}/api/email`,
        {
          task,
          tone,
          text,
        }
      );

      setGeneratedEmail(response.data.result || "");
    } catch (err: unknown) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Unable to generate your email right now. Please try again.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedEmail) return;

    try {
      await navigator.clipboard.writeText(generatedEmail);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      setError("Failed to copy the email.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center">

        <div className="mb-8 text-center">

          <div className="mb-3 inline-flex items-center rounded-full border border-indigo-200 bg-white/80 px-3 py-1 text-sm font-medium text-indigo-600 shadow-sm backdrop-blur">

            Powered by Llama 3.3 • Groq

          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            SmartMail AI
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-lg text-slate-600">
            Generate, rewrite, summarize and reply to emails using AI.
          </p>

        </div>

        <div className="w-full rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_25px_80px_-30px_rgba(99,102,241,0.45)] backdrop-blur-xl sm:p-8">

          <div className="grid gap-4 md:grid-cols-2">

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">

              <span>Task</span>

              <select
                value={task}
                onChange={(event) => {
                  setTask(event.target.value as Task);
                  setGeneratedEmail("");
                  setError("");
                }}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white"
              >
                {taskOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>

            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">

              <span>Tone</span>

              <select
                value={tone}
                onChange={(event) => {
                  setTone(event.target.value as Tone);
                  setGeneratedEmail("");
                  setError("");
                }}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white"
              >
                {toneOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>

            </label>

          </div>
                    <label className="mt-5 flex flex-col gap-2 text-sm font-medium text-slate-700">

            <span>{inputTitles[task]}</span>

            <textarea
              value={text}
              onChange={(event) => {
                setText(event.target.value);
                if (error) setError("");
              }}
              placeholder={placeholders[task]}
              rows={10}
              className="w-full rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white"
            />

          </label>

          <div className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">

            <p className="text-sm text-slate-500">
              Create polished, context-aware email drafts in seconds.
            </p>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "✨ AI is working..." : buttonLabels[task]}
            </button>

          </div>

          {error && (
            <div
              className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600"
              role="alert"
            >
              {error}
            </div>
          )}

        </div>

        <div className="mt-8 w-full rounded-[28px] border border-slate-200/80 bg-slate-950 p-6 text-slate-50 shadow-[0_25px_80px_-30px_rgba(15,23,42,0.65)] sm:p-8">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="text-xl font-semibold">
                {outputTitles[task]}
              </h2>

              <p className="text-sm text-slate-400">
                Your AI-generated output will appear here.
              </p>

            </div>

            <button
              type="button"
              onClick={handleCopy}
              disabled={!generatedEmail || isLoading}
              className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-slate-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {copied ? "Copied!" : "Copy"}
            </button>

          </div>

          <div className="mt-6 min-h-[220px] rounded-[24px] border border-slate-800 bg-slate-900/80 p-4">

            {generatedEmail ? (

              <pre className="whitespace-pre-wrap font-mono text-sm leading-7 text-slate-200">
                {generatedEmail}
              </pre>

            ) : (

              <div className="flex h-full min-h-[180px] items-center justify-center text-center text-sm text-slate-500">

                {task === "Generate" &&
                  "Your generated email will appear here."}

                {task === "Rewrite" &&
                  "Your rewritten email will appear here."}

                {task === "Reply" &&
                  "Your AI-generated reply will appear here."}

                {task === "Summarize" &&
                  "Your email summary will appear here."}

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default App;