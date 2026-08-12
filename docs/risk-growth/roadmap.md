# ROADMAP — - Risk + Growth

- **Consolidado pelo PM** a partir dos insumos do PO (valor, resultados esperados, prioridades) e do SM (datas, cadência, riscos) · **Data-base: 2026-08-12 (qua)**
- Fontes: `tese-pmf.md` · `sprint-1/decisoes-fundador.md` · `sprint-1/backlog.md` · `sprint-1/personas.md` · `p2-plataforma/` · velocidade medida no git log

## Como ler este documento (regra de ouro)

> **Nenhuma data que dependa de pendência do fundador ou de relógio de terceiro aparece aqui como data absoluta sem o "D+N a partir de X" ao lado.** A lição de 11/08: o time entregou o MVP em ~8 horas de relógio; 96% do calendário da Sprint 1 foi espera. **Datas deste roadmap descrevem espera, não trabalho** — a coluna "Data (base)" assume as pendências do fundador entregues em **14/08 (sex)**; cada dia a mais desloca quase tudo 1:1.

**Achado nº 1 do SM**: responder **13/08 (qui)** em vez de 14/08 (sex) vale **3–4 dias corridos**, não 1 — a ativação do Lemon Squeezy conta em dias úteis, e submissão de sexta entrega o fim de semana ao fornecedor.

**Achado nº 2**: a data que manda não é 11/11 — é **12/09**, o drop-dead da assinatura no ar para existirem 2 coortes completas na leitura. Folga no cenário-base: 3 dias (10 com a antecipação do P2 aprovada abaixo).

## Os três marcos do lançamento (não é um marco só)

| Marco | O que é | Data (base) | Regra |
|---|---|---|---|
| **L1 — Site no ar** | DNS propagado + deploy no domínio (sem venda) | **15/08 (sáb)** | apontamento + até 48h |
| **L2 — Lançamento formal** | Loja ativada + **transação real de estranho** + Go/No-Go (= DF-04) | **19/08 (qua)** | ativação LS + 1–3 dias úteis |
| **L3 — Tráfego ligado** | Conta de ads aprovada + campanha no ar → **inicia o relógio de aprendizado** | **20/08 (qui)** | PF-04 + 1–3 dias úteis |

---

## H0 — LANÇAR · `lancamento`

> Sair de "pacote aprovado, nada no ar" para "estranho paga, conclui e gera o card" (DF-04).

| # | Item | Tags | Prio | Data (base) | Regra | Resultado esperado |
|---|---|---|---|---|---|---|
| R-01 | Bloco de destravamento do fundador (PF-08a/b, PF-09, PF-11, PF-14 DNS, PF-04, PF-12, PF-13) | `lancamento` | Must | **13–14/08** | janela 7h–9h | 4 execuções + 2 decisões + 1 leitura feitas; URL de checkout **live** entregue |
| R-02 | DT-07 — dedup por `seq` | `infra` | Must | ✅ **feito 12/08** | — | duplo-clique no Buy = 2 `checkout_start` contados |
| R-03 | RG-02 — checkout no ar | `produto` | Must | **14/08** | PF-08a + 0 | **1 compra real ponta a ponta, dinheiro na conta** (US-02 AC1) |
| R-04 | RG-06 — card por e-mail + captura | `produto` | Must | **14/08** | PF-11 + 0 | card entregue **<2 min, caixa de entrada** em 2 provedores |
| R-05 | Publicação + Go/No-Go nível 2 | `infra` | Must | **L1 15/08 · L2 19/08** | DNS+48h; ativação LS | 6 páginas no ar; contact@ recebe teste (INT-3); <3s em 4G |
| R-06 | Flip dos providers (Plausible 1º, **nunca GA4 sozinho**) | `dados` | Must | **15/08** | junto do L1 | primeiro `page_view` real no painel; domínio e custom props conferidos |
| R-07 | Smoke test — caminhada dos 7 eventos | `dados` | Must | **18/08** | 1ª transação real + 0 | **7/7 na ordem**; exceção do RG-07 encerrada |
| R-08 | **Primeira venda de estranho** (DF-04) | `lancamento` | Must | **20–21/08** | L3 + tráfego | 1 desconhecido paga, conclui builder, gera card — funil instrumentado |

## H1 — APRENDER · `dados` `growth`

> Transformar produto no ar em leitura confiável das 6 hipóteses. Entrega aqui é evidência, não funcionalidade.

| # | Item | Tags | Prio | Data (base) | Regra | Resultado esperado |
|---|---|---|---|---|---|---|
| R-09 | RG-09 — ads com teto | `ads` | **Must** ⬆ | **20/08** | PF-04 + go L2; DT-05 obrigatória | campanha dentro de R$1k–5k/mês; ≥3 criativos; 2 públicos; custo/visitante qualificado ≤ US$ 0,90 *(proposta PO)* |
| R-10 | Semeadura orgânica | `growth` | Should | 15–20/08 | L1 + 0 | ≥200 visitantes qualificados de comunidades *(proposta PO)*; plano A se PF-04 atrasar |
| R-11 | RG-10 — pós-compra + lista de espera | `produto` | **Must** ⬆ | **13/08** (em construção) | sem PF | **H2.2 medida desde o comprador nº 1**; resposta à pergunta única ≥60% *(proposta PO)* |
| R-12 | Rotina de leitura do painel | `dados` | Must | desde 20/08 | L3 + 0 | relatório com volume absoluto ao lado de cada %; abaixo do piso, diz **"inconclusivo"** |
| R-13 | **PORTÃO: piso de amostra** | `dados` | Must | est. **03–24/09** | tráfego acumulado | **≥30 compradores OU ≥1.000 visitantes qualificados**. Abaixo: proibido mexer em preço/mídia/promessa **ou construir a Library** |
| R-14 | Primeira leitura das 6 hipóteses | `dados` | Must | D+0 do R-13 | — | veredito escrito por hipótese: H0 ≥1,5% · H1.1 ≥50% · H1.4 ≥70% · H2.1 ≥25% · H2.2 ≥40% · H2.4 <15% |
| R-15 | Iteração guiada por regra | `produto` | Must (cond.) | D+0 do sinal | pós R-14 | H1.4<70% → simplificar builder · H1.1<50% → mensagem/público Priya · H0<1,5% → preço/promessa + congela mídia |
| R-16 | 10 entrevistas pós-compra | `pesquisa` | Should | ≥10 compradores | — | vocabulário real para copy; ≤US$ 200; **hipótese, nunca prova** |
| R-17 | Newsletter (degrau 0) | `conteudo` | Could ✅ | P1-2+ | aprovada pelo PM c/ condição: zero janela do fundador até o Go | ≥100 e-mails; abertura ≥35% *(proposta PO)* |
| R-18 | DT-06 — lacunas de analytics | `infra` | **Won't (agora)** | pós-janela de leitura | — | não mexer no contrato de eventos durante a série que sustenta 11/11 |

## H2 — DEGRAU 2 · `p2` (aposta sob DF-10: R$ 8.000 + 3 sprints)

> **Esqueleto (R-19..R-23) é incondicional** — sobrevive a qualquer resultado e começa antes. **Aposta (R-24..R-26) só atrás do portão R-13/R-14.**

| # | Item | Tags | Prio | Data (base) | Regra | Resultado esperado |
|---|---|---|---|---|---|---|
| R-19 | P2-01 setup (Vercel+Supabase+`app.`) | `infra` | Must | até 25/08 | DP2-01/02 (janela 17/08) | subdomínio no ar; custo fixo US$ 0 |
| R-20 | P2-02 magic link + RLS | `produto` | Must | até 27/08 | R-19 + 0 | login por e-mail da compra <2 min; **0 vazamentos** no teste de acesso cruzado |
| R-21 | P2-03 backfill + webhook LS | `infra` | Must | até 28/08 | R-19; API LS | 100% dos pedidos com entitlement; backfill idempotente |
| R-22 | P2-04 kit portado (cópia fiel) | `produto` | Must | até 31/08 | pode começar **13/08** (Alavanca A ✅) | 0 divergência vs. `product/` (diff do QA); login **nunca** vira condição p/ o que o degrau 1 já pagou |
| R-23 | P2-05+09 salvar card + eventos | `produto` | Must | até **02/09** | R-22 + 0 | 1 comprador real salva um card na conta |
| R-24 | P2-06 result logging v0 | `produto` | Should (cond.) | P2-3: 10–16/09 | leitura do RG-10 | ≥40% dos que salvam registram resultado em 30 dias *(proposta PO)* |
| R-25 | P2-07 e-mail de convite | `conteudo` | Should | 03–07/09 | DP2-04 (texto aprovado) | abertura ≥40%; ≥25% reivindicam conta *(proposta PO)* |
| R-26 | **P2-08 ASSINATURA NO AR** ⛳ | `produto` | Must **se H2.2 ≥40%** | **alvo 09/09 · drop-dead 12/09** | gate H2.2 (ver decisão PF-15) | primeira assinatura paga de estranho; caminho p/ ≥25 ativos, churn ≤8%/mês |
| R-27 | 📌 **LEITURA KILL/SCALE** | `dados` | Must | **11/11 (imutável, DF-10)** | — | veredito escrito: scale/kill/inconclusivo, com volumes; **R$ 8k e 3 sprints não excedidos** |

## H3 — CONDICIONAIS (só existem conforme 11/11)

| # | Item | Condição | Resultado esperado |
|---|---|---|---|
| R-28 | Library vira produto principal | scale | 8→20+ experimentos; ≥60% da coorte pagando no mês 3; MRR sem verba proporcional |
| R-29 | Cutover: compra aponta p/ plataforma | R-28 + aprovação explícita do PM | 0 comprador do degrau 1 perde acesso |
| R-30/31 | Degraus 3 (curso) e 4 (mentoria) | **Won't até retenção da Library comprovada** | regra não negociável da tese |
| R-32 | Ramo kill | 11/11 = kill | pivô p/ degrau 3 como carro-chefe; **tese reescrita, não remendada**; R$ 0 adicionais na Library |
| R-33 | Ramo H2.4 ≥15% | leitura R-14 | oferta se parte em duas (Sam/Priya) — decisão do PM antecipada: **teto mantém, Library encolhe** |
| R-34 | Ramo inconclusivo | 11/11 sem piso | roda de novo dentro do mesmo teto, ou abandona a pergunta |

---

## Cadência (SM) — sprints de 1 semana; cerimônias 100% dentro da janela 7h–9h

| Bloco | Período | Conteúdo |
|---|---|---|
| Sprint 1 (cauda) | até 20/08 | fecha no L3 · Review+Retro 21/08 |
| P1-2 "Aprender" | 20–26/08 | RG-09, DT-05, iterações de copy |
| P2-1 "Esqueleto" | 20/08–02/09 (2 sem; itens sem fundador desde 13/08) | P2-01..05, 09 |
| P1-3 "Iterar" | 27/08–02/09 | guiada pelos dados |
| P2-2 "Assinatura" | 03–**09/09** ⛳ | P2-07, P2-08 |
| P2-3 "Uso e retenção" | 10–16/09 | P2-06, onboarding |
| **Janela de medição** | 17/09–10/11 (**8 semanas, sem sprint de construção**) | coortes se formam; só bug bloqueante, suporte e mídia |
| 📌 Leitura | **11/11** | — |

Custo do fundador: **~1h45/semana**. Com P1 e P2 em paralelo: teto de 2 decisões P1 + 1 P2 por janela.

## Decisões do PM tomadas nesta consolidação

1. **Promoções homologadas**: RG-09 e RG-10 de Should → Must (sem tráfego não há "estranho paga"; sem RG-10 a leitura de 11/11 nasce cega). RG-10 despachado para construção em 12/08.
2. **"Coorte mensal" = 30 dias rolantes a partir do go-live da assinatura** → drop-dead **12/09**. (A leitura mês-calendário tornaria o cenário-base inviável já hoje; a tese usa datas absolutas, não meses civis.)
3. **Alavanca A aprovada**: itens do P2 sem dependência de fundador (P2-04, modelagem, RLS) começam 13/08 — a regra "P1 absoluto" foi escrita sob premissa refutada (o lançamento não consome capacidade do time, consome janela do fundador). Folga do drop-dead: 3 → ~10 dias. P1 mantém prioridade em qualquer conflito de janela.
4. **PF-08 quebrada em a/b** (criar loja+produto+URL ≠ submeter ativação) — o relógio de terceiro começa antes de o nosso terminar.
5. **Escalação após 1 janela perdida** (era 2): a espera veio em blocos de 40–77h; o processo agora reage na primeira.
6. **R-17 (newsletter) aprovada como Could** com condição: zero custo de janela do fundador até o Go.
7. **R-18/DT-06 confirmado Won't** durante a janela de leitura (não se mexe na série que sustenta o veredito).
8. **R-33 antecipado**: se H2.4 ≥15%, o teto se mantém e a Library encolhe (não há verba nova para oferta dupla).
9. Números marcados *(proposta PO)* homologados **como alvos provisórios** — viram compromisso quando o primeiro dado real chegar (CPC real em 48h de tráfego recalibra tudo).

## Decisões que ficam com o fundador (PF-15 — levar na janela de 13/08)

1. **O que o 11/11 lê.** A aritmética não fecha para churn/25 assinantes (produto entra no ar ~outubro → <2 coortes). Recomendação PM+PO: **manter 11/11 imutável** lendo H2.2 + apetite + consumo do teto (decisão de continuar), e fixar **segunda data absoluta para churn/assinantes ancorada no go-live da assinatura**. Alternativa: aceitar formalmente "inconclusivo" como desfecho provável.
2. **Antecipação de mídia dentro do mesmo teto** (única opção que não quebra regra nenhuma): ex. R$ 1,5k/sem nas 2 primeiras semanas, R$ 500/sem depois = R$ 8k. Acelera o denominador para o gate H2.2 abrir antes da P2-2. Premissas de CPC são provisórias até 48h de tráfego real.
3. **Lote de pendências P2 na janela de 17/08**: DP2-01 (Vercel/Supabase), DP2-02 (subdomínio), **DP2-03 (produto de assinatura no LS — o mais urgente: carrega o mesmo relógio de revisão da loja; criado em setembro, cai em cima de um marco com 3 dias de folga)**.

## Riscos top-5 (SM) — resumo

| # | Risco | Prob. | Mitigação-chave | Dono |
|---|---|---|---|---|
| R1 | Ativação LS demora/pede informação | média | PF-08a/b separadas; submeter já, com URL da Vercel | fundador/PM |
| R2 | Janela 7h–9h perdida (causa de 100% do atraso até aqui) | alta | bloco numerado "N passos, X min"; escalar após 1 janela | PM |
| R3 | Conta de ads travada (pessoa física, DF-08) | média-alta | abrir conta AGORA em paralelo; 1 plataforma só; R-10 como plano B | fundador |
| R4 | Assinatura depois de 12/09 → 11/11 vira "inconclusivo" | média (alta no pessimista) | 09/09 alvo + 12/09 drop-dead como marcos; Alavancas A/B | PM |
| R5 | DNS mal apontado / quebra do e-mail do Google | baixa-média | checklist de não-quebra (registrado); verificar por consulta pública; planejar 48h | fundador+squad |

> **Cadeia de valor em uma linha (PO):** R-01 (fundador) → checkout+e-mail no ar → 7 eventos → **primeira venda de estranho** → tráfego → **piso de amostra** → **leitura das 6 hipóteses** → H2.2 decide a assinatura → **11/11 decide se o degrau 2 vira o negócio.** Só três números mudam o rumo do projeto: **H0 ≥1,5% · H1.4 ≥70% · H2.2 ≥40%.** Todo o resto é infraestrutura para lê-los com honestidade.
