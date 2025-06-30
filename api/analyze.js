import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const assistantId = process.env.ASSISTANT_ID;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { contexto, socialICP, matrizProduto, pulse4d } = req.body;

  try {
    const thread = await openai.beta.threads.create();

    await openai.beta.threads.messages.create(thread.id, {
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
      `.trim()
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId
    });

    let status;
    do {
      await new Promise(r => setTimeout(r, 1500));
      status = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    } while (status.status !== "completed");

    const msgs = await openai.beta.threads.messages.list(thread.id);
    const resposta = msgs.data.find(m => m.role === "assistant")
                      .content[0].text.value;

    res.json({ resultado: resposta });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Falha na IA" });
  }
}
