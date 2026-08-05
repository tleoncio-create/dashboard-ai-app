# P2 — Fundação: requisitos, arquitetura e plano de migração da plataforma

- **Autor**: squad-apps · **Data**: 2026-08-05 · **Fase**: Fundação (05–11/08, charter §Fases)
- **Status**: proposta para revisão do PM. Nenhum código foi escrito; nenhum arquivo do P1 foi tocado.
- **Fontes**: `docs/p2-plataforma/charter.md`, `docs/risk-growth/briefing.md`, `docs/risk-growth/sprint-1/produto-proposta.md` (§7 escada, §8 stack), `product/experiments-library.md`, `product/site/*` (leitura), `docs/risk-growth/sprint-1/decisoes-fundador.md`
- **Idioma**: documento interno em português. Todo texto de produto da plataforma será em inglês (padrão do ecossistema).

---

## 1. Requisitos da plataforma (derivados da escada de valor)

A escada (produto-proposta §7) define o que a plataforma precisa sustentar em cada degrau. O princípio de corte: **o login só se justifica quando entrega algo que o produto estático não consegue entregar** — hoje, isso é exatamente o coração do degrau 2: histórico, acompanhamento e acesso recorrente.

### 1.1 Requisitos por área

| Área | Requisito | Degrau que exige | Observações |
|---|---|---|---|
| **Conta de usuário** | Criar conta e entrar **sem senha** (magic link por e-mail) | 2 | O e-mail já é o identificador que o P1 captura; senha adicionaria suporte (reset, vazamento) sem valor. Coerente com a promessa de dados mínimos da Privacy Policy. |
| **Acesso ao TYJC comprado** | Comprador do TYJC (degrau 1) entra com o e-mail da compra e encontra o Kit (builder + biblioteca) dentro da plataforma | 1→2 | A lista de pedidos do Lemon Squeezy é a fonte de verdade do direito de acesso (entitlement). Ver §3. |
| **Assinatura** | Billing recorrente US$ 19–29/mês via **Lemon Squeezy Subscriptions**, com webhook atualizando o status (ativa, inadimplente, cancelada) e o acesso refletindo o status | 2 | Mesmo provedor do P1 (DF-03): uma conta, um merchant of record, imposto global resolvido. Preço é hipótese — decisão do fundador pós-H2.2. |
| **Histórico de experimentos** | Todo Experiment Card gerado logado fica salvo na conta, com os 8 campos | 2 | Hoje o card vive no browser (localStorage) e no e-mail. A conta é o que o torna permanente e multi-dispositivo. |
| **Acompanhamento (result logging)** | O usuário registra o resultado de cada card: rodou ou não, número observado vs. número-alvo, e o veredito — *kept / killed / inconclusive* | 2 | É o produto da assinatura: a repetição do método. O registro espelha os campos 6–8 do card (metric, kill criteria, if it works/doesn't). Nunca prometemos resultado — registramos leitura, não sucesso. |
| **Biblioteca completa** | Assinante vê a biblioteca inteira e gera cards ilimitados; comprador avulso vê o que comprou | 2 | A biblioteca já tem contrato de dados pronto (yaml de `experiments-library.md`) — a plataforma a consome como dado, sem reescrever. |
| **Espaço para degraus futuros** | Modelagem que aceita novos "produtos" e "entitlements" sem migração estrutural: curso (degrau 3) = produto com módulos/progresso; mentoria (degrau 4) = produto com agenda/sessões | 3–4 | Não construir nada disso agora — apenas não fechar a porta: tabela de produtos e de direitos de acesso genérica desde o dia 1. |
| **Privacidade** | Herdar as promessas publicadas do P1: e-mail nunca em analytics, dados mínimos, deleção sob pedido, e-mail nunca é barreira ao que foi pago | todos | Qualquer promessa nova ou alterada sobe ao PM **antes** do código (atribuição 5 da squad). |

### 1.2 MVP da plataforma — o mínimo que justifica o login

1. **Entrar com magic link** no e-mail usado na compra e encontrar o **TYJC Kit dentro da plataforma** (builder + biblioteca, portados sem mudança de conteúdo).
2. **Salvar cada Experiment Card na conta** e **registrar o resultado** (rodou/não rodou, número observado, kept/killed/inconclusive) — o histórico mínimo que o produto estático não tem como oferecer.
3. **Assinatura da Experiment Library via Lemon Squeezy** controlando o acesso: assinante ativo = biblioteca completa + cards ilimitados; não assinante = o que comprou no degrau 1.

Se um item não serve a um desses três, não é MVP da plataforma.

### 1.3 Explicitamente fora do MVP (vem depois)

- Curso e área de membros do degrau 3 (módulos, progresso, vídeo).
- Mentoria/agenda do degrau 4.
- Newsletter/degrau 0 dentro da plataforma (continua no provedor de e-mail).
- Múltiplos idiomas, comunidade, app nativo, times/assentos múltiplos, integrações com analytics do cliente, API pública.
- Dashboard de métricas agregadas do usuário ("seus experimentos em números") — só depois que existirem experimentos registrados de verdade.

---

## 2. Proposta de stack

**Critério (do mandato)**: a mais simples que sustenta o degrau 2, operável por agentes de IA com um fundador solo — baixa manutenção, custo fixo baixo, deploy simples. O P1 é site estático + JS + Lemon Squeezy; a stack da plataforma deve ser o **menor passo adiante** a partir disso, não uma reescrita.

### 2.1 Recomendação

| Camada | Escolha | Por quê | Custo/mês |
|---|---|---|---|
| App + hosting | **Next.js (App Router) na Vercel** | Deploy por git push (zero pipeline para manter); serverless para os webhooks; o site estático do P1 pode conviver no mesmo projeto ou separado; é a stack com mais documentação/exemplos do mundo — o que importa quando quem opera são agentes de IA | US$ 0 (hobby) → US$ 20 |
| Banco + auth | **Supabase** (Postgres gerenciado + Auth com magic link) | Um fornecedor resolve duas necessidades; Postgres relacional serve histórico de experimentos naturalmente; magic link elimina senha; Row Level Security dá isolamento por usuário sem código de autorização artesanal; é SQL padrão — sem lock-in de modelo de dados | US$ 0 → US$ 25 |
| Billing | **Lemon Squeezy Subscriptions** | Já decidido no P1 (DF-03); merchant of record resolve imposto global; webhooks (`subscription_created/updated/cancelled`, `order_created`) mantêm o entitlement; **uma única conta de pagamento para todo o ecossistema** | % por venda, fixo US$ 0 |
| E-mail transacional | O mesmo provedor que o P1 escolher em PF-03 (ex.: Resend/Postmark) | Magic link e recibos saem pelo provedor já contratado; não abrir segundo fornecedor de e-mail | US$ 0–20 |
| Analytics | O mesmo provedor/contrato de eventos do P1 (US-07) | O contrato de `analytics.js` está congelado e já respeita a promessa "e-mail nunca em analytics"; a plataforma adiciona eventos novos (`login`, `card_saved`, `result_logged`, `subscription_started`) ao mesmo padrão | US$ 0–10 |

**Custo fixo total: US$ 0 no MVP, teto ~US$ 65/mês** quando sair dos planos gratuitos — dentro do orçamento do briefing com folga para mídia.

### 2.2 Alternativas descartadas (e por quê)

| Alternativa | Por que não |
|---|---|
| **Continuar 100% estático + localStorage** | Não sustenta o degrau 2: sem conta não há histórico multi-dispositivo, sem servidor não há verificação de assinatura. O localStorage já é o teto do P1, por design. |
| **Backend próprio (Rails/Django/Node em VPS)** | Manutenção de servidor, upgrades e segurança recaem num "time" sem humanos de plantão. Um fundador solo não deve carregar pager de infraestrutura. |
| **Firebase** | NoSQL modela mal "usuário → cards → resultados" (relacional por natureza); lock-in de dados forte; regras de segurança proprietárias. Supabase dá o mesmo conforto com SQL padrão e exportável. |
| **Auth de terceiro pago (Clerk/Auth0)** | Fornecedor e fatura a mais para resolver o que o Supabase Auth já resolve de graça no mesmo lugar do banco. |
| **Stripe direto** | Sem merchant of record, a responsabilidade fiscal global cai no fundador — exatamente o que DF-03 evitou. Trocar de provedor de billing entre degrau 1 e 2 também quebraria a ponte de e-mail/pedidos. |
| **No-code (Bubble/Softr)** | Não versionável em git, não operável por agentes de IA, lock-in total. Nosso "custo de desenvolvimento" é baixo; nosso custo de *opacidade* é altíssimo. |
| **Astro/SvelteKit/Remix** | Tecnicamente adequados, mas com menos massa de exemplos e integrações prontas (Supabase, Lemon Squeezy, Vercel) — para agentes de IA, a stack mais documentada é a mais barata de operar. |

### 2.3 Esqueleto de dados (orientação, não spec final)

```
users            (id, email, created_at)                        ← Supabase Auth
products         (id, slug: tyjc_kit | experiment_library | …)  ← degraus futuros entram aqui
entitlements     (user_id, product_id, source: ls_order | ls_subscription | manual, status, ls_ref)
experiment_cards (id, user_id, track, experiment_id A1–B4, os 8 campos, created_at)
experiment_runs  (card_id, status: planned|running|read, observed_number, verdict: kept|killed|inconclusive, read_at, note)
```

Regra de privacidade no schema: nenhum campo além do e-mail identifica a pessoa; respostas livres do builder ficam apenas em `experiment_cards` do próprio usuário (RLS), nunca em eventos de analytics.

### 2.4 Nota sobre legado

`api/analyze.js` (raiz do repositório) é resto do antigo Dashboard 4+1 (OpenAI Assistants) — que o briefing declara **não** ser o produto. Não é dependência de nada no P1 nem no P2. Recomendação ao PM: arquivar/remover em limpeza futura para não confundir agentes; a squad-apps não vai tocá-lo sem autorização.

---

## 3. Plano de migração do TYJC para dentro da plataforma

**Princípio (atribuição 2 da squad)**: o produto estático do P1 é a fonte de verdade do fluxo até a migração ser aprovada pelo PM. A plataforma nasce **ao lado**, não no lugar.

### 3.1 A ponte: o e-mail

Todo comprador do TYJC existe em dois lugares que já capturamos hoje: o **pedido no Lemon Squeezy** (e-mail + order, sempre) e a **lista de e-mail** (US-06, quando ele pediu o card por e-mail). O pedido no LS é a fonte de verdade do direito de acesso:

1. **Backfill**: script lê os pedidos TYJC via API do Lemon Squeezy e cria `users` + `entitlements(tyjc_kit)` para cada e-mail comprador.
2. **Daqui em diante**: webhook `order_created` do LS cria o entitlement em tempo real — o comprador novo já nasce com conta reivindicável.
3. **Reivindicação**: o comprador digita o e-mail da compra na plataforma → magic link → entra e encontra o Kit. Sem senha, sem "criar conta" como etapa separada, sem importação manual.
4. **E-mail trocado/errado**: fluxo de suporte manual (fundador/PM) via `entitlements.source = manual` — sem automação no MVP.

### 3.2 Fases (cada uma lançável e reversível — nada de big bang)

| Fase | O que acontece | O que o comprador vê | Reversível? |
|---|---|---|---|
| **0. Fundação** (agora) | Este documento; nenhum código | Nada muda | n/a |
| **1. Esqueleto** | `platform/` em subdomínio próprio (ex.: `app.` no domínio de PF-02): auth + backfill de pedidos + Kit portado (builder + biblioteca, mesmo conteúdo) | Nada muda — ninguém é convidado ainda | Sim — desligar o subdomínio |
| **2. Convite** | E-mail aos compradores: *"your cards now have a home"* — login opcional, card ganha "save to your account" | Site estático continua funcionando exatamente igual; a plataforma é um **adicional** | Sim — parar de convidar |
| **3. Assinatura** | Produto de assinatura no LS + gating da biblioteca completa + result logging | Oferta do degrau 2 para logados e para a lista de espera de US-10 | Sim — despublicar a oferta |
| **4. Cutover** (só com aprovação explícita do PM) | O fluxo de compra passa a apontar para a plataforma; o estático vira redirect | Um fluxo só | Parcial — manter o estático publicado como fallback |

**Compromisso que não quebramos**: o TYJC foi vendido sem login, e a Privacy Policy promete que o e-mail nunca é barreira ao que foi pago. Portanto **login nunca vira condição para usar o que o comprador do degrau 1 já pagou** — ele é a porta para o que o estático não faz (histórico, acompanhamento, assinatura). Qualquer desvio disso é mudança de promessa e sobe ao PM antes.

### 3.3 Como evitar retrabalho na squad-produto do P1

- **A plataforma consome, não pede.** A biblioteca já tem contrato de dados (yaml + regra de recomendação em `experiments-library.md`); o funil já tem contrato de eventos (`analytics.js`). A plataforma adota os dois como estão — zero mudança solicitada ao P1.
- **Cópia, não movimentação.** O builder e a biblioteca são copiados para `platform/` na fase 1; os arquivos de `product/` ficam intactos e continuam sendo a fonte de verdade até o cutover. Divergências de conteúdo pós-cópia são geridas pelo PO, não improvisadas pela squad.
- **Nenhuma mudança no site estático** até a fase 4 — nem um link. O convite da fase 2 sai por e-mail, não por alteração de página do P1.
- **Mesmas contas de fornecedor** (Lemon Squeezy, e-mail, analytics): nada de migrar dados entre provedores.

### 3.4 O e-mail de convite (fase 2) — atenção de compliance

Convidar o comprador a acessar o que comprou é comunicação de serviço, não marketing — defensável mesmo sem o opt-in de marketing de US-06. Mas é zona cinzenta e **vai ao ar**, portanto: um único e-mail, sem oferta de venda no corpo, e o texto passa por aprovação do fundador. Registrado aqui como pendência de decisão (§4.2).

---

## 4. Riscos e dependências

### 4.1 Depende dos dados do lançamento do P1 (ler antes de construir)

| Dado (painel US-07/US-10) | O que decide no P2 |
|---|---|
| **H2.2 — % de adesão à lista de espera do degrau 2** | Se a assinatura merece ser construída já (fase 3) ou se a Sprint P2-1 para na fase 1–2. É o dado mais importante deste documento. |
| Resposta *"ready to run on Monday?"* + texto livre (US-10) | Se o result logging é o gancho certo da assinatura ou se o apetite é por outra coisa (mais experimentos? outra profundidade?). |
| % por trilha (H1.1/H2.1) | Para quem desenhar a UI do histórico primeiro (Sam vs. Priya). |
| Volume de vendas e taxa de reembolso | Tamanho do backfill; se houver pouquíssimos compradores, a fase 2 espera acumular base. |
| Respostas abertas do builder | Linguagem real para o copy da plataforma (em inglês). |

### 4.2 Depende de decisão do fundador (nenhuma é urgente antes de 12/08)

| # | Decisão | Bloqueia |
|---|---|---|
| DP2-01 | Criar contas **Vercel** e **Supabase** (gratuitas) em e-mail do negócio | Início da fase 1 |
| DP2-02 | Subdomínio da plataforma (ex.: `app.` no domínio de PF-02) | Fase 1 |
| DP2-03 | Criar o **produto de assinatura** no Lemon Squeezy e definir o preço dentro da faixa US$ 19–29 (pós-H2.2) | Fase 3 |
| DP2-04 | Aprovar o texto do e-mail de convite aos compradores (§3.4 — vai ao ar) | Fase 2 |

Nota de convivência: pelo charter, **nenhuma dessas pendências entra na janela do fundador antes do lançamento do P1** se houver pendência de P1 aberta (e há: PF-01 a PF-04).

### 4.3 Pode ser construído desde já, sem risco de descarte

- Este documento e o detalhamento do schema/RLS e dos handlers de webhook (spec, não código).
- Especificação do fluxo de auth (magic link) e do backfill de pedidos LS — independem de qualquer dado do lançamento.
- Esqueleto do `platform/` (quando o PM autorizar o build): auth + entitlements + Kit portado servem a **qualquer** resultado da H2.2, pois o degrau 1 dentro da plataforma é útil mesmo que a assinatura mude de forma.
- O que **não** construir ainda: gating de assinatura, telas de billing, result logging final — são a parte sensível à H2.2 e à resposta de US-10.

### 4.4 Riscos técnicos e de produto

| Risco | Mitigação |
|---|---|
| Plataforma quebrar promessa de privacidade do P1 (e-mail em analytics, dados demais) | Regra de schema (§2.3), mesmos contratos de eventos, revisão do PM em toda promessa nova |
| Divergência de conteúdo builder estático × builder da plataforma após a cópia | Fonte de verdade continua no P1 até o cutover; mudanças de conteúdo só via PO |
| Dependência dupla do Lemon Squeezy (checkout **e** identidade de compra) | Aceita conscientemente: é o custo do merchant of record. Export periódico de pedidos como backup frio |
| Webhook perdido → comprador sem acesso | Backfill reexecutável (idempotente) como rede de segurança + fluxo manual de suporte |
| Fundador solo como gargalo de contas/fornecedores | Todas as contas listadas de uma vez (§4.2), pedidas em lote numa única janela pós-lançamento |

---

## 5. Proposta de Sprint P2-1 (a partir de 12/08)

**Objetivo proposto**: *um comprador real do TYJC entra na plataforma com o e-mail da compra e salva um Experiment Card na conta.* (Espelha o critério DF-04 do P1: aprendizado validado com um estranho, não faturamento.)

A Planning acontece **com os dados do lançamento na mesa** — a H2.2 decide se os itens de assinatura entram ou esperam. Candidatos para o PO priorizar:

| # | Candidato | Depende de | Comentário |
|---|---|---|---|
| P2-01 | Setup Vercel + Supabase + subdomínio + esqueleto Next.js | DP2-01, DP2-02 | Fundação; meio dia-agente |
| P2-02 | Auth por magic link + tabela de entitlements + RLS | P2-01 | Coração da conta |
| P2-03 | Backfill de pedidos LS + webhook `order_created` | P2-01, acesso à API LS | A ponte do §3.1 |
| P2-04 | Portar builder + biblioteca para a plataforma (cópia fiel, logado) | P2-02 | Zero mudança de conteúdo |
| P2-05 | Salvar card na conta + histórico (lista dos cards) | P2-04 | Metade do MVP §1.2 |
| P2-06 | Result logging v0 (rodou? número? kept/killed/inconclusive) | P2-05 | **Condicionado à leitura de US-10** |
| P2-07 | E-mail de convite aos compradores | P2-03, DP2-04 | Vai ao ar — aprovação do fundador |
| P2-08 | Assinatura LS + gating da biblioteca | P2-03, DP2-03, **H2.2 favorável** | Se H2.2 fraca, sai da sprint sem dó |
| P2-09 | Eventos de analytics da plataforma no contrato do P1 | P2-02 | `login`, `card_saved`, `result_logged`, `subscription_started` |

Sugestão de corte: P2-01 a P2-05 formam o esqueleto que sobrevive a qualquer resultado do lançamento; P2-06 a P2-08 são a aposta do degrau 2 e entram conforme os dados. QA da sprint espelha o critério do objetivo: um comprador real, não do time, completa o fluxo ponta a ponta.

---

*squad-apps · P2 · dúvidas e aprovações: PM.*
