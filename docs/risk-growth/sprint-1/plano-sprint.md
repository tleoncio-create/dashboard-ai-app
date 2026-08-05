# Sprint 1 — Plano de Sprint (SM)

> **Fonte de verdade**: `docs/risk-growth/briefing.md`. Este documento define **como** a Sprint 1 será executada; **o que** entra na sprint é do PO e o aceite final é do PM/fundador.
> **Autor**: SM · **Status**: proposta para homologação do PM · **Criado em**: 2026-08-05

---

## 0. Cabeçalho da sprint

| Campo | Valor |
|---|---|
| Sprint | 1 |
| Duração | 7 dias corridos |
| Início (D1) | 2026-08-05 (qua) |
| Fim / Lançamento (D7) | 2026-08-11 (ter) |
| Objetivo da sprint | Colocar no ar a **oferta de entrada da escada de valor** (MVP) que faz o empreendedor sair com **1 experimento barato desenhado e pronto para rodar na semana seguinte** |
| Time de execução | Agentes de IA (squads + QA), coordenados por PM/PO/SM |
| Único humano | Fundador — dedicação parcial, aprova **apenas o que vai ao ar** |
| Condição de sucesso | Produto acessível por link público, com caminho de pagamento funcionando e entrega pós-compra automática |

### Premissa central de cadência

O gargalo desta sprint **não é a produção — é a aprovação humana**. Os agentes produzem em horas; o fundador tem dedicação parcial. Portanto todo o desenho abaixo otimiza uma coisa só: **minimizar o número de vezes que o fundador precisa decidir, e concentrar essas decisões em janelas previsíveis**.

Três consequências práticas:

1. **Aprovações em lote, não a fluxo.** Uma janela por dia, junto do resumo matinal. Nada de pedidos avulsos ao longo do dia.
2. **Nunca deixar o fundador ser caminho crítico de duas coisas ao mesmo tempo.** No máximo **3 decisões por janela**, ordenadas por bloqueio.
3. **Fim de semana (D4 sáb / D5 dom) é zona sem dependência humana.** Ver alerta abaixo.

> ⚠️ **Alerta de calendário (impedimento estrutural)**: D4 e D5 caem em **sábado e domingo**. Com fundador em dedicação parcial, assumir aprovação no fim de semana é risco de perder 2 dos 7 dias. O plano abaixo **antecipa para D3 (sexta) todas as aprovações que destravam o fim de semana** e trata D4–D5 como execução autônoma dos agentes. Se o fundador confirmar disponibilidade no fim de semana, ganhamos folga — mas o plano não depende disso.

---

## 1. Cadência da Sprint 1 — marcos D1 a D7

### Regra diária fixa (todos os dias)

| Horário | Evento | Quem | Duração |
|---|---|---|---|
| Manhã | **Resumo matinal** (entregue por escrito, ver seção 3) | SM → fundador | leitura de 2 min |
| Manhã, logo após | **Janela de aprovação** — o fundador responde as decisões do resumo | Fundador | 10–15 min |
| Após a janela | Desbloqueio e redistribuição do dia | SM + PM | assíncrono |
| Fim do dia | Fechamento do board + atualização do burndown | SM | assíncrono |

Se a janela de aprovação passar sem resposta, vale a **regra de não-bloqueio** da seção 5.

### Marcos

#### D1 — 2026-08-05 (qua) · Fundação e decisão de oferta
- **Entrega do dia**: personas-hipótese + **proposta da oferta de entrada** + backlog priorizado (RICE) da sprint — PO; homologação PM; board da sprint publicado — SM.
- **Decisão do fundador (crítica)**: **aprovar a oferta de entrada** — o que é, para quem, preço e promessa. É o único item que não pode ser decidido pelo time, porque define tudo que vai ao ar depois.
- **Também precisa dele**: acessos/credenciais (domínio, gateway de pagamento, ferramenta de e-mail, conta de anúncios). Sem isso, D6–D7 travam.
- **Gate**: sem oferta aprovada até o fim de D1, o lançamento de D7 está em risco → escalar ao PM no mesmo dia.

#### D2 — 2026-08-06 (qui) · Núcleo do MVP
- **Entrega do dia**: o **artefato central** funcionando de ponta a ponta em versão crua — o fluxo que produz o "experimento barato pronto para rodar". Em paralelo: esqueleto da landing e primeira versão da copy (inglês).
- **Decisão do fundador**: nenhuma bloqueante. Apenas ciência do resumo. (Dia de produção pura.)
- **Gate**: o núcleo precisa gerar **1 saída real de exemplo** até o fim do dia, mesmo feia.

#### D3 — 2026-08-07 (sex) · Fim-a-fim + **aprovação que destrava o fim de semana**
- **Entrega do dia**: fluxo completo navegável — landing → checkout → entrega do artefato. QA passa a primeira bateria contra os critérios de aceite do PO.
- **Decisão do fundador (crítica — a mais importante da sprint)**: aprovar **copy/posicionamento da landing, preço final e promessa pública**. Aprovado aqui, os agentes trabalham sábado e domingo sem depender dele.
- **Gate de escopo**: PM e PO fazem o **corte de escopo** hoje. O que não estiver iniciado até o fim de D3 vai para a lista pós-lançamento, sem exceção.

#### D4 — 2026-08-08 (sáb) · Execução autônoma I
- **Entrega do dia**: polimento do fluxo, tratamento de erro, versão mobile, instrumentação (analytics + evento de conversão), páginas mínimas de termos/privacidade/reembolso.
- **Decisão do fundador**: **zero**. Nenhum item pode entrar em "Aguardando fundador" hoje. Resumo matinal continua sendo enviado (direito de intervenção preservado), mas não pede nada.

#### D5 — 2026-08-09 (dom) · Execução autônoma II + **congelamento**
- **Entrega do dia**: **congelamento de escopo do MVP**. QA roda a bateria completa (funcional, conteúdo, pagamento, mobile, anti-escopo). Bugs classificados em bloqueantes / não bloqueantes.
- **Decisão do fundador**: **zero**. Ao fim do dia, o SM monta o **pacote de aprovação final** para ele encontrar pronto na segunda de manhã.
- **Gate**: a partir de D5, só entra correção de bug bloqueante. Melhoria vira pós-lançamento.

#### D6 — 2026-08-10 (seg) · **Go / No-Go**
- **Entrega do dia**: correção dos bloqueantes; ensaio de publicação (deploy em ambiente idêntico ao de produção); campanha/tráfego inicial preparada e pausada.
- **Decisão do fundador (crítica)**: **aprovação final "pronto para o ar"** sobre o pacote completo + **Go/No-Go** do lançamento de D7. É a aprovação formal de nível 2 da DoD (seção 2).
- **Gate**: No-Go aqui não adia a sprint — reduz o escopo do que vai ao ar em D7. O lançamento acontece com o que estiver aprovado.

#### D7 — 2026-08-11 (ter) · Publicação e fechamento
- **Manhã**: publicação. Smoke test em produção pelo QA (fluxo real de compra ponta a ponta, incluindo uma transação de verdade). Tráfego despausado só após o smoke test passar.
- **Tarde**: **Sprint Review com o fundador** (20 min, o único ritual síncrono da sprint — ou assíncrono com vídeo curto, se ele preferir) e **Retrospectiva** (PM + PO + SM + squads, assíncrona, 30 min, saída = ações com dono e prazo).
- **Entrega do SM**: relatório de sprint ao PM — burndown, lead time de aprovação, trocas de urgência usadas, impedimentos e recomendações para a Sprint 2.

### Cerimônias (versão comprimida para 7 dias)

| Cerimônia | Quando | Formato | Participantes |
|---|---|---|---|
| Planning | D1 | Assíncrona, sobre o backlog do PO | PM, PO, SM |
| Daily | D1–D7, manhã | **Resumo matinal escrito** (seção 3) | SM → fundador; SM ↔ squads |
| Corte de escopo | D3 | Assíncrona, 30 min | PM, PO, SM |
| Go/No-Go | D6 | Janela de aprovação | Fundador, PM, SM |
| Review | D7 | 20 min, síncrona ou vídeo curto | Fundador, PM, PO, SM |
| Retrospectiva | D7 | Assíncrona, 30 min | PM, PO, SM, squads, QA |

### Métricas de processo desta sprint

Com agentes de IA executando, "velocity em story points" diz pouco. O SM acompanha:

1. **Burndown do escopo mínimo do MVP** — itens obrigatórios restantes por dia (a única curva que importa até D7).
2. **Lead time de aprovação** — horas entre um item entrar em "Aguardando fundador" e sair. **É a métrica-chave da sprint**; é onde o prazo vai morrer se morrer.
3. **% de itens parados por dependência humana** — se passar de 30% em qualquer dia, o SM escala ao PM no mesmo dia.
4. **Trocas de urgência consumidas** — x/2, conforme o acordo da seção 5.
5. **Retrabalho pós-aprovação** — itens que voltaram depois de aprovados (sinal de DoD fraca).

---

## 2. Definition of Done — dois níveis

Um item só pode ser chamado de "pronto" quando cumpre **todos** os critérios do nível declarado. Nível 1 é pré-requisito de nível 2 — nada vai ao fundador sem ter passado por PM e QA.

### Nível 1 — **Pronto internamente** (aprovado pelo PM + verificado pelo QA)

Quem fecha: **QA verifica, PO recomenda, PM aprova.** O fundador não participa.

- [ ] Todos os **critérios de aceite escritos pelo PO** foram verificados pelo QA, um a um, com resultado registrado (passou / falhou / não aplicável).
- [ ] O item **funciona fim-a-fim** no caminho feliz, em ambiente de teste, sem intervenção manual.
- [ ] **Nenhum placeholder**: sem lorem ipsum, sem "TODO", sem link morto, sem imagem quebrada, sem texto de exemplo.
- [ ] **Conteúdo em inglês** revisado (mercado global desde o dia 1) — gramática, clareza e tom **acessível e prático**, sem jargão.
- [ ] **Checagem de anti-escopo** (briefing §5): sem promessa milagrosa; foco em pequeno/médio empreendedor; escopo restrito a marketing/produto/growth; não executa pelo cliente.
- [ ] **Mobile e desktop** verificados — o público chega por tráfego pago, majoritariamente mobile.
- [ ] **Tratamento de erro**: o usuário nunca vê tela branca, stack trace ou beco sem saída.
- [ ] **Instrumentação**: evento de analytics disparando no ponto que importa (visita, início de checkout, compra).
- [ ] **Reversível**: existe caminho de rollback ou de despublicação em minutos.
- [ ] Registrado no board com ID, dono e link do que foi verificado.

### Nível 2 — **Pronto para o ar** (aprovado pelo fundador)

Quem fecha: **o fundador**, e só ele. Pré-condição obrigatória: o item já está em Nível 1.

- [ ] Item **já aprovado em Nível 1** — o fundador nunca é usado como QA.
- [ ] **Promessa e preço** conferem com o que ele aprovou em D1/D3 — qualquer desvio é apontado explicitamente no pedido de aprovação.
- [ ] O item foi apresentado a ele **como o usuário final vai ver** (link navegável ou captura), não como descrição.
- [ ] **Caminho de pagamento testado** com transação real ou sandbox equivalente, e o resultado do teste consta do pedido.
- [ ] **Mínimo legal** presente: termos, privacidade e política de reembolso publicados.
- [ ] O pedido de aprovação diz, em uma linha, **o que muda para o negócio** e **o que acontece se ele não responder hoje**.
- [ ] Aprovação registrada pelo SM no board com data/hora (rastreabilidade da decisão).

### Regra de ouro da DoD

**Item entregue sem DoD de nível 1 não é apresentado ao fundador.** Se um item chegar à janela de aprovação sem QA, o SM o retira da pauta e informa o PM — proteger a atenção do único humano do time é a função de proteção mais importante desta sprint.

---

## 3. Resumo matinal ao fundador — template

Regras do formato: **máximo 1 tela**, leitura em **2 minutos**, sempre a mesma ordem, sempre no mesmo lugar. As decisões vêm **antes** do detalhe — se ele só ler metade, terá lido o que importa.

```markdown
# Risk + Growth — Resumo do dia · D{N}/7 · {data}

**Lançamento:** {🟢 no prazo | 🟡 em risco | 🔴 fora do prazo} — faltam {X} dias
**Uma linha:** {onde estamos, em uma frase}

## ⚡ Precisamos de você hoje ({n} decisões · ~{m} min)
1. **{Decisão}** — {opções ou link para aprovar}
   Se não decidir hoje: {consequência concreta}
2. ...
> Nada a decidir hoje. Pode ignorar este resumo. ← usar quando for o caso

## ✅ Ontem
- {entrega} — {status: no ar / pronto internamente / em revisão}
- {entrega} — ...

## ▶️ Hoje
- {o que os agentes vão produzir hoje}
- {o que fica pronto até o fim do dia}

## 🔄 Trocas de urgência ({usadas}/2 da sprint)
- {item que entrou} ⇄ {item que saiu} — pedido por você em {data}
> Nenhuma troca nesta sprint. ← usar quando for o caso

## 🚧 Impedimentos
- {bloqueio} — dono: {quem} — {o que estamos fazendo}
> Sem impedimentos. ← usar quando for o caso
```

Convenções:
- **Máximo 3 decisões por dia.** Se houver mais, o SM prioriza por bloqueio e as demais esperam.
- Toda decisão traz **consequência de não decidir** — é o que permite ao fundador priorizar em 10 segundos.
- Toda decisão vem com **opção recomendada pelo PM**, para que a resposta possa ser só "ok".
- Os arquivos ficam em `docs/risk-growth/sprint-1/resumos/D1.md` … `D7.md`.
- Seções vazias usam a linha curta de "nada aqui" — nunca somem, para o formato ficar previsível.

---

## 4. Board da sprint — estrutura proposta

**Proposta**: um único arquivo markdown neste repositório, `docs/risk-growth/sprint-1/board.md`. Sem ferramenta externa, sem conta nova, sem custo — coerente com o briefing §6 ("stack mais simples possível") e com o fato de que quem move os cartões são agentes que já vivem no repositório.

**Colunas = seções.** Mover um item é recortar a linha de uma seção e colar em outra:

```markdown
# Board — Sprint 1

## 📋 A fazer
- [ ] RG-07 — Página de obrigado + entrega do artefato — squad-produto

## 🔨 Em execução
- [ ] RG-04 — Checkout integrado ao gateway — squad-produto

## 🔍 Em revisão (QA + PM) — DoD nível 1
- [ ] RG-03 — Copy da landing (EN) — squad-conteudo — QA: 6/9 critérios

## ⏳ Aguardando fundador — DoD nível 2
- [ ] RG-01 — Oferta de entrada (preço + promessa) — desde D1 08:40

## 🚀 No ar
- [x] RG-02 — Domínio + deploy inicial — publicado D3

## ✂️ Cortado / pós-lançamento
- RG-09 — Trilha avançada (CAC/LTV) — cortado em D3, motivo: fora do MVP
```

Convenções mínimas:

| Regra | Detalhe |
|---|---|
| ID | `RG-{n}` sequencial, **nunca reaproveitado** — permite rastrear no resumo matinal e no relatório |
| Dono | nome da squad ou do agente responsável |
| Limite de WIP | **máx. 3 itens** em "Em execução" — evita 8 frentes pela metade no dia 7 |
| Quem move | squads movem até "Em revisão"; **QA/PM** movem para "Aguardando fundador"; **só o SM** move para "No ar", após confirmação do fundador |
| Carimbo de espera | todo item em "Aguardando fundador" registra data/hora de entrada — é a fonte do lead time de aprovação |
| Corte | item cortado **não é apagado** — vai para a última seção com motivo e data (memória para a Sprint 2) |
| Atualização | fim de cada dia, pelo SM, junto do burndown |

Arquivos da sprint:

```
docs/risk-growth/sprint-1/
├── plano-sprint.md      ← este documento
├── board.md             ← board vivo
├── resumos/D1..D7.md    ← resumos matinais
└── retrospectiva.md     ← saída de D7, com ações e donos
```

---

## 5. Acordo de trabalho da Sprint 1 (regra de urgência)

Transcrito do briefing §6, vale como acordo desta sprint:

1. **Só o fundador** pode furar a sprint em andamento.
2. Toda entrada exige uma **saída de esforço equivalente** — o PO indica o item que sai (menor RICE), o PM homologa, o SM registra no resumo matinal.
3. **Máximo 2 trocas por sprint** — acima disso é replanejamento, não urgência.
4. **Escopo do MVP congelado até o lançamento (D7)** — nada entra por essa via se tocar o mínimo do MVP; pedidos novos vão por padrão para a lista pós-lançamento.
5. **Exceção**: item que **bloqueia o lançamento** entra sem troca e derruba o item de menor RICE.

### Como o SM opera esse acordo

- Pedido de urgência chega → SM registra no board com carimbo de hora → PO aponta a saída → PM homologa → SM confirma ao fundador **no mesmo dia** e publica a troca no resumo matinal seguinte.
- **Sem "o que sai" definido, não há entrada.** Enquanto a saída não for indicada, o pedido fica na lista pós-lançamento — o time não para.
- **A partir de D5 (congelamento), a regra 4 endurece**: nem troca 1-por-1 é aceita sobre o escopo do MVP. Só bug bloqueante (regra 5).
- O contador de trocas (x/2) aparece **todo dia** no resumo matinal, inclusive em zero — transparência sobre quanto orçamento de mudança ainda existe.

### Regra de não-bloqueio (proposta do SM, precisa de homologação do PM)

Como o fundador tem dedicação parcial e é o único aprovador, o time precisa de uma regra para quando a janela de aprovação passar em branco:

- **Decisão de nível 1 (interna)**: o time nunca espera — PM decide e segue.
- **Decisão de nível 2 (vai ao ar) sem resposta em 24h**: o item **não é publicado** (só o fundador aprova o que vai ao ar), mas o time **segue produzindo o resto** e o item aparece no topo do resumo do dia seguinte, marcado como 🔴 e com o impacto acumulado na data de lançamento.
- **Duas janelas seguidas sem resposta**: o SM escala ao PM e o PM aciona o fundador pelo canal que ele preferir. Silêncio não pode virar decisão implícita de adiar o lançamento.

---

## 6. Riscos de processo desta sprint (registrados pelo SM)

| # | Risco | Impacto | Mitigação |
|---|---|---|---|
| 1 | D4/D5 no fim de semana com fundador parcial | perda de 2 dos 7 dias | aprovações antecipadas para D3; D4–D5 sem dependência humana |
| 2 | Fundador é fonte de urgência **e** único aprovador | conflito de papel, atraso | acordo da seção 5 + máx. 3 decisões/dia + regra de não-bloqueio |
| 3 | Credenciais externas (domínio, gateway, e-mail) não disponíveis | trava D6–D7 inteiro | pedidas já em D1 como decisão crítica; sem elas, escalar no mesmo dia |
| 4 | Agentes produzem mais rápido do que o QA verifica | itens "prontos" sem DoD chegando ao fundador | limite de WIP 3 + regra de ouro da DoD |
| 5 | Descoberta total + 7 dias | MVP raso demais para justificar preço | corte de escopo formal em D3, com PM e PO |
| 6 | QA e squads ainda "a definir" no documento de equipe | ninguém nomeado para verificar a DoD | **depende de decisão do PM** (ver abaixo) |
