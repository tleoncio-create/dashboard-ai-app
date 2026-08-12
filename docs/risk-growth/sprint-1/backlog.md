# Backlog priorizado — Sprint 1 (7 dias)

- **Autor**: PO
- **Sprint**: 1 — de 2026-08-05 a 2026-08-11 (dia 7 = lançamento)
- **Objetivo da sprint**: colocar no ar o produto de entrada **The Small Bet Kit**, de forma que um empreendedor real, fora do time, consiga **pagar, concluir o fluxo e sair com o primeiro experimento barato pronto para rodar**.
- **Fonte de verdade**: `docs/risk-growth/briefing.md` · **Produto**: `produto-proposta.md` · **Público**: `personas.md`
- **Definition of Done e cerimônias**: responsabilidade do SM. Este documento define **o quê** e **em que ordem** — não define processo.
- **Idioma**: histórias em português; **todo texto entregue ao usuário é em inglês**.

---

## 1. Método de priorização

### RICE

`RICE = (Reach × Impact × Confidence) / Effort`

| Fator | Como foi medido nesta sprint |
|---|---|
| **Reach** | Pessoas alcançadas pelo item em 30 dias. Premissa: **~700 visitantes qualificados** e **~14 compradores** (conversão de 2%), coerentes com R$ 1k–5k/mês de mídia. Itens antes do paywall usam 700; itens depois do paywall usam 14. |
| **Impact** | 3 = massivo · 2 = alto · 1,5 = médio · 1 = baixo · 0,5 = mínimo |
| **Confidence** | 0,5 a 1,0 — quanta evidência temos de que o item entrega o efeito estimado |
| **Effort** | Dias-agente (uma squad de IA trabalhando um dia) |

### Aviso de leitura obrigatório (limitação conhecida do RICE nesta sprint)

O funil tem uma queda de 50x entre visitante e comprador. Isso faz o RICE puro **colocar a página de vendas acima do próprio produto**, o que seria absurdo se lido literalmente. Portanto:

> **O RICE ordena a sequência de execução. Quem decide o corte MoSCoW é a coluna "Bloqueia a promessa do dia 7?".**
> Nenhum item que bloqueia a promessa sai do Must, por mais baixo que seja o seu RICE.

Isso está registrado explicitamente para que o PM possa auditar a decisão em vez de precisar reconstituí-la.

### MoSCoW

- **Must** — sem isso não há lançamento no dia 7. São 8 itens.
- **Should** — aumenta muito o valor, mas o lançamento sobrevive sem. São 2 itens.
- **Won't (esta sprint)** — decidido fora, com justificativa. Ver seção 5.

---

## 2. Backlog priorizado

| # | História | R | I | C | E | **RICE** | Bloqueia dia 7? | MoSCoW |
|---|---|---|---|---|---|---|---|---|
| US-01 | Página de vendas em inglês | 700 | 3 | 0,9 | 1,0 | **1890** | Sim | Must |
| US-02 | Checkout internacional + entrega do acesso | 700 | 3 | 0,95 | 1,5 | **1330** | Sim | Must |
| US-08 | Páginas legais mínimas + garantia de 7 dias | 700 | 1 | 0,9 | 0,5 | **1260** | Sim | Must |
| US-07 | Instrumentação do funil e do painel de validação | 700 | 1,5 | 0,8 | 1,0 | **840** | Sim | Must |
| US-09 | Campanha de ads inicial com teto de orçamento | 700 | 2 | 0,5 | 1,0 | **700** | Não | Should |
| US-06 | Entrega do Experiment Card por e-mail + captura de lista | 14 | 2 | 0,8 | 0,5 | **44,8** | Sim | Must |
| US-04 | Geração do Experiment Card | 14 | 3 | 0,9 | 1,0 | **37,8** | Sim | Must |
| US-10 | Pós-compra: feedback de 1 pergunta + lista de espera do degrau 2 | 14 | 1,5 | 0,7 | 0,5 | **29,4** | Não | Should |
| US-03 | Experiment Builder guiado (8 perguntas) | 14 | 3 | 0,9 | 2,0 | **18,9** | Sim | Must |
| US-05 | Biblioteca de 8 experimentos baratos | 14 | 2,5 | 0,7 | 1,5 | **16,3** | Sim | Must |

**Esforço total**: 10,5 dias-agente · **Musts**: 9,0 · **Shoulds**: 1,5.

### Fila de sacrifício (para a regra de urgência do briefing, seção 6)

Quando o fundador furar a sprint, **este é o item que eu, PO, indico para sair**, nesta ordem:

1. **US-10** (0,5 dia) — pós-compra
2. **US-09** (1,0 dia) — ads podem começar no dia 8 sem perder o lançamento
3. **Reduzir US-05** de 8 para 4 experimentos (libera 0,75 dia) — degrada o produto sem quebrá-lo
4. **Reduzir US-03** de 8 para 6 perguntas (libera 0,5 dia) — **último recurso**; abaixo disso o card perde campos e a promessa cai

Nada além disso sai sem replanejamento formal com o PM. Teto de 2 trocas na sprint, conforme o briefing.

---

## 3. As histórias

> **Convenção de personas nas histórias**: "Sam" = empreendedor em primeiros clientes · "Priya" = empreendedora faturando e querendo crescer (ver `personas.md`).
> Critérios de aceite escritos para serem **verificados pelo QA sem interpretação** — cada um é observável e tem resposta binária.

---

### US-01 — Página de vendas

**Como** Sam, que acabou de clicar em um anúncio,
**quero** entender em menos de 10 segundos o que é isso, o que eu saio com e quanto custa,
**para** decidir comprar sem precisar pesquisar mais nada.

**MoSCoW**: Must · **RICE**: 1890 · **Esforço**: 1,0 dia-agente

**Critérios de aceite**
1. A página está integralmente em inglês, sem nenhuma palavra em português visível ao usuário.
2. O título principal comunica o resultado ("walk out with one cheap experiment ready to run") e é visível sem rolagem em telas de 375px de largura.
3. O preço aparece na página em pelo menos dois pontos, incluindo próximo ao botão de compra.
4. Existe uma seção que lista os 8 campos do Experiment Card, com um exemplo real preenchido de ponta a ponta.
5. Existe uma seção que responde à objeção "why not just ask ChatGPT?" em no máximo 4 linhas.
6. A garantia de reembolso de 7 dias aparece próxima ao botão de compra.
7. **Nenhuma promessa de resultado de negócio** (número de vendas, faturamento, prazo de retorno) aparece em qualquer lugar da página — QA deve buscar ativamente por promessas e reprovar se encontrar. *(anti-escopo 1)*
8. Nenhum depoimento, logo de cliente, número de usuários ou prova social inventada aparece na página. *(regra de integridade)*
9. Todos os CTAs levam ao checkout e o fluxo completa sem erro em desktop e mobile.
10. A página carrega em menos de 3 segundos em conexão 4G simulada.

---

### US-02 — Checkout internacional e entrega do acesso

**Como** Priya, que está em outro país e paga em outra moeda,
**quero** pagar em menos de 2 minutos e receber acesso imediato,
**para** não perder o impulso de compra nem ter que falar com ninguém.

**MoSCoW**: Must · **RICE**: 1330 · **Esforço**: 1,5 dia-agente

**Critérios de aceite**
1. Uma compra de teste real, com cartão internacional, completa de ponta a ponta e o dinheiro aparece na conta do fundador.
2. Após o pagamento, o usuário chega ao Experiment Builder **sem precisar criar conta, senha ou login**.
3. O acesso funciona se o usuário fechar a aba e voltar pelo link recebido por e-mail.
4. O preço é cobrado em US$ e o checkout exibe o valor final, com impostos, antes da confirmação.
5. O checkout funciona em desktop e mobile, em pelo menos dois navegadores.
6. Uma tentativa de pagamento recusada mostra mensagem de erro em inglês e permite nova tentativa sem recarregar a página.
7. O comprador recebe um recibo automático por e-mail.
8. O provedor usado é merchant of record (responsabilidade fiscal fora do fundador) — ou, se não for, existe registro escrito da decisão contrária aprovada pelo fundador.

---

### US-03 — Experiment Builder guiado

**Como** Sam, que decide no feeling e não sabe por onde começar,
**quero** ser conduzido por poucas perguntas objetivas sobre o meu negócio,
**para** transformar a minha dúvida em uma hipótese testável sem precisar saber o jargão.

**MoSCoW**: Must · **RICE**: 18,9 · **Esforço**: 2,0 dias-agente
*(RICE baixo por estar depois do paywall — é o núcleo do produto e não sai do Must.)*

**Critérios de aceite**
1. O fluxo tem exatamente as 8 perguntas definidas em `produto-proposta.md`, seção 5.1, na ordem definida.
2. A pergunta 1 bifurca a trilha entre "getting first traction" (Sam) e "scaling what works" (Priya), e a escolha altera a linguagem e as recomendações das etapas seguintes.
3. É possível voltar a qualquer pergunta anterior sem perder as respostas já dadas.
4. Uma resposta em branco em campo obrigatório impede o avanço e mostra mensagem de erro em inglês.
5. As perguntas 5 (teto de gasto) e 6 (prazo) aceitam apenas valores numéricos válidos e recusam zero e negativos.
6. Se o usuário fechar a aba e voltar pelo mesmo dispositivo, as respostas já dadas são recuperadas.
7. Um usuário de teste que nunca viu o produto conclui o fluxo em **menos de 30 minutos** sem pedir ajuda — medido e registrado pelo QA.
8. O fluxo é utilizável em tela de 375px, sem rolagem horizontal e sem sobreposição de elementos.
9. Nenhuma pergunta trata de finanças, jurídico, RH ou operação. *(anti-escopo 3)*
10. Nenhuma etapa oferece executar a ação pelo usuário. *(anti-escopo 4)*

---

### US-04 — Geração do Experiment Card

**Como** Sam, que já tentou de tudo e nunca soube o que funcionou,
**quero** sair com uma página única contendo o meu experimento, o teto de gasto, o prazo, o número-alvo e o critério de desistência,
**para** rodar o teste na segunda-feira e saber, sozinho, se deu certo.

**MoSCoW**: Must · **RICE**: 37,8 · **Esforço**: 1,0 dia-agente

**Critérios de aceite**
1. O card exibe os 8 campos definidos em `produto-proposta.md`, seção 5.2, todos preenchidos com base nas respostas do usuário — nenhum campo em branco ou com placeholder.
2. O campo **Budget cap** reproduz exatamente o valor informado na pergunta 5, com a moeda.
3. Os campos **Timebox** exibem data de início e data de leitura calculadas a partir da pergunta 6, em datas absolutas (não "em 14 dias").
4. O campo **Kill criteria** contém um número e uma ação explícita de parada (ex.: *"fewer than 5 sign-ups by Aug 22 → stop and do not extend the budget"*).
5. O campo **Success metric** contém uma métrica e um número-alvo, nunca um adjetivo.
6. O card pode ser copiado como texto e impresso/salvo em PDF, e ambos preservam os 8 campos.
7. O card cabe em uma página A4 ao imprimir.
8. QA gera 3 cards com perfis diferentes (Sam com US$ 100/7 dias; Priya com US$ 500/14 dias; caso extremo com US$ 0) e os 3 saem coerentes e executáveis.
9. Todo o texto do card está em inglês.

---

### US-05 — Biblioteca de 8 experimentos baratos

**Como** Priya, que tem cinco ideias competindo e nenhuma forma barata de descartá-las,
**quero** receber 2 ou 3 sugestões de teste que caibam na minha verba e no meu prazo,
**para** escolher o experimento certo sem ter que inventá-lo do zero.

**MoSCoW**: Must · **RICE**: 16,3 · **Esforço**: 1,5 dia-agente

**Critérios de aceite**
1. Existem **8 experimentos** cadastrados, 4 marcados para a trilha "first traction" e 4 para "scaling".
2. Cada experimento tem: nome, o que prova, passo a passo executável, custo típico em US$, prazo típico em dias e o erro mais comum ao rodá-lo.
3. Cada experimento tem custo típico **≤ US$ 500** e prazo **≤ 14 dias**. *(coerência com a promessa "barato")*
4. Na pergunta 8 do builder, o usuário recebe entre 2 e 3 recomendações filtradas pela trilha, pelo teto de gasto e pelo prazo informados.
5. Se nenhum experimento couber no teto de gasto informado, o sistema recomenda o mais barato disponível e avisa claramente que ele excede o orçamento — nunca devolve lista vazia.
6. Nenhum experimento pressupõe audiência preexistente, equipe ou verba acima de US$ 500.
7. Nenhum experimento envolve finanças, jurídico, RH ou operação. *(anti-escopo 3)*
8. Todos os textos em inglês.

---

### US-06 — Entrega do card por e-mail e captura de lista

**Como** Sam, que fecha abas e esquece coisas,
**quero** receber o meu Experiment Card por e-mail,
**para** ter o teste em mãos na segunda-feira mesmo que eu perca o link.

**MoSCoW**: Must · **RICE**: 44,8 · **Esforço**: 0,5 dia-agente

**Critérios de aceite**
1. Após gerar o card, o usuário informa o e-mail e recebe o card em **menos de 2 minutos**.
2. O e-mail contém os 8 campos do card em texto legível (não apenas um link) e também o link de retorno.
3. O e-mail chega à caixa de entrada, não ao spam, em pelo menos dois provedores testados (Gmail e um outro).
4. O e-mail é armazenado em uma lista com a origem identificada (produto de entrada, trilha escolhida).
5. Existe consentimento explícito para comunicações futuras e um link de descadastro funcional. *(requisito para vender globalmente)*
6. Um e-mail inválido é recusado com mensagem em inglês, sem travar o acesso ao card na tela.
7. O card na tela continua acessível mesmo se o usuário se recusar a informar o e-mail — **o e-mail não pode ser barreira para a entrega do que foi pago**.

---

### US-07 — Instrumentação do funil e do painel de validação

**Como** PO,
**quero** medir cada etapa do funil e os sinais das hipóteses de persona,
**para** recomendar ao PM, com dados, o que fazer na Sprint 2 em vez de opinar.

**MoSCoW**: Must · **RICE**: 840 · **Esforço**: 1,0 dia-agente

**Critérios de aceite**
1. São registrados os eventos: `page_view`, `checkout_start`, `purchase`, `builder_start`, `builder_step_completed` (com o número da etapa), `card_generated`, `email_captured`.
2. Cada evento de builder carrega a trilha escolhida (`first_traction` ou `scaling`).
3. É possível ler, em uma única tela, as 6 linhas do painel de validação de `personas.md`: % por trilha, % de conclusão do builder, % em lista de espera, taxa de reembolso, conversão visita→compra.
4. O relatório distingue tráfego pago de orgânico.
5. Nenhum dado pessoal além do e-mail é coletado, e o e-mail não é enviado a ferramentas de analytics.
6. QA percorre o funil completo uma vez e confirma que **todos os 7 eventos** aparecem no relatório, na ordem correta.
7. O relatório exibe o volume absoluto ao lado de cada percentual, para impedir leitura de percentual sobre amostra minúscula.

---

### US-08 — Páginas legais mínimas e garantia

**Como** Priya, comprando de um site que nunca vi, de outro país,
**quero** ver termos, política de privacidade e uma garantia clara,
**para** confiar o suficiente para colocar o cartão.

**MoSCoW**: Must · **RICE**: 1260 · **Esforço**: 0,5 dia-agente

**Critérios de aceite**
1. Existem páginas de Terms of Service, Privacy Policy e Refund Policy, acessíveis do rodapé de todas as páginas.
2. A Refund Policy declara reembolso total em 7 dias, sem perguntas, e informa como solicitá-lo.
3. Existe um e-mail de contato funcional, e uma mensagem de teste enviada a ele é recebida.
4. A política de privacidade declara quais dados são coletados (e-mail e respostas do builder) e para que servem.
5. Nenhuma dessas páginas afirma ser aconselhamento jurídico, financeiro, contábil ou de investimento. *(anti-escopo 3)*
6. Todos os textos em inglês.

> **Nota do PO**: este item é sobre a conformidade **do nosso próprio site** para vender globalmente. Não conflita com o anti-escopo 3, que trata do **tema do conteúdo** que entregamos ao cliente.

---

### US-09 — Campanha de ads inicial com teto de orçamento

**Como** fundador,
**quero** levar tráfego pago à página com teto diário de gasto,
**para** validar se alguém que não me conhece paga por isso, sem estourar o orçamento.

**MoSCoW**: Should · **RICE**: 700 · **Esforço**: 1,0 dia-agente

**Critérios de aceite**
1. Existe 1 campanha ativa, com teto diário configurado, cujo gasto mensal projetado fica **dentro de R$ 1k–5k**.
2. Existem no mínimo 3 criativos, sendo **um com ângulo "stop wasting money on guesses"** e **um com ângulo "grow faster"** — para testar a hipótese H1.2 das personas.
3. Existem 2 conjuntos de público, um por persona.
4. Todos os anúncios apontam para URLs com parâmetros de origem que o relatório de US-07 consegue ler.
5. Nenhum anúncio contém promessa de resultado de negócio. *(anti-escopo 1)*
6. O fundador aprovou os criativos antes de irem ao ar. *(briefing, seção 6 — ele aprova o que vai ao ar)*
7. A campanha só é ativada depois que QA confirmou o funil completo funcionando ponta a ponta.

---

### US-10 — Pós-compra: feedback e lista de espera do degrau 2

**Como** PO,
**quero** perguntar uma única coisa ao comprador e oferecer o próximo degrau,
**para** medir a satisfação real e o apetite pela assinatura antes de investir em construí-la.

**MoSCoW**: Should · **RICE**: 29,4 · **Esforço**: 0,5 dia-agente

**Critérios de aceite**
1. Após gerar o card, aparece **uma única pergunta**: *"Is this experiment ready to run on Monday?"* com resposta Yes/No e um campo de texto opcional.
2. A resposta é registrada e aparece no relatório de US-07, segmentada por trilha.
3. Na mesma tela existe um convite para a lista de espera de *The Experiment Library*, descrito em uma frase, **sem preço e sem data de lançamento**.
4. A adesão à lista de espera é registrada e segmentada por trilha.
5. Nada nesta tela bloqueia o acesso ao card nem exige nova ação para mantê-lo.
6. Nenhuma promessa de quando o degrau 2 ficará pronto. *(anti-escopo 1)*

---

## 4. Sequência sugerida pelos 7 dias

Ordenação por dependência, não por RICE. O SM ajusta a mecânica; a ordem de valor é do PO.

| Dia | Foco | Depende de |
|---|---|---|
| 1 | **Decisão de nome e domínio (fundador)** · US-05 biblioteca começa (não depende de nome) | — |
| 2 | US-03 builder (parte 1) · US-08 legais | Nome aprovado |
| 3 | US-03 builder (parte 2) · US-01 página de vendas | US-05 |
| 4 | US-04 card · US-02 checkout | US-03 |
| 5 | US-06 e-mail · US-07 instrumentação | US-04, US-02 |
| 6 | **QA ponta a ponta** · correções · US-10 | Tudo acima |
| 7 | **Aprovação do fundador → no ar** · US-09 ads ligados após o "go" | QA aprovado |

**Marco crítico do dia 1**: sem o nome aprovado, US-01 não começa. É o único bloqueador externo ao time.

---

## 5. Won't — decidido fora desta sprint, com justificativa

| Item | Por que fica fora |
|---|---|
| Diagnóstico gratuito de 3 perguntas antes do paywall | Melhora conversão fria, mas adiciona ~1 dia e o briefing pede validação da **oferta paga**. Primeiro item da lista pós-lançamento. |
| Login, conta de usuário e histórico | Não é necessário para entregar a promessa; adiciona backend e risco. |
| Acompanhamento do resultado do experimento dentro da ferramenta | É o coração do degrau 2 da escada, não do degrau 1. |
| Múltiplos idiomas | O briefing diz global **em inglês** no dia 1. |
| Biblioteca ampliada (20+ experimentos) | 8 provam o conceito; ampliar é degrau 2. |
| Newsletter e conteúdo editorial | Degrau 0 da escada, previsto para a Sprint 2. |
| Programa de afiliados, comunidade, app | Fora do escopo do produto de entrada. |

Conforme o briefing (regra de urgência, item 4), **o escopo do MVP está congelado até o dia 7**. Pedidos novos vão por padrão para esta lista.

---

## 6. Premissas que, se caírem, invalidam este backlog

1. Squads de IA entregam ~1,5–2 dias-agente de trabalho por dia corrido. Se a capacidade real for menor, os Shoulds caem e depois a fila de sacrifício entra em ação.
2. O fundador decide nome e provedor de pagamento até o **dia 1**.
3. Existe uma conta de pagamento internacional utilizável — se não existir, **US-02 vira o maior risco da sprint** e o lançamento pago é impossível no dia 7.
4. O fundador tem uma janela de aprovação no dia 7.

---

## 7. Registro de decisões de priorização (para auditoria do PM)

| Decisão | Justificativa |
|---|---|
| RICE ordena, mas "bloqueia o dia 7" decide o corte | O RICE puro colocaria o builder em 9º lugar por estar depois do paywall. Corrigir isso com um segundo critério explícito é mais honesto que inflar os números. |
| US-05 (biblioteca) é Must apesar do menor RICE | Sem repertório de experimentos, o builder devolve um card genérico — e genérico é exatamente o que faz a IA generalista perder. É a defesa competitiva do produto. |
| US-09 (ads) é Should, não Must | O lançamento existe sem tráfego pago; tráfego pago sem produto no ar queima verba. Ligar ads no dia 8 custa 1 dia de aprendizado; ligar antes de o QA aprovar custa dinheiro e credibilidade. |
| US-08 (legais) é Must apesar de Impact 1 | É barato (0,5 dia) e é bloqueador para vender globalmente com cartão. Impacto baixo, risco de omissão altíssimo. |
| Diagnóstico gratuito foi cortado | Custa ~1 dia e ataca conversão, não a promessa. O objetivo do dia 7 é validar que **alguém paga**, e a página de vendas já cumpre essa função. |
| 8 perguntas no builder, não 12 | Cada pergunta adicional derruba a taxa de conclusão, e H1.4 (≥70% de conclusão) é a hipótese mais importante da sprint. |
| Nenhuma meta de faturamento no dia 7 | Meta de receita com esta verba empurraria o time a prometer resultado, o que o anti-escopo 1 proíbe. O sucesso do dia 7 é aprendizado, não caixa. |
