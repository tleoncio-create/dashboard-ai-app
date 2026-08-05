# P1 — Contexto essencial (1 página)

> Leitura mínima para agentes. Detalhe: briefing.md · backlog.md · produto-proposta.md · personas.md · decisoes-fundador.md.

## O que é

**- Risk + Growth** (marca; o "-" antes de Risk é parte da identidade, SEMPRE — DF-07) lança o produto **Test Your Jump Cheaply (TYJC)**: ferramenta web em inglês, sem login e sem backend, que em 8 perguntas transforma a dúvida de crescimento do empreendedor em um **Experiment Card** — hipótese, teste mínimo, teto de gasto, prazo, número-alvo e critério de parada — pronto para rodar. Promessa: **testar barato antes de apostar**. O número-alvo é sempre **do usuário** (spec-card-campos-6-7.md).

## Números e decisões-chave

- Preço: **US$ 29** (lançamento US$ 19/100 primeiros) · reembolso 7 dias sem perguntas · cards ilimitados no degrau 1.
- Pagamento: **Lemon Squeezy** (merchant of record) — conta pendente (PF-01). Domínio pendente (PF-02).
- Lançamento: **D7 = 2026-08-11**. Fundador (pessoa física — DF-08) aprova só o que vai ao ar; janela 7h–9h.
- Sucesso do D7: **aprendizado validado** (1 estranho paga, conclui, gera card) — sem meta de faturamento.
- Público: empreendedores "primeiros clientes" (persona Sam) e "faturando, quer crescer" (persona Priya). Dor: *"cresço no improviso"*.

## Anti-escopo (vale para cada frase pública)

1. Sem promessa de resultado de negócio. 2. Sem grandes empresas. 3. Só marketing/produto/growth. 4. Não executamos pelo cliente. **Nunca** prova social inventada.

## Regras técnicas do produto

- Site estático + JS, **zero requisição externa**, mobile-first (piso 375px), tudo em inglês.
- Fontes de verdade espelhadas **no mesmo commit**: `product/experiments-library.md` ↔ `product/site/experiments.js` ↔ `RULES` em `card.js`.
- Analytics: contrato congelado em `analytics.js`; e-mail e texto livre **nunca** em eventos.
- Aprovados na DoD nível 1: RG-05, RG-08, RG-03, RG-01, RG-04. Restam: RG-02 (⛔PF-01), RG-06 (⛔PF-03), RG-07.

## Processo

Squads não commitam (PM commita). QA verifica antes do PM. Escopo do MVP congelado até D7. Board: `docs/risk-growth/sprint-1/board.md`.
