# Tese de Product-Market Fit — - Risk + Growth

- **Autor**: PO · **Data**: 2026-08-06 · **Status**: proposta para homologação do PM
- **Documento interno em português.** Todo texto público é em inglês.
- Fontes: `contexto-essencial.md` · painel de validação em `sprint-1/personas.md` · escada de valor em `sprint-1/produto-proposta.md` §7

---

## 1. A tese

**TYJC (Test Your Jump Cheaply, US$ 29) não é o negócio — é o instrumento de descoberta.** Ele existe para provar, com dinheiro real e não com pesquisa declarada, que existe um empreendedor disposto a pagar para transformar uma dúvida cara em um experimento barato, e para revelar quem é esse empreendedor, o que ele está tentando decidir e com que linguagem ele descreve a própria dor. O **candidato a PMF é o degrau 2 — a Experiment Library por assinatura (US$ 19–29/mês)** —, porque o degrau 1 prova que o método funciona **uma vez** e a assinatura é a única oferta da escada cujo valor cresce com a **repetição**: um empreendedor que testa barato uma vez tem um episódio; um que testa todo mês mudou de comportamento, e comportamento recorrente é o que sustenta receita recorrente. **Curso (degrau 3) e mentoria (degrau 4) não são apostas independentes: são a escala do que a Library provar** — o curso vende a autonomia para quem já usa a Library, a mentoria vende o acompanhamento para quem já tem autonomia. Consequência prática e não negociável: **não construímos curso nem mentoria antes de a Library dar sinal de retenção**, e não construímos a Library antes de o TYJC dar sinal de demanda paga.

---

## 2. Hipóteses que o lançamento testa

Consolidação do painel de `personas.md`. Cada linha diz qual decisão ela **destrava** ou **mata** — nenhuma hipótese existe aqui sem consequência atrelada.

| # | Hipótese | Sinal | Meta | Se atingir → destrava | Se falhar → mata / muda |
|---|---|---|---|---|---|
| **H0** | Alguém paga por isso | conversão visita → compra | **≥ 1,5%** | Toda a tese segue de pé; libera escalar mídia | Rever **preço e promessa** antes de qualquer novo degrau. **Nenhuma verba adicional em mídia.** É a hipótese-mãe: se H0 cai, as outras não têm leitura. |
| **H1.1** | Sam (primeiros clientes) é o comprador majoritário | % trilha `first_traction` | **≥ 50%** | Library nasce com repertório priorizado para tração | Repriorizar mensagem e público de ads para Priya; a Library muda de eixo (escala, não tração) |
| **H1.4** | O artefato é o valor percebido, não o conteúdo | % que conclui o builder e gera card | **≥ 70%** | Confirma que o produto é a **restrição** (teto, prazo, kill), não a informação — a Library herda o formato | Abaixo de 70%, **simplificar o builder antes de tudo**. Nada de degrau 2 com um degrau 1 que as pessoas não terminam. |
| **H2.1** | Priya (faturando) aparece no funil pago | % trilha `scaling` | **≥ 25%** | Duas personas viáveis no mesmo funil; escada única se sustenta | Rever criativo e público. Se persistir, a escada vira monopersona e os degraus 3–4 precisam ser repensados |
| **H2.2** | Existe apetite pelo degrau 2 | % de compradores na lista de espera da Library | **≥ 40%** | **Assinatura entra como objetivo da Sprint P2-1.** É o gatilho positivo mais importante deste documento | < 40%: a Library não entra em construção. **Revisar a escada de valor com o PM** antes de escrever uma linha de código do degrau 2 |
| **H2.4** | Um único produto de entrada serve as duas personas | reembolso da trilha `scaling` | **< 15%** | Mantemos oferta única, mensagem única, custo de manutenção único | ≥ 15% (ou feedback ≤ 2/5 na trilha avançada): **a oferta se parte em duas** — decisão do PM, não do PO. Dobra o custo de tudo a partir do degrau 2 |

**Ordem de leitura**: H0 primeiro. Sem H0, nenhuma das outras cinco tem significado — são percentuais sobre um denominador que não existe.

---

## 3. Critérios de kill da própria tese

Aplicamos ao projeto o mesmo formato que vendemos ao cliente. Se o Experiment Card é honesto, esta seção também precisa ser.

| Campo | Valor |
|---|---|
| **The bet** | Construir a Experiment Library por assinatura como o produto principal de - Risk + Growth |
| **The hypothesis** | Empreendedores que pagaram uma vez para desenhar um experimento barato pagarão todo mês para continuar testando — e continuarão usando depois do primeiro mês |
| **Budget cap** | **R$ 8.000 acumulados** (~R$ 2,7k/mês por 3 meses, dentro da faixa de orçamento do briefing) + **3 sprints** de capacidade do time. Definido pelo fundador em D2 (DF-10, reduzido dos R$ 15k propostos). Nada além disso sem replanejamento formal |
| **Timebox** | Início **2026-08-11 (D7)** · leitura em **2026-11-11 (D+90)**. Data absoluta, não "em 3 meses" |
| **Success metric + threshold** | **≥ 25 assinantes pagantes ativos** no fim do mês 3, com **churn mensal ≤ 8%** nas duas últimas coortes |
| **Piso de leitura (não é kill)** | **< 25 assinantes** OU **< 2 coortes mensais completas**: **inconclusivo — não coroa e não mata.** O teste não rodou; não há resultado para ler. Rodar de novo dentro do mesmo teto, ou abandonar a pergunta. Proibido esticar o prazo para perseguir número melhor. |
| **Kill criteria** | Com amostra **acima** do piso: churn mensal **> 15%** por 2 meses seguidos, **ou** < 40% dos assinantes gerando ≥ 1 experimento/mês, **ou** H2.2 abaixo de 40% no lançamento → **parar a Library**. Não subir o teto, não estender o prazo, não reconstruir o produto atrás de um número melhor. |
| **If it doesn't work** | Pivô para o degrau 3 (curso/trilhas) como carro-chefe, com o TYJC seguindo como captação — **e a tese deste documento é reescrita, não remendada** |
| **If it works** | Library vira o produto principal; curso e mentoria entram como escala, nesta ordem |

---

## 4. Definição operacional de "PMF atingido" (proposta ao PM)

**A Experiment Library atingiu PMF quando, por duas coortes mensais consecutivas:**

1. **Retenção**: ≥ 60% dos assinantes de uma coorte seguem pagando no **mês 3**;
2. **Churn**: churn mensal ≤ 8%;
3. **Uso, não acesso**: ≥ 40% dos assinantes ativos geram **≥ 1 experimento por mês** — login não conta, card gerado conta;
4. **Volume**: ≥ 25 assinantes por coorte;
5. **Receita**: MRR crescendo mês a mês **sem aumento proporcional de verba de mídia**.

**NPS não vale, e nem qualquer métrica declarativa** (nota de satisfação, "recomendaria a um amigo", pesquisa de intenção). Três razões: mede o que a pessoa diz num momento em que nada custa a ela; com menos de 100 respostas o intervalo de confiança é maior que qualquer diferença que conseguiríamos detectar; e é exatamente o tipo de sinal confortável que faria o time crescer no improviso — a dor que este projeto existe para tratar. **Só contam sinais que custam dinheiro ou esforço ao usuário**: renovar, usar, indicar com nome.

Feedback qualitativo (as respostas abertas do builder, as 10 entrevistas planejadas) permanece valioso — mas como **fonte de hipótese**, nunca como prova de PMF.

---

## 5. Limites de leitura

**Amostra mínima para qualquer conclusão**: **≥ 30 compradores** ou **≥ 1.000 visitantes qualificados**. Abaixo disso, os percentuais da seção 2 são anedota com casas decimais.

**O que NÃO concluir com menos que isso:**

- Não declarar hipótese confirmada nem refutada — nem H0.
- Não subir nem descer preço.
- Não escalar verba de mídia, nem cortá-la.
- Não iniciar a construção da Library.
- Não partir a oferta em duas por H2.4.
- Não reescrever a promessa da página.

**O que É legítimo fazer abaixo do piso**: corrigir bugs, ler as respostas abertas, formular hipóteses novas, aumentar volume de tráfego dentro do teto e conversar com quem comprou.

**Compromisso do PO**: com amostra abaixo do piso, eu reporto **"inconclusivo"** ao PM — não uma tendência, não uma leitura preliminar, não "os primeiros sinais apontam para". Todo relatório exibe **volume absoluto ao lado de cada percentual**. Um documento que aplica ao próprio negócio um critério mais frouxo que o vendido ao cliente não vale o arquivo em que está escrito.
