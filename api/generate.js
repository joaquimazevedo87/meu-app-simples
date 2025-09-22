export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { idea, platform, language, numberOfPosts } = req.body;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    const prompt = `Crie ${numberOfPosts} variações de post para ${platform} sobre: "${idea}". Em ${language}. Use linguagem criativa e envolvente. Para cada post, inclua emojis e hashtags relevantes.`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Erro na API");
    }

    res.status(200).json({ content: data.candidates[0].content.parts[0].text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
