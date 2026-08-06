# Proposta de provedores — analytics e e-mail transacional

- **Autor**: squad-produto (RG-07) · **Para decisão**: PM → fundador (envolve conta e cartão) · **Data**: D2
- **Domínio**: `lessriskmoregrowth.com` (Squarespace) · **E-mail**: `contact@lessriskmoregrowth.com`
- **Restrição de arquitetura**: site estático, **sem backend**. Hoje o produto faz **zero requisição externa**; o analytics é a única exceção permitida.
- **Restrição de verdade pública**: a Privacy Policy §5/§9 já diz *"anonymous analytics"* e *"no advertising trackers"*. **A escolha não pode transformar isso em declaração falsa.**

---

## a) Analytics

### Recomendado: **Plausible Analytics** (cloud)

| Item | Detalhe |
|---|---|
| Por quê | Sem cookies, sem identificador entre sites, sem rede de anúncios por trás — é o único tipo de provedor que mantém *"no advertising trackers"* verdadeiro. Script de ~1 KB, não pesa no LCP da página de vendas. |
| Custo | Faixa inicial ~US$ 9/mês (10k pageviews/mês) na tabela pública **na data desta proposta** — confirmar no cadastro. Dentro do teto de US$ 0–10. |
| Integração | Uma linha: `TYJC.analytics.install(function (e) { window.plausible(e.name, { props: e.props }); });` O `install()` já reenvia o que foi gravado antes de o script carregar. Exige a variante do script com *custom properties*. |
| Fundador precisa | Criar conta, adicionar o site `lessriskmoregrowth.com`, copiar o snippet e o domínio. **~15 min**, sem DNS. |

### Alternativa: **Umami Cloud**

Mesma postura de privacidade (sem cookies, open source), com plano gratuito na faixa de volume que teremos no D7 (~700 visitas/mês). API equivalente: `umami.track(e.name, e.props)`. Fica como alternativa e não como recomendação porque o plano gratuito muda com mais frequência e porque o painel é mais cru para o PO ler sozinho. **Vantagem real**: custo US$ 0 e possibilidade de auto-hospedar depois sem trocar de contrato de eventos.

### Rejeitado explicitamente: **Google Analytics 4**

Grátis e familiar, mas usa cookies, alimenta o ecossistema de anúncios do Google (Signals/remarketing) e é classificado como *advertising tracker* por qualquer leitura honesta. Adotá-lo obrigaria a **reescrever a Privacy Policy** e a rever o banner de consentimento — mais caro que os US$ 9/mês, e contradiz a promessa da marca.

---

## b) E-mail transacional

> **Alerta de arquitetura, decidir antes do provedor**: enviar e-mail exige uma chave secreta. Chave secreta **não pode ficar no JS do cliente** — quem tiver a chave manda e-mail em nome do domínio. Ou aceitamos **uma função serverless mínima** (o repositório já tem `api/` na Vercel), ou usamos um provedor de formulário público, com as limitações abaixo. O RG-06 depende desta decisão.

### Recomendado: **Resend + 1 função serverless** (Vercel, plano gratuito)

| Item | Detalhe |
|---|---|
| Por quê | Plano gratuito na faixa de 3.000 e-mails/mês (~100/dia), muito acima do D7. API de uma chamada, e serve igualmente ao **magic link do P2** sem trocar de provedor. Domínio próprio = melhor entregabilidade que remetente genérico (US-06 AC3 exige caixa de entrada, não spam). |
| Custo | US$ 0 no volume da Sprint 1; primeiro degrau pago bem abaixo do teto de US$ 20. |
| Integração | `POST /api/send-card` com `{ email, cardText }`; a chave vive na variável de ambiente da Vercel. O card já sai pronto de `TYJC.getCardText()`. |
| Fundador precisa | Criar conta, verificar o domínio colando **3 registros DNS** (SPF, DKIM, DMARC) no painel de DNS da Squarespace, gerar a API key e entregá-la ao time. **~30 min + até 24 h de propagação** — por isso é o item mais urgente desta página. |

### Alternativa sem backend nenhum: **Buttondown** (ou MailerLite)

Formulário embutido que aceita POST público e dispara um automation de boas-vindas. Evita a função serverless, mas: (1) o card inteiro teria de viajar como *custom field*, com limite de tamanho e formatação pobre; (2) chave pública de formulário é vetor de abuso (terceiros mandando conteúdo pelo nosso domínio); (3) não resolve o magic link do P2. Serve se o PM quiser zero backend a qualquer custo — ao preço de um e-mail pior no artefato que o cliente pagou para receber.

### Ainda necessário, independente da escolha

`contact@lessriskmoregrowth.com` precisa existir e receber (US-08 AC3 pede mensagem de teste recebida) — caixa ou redirecionamento na Squarespace. A troca do token pelo endereço real já foi feita pelo PM (commits `cb58d8c`/`128e590`); o INT-3 fecha com o teste real de recebimento no D6.

---

## Ordem de urgência para o fundador

1. **DNS + conta de e-mail** (propagação é o único item que o time não consegue acelerar) — desbloqueia RG-06.
2. **Conta de analytics** (15 min, sem dependência externa) — desbloqueia a instalação do sink.
3. Lemon Squeezy (PF-01) segue sendo o bloqueador maior, fora desta página.
