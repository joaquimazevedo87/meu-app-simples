export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { idea, platform, language, numberOfPosts } = req.body;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

 const prompt = `
Crie ${numberOfPosts} variações de post para ${platform} sobre: "${idea}". Em ${language}. Use linguagem criativa e envolvente.

Para cada variação, siga esta estrutura EXATA:

📌 **Legenda para o Post**
[Escreva uma legenda curta, inspiradora, com emojis e hashtags relevantes]

🖼️ **Prompt para Imagem**
[Descreva uma cena detalhada para gerar uma imagem com IA. Inclua estilo, luz, objetos, personagens, emoção e detalhes visuais.]

🔖 **Hashtags Estratégicas**
[Lista de 5-7 hashtags relevantes, separadas por espaço]

⏰ **Melhor Horário para Postar**
[Hora ideal para publicar, com justificativa curta]

Seja criativo, mas mantenha a estrutura acima. Evite repetições e use linguagem natural.
`;

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
