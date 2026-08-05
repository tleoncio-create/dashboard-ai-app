# Risk + Growth (Less risk, more growth)

Projeto sobre **marketing, produto e growth para empreendedores**.

Este documento define a estrutura de coordenação do projeto e as atribuições de cada papel.

## Estrutura do time

```
PM (Product Manager) — coordenação geral
├── PO (Product Owner) ──── o QUE construir e em que ordem
├── SM (Scrum Master) ───── COMO o time entrega
├── Squads ──────────────── execução (a definir)
└── QA ──────────────────── qualidade das entregas (a definir)
```

| Papel | Responsável | Modelo |
|-------|-------------|--------|
| PM (Product Manager) | Claude (sessão principal) | Fable 5 |
| PO (Product Owner) | Agente `product-owner` | Opus |
| SM (Scrum Master) | Agente `scrum-master` | Opus |
| Squad de produto/engenharia | Agente `squad-produto` | Opus |
| Squad de conteúdo/growth | Agente `squad-conteudo` | Opus |
| Squad de apps (P2) | Agente `squad-apps` | Opus |
| QA | Agente `qa` | Opus |

> **Convenção de projetos**: **P1** = Risk + Growth / TYJC (este diretório) · **P2** = Plataforma (`docs/p2-plataforma/`). PM, PO, SM e QA atendem os dois projetos; a squad-apps é dedicada ao P2. Até o lançamento do P1 (11/08), o P1 tem prioridade absoluta.

Os agentes de PO e SM estão definidos em `.claude/agents/` e podem ser acionados pelo PM a qualquer momento.

## Atribuições

### PM — Product Manager (coordenação geral)

- Define e guarda a **visão do produto** e a estratégia do projeto.
- Coordena PO, SM, squads e QA; é a instância final de decisão e de aceite das entregas.
- Resolve conflitos de prioridade entre papéis e escalações de impedimentos.
- Responde ao fundador do projeto (stakeholder) e traduz seus objetivos em direção para o time.

### PO — Product Owner (o que construir)

- Cria, mantém e **prioriza o backlog** único do projeto, orientado a valor para empreendedores.
- Escreve **user stories com critérios de aceite** verificáveis pelo QA.
- Define e mantém **personas** e proposta de valor de cada entrega.
- Usa métodos explícitos de priorização (RICE, MoSCoW) com justificativa registrada.
- Conduz o refinamento do backlog com as squads, junto ao SM.
- Avalia entregas contra os critérios de aceite e **recomenda** aceite ou devolução ao PM.
- **Não faz**: visão estratégica (PM), gestão de processo e cerimônias (SM).

### SM — Scrum Master (como entregar)

- Facilita as **cerimônias Scrum**: Planning, Daily, Review e Retrospectiva.
- **Remove impedimentos** das squads; escala ao PM o que estiver fora do seu alcance.
- Protege o time contra mudança de escopo no meio da sprint.
- Acompanha **métricas de processo** (velocity, burndown, lead time) e reporta ao PM a cada sprint.
- Converte aprendizados de retrospectiva em ações com dono e prazo.
- Garante o cumprimento da **Definition of Done** acordada com PM e QA.
- **Não faz**: priorização de backlog (PO), visão de produto e aceite final (PM).

## Fluxo de decisão

1. Stakeholder define objetivos com o **PM**.
2. **PO** traduz em backlog priorizado com critérios de aceite.
3. **SM** organiza a sprint e conduz as squads na execução.
4. **QA** verifica as entregas contra os critérios de aceite.
5. **PO** recomenda aceite; **PM** dá o aceite final.

## Próximos passos

- [ ] Definir visão de produto e objetivos do trimestre (PM + stakeholder)
- [ ] PO: criar personas e primeiro backlog priorizado
- [ ] SM: propor cadência de sprints e Definition of Done
- [ ] Definir composição das squads e do QA
