# Política de otimização de tokens — P1 e P2

- **Aprovada pelo fundador** em 2026-08-06 (D2). Vale para os dois projetos. Aplicada pelo PM.

## 1. QA em 3 níveis (por risco)

| Nível | Quando | O que roda |
|---|---|---|
| **Completo** | Produto com lógica que vai ao ar (builder, card, checkout, plataforma) | Navegador real, varreduras exaustivas, caça ativa — como hoje |
| **Padrão** | Copy que vai ao ar (páginas, e-mails, ads) | Checklist dirigido dos critérios de aceite + anti-escopo; sem varreduras exaustivas |
| **Leve** | Documentos internos (specs, planos, resumos) | Revisão do PM; sem agente QA |

## 2. Modelo por natureza da tarefa

- **Opus**: builds novos, vereditos de QA de primeira rodada em itens de nível completo, decisões de PO/SM.
- **Sonnet**: implementação-com-spec (correções especificadas), re-verificações do QA, tarefas mecânicas (board, snapshots, sincronizações).
- PO e SM permanecem em Opus (definição original do fundador).
- Aplicação: o PM define o modelo no despacho de cada tarefa.

## 3. Spec antes do código

Todo item com modelo de conteúdo ambíguo recebe spec do PO **antes** do build (lição do RG-04: ~70k de spec economizam ~400k de retrabalho). O critério de "ambíguo" é do PM.

## 4. Dieta de contexto

- Cada projeto mantém um `contexto-essencial.md` de 1 página.
- Despachos apontam para seções específicas ("leia US-04 e §5.2"), nunca "leia tudo".

## 5. Menos cerimônia em decisões óbvias

Consulta aos papéis (PO/SM) só quando a decisão muda o produto. Decisões de processo e extensões óbvias de princípio já aprovado: o PM decide e registra.

## 6. Custo como métrica

O resumo matinal do SM ganha linha fixa: **tokens gastos ontem / acumulado da sprint / projeção do D7**. Fonte: totais reportados por tarefa; o número oficial de billing é o painel de uso da conta.

## Registro de consumo (base)

Até D2 (fechamento do RG-04): **~3,36M tokens** de agentes — P1 ~3,29M · P2 ~73k. QA respondeu por ~50% (antes desta política).
