# Board — Sprint 1 · Test Your Jump Cheaply (TYJC)

> Board vivo da sprint. Atualizado pelo SM ao fim de cada dia e sempre que um item muda de estado.
> Backlog e critérios de aceite: `backlog.md` · Processo e DoD: `plano-sprint.md` · Decisões do fundador: `decisoes-fundador.md`
> **Última atualização**: D1 · 2026-08-05

**Lançamento**: D7 · 2026-08-11 (ter) · **Janela de aprovação**: 7h–9h (DF-05)

---

## 📋 A fazer

- [ ] **RG-01** (US-01) — Página de vendas em inglês — `squad-conteudo` — Must · RICE 1890 · 1,0 d-agente · dep: nome ✅ (DF-01), domínio ⛔ PF-02
- [ ] **RG-02** (US-02) — Checkout internacional + entrega do acesso — `squad-produto` — Must · RICE 1330 · 1,5 d-agente · dep: ⛔ PF-01 (Lemon Squeezy)
- [ ] **RG-06** (US-06) — Entrega do card por e-mail + captura de lista — `squad-produto` — Must · RICE 44,8 · 0,5 d-agente · dep: RG-04, ⛔ PF-03
- [ ] **RG-07** (US-07) — Instrumentação do funil + painel de validação — `squad-produto` — Must · RICE 840 · 1,0 d-agente · dep: RG-02, RG-04 — **QA em D6: REPROVADO na DoD nível 1** (3 bloqueantes). AC2/AC3/AC4/AC7 aprovados (atribuição paid/organic sólida, painel honesto com amostra mínima). **BLQ-1**: `checkout_start`/`purchase`/`email_captured` sem emissor — não é defeito da squad, depende de RG-02 (⛔ PF-08) e RG-06 (⛔ PF-11); exceção por dependência externa é decisão do PM. **BLQ-2**: `install()` reenvia todo o histórico do dispositivo a cada page load (5,5× em 10 loads) — infla o número que decide o degrau 2; conserto: marca-d'água de entrega. **BLQ-3**: `_dropped` ecoa nome de propriedade sem sanitizar até o provedor (fura AC5); conserto de 1 linha. + OBS-1 (guarda em `e.props` no painel, senão a autoverificação de privacidade some em silêncio) e OBS-2 (plural em n=1). Correções BLQ-2/BLQ-3/OBS-1/OBS-2 com a squad; BLQ-1 aguarda checkout/e-mail existirem. Latente enquanto providers `enabled:false`
- [ ] **RG-09** (US-09) — Campanha de ads com teto de orçamento — `squad-conteudo` — Should · RICE 700 · 1,0 d-agente · dep: go do D7, ⛔ PF-04
- [ ] **RG-10** (US-10) — Pós-compra: feedback de 1 pergunta + lista de espera — `squad-produto` — Should · RICE 29,4 · 0,5 d-agente

## 🔨 Em execução

> Limite de WIP: **3 itens**. Ocupado: **1/3**.


## 🔍 Em revisão (QA + PM) — DoD nível 1

> vazio

## ⏳ Aguardando fundador — DoD nível 2

- [x] **RG-05** (US-05) — Biblioteca de 8 experimentos — **DoD nível 1 APROVADA** (QA em D1, 2 rodadas: reprovado BLQ-1 → corrigido → aprovado; commits `986c68b` + `39bf7e2`). Conteúdo vai ao ar dentro do produto → entra no **pacote de aprovação de copy do D3**. Desde D1.
- [x] **RG-04** (US-04) — Experiment Card — **DoD nível 1 APROVADA** (QA em D2, 2 rodadas: BLQ-1/BLQ-2 de modelo de conteúdo → spec do PO `spec-card-campos-6-7.md` → implementada → aprovado; versão final no commit `ac88826`, rotulado WIP por corrida de snapshot — este registro é o fechamento oficial). **A spec é anexo do cartão: seu invariante testável é regressão obrigatória de qualquer mudança futura em card.js/RULES.** Vai ao ar → Go/No-Go D6.
- [x] **RG-01** (US-01) — Página de vendas — **DoD nível 1 APROVADA** (QA em D1, 1 rodada, zero bloqueantes; commit `49079ad`; headline acima da dobra confirmada em 4 alturas; 23,5 KB, zero rede externa). **AC9 condicional a PF-01** (CTAs com placeholder do checkout). Copy → pacote D3; publicação → PF-02.
- [x] **RG-03** (US-03) — Experiment Builder — **DoD nível 1 APROVADA** (QA em D1, 2 rodadas: reprovado BLQ-1 chips → corrigido na raiz → aprovado; commits `5b1904a` + `7dadf24`; 60k combinações sem violação; INT-1 confirmado contra o código). Vai ao ar → copy no pacote D3, produto no Go/No-Go D6.
- [x] **RG-08** (US-08) — Páginas legais — **DoD nível 1 APROVADA** (QA em D1, zero bloqueantes; commit `c823a3c` + ajustes NB-1..NB-6 em aplicação). **ACs condicionais**: AC1 fecha com o rodapé colado nas demais páginas (INT-2); AC3 fecha com PF-02 + teste de e-mail (INT-3). Revalidar menções Lemon Squeezy quando PF-01 fechar (INT-4). Vai ao ar → aprovação do fundador no Go/No-Go de D6.
- Decisões de D1 (DF-01 a DF-06) respondidas e registradas em `decisoes-fundador.md`

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

**Notas do PM (D1, pós-QA do RG-05):**
1. **OBS-1 do QA vira critério de aceite adicional do RG-03**: a lógica do `budget_note` (exibir quando o teto informado for menor que a rota paga do experimento) é pré-requisito de aprovação do builder, não item pós-lançamento.
2. **Conflito US-03 AC5 × US-04 AC8 resolvido por decisão do PM**: como a pergunta 5 recusa zero, o terceiro perfil de teste do QA na integração passa a ser "menor verba positiva aceita" (ex.: US$ 10), não US$ 0. PO deve refletir isso no backlog na próxima revisão.
3. Strings de aviso do filtro: homologadas como copy de produto pelo PM; entram no pacote de aprovação de copy do fundador em D3 (DF pendente).
4. **Itens de verificação de integração (obrigatórios antes do Go/No-Go de D6)**: INT-1 validar Privacy §3/§9 contra o código real do builder (RG-03); INT-2 rodapé legal colado em RG-01/RG-03/RG-04/RG-10; INT-3 substituição do token [DOMAIN-TBD] + remoção da regra .tbd + teste real de e-mail; INT-4 revalidar menções à Lemon Squeezy quando PF-01 fechar.
5. **Decisão comercial do PM (Terms §6)**: degrau 1 = geração ilimitada de Experiment Cards (sem login não há como impor limite; afirmar limite seria falso).

---

## 📉 Burndown — Musts restantes

| Dia | Musts restantes | Esforço Must restante (d-agente) | Observação |
|-----|-----|-----|-----|
| D1 (05/08) | **5 de 8** | **5,0** | RG-05, RG-08 e RG-03 aprovados na DoD nível 1; RG-04 iniciado; P2 em fundação |
| D2 (06/08) | **3 de 8** | **3,0** | RG-01 e RG-04 aprovados na DoD nível 1. Restam RG-02 (⛔ PF-01), RG-06 (⛔ PF-03) e RG-07 |
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
