import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";

const openai = new OpenAI(process.env.OPENAI_API_KEY);

export const runtime = 'edge';

export async function post({ req: Request }) {
    try {
        const prompt = "Create a list of three open-ended and engaging qiestions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform., like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example,  your output should be structured like this: 'What's a hobby you've recently started? || If you could have dinner with any historical figure, who would it be? || What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiousity, and contribute to a positive and welcoming conversational environment."

        const response = await openai.completions.create({
            model: "gpt-3.5-turbo-instruct-beta",
            max_tokens: 100,
            stream: true,
            prompt
        });

        const steam = OpenAIStream(response)

        return new StreamingTextResponse(steam)

    } catch (error) {
        if (error instanceof OpenAI.APIError) {
            const { name, status, headers, message } = error
            return NextResponse.json({
                name, status, headers, message
            })
        } else {
            console.log("An unexpected error occured", error)
            throw error
        }
    }
}