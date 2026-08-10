# Registro de decisões do fundador — Sprint 1

Fonte de rastreabilidade das aprovações de nível 2 (DoD) e decisões de negócio. Mantido pelo PM.

| # | Data | Decisão | Escolha do fundador |
|---|------|---------|---------------------|
| DF-01 | 2026-08-05 (D1) | Nome da oferta de entrada | **Test Your Jump Cheaply (TYJC)** — escolhido entre as expansões da sigla TYJC proposta pelo próprio fundador. Copy de referência: *"About to jump? Test the jump first."* |
| DF-02 | 2026-08-05 (D1) | Preço de entrada | **US$ 29**, com preço de lançamento **US$ 19 para os 100 primeiros**. Garantia de reembolso de 7 dias. |
| DF-03 | 2026-08-05 (D1) | Provedor de pagamento | **Lemon Squeezy** (merchant of record). Fundador criará a conta. |
| DF-04 | 2026-08-05 (D1) | Critério de sucesso do D7 | **Aprendizado validado** — produto no ar, 1 estranho paga/conclui/gera o card, funil instrumentado. Sem meta de faturamento no D7. |
| DF-05 | 2026-08-05 (D1) | Janela diária de aprovação | **7h–9h** — resumo do SM pronto às 7h; decisões respondidas até as 9h. |
| DF-06 | 2026-08-05 (D1) | Disponibilidade no fim de semana | **Totalmente disponível** em 08/08 (sáb) e 09/08 (dom) — o plano ganha folga, mas mantém D4–D5 sem dependência obrigatória. |
| DF-07 | 2026-08-05 (D1) | Identidade da marca | O nome da marca é **"- Risk + Growth"** — o símbolo **"-" (menos) antes de Risk é parte da identidade, sempre** (leitura: menos risco, mais crescimento). Toda menção pública da marca deve usar essa grafia; verificação entra no pacote de copy de D3 e no checklist do QA. O nome do produto de entrada (TYJC) não muda. |
| DF-09 | 2026-08-06 (D2) | Domínio e e-mail | **lessriskmoregrowth.com** — grafia confirmada com o fundador (corrigido o typo "groeth" da mensagem original). **Registrado via Squarespace** (DNS será apontado no D6). E-mail de contato configurado: **contact@lessriskmoregrowth.com**, aplicado nas 18 ocorrências do site. |
| DF-10 | 2026-08-06 (D2) | Teto da aposta do degrau 2 | **R$ 8.000 acumulados + 3 sprints**, leitura em 2026-11-11 (D+90) — reduzido dos R$ 15k propostos na tese de PMF. Kill automático pelos critérios de `tese-pmf.md` §3. Autoriza o orçamento da Sprint P2-1. |
| DF-11 | 2026-08-06 (D2) | Provedor de analytics | **Os dois em paralelo**: **Plausible** é o instrumento de decisão da fase 1 (vê 100% do tráfego, sem consentimento) e **GA4** roda desde o D0 sob *Consent Mode* apenas para acumular série histórica de longo prazo (GA4 não tem retroativo). Nenhuma decisão de kill/scale do degrau 2 se apoia em número do GA4. **Condicionada a PF-05** (ver pendências): o GA4 exige ajuste na Privacy Policy §4/§5/§9 e configuração restrita (Google Signals OFF, sem link com Google Ads) — sem isso, o site passa a fazer promessa pública falsa. Até PF-05 ser aprovada, o GA4 fica inerte no código. |
| DF-12 | 2026-08-06 (D2) | Postura de privacidade | **Mudar a política em vez de limitar o rastreamento.** O fundador determinou que o rastreamento é essencial para escala, expansão e fidelidade dos dados; a Privacy Policy foi reescrita para permitir cookies de analytics **e de publicidade/remarketing** (§1, §4, §5, §7, §9). Resolve PF-05. **O que foi preservado**: e-mail e respostas do builder nunca chegam a analytics/ads (garantido em código pelo `sanitize()`), e a proibição de vender/alugar/trocar e-mail e respostas continua absoluta. **O que foi abandonado**: a frase *"we don't run advertising trackers"* e o adjetivo *"anonymous"* — a página agora declara a mudança explicitamente em vez de silenciá-la. |
| DF-08 | 2026-08-05 (D1) | Entidade legal | O fundador atua como **pessoa física** neste primeiro momento. Confirma a decisão de lançar sem cláusula de jurisdição/razão social (merchant of record absorve a responsabilidade fiscal); revisão quando houver PJ. |

## Pendências que dependem do fundador (abertas)

| # | Item | Bloqueia | Prazo |
|---|------|----------|-------|
| PF-01 | ✅ **RESOLVIDO (D2)** — conta **Lemon Squeezy** criada pelo fundador. Confirma DF-03 como Merchant of Record definitivo; os 5 arquivos do site que traziam o aviso provisório de MoR foram limpos | — | Fechado |
| PF-08 | **Loja + produto + link de checkout no Lemon Squeezy.** Conta não é link de compra: falta criar a *store*, o produto com o preço do DF-02 (US$ 29, com US$ 19 para os 100 primeiros) e **ativar a loja para pagamentos reais** (a plataforma revisa a loja antes de liberar — é o único passo com prazo fora do nosso controle). Entregar ao time a **URL pública de checkout**. Não enviar API key | US-02 (checkout) → RG-02 substitui os 3 botões de `index.html` | Até D4 |
| PF-09 | **Decidir o mecanismo do preço de lançamento** (DF-02, US$ 19 para os 100 primeiros): cupom com limite de 100 usos, ou produto/variante separada que é trocada na mão ao atingir 100. Escolha do fundador porque muda o que o cliente vê no checkout e quem controla o corte | Copy dos 3 CTAs e do checkout | Até D4 |
| PF-02 | ✅ **RESOLVIDO (D2)** — lessriskmoregrowth.com registrado via Squarespace; contact@lessriskmoregrowth.com configurado. Resta apenas o apontamento de DNS para a hospedagem (D6) e o teste real de recebimento (INT-3, QA no D6) | — | Fechado |
| PF-03 | ✅ **RESOLVIDO (D2)** — conta **Resend** criada pelo fundador, conforme a recomendação da proposta de provedores. Serve ao envio do card (US-06) e ao magic link do P2 sem troca de provedor | — | Fechado |
| PF-10 | ✅ **RESOLVIDO (D2)** — os 3 registros do Resend estão publicados e **confirmados por consulta ao DNS público**, não só pelo painel. Os 4 registros pré-existentes do Google Workspace seguem intactos. Falta apenas o Resend marcar `Verified` na interface dele (leitura do mesmo DNS já propagado). Inventário abaixo | — | Fechado |
| PF-11 | **API key do Resend → variável de ambiente da Vercel** (`RESEND_API_KEY`), pelo painel da Vercel. ⚠️ **Chave secreta: não colar no chat, em documento nem no repositório.** Quem tem a chave envia e-mail em nome do domínio. Se for exposta por engano, revogar no Resend e gerar outra — é rápido e sem custo | RG-06 (`/api/send-card`) | Até D5 |
| PF-04 | Conta de anúncios (Google/Meta) com forma de pagamento | US-09 (ads, pós-QA) | Até D6 |
| PF-05 | ✅ **RESOLVIDO (D2)** — DF-12: o fundador optou por mudar a política em vez de restringir o rastreamento. Privacy Policy §1/§4/§5/§7/§9 reescrita e commitada. Resta apenas a leitura final do fundador antes do D6 (o texto é público e assinado por ele) | — | Fechado |
| PF-07 | ✅ **RESOLVIDO (D2)** — conta **Plausible** criada pelo fundador. Não exige chave nem ID: o script se identifica pelo domínio (`lessriskmoregrowth.com`, DF-09), já configurado. Duas verificações antes de ligar: (1) a string do site no painel do Plausible tem de bater exatamente com o `domain` do config — divergência não dá erro, só deixa o painel vazio; (2) confirmar que o plano contratado inclui *custom properties*, das quais depende a quebra de funil do US-07 AC4 | — | Fechado |
| PF-06 | ✅ **RESOLVIDO (D2)** — propriedade GA4 criada; *Measurement ID* **`G-BH0GMH7G4K`** entregue pelo fundador e registrado em `product/site/analytics-config.js`. O snippet padrão do Google **não** será usado literalmente (dispara sem consentimento e violaria a §9); entra via Consent Mode com tudo negado por padrão | — | Fechado |

## DNS do domínio — inventário verificado (PF-10, D2)

Estado conferido em **2026-08-06 por consulta ao DNS público** (resolver do Google, DNS-over-HTTPS), não pelo painel do provedor. O Resend pede **3 registros** — e não os SPF/DKIM/DMARC que a proposta de provedores supôs: **nenhum deles é DMARC** (o `_dmarc` existente é do Google Workspace, anterior).

| Host | Type | Valor publicado | Dono | Mexer? |
|------|------|-----------------|------|--------|
| `send` | TXT | `v=spf1 include:amazonses.com ~all` | **Resend** | — |
| `send` | MX (10) | `feedback-smtp.us-east-1.amazonses.com.` | **Resend** | — |
| `resend._domainkey` | TXT | `p=MIGfMA0GCSqGSIb3DQEB…` (DKIM) | **Resend** | — |
| `@` | TXT | `v=spf1 include:_spf.google.com ~all` | Google Workspace | ❌ **não tocar** |
| `@` | MX (1) | `smtp.google.com.` | Google Workspace | ❌ **não tocar** |
| `google._domainkey` | TXT | `v=DKIM1; k=rsa; p=MIIBIjANBgkq…` | Google Workspace | ❌ **não tocar** |
| `_dmarc` | TXT | `v=DMARC1; p=none;` | Google Workspace | ⚠️ ver abaixo |

**O risco que se dissolveu:** o SPF do Resend vive no **subdomínio `send`** e o do Google na **raiz**. Hosts diferentes, registros independentes — nunca houve mesclagem a fazer, e os 4 registros do Google atravessaram a mudança intactos.

**DMARC em `p=none`** é política de observação: nenhum e-mail é bloqueado por falha de autenticação. É o ajuste correto enquanto o envio pelo Resend não tem histórico. Endurecer para `quarantine` é decisão pós-D7, com dados de entrega na mão — **não é tarefa desta sprint**, e apertar antes de o Resend ter histórico é a forma mais fácil de mandar o próprio e-mail transacional para spam.

**Regras de não-quebra, para qualquer pessoa que mexer nesse DNS depois:**
- **Nunca** criar um segundo TXT `v=spf1` no mesmo host — dois SPF invalidam o SPF do domínio inteiro, pior que nenhum.
- **Não tocar** no SPF da raiz nem nos **MX da raiz** (Google Workspace). O MX novo é do host `send`; não substitui nem concorre com os da raiz, e apagá-los derruba o e-mail de contato.
- *Enable Receiving* fica **desligado** — o projeto só envia, não recebe pelo Resend.

## Dívida aberta por DF-12 (implementação, não depende do fundador)

A Privacy Policy §9 passou a prometer três coisas que o site **ainda não faz**. Enquanto não existirem, a página é declaração falsa e o US-08 não pode ser assinado:

| # | Item | Dono | Prazo |
|---|------|------|-------|
| DT-01 | ✅ **RESOLVIDO (D6)** — `consent.js`/`consent.css` (commit `0ddd823`): dois portões independentes (config `enabled` × escolha do visitante), Consent Mode v2 com os 4 sinais *denied* forçados em código (config mal editado não concede nada), fechar no × não é consentimento, retirada apaga cookies `_ga*` já gravados, Accept/Decline com peso visual idêntico. **Copy do banner (~4 frases, EN) entra no pacote de aprovação do fundador no Go/No-Go** | squad-produto | Fechado |
| DT-02 | ✅ **RESOLVIDO (D6)** — link "Cookie settings" no rodapé das 6 páginas + `_footer-snippet.html`, reabrindo o banner (commit `0ddd823`) | squad-produto | Fechado |
| DT-03 | 🔨 **EM CORREÇÃO (D6)** — incluído no pacote de correções pós-veredito do RG-07 | squad-produto | D6 |
| DT-04 | ✅ **RESOLVIDO (D6)** — revalidação completa do QA: 353 asserções independentes, 350 verdes; BLQ-2/BLQ-3/OBS-1/OBS-2/DT-03 confirmados corrigidos; bateria do banner 105/105 (bloqueio prévio, retirada apaga `_ga*`, config adulterado não concede nada). RG-07 aprovado com exceção (BLQ-1 → RG-02/RG-06) | qa | Fechado |
| DT-07 | **DEF-1 do QA**: dedup do `consent.js` chaveia por `name\|ts\|props` e ignora `seq` — dois eventos legítimos idênticos no mesmo milissegundo, um é descartado (subcontagem). Hoje inalcançável; vira risco real com o duplo-clique no botão Buy (`checkout_start`). Conserto de 1 linha (chavear em `seq`). **Prioridade: antes de RG-02/RG-06 irem ao ar.** + OBS-4: nomear o trade do ad-blocker (subcontagem) no cabeçalho de `analytics.js` | squad-produto | Antes de RG-02/RG-06 no ar |
| DT-05 | **Tags de anúncio (Meta/Google Ads) só entram atrás do portão de consentimento** (`ga4Grant()` ou equivalente) — a §9 promete; tag fora do portão torna a política falsa. Registrado antes de existir qualquer tag, para não ser esquecido quando US-09 sair do papel | squad-produto | Quando houver ads |
| DT-06 | Pós-D7 (backlog PO): páginas legais não emitem `page_view` (lacuna pré-existente; provedores contam a visita por conta própria); avaliar evento de taxa de aceite do banner (exigiria 8º nome no contrato congelado — é história nova, não ajuste) | product-owner | Pós-D7 |
