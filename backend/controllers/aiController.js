const OpenAI = require("openai");

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.askAI = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ message: "Prompt is required." });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ message: "OpenAI key is not configured." });
    }

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
      max_tokens: 400,
      temperature: 0.7,
    });

    const answer = response.output_text || response.output?.[0]?.content?.[0]?.text || "Sorry, I could not generate a response.";

    res.json({ answer });
  } catch (error) {
    console.error("AI request failed", error);
    res.status(500).json({ message: error.message || "AI service error." });
  }
};
