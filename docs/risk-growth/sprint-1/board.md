# Board — Sprint 1 · Test Your Jump Cheaply (TYJC)

> Board vivo da sprint. Atualizado pelo SM ao fim de cada dia e sempre que um item muda de estado.
> Backlog e critérios de aceite: `backlog.md` · Processo e DoD: `plano-sprint.md` · Decisões do fundador: `decisoes-fundador.md`
> **Última atualização**: D1 · 2026-08-05

**Lançamento**: D7 · 2026-08-11 (ter) · **Janela de aprovação**: 7h–9h (DF-05)

---

## 📋 A fazer

- [ ] **RG-01** (US-01) — Página de vendas em inglês — `squad-conteudo` — Must · RICE 1890 · 1,0 d-agente · dep: nome ✅ (DF-01), domínio ⛔ PF-02
- [ ] **RG-02** (US-02) — Checkout internacional + entrega do acesso — `squad-produto` — Must · RICE 1330 · 1,5 d-agente · dep: ⛔ PF-01 (Lemon Squeezy)
- [ ] **RG-03** (US-03) — Experiment Builder guiado (8 perguntas) — `squad-produto` — Must · RICE 18,9 · 2,0 d-agente · dep: RG-05
- [ ] **RG-04** (US-04) — Geração do Experiment Card — `squad-produto` — Must · RICE 37,8 · 1,0 d-agente · dep: RG-03
- [ ] **RG-06** (US-06) — Entrega do card por e-mail + captura de lista — `squad-produto` — Must · RICE 44,8 · 0,5 d-agente · dep: RG-04, ⛔ PF-03
- [ ] **RG-07** (US-07) — Instrumentação do funil + painel de validação — `squad-produto` — Must · RICE 840 · 1,0 d-agente · dep: RG-02, RG-04
- [ ] **RG-08** (US-08) — Páginas legais mínimas + garantia de 7 dias — `squad-conteudo` (revisão obrigatória do `qa`) — Must · RICE 1260 · 0,5 d-agente
- [ ] **RG-09** (US-09) — Campanha de ads com teto de orçamento — `squad-conteudo` — Should · RICE 700 · 1,0 d-agente · dep: go do D7, ⛔ PF-04
- [ ] **RG-10** (US-10) — Pós-compra: feedback de 1 pergunta + lista de espera — `squad-produto` — Should · RICE 29,4 · 0,5 d-agente

## 🔨 Em execução

> Limite de WIP: **3 itens**. Ocupado: **1/3**.

- [ ] **RG-05** (US-05) — Biblioteca de 8 experimentos baratos — `squad-conteudo` — Must · RICE 16,3 · 1,5 d-agente — iniciado D1 (não depende do nome nem de credenciais)

## 🔍 Em revisão (QA + PM) — DoD nível 1

> vazio

## ⏳ Aguardando fundador — DoD nível 2

> vazio — as decisões de D1 (DF-01 a DF-06) já foram respondidas e estão registradas em `decisoes-fundador.md`

## 🚀 No ar

> vazio

## ✂️ Cortado / pós-lançamento

> vazio — fila de sacrifício definida pelo PO: RG-10 → RG-09 → reduzir RG-05 (8→4 experimentos) → reduzir RG-03 (8→6 perguntas, último recurso)

---

## 🚧 Impedimentos abertos

| # | Impedimento | Bloqueia | Dono | Prazo | Estado |
|---|---|---|---|---|---|
| PF-01 | Criar conta no **Lemon Squeezy** e compartilhar acesso | RG-02 → lançamento pago do D7 | **Fundador** | D3 (07/08) | 🔴 aberto |
| PF-02 | Registrar **domínio** (`testyourjump.com` / `tyjc.io` / `testyourjumpcheaply.com`) | RG-01 e qualquer publicação | **Fundador** | D3 (07/08) | 🔴 aberto |
| PF-03 | Conta de **e-mail transacional** (provedor proposto pelo time) | RG-06 | **Fundador** | D5 (09/08) | 🟡 aberto |
| PF-04 | Conta de **anúncios** com forma de pagamento | RG-09 | **Fundador** | D6 (10/08) | 🟡 aberto |

**Nota do SM**: PF-01 e PF-02 são os dois únicos itens capazes de impedir o lançamento do D7 por causa externa ao time. Ambos aparecem no resumo matinal todos os dias até serem resolvidos.

---

## 📉 Burndown — Musts restantes

| Dia | Musts restantes | Esforço Must restante (d-agente) | Observação |
|-----|-----|-----|-----|
| D1 (05/08) | **8 de 8** | **9,0** | RG-05 em execução; nenhum item concluído |
| D2 (06/08) | | | |
| D3 (07/08) | | | |
| D4 (08/08) | | | |
| D5 (09/08) | | | |
| D6 (10/08) | | | |
| D7 (11/08) | | | |

Shoulds: 2 (RG-09, RG-10) · 1,5 d-agente · fora da curva de burndown por serem a fila de sacrifício.

---

## 🔄 Trocas de urgência

**0 / 2 usadas** nesta sprint (acordo de trabalho, `plano-sprint.md` §5).

| Data | Entrou | Saiu | Pedido por | Homologado por |
|---|---|---|---|---|
| — | — | — | — | — |

---

## Convenções do board

| Regra | Detalhe |
|---|---|
| ID | `RG-{n}` fixo, mapeando 1:1 com `US-{n}` do backlog; nunca reaproveitado |
| Limite de WIP | máximo **3** itens em "Em execução" |
| Quem move | squads movem até "Em revisão"; **QA/PM** movem para "Aguardando fundador"; **só o SM** move para "No ar" após confirmação do fundador |
| Carimbo de espera | item que entra em "Aguardando fundador" registra data/hora — fonte do lead time de aprovação |
| Corte | item cortado não é apagado: vai para "Cortado / pós-lançamento" com motivo e data |
| Congelamento | a partir de **D5**, só entra correção de bug bloqueante |
