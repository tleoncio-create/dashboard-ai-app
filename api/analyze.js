import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const assistantId = process.env.ASSISTANT_ID;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { contexto, socialICP, matrizProduto, pulse4d, lang } = req.body;

  /* 1. Define em qual idioma a IA deve responder */
  const idiomaPrompt =
    lang === "en"
      ? "Answer in English."
      : lang === "es"
      ? "Responde en Español."
      : "Responda em Português.";

  try {
    /* 2. Cria um thread */
    const thread = await openai.beta.threads.create();

    /* 3. Envia a instrução de idioma (system) */
    await openai.beta.threads.messages.create(thread.id, {
      role: "system",
      content: idiomaPrompt
    });

    /* 4. Envia a pergunta do usuário (user) */
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

    /* 5. Roda o Assistant */
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId
    });

    /* 6. Acompanha até terminar */
    let status;
    do {
      await new Promise(r => setTimeout(r, 1500));   // espera 1,5 s
      status = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    } while (status.status !== "completed");

    /* 7. Puxa a resposta final*
