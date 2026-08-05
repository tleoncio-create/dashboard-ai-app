# Proposta do produto de entrada — escada de valor Risk + Growth

- **Autor**: PO
- **Data**: 2026-08-05
- **Fonte de verdade**: `docs/risk-growth/briefing.md`
- **Status**: proposta para aprovação. O **nome, o preço e a página de vendas vão ao ar** — portanto, pelo briefing (seção 6), **exigem aprovação do fundador**. O restante é trabalho interno, homologado pelo PM.
- **Idioma**: documento interno em português. **Todo texto de produto é em inglês.**

---

## 1. A ideia em uma frase

Uma ferramenta web guiada que transforma a maior dúvida de crescimento do empreendedor em **um experimento barato, datado, com teto de gasto e critério de parada — pronto para rodar na segunda-feira seguinte**.

O usuário entra com uma dúvida cara ("devo investir em ads?", "esse novo pacote vende?") e sai com um **Experiment Card**: uma página, oito campos, zero teoria.

---

## 2. Por que este produto (e não conteúdo, curso ou newsletter)

| Critério do briefing | Como esta proposta atende |
|---|---|
| Carro-chefe dos 3 primeiros meses é **produto digital/ferramenta** (seção 1) | É uma ferramenta, não um PDF nem um curso. |
| MVP entrega **"1º experimento barato desenhado e pronto para rodar"** (seção 2) | É literalmente o output do produto. O resultado prometido e o artefato entregue são a mesma coisa. |
| Promessa **"testar barato antes de apostar"** (seção 2) | O produto é a promessa executada, não explicada. |
| Dor nº 1: **"cresço no improviso"** (seção 3) | O improviso morre quando existe hipótese, métrica e critério de kill definidos **antes** de gastar. |
| **Não executamos pelo cliente** (anti-escopo 4) | Entregamos o desenho do teste; quem roda é ele. |
| **Sem promessa milagrosa** (anti-escopo 1) | A promessa é sobre o processo (um teste pronto), não sobre resultado de negócio. |
| Lançável em **7 dias** | Sem login, sem backend complexo, sem conta de usuário, sem app. Página de vendas + checkout + fluxo guiado + geração do card. |
| **Global desde o dia 1** | Produto em inglês, pagamento internacional, nenhuma dependência cultural ou fiscal local. |
| Orçamento **R$ 1k–5k/mês** | Stack de baixo custo fixo; a maior parte da verba vai para mídia. |

**Por que vence a IA generalista** (a principal alternativa da persona): o ChatGPT devolve um plano; este produto devolve **um compromisso** — com teto de gasto, prazo, métrica, número-alvo e critério de desistência. A restrição é o produto.

---

## 3. Nome da oferta

### Recomendação primária: **The Small Bet Kit**

- **Tagline**: *Design your first low-risk growth experiment in 30 minutes — before you spend real money.*
- **Por quê**: "small bet" é linguagem que as duas personas já usam e entendem; conecta diretamente com "less risk, more growth"; funciona em inglês global sem soar amador. Evita a palavra "cheap" no nome, que em inglês contamina a percepção de qualidade **do próprio produto** (queremos "teste barato", não "produto barato").

### Alternativas para o fundador escolher

| Nome | A favor | Contra |
|---|---|---|
| **Experiment Zero** | Memorável, sugere "o primeiro de muitos", abre caminho natural para a assinatura no degrau 2 | Mais abstrato; exige a tagline para ser entendido |
| **Test Before You Bet** | Diz exatamente o que faz; ótimo para ads | Soa mais como slogan do que como produto; difícil de virar marca |
| **The Cheap Test Kit** | Máxima clareza sobre o benefício (teste barato) | "cheap" pode ser lido como qualidade baixa do produto por parte do público frio |

> **Decisão do fundador** — vai ao ar. Recomendo **The Small Bet Kit** e sugiro travar a decisão até o dia 2 da sprint, porque nome e domínio bloqueiam a página de vendas (US-01).

---

## 4. Preço de entrada

### Recomendação: **US$ 29**, com **preço de lançamento US$ 19 para os 100 primeiros compradores**

**Justificativa:**

1. **Abaixo do limiar de deliberação global.** A hipótese H1.3 (persona Sam) é que até ~US$ 30 a compra é por impulso; acima disso ele pesquisa e adia. Com 7 dias e verba pequena, não podemos pagar o custo de um ciclo de decisão longo.
2. **Alto o bastante para ser um teste real de disposição a pagar.** Grátis não valida nada — e o briefing pede explicitamente **validação rápida da oferta paga** (seção 4). US$ 29 separa curiosidade de intenção.
3. **Deixa espaço para a escada.** Uma entrada a US$ 29 sustenta um degrau 2 a US$ 19–29/mês e um degrau 3 na casa das centenas sem canibalizar nada.
4. **O lançamento a US$ 19 tem função de instrumentação, não de desconto.** A diferença de conversão entre US$ 19 e US$ 29 é o primeiro dado real de elasticidade que teremos — e sai de graça, dentro da mesma campanha.

**Aviso honesto ao PM**: com R$ 1k–5k/mês (~US$ 180–900), **este produto não se paga em mídia paga fria a US$ 29**. Ele não é um centro de lucro — é um **teste de disposição a pagar e uma máquina de captura de e-mails qualificados** para os degraus 2 e 3. O sucesso da Sprint 1 é aprender, não lucrar. Se o objetivo for lucro no dia 7, a proposta muda e isso precisa voltar ao PM.

**Garantia**: reembolso total em 7 dias, sem perguntas. Remove a objeção de risco e é obrigatório para vender globalmente com credibilidade.

---

## 5. O que o usuário recebe (escopo do MVP do dia 7)

### 5.1 O fluxo — Experiment Builder

Um fluxo guiado de **8 perguntas**, sem login, funcionando no celular, concluível em menos de 30 minutos:

| # | Pergunta (em inglês, no produto) | Para quê |
|---|---|---|
| 1 | What stage are you at? | Bifurca a trilha (Sam vs. Priya) e alimenta a validação H1.1/H2.1 |
| 2 | What does your business sell, in one line? | Contexto — o que falta na IA generalista |
| 3 | What's the one decision you're stuck on? | A dúvida cara — matéria-prima do experimento |
| 4 | What do you believe is true, that you haven't proven? | Converte a dúvida em **hipótese falsificável** |
| 5 | How much can you lose without it hurting? | Define o **teto de gasto** — o coração de "less risk" |
| 6 | How many days until you need an answer? | Define o **timebox** |
| 7 | What would you see if you were right? | Define a **métrica e o número-alvo** |
| 8 | Pick your test | Recomendação de 2–3 experimentos da biblioteca, filtrados por estágio, verba e prazo |

### 5.2 O artefato — The Experiment Card

Uma página, gerada na tela, copiável, imprimível e enviada por e-mail. Oito campos:

1. **The bet** — a decisão que ele está prestes a tomar
2. **The hypothesis** — a crença, escrita de forma falsificável
3. **The smallest test** — o experimento concreto, passo a passo
4. **Budget cap** — quanto ele pode perder, em número
5. **Timebox** — data de início e data de leitura
6. **Success metric + threshold** — o que medir e qual número conta como "sim"
7. **Kill criteria** — o número abaixo do qual ele **para e não insiste**
8. **If it works / If it doesn't** — o próximo passo em cada cenário

> O campo **Kill criteria** é a diferença estrutural entre este produto e qualquer plano de marketing gerado por IA. É o que transforma gasto em aprendizado — e é o que faz o nome da marca ser verdadeiro.

### 5.3 A biblioteca — 8 experimentos baratos

Oito experimentos prontos, cada um com custo típico (US$ 0–500), prazo (3–14 dias) e o que ele prova. Quatro calibrados para Sam, quatro para Priya. Exemplos de tipo: fake door / landing de pré-venda, oferta manual a 20 clientes atuais, teste de preço em duas páginas, anúncio de US$ 50 para medir custo por clique qualificado, entrevista de ganho/perda com 5 clientes, teste de canal orgânico com 5 posts.

### 5.4 Fora do MVP do dia 7 (explicitamente)

Login e conta de usuário; acompanhamento do resultado do experimento dentro da ferramenta; múltiplos idiomas; biblioteca ampliada; comunidade; app; diagnóstico gratuito antes do paywall; integração com ferramentas de analytics do cliente.

Tudo isso vai para a lista pós-lançamento. Pelo briefing (regra de urgência, item 4), **o escopo do MVP está congelado até o dia 7**.

---

## 6. Proposta de valor (para a página de vendas)

**Para** empreendedores que crescem no improviso,
**que** precisam decidir onde apostar com pouco dinheiro e pouco tempo,
**The Small Bet Kit** é uma ferramenta guiada
**que** transforma a sua maior dúvida de crescimento em um experimento barato pronto para rodar,
**diferentemente de** cursos genéricos, agências ou de pedir um plano à IA,
**ela** entrega um único teste com teto de gasto, prazo, número-alvo e critério de desistência definidos antes de você gastar o primeiro dólar.

**Promessa de página (em inglês):**
> *Stop betting your money on guesses. In 30 minutes, walk out with one cheap experiment — with a budget cap, a deadline, and a number that tells you when to stop. Less risk, more growth.*

**O que NÃO prometemos** (anti-escopo 1): nenhum número de vendas, nenhum prazo de resultado, nenhum caso de sucesso inventado. A página vende **o artefato e o método**, nunca o resultado de negócio.

---

## 7. A escada de valor (visão — sem detalhamento)

| Degrau | Oferta (nome de trabalho) | Preço-hipótese | Resultado para o usuário | Quando |
|---|---|---|---|---|
| **0** | Newsletter *Less Risk, More Growth* + um experimento por semana | Grátis | Fica na órbita e aprende o método | Sprint 2 |
| **1** | **The Small Bet Kit** — produto de entrada | **US$ 29** (lançamento US$ 19) | Sai com o primeiro experimento pronto para rodar | **Sprint 1 — dia 7** |
| **2** | *The Experiment Library* — assinatura | US$ 19–29/mês | Experimentos ilimitados, biblioteca completa, acompanhamento do resultado de cada teste | Sprints 2–4 |
| **3** | *The Growth Testing System* — curso com as duas trilhas (fundamentos aplicados / avançado: CAC, LTV, funis) | US$ 297–497 | Aprende a operar o sistema sozinho, no próprio negócio | Mês 2–3 |
| **4** | Programa em grupo / mentoria com a marca à frente | US$ 1.000+ | Aplicação assistida no negócio dele | Mês 4+ |

**Preços dos degraus 2 a 4 são hipóteses** e não devem ser comunicados publicamente. A única coisa que a Sprint 1 precisa fazer pela escada é **capturar o e-mail e medir o interesse no degrau 2** (história US-10 do backlog).

**Lógica da escada**: o degrau 1 prova que o método funciona **uma vez**; o degrau 2 vende a **repetição**; o degrau 3 vende a **autonomia**; o degrau 4 vende o **acompanhamento**. Cada degrau responde a uma objeção que o degrau anterior deixou em aberto.

---

## 8. Stack proposta (a mais simples que entrega em 7 dias)

| Necessidade | Proposta | Custo/mês |
|---|---|---|
| Site + página de vendas + ferramenta | Site estático + JS no cliente (sem backend, sem banco) | ~US$ 0 |
| Checkout global + impostos + entrega | Lemon Squeezy ou Gumroad (merchant of record — resolve IVA/sales tax sem estrutura jurídica) | % por venda |
| E-mail (entrega do card + lista) | Provedor de e-mail transacional/marketing no plano gratuito | US$ 0–20 |
| Métricas | Analytics leve com eventos de funil | US$ 0–10 |
| Ads | Google Ads e/ou Meta, teto diário | Verba do fundador |

> **Merchant of record é uma recomendação forte**: vender globalmente com Stripe direto joga a responsabilidade fiscal sobre o fundador. Lemon Squeezy/Gumroad absorvem isso e removem um bloqueador legal que não cabe em 7 dias. **Decisão do fundador** (envolve conta e dinheiro).

---

## 9. Como saberemos que deu certo no dia 7

**Critério mínimo de sucesso do lançamento** (proposta ao PM):

- O produto está no ar e uma pessoa real, que não é do time, conseguiu pagar, concluir o fluxo e gerar um Experiment Card. **Este é o critério não negociável.**
- **≥ 1 venda orgânica ou paga** de alguém fora da rede do fundador.
- Funil instrumentado ponta a ponta, com os sinais do painel de validação das personas sendo coletados.

Não proponho meta de faturamento para o dia 7. Com esta verba e este prazo, meta de receita geraria decisão ruim — empurraria o time a prometer resultado, o que o anti-escopo proíbe.

---

## 10. Riscos desta proposta (registrados pelo PO)

1. **Um produto para duas personas.** Se a Priya achar raso demais (H2.4), a oferta se parte em duas. Mitigação: bifurcação de trilha na pergunta 1 e biblioteca segmentada.
2. **Concorrência com IA gratuita.** A defesa é a restrição (teto, prazo, kill criteria) e o artefato, não a informação. Se a página vender "conteúdo", perdemos.
3. **Volume insuficiente para conclusão.** Com US$ 180–900/mês de mídia, podemos chegar ao dia 30 sem amostra estatística. Mitigação: tratar os números como direcionais e complementar com as 10 entrevistas propostas nas personas.
4. **Nome e domínio como bloqueadores.** A página de vendas não começa sem o nome aprovado. Por isso a decisão do fundador precisa sair até o dia 2.
