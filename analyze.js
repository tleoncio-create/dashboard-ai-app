
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const { contexto, socialICP, matrizProduto, pulse4d } = req.body;

  const messages = [
    { role: "system", content: "Você é um analista de mercado e produto." },
    {
      role: "user",
      content: `
Contexto Geral:
${contexto}

Social Listening + ICP:
${socialICP}

Matriz de Produto:
${matrizProduto}

Pulse 4D:
${pulse4d}

Gere uma análise sintética com:
- Principais Insights (bullet points)
- Ações recomendadas em até 5 passos curtos
      `.trim()
    }
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7
    });
    const resposta = completion.choices[0].message.content;
    res.status(200).json({ resultado: resposta });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Falha na IA" });
  }
}
