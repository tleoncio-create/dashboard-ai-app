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
| PF-01 | Criar conta no **Lemon Squeezy** e compartilhar acesso para integração | US-02 (checkout) → D6–D7 | Até D3 (sexta 07/08) |
| PF-02 | ✅ **RESOLVIDO (D2)** — lessriskmoregrowth.com registrado via Squarespace; contact@lessriskmoregrowth.com configurado. Resta apenas o apontamento de DNS para a hospedagem (D6) e o teste real de recebimento (INT-3, QA no D6) | — | Fechado |
| PF-03 | Conta de e-mail transacional/marketing (o time propõe o provedor) | US-06 | Até D5 |
| PF-04 | Conta de anúncios (Google/Meta) com forma de pagamento | US-09 (ads, pós-QA) | Até D6 |
| PF-05 | ✅ **RESOLVIDO (D2)** — DF-12: o fundador optou por mudar a política em vez de restringir o rastreamento. Privacy Policy §1/§4/§5/§7/§9 reescrita e commitada. Resta apenas a leitura final do fundador antes do D6 (o texto é público e assinado por ele) | — | Fechado |
| PF-06 | Criar propriedade GA4 em analytics.google.com (grátis, ~10 min) e entregar o *Measurement ID* (`G-XXXXXXX`). **Revisado por DF-12**: a restrição "Signals desligado / sem link com Google Ads" deixa de ser obrigatória — a política agora cobre remarketing. Continua sendo escolha do fundador ligar ou não o Signals no cadastro | Ativação do GA4 | Até D5 |

## Dívida aberta por DF-12 (implementação, não depende do fundador)

A Privacy Policy §9 passou a prometer três coisas que o site **ainda não faz**. Enquanto não existirem, a página é declaração falsa e o US-08 não pode ser assinado:

| # | Item | Dono | Prazo |
|---|------|------|-------|
| DT-01 | **Banner de consentimento com bloqueio prévio** — analytics/ads não disparam até o aceite (Consent Mode). Plausible dispara sempre, por não usar cookie | squad-produto | Antes do D6 |
| DT-02 | **Link "Cookie settings" no rodapé** reabrindo o banner — a §9 promete que retirar o consentimento é tão fácil quanto dar | squad-produto | Antes do D6 |
| DT-03 | Atualizar o cabeçalho de `product/site/analytics.js`, que ainda cita *"anonymous analytics"* e *"no advertising trackers"* como contrato da política. **Bloqueado até o veredito do QA no RG-07** (mesmo arquivo sob teste) | squad-produto | Após veredito RG-07 |
| DT-04 | Bateria de QA específica: banner bloqueia de fato antes do aceite, recusa mantém o Plausible contando, e o `sanitize()` continua barrando e-mail/respostas com os dois sinks instalados | qa | D6 |
