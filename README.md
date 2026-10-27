# Diagnóstico Estratégico de Prosperidade | Método Berkana

Aplicativo interativo de diagnóstico sistêmico dos 12 pilares empresariais, desenvolvido com a identidade visual cósmica e radiestésica do Método Berkana de Fabiana Berkana, com **envio automático dos resultados por e-mail** para `fabianaberkana@gmail.com`.

---

## ✉️ Como Conectar a Conta de E-mail (Passo a Passo)

O sistema suporta duas opções principais para envio automático para **`fabianaberkana@gmail.com`**:

### Opção 1: Resend (Mais Rápido e Recomendado na Vercel — 2 Minutos)
Esta é a melhor opção para a Vercel, pois não requer portas SMTP nem senhas pessoais:

1. Acesse [resend.com](https://resend.com) e crie uma conta gratuita (plano gratuito permite até 3.000 e-mails por mês).
2. No menu lateral esquerdo, clique em **API Keys**.
3. Clique no botão **Create API Key**, dê um nome (ex: `Berkana App`) e clique em **Add**.
4. Copie a chave gerada (ela começa com `re_...`).
5. No painel do seu projeto na Vercel:
   - Vá em **Settings → Environment Variables**.
   - Adicione a variável:
     - **Key**: `RESEND_API_KEY`
     - **Value**: `re_sua_chave_aqui`
   - Adicione também (se desejar confirmar explicitamente):
     - **Key**: `RECIPIENT_EMAIL`
     - **Value**: `fabianaberkana@gmail.com`
6. Pronto! Ao finalizar qualquer diagnóstico, o e-mail formatado em HTML será entregue na caixa de entrada de `fabianaberkana@gmail.com`.

---

### Opção 2: Usar seu próprio Gmail (via Senha de App)
Caso queira disparar os e-mails diretamente usando uma conta do Gmail:

1. Acesse sua conta Google em [myaccount.google.com/security](https://myaccount.google.com/security).
2. Verifique se a **"Verificação em duas etapas"** está ativada (requisito obrigatório do Google).
3. Na barra de pesquisa no topo da página de segurança, digite **"Senhas de app"** (ou acesse diretamente [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)).
4. Crie um novo app com o nome `Diagnóstico Berkana`.
5. O Google gerará uma senha de **16 caracteres** (ex: `abcd efgh ijkl mnop`). Copie esse código.
6. No painel da Vercel (em **Settings → Environment Variables**), adicione as seguintes variáveis:
   - `SMTP_HOST`: `smtp.gmail.com`
   - `SMTP_PORT`: `465`
   - `SMTP_USER`: `seu-email@gmail.com` (o e-mail do Gmail que enviará a mensagem)
   - `SMTP_PASS`: `sua-senha-de-app-de-16-letras`
   - `RECIPIENT_EMAIL`: `fabianaberkana@gmail.com`

---

### Opção 3: Outros E-mails Corporativos (Zoho, Hostgator, Locaweb, Titan)
Configure na Vercel em **Environment Variables**:
- `SMTP_HOST`: servidor SMTP da sua hospedagem (ex: `smtp.seudominio.com.br`)
- `SMTP_PORT`: `587` (ou `465`)
- `SMTP_USER`: seu e-mail (ex: `contato@seudominio.com.br`)
- `SMTP_PASS`: a senha do e-mail
- `RECIPIENT_EMAIL`: `fabianaberkana@gmail.com`

---

## 🚀 Como Publicar na Vercel com sua URL Amigável

1. **Suba o código para o GitHub.**
2. No painel da [Vercel](https://vercel.com/new), clique em **"Add New... → Project"** e importe o repositório.
3. Configure as variáveis de ambiente (`RESEND_API_KEY` ou dados SMTP).
4. Clique em **Deploy**.
5. Em **Settings → Domains**, escolha sua URL:
   - Subdomínio gratuito: `diagnostico-berkana.vercel.app`
   - Domínio próprio: `prosperidade.fabianaberkana.com.br`
