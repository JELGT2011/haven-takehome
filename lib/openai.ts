import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

const RUN_ANALYSIS_PROMPT = `
You will be provided with the full contents of a book.
Analyze the text and provide insights about the motifs, themes, and characters in the book.
`;

export const GenerateAnalysis = async (content: string) => {
    const analysis = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "system", content: RUN_ANALYSIS_PROMPT },
            { role: "user", content: content },
        ],
        response_format: { type: "text" },
        stream: false,
    });

    const result = analysis.choices[0].message.content;
    if (result === null) {
        throw new Error("Analysis result is null");
    }

    return result;
}
