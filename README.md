
# Dashboard 4+1 com Análise via IA

Este projeto é um MVP que coleta quatro blocos de texto do usuário, envia-os para uma API Serverless que chama a OpenAI e devolve a análise ao front‑end.

## Como rodar (1‑click deploy via Vercel)

1. Crie uma conta (grátis) em https://vercel.com
2. Clique em “Import Project” e aponte para este repositório (GitHub).
3. Nas **Environment Variables**, crie `OPENAI_API_KEY` com a sua chave.
4. Deploy. A URL gerada já estará funcionando 🪄.

### Estrutura

```
.
├── index.html        # Front‑end estático
└── api
    └── analyze.js    # Função Serverless (Node 18)
```

## Local (Node 18)

```bash
npm i -g vercel
vercel dev
```

Pronto — abra http://localhost:3000
