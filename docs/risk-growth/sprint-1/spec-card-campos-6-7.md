# Spec — Campos 6 e 7 do Experiment Card (correção BLQ-1/BLQ-2 do RG-04)

- **Autor**: PO · **Homologada pelo PM** em D2 · **Implementação**: squad-produto · **Esforço**: 0,25 dia-agente
- Origem: veredito do QA no RG-04 (rodada 1). Não toca o builder (RG-03 congelado), não altera o escopo do MVP.

## Princípio

**A autoridade do número é do usuário, sempre.** O número da biblioteca nunca sobrescreve nem concorre com o da pergunta 7. A biblioteca serve de guarda-corpo, não de juiz.

## Especificação

1. Adicionar `kind` ao `RULES` de `card.js`: `floor` (piso de leitura) para **A3, B1, B3**; `threshold` (barra de sucesso) para **A1, A2, A4, B2, B4**. Semântica vem da própria biblioteca.
2. **Campo 6 (Success metric), ordem fixa**: `Count` = `rule.count` (instrumentação, fica como está) · `Yes means` = resposta da pergunta 7 **verbatim** · `The number` = **número do usuário** + unidade do usuário + `by <readText>`.
3. `kind === 'threshold'`: `rule.number` **não aparece** no campo 6. Um número só (US-04 AC5).
4. `kind === 'floor'`: quarto bloco rotulado **`Only readable above`** — `"At least <rule.number> <rule.unit> by <readText>. <rule.context>. This is a sample floor, not a target."` O rótulo é obrigatório: não pode ser lido como meta.
5. **Pergunta 7 sem dígito**: input inline **obrigatório** na tela de geração do card — *"Write the number that counts as yes"* — pré-preenchido com `rule.number + rule.unit` marcado como **suggestion**, editável. **Sem número confirmado, não se gera card.** Camada de card (US-04), builder intacto.
6. **Campo 7 (Kill criteria), `threshold`**: `"Fewer than <userNumber> <userUnit> by <readText> → stop. Do not extend the deadline, do not raise the <cap> cap, and do not rebuild the test to chase a better number."`
7. **Campo 7, `floor`**, duas cláusulas nesta ordem:
   - (a) `"Fewer than <rule.number> <rule.unit> by <readText> → inconclusive, not dead. The test did not run; there is no result to read. Rerun it at the same <cap> cap with enough volume, or drop the question. Do not crown a winner and do not kill the idea on this."`
   - (b) `"At or above <rule.number> <rule.unit>, and fewer than <userNumber> <userUnit> → stop, under the same rules above."`
8. **Nunca** usar `rule.number` como gatilho de morte em A3, B1 ou B3.

## Invariante testável (QA)

Campo 6 exibe exatamente **um** número rotulado como alvo; em `floor`, o segundo número existe mas rotulado `Only readable above`. Campo 7 sempre cita o número do usuário como critério de parada.
