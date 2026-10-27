import React, { useState } from 'react';
import {
  X,
  Globe,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Mail,
  Send,
  Download,
  FolderArchive,
  Sparkles,
  Terminal,
  FileCode,
} from 'lucide-react';

interface VercelGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'zip' | 'email' | 'vercel';
}

export const VercelGuideModal: React.FC<VercelGuideModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'zip',
}) => {
  const [activeTab, setActiveTab] = useState<'zip' | 'email' | 'vercel'>(defaultTab);
  const [emailMethod, setEmailMethod] = useState<'resend' | 'gmail' | 'smtp'>('resend');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Test email state
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    provider?: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSendTestEmail = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        setTestResult({
          success: true,
          message:
            data.emailResult?.provider === 'simulated'
              ? 'Ambiente de desenvolvimento local (modo de simulação). Para receber na sua caixa de entrada real, adicione a chave RESEND_API_KEY ou credenciais de Gmail/SMTP no painel da Vercel.'
              : `E-mail de teste enviado com sucesso via ${data.emailResult?.provider} para fabianaberkana@gmail.com!`,
          provider: data.emailResult?.provider,
        });
      } else {
        setTestResult({
          success: false,
          message: data.error || 'Erro ao enviar e-mail de teste.',
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Falha de conexão com a API de e-mail.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-rise"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 sm:p-8 backdrop-blur-xl shadow-2xl text-foreground"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary">
          <FolderArchive className="w-4 h-4" />
          <span>Pacote de Publicação Vercel</span>
        </div>

        <h3 className="mt-2 text-2xl sm:text-3xl font-medium">Exportar & Publicar na Vercel</h3>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
          Destino automático dos resultados: <strong className="text-primary font-medium">fabianaberkana@gmail.com</strong>
        </p>

        {/* Tab Navigation */}
        <div className="mt-5 flex gap-2 border-b border-border pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('zip')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'zip'
                ? 'bg-primary text-primary-foreground font-semibold shadow-glow'
                : 'bg-muted/50 text-muted-foreground hover:text-foreground'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Baixar Arquivo ZIP</span>
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'email'
                ? 'bg-primary text-primary-foreground font-semibold shadow-glow'
                : 'bg-muted/50 text-muted-foreground hover:text-foreground'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Configuração do E-mail</span>
          </button>
          <button
            onClick={() => setActiveTab('vercel')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'vercel'
                ? 'bg-primary text-primary-foreground font-semibold shadow-glow'
                : 'bg-muted/50 text-muted-foreground hover:text-foreground'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Domínio & Publicação</span>
          </button>
        </div>

        {/* TAB 0: DOWNLOAD ZIP */}
        {activeTab === 'zip' && (
          <div className="mt-5 space-y-5 text-sm animate-rise">
            {/* Download Hero Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border border-primary/40 shadow-glow relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-xs font-semibold text-primary mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Pronto para Upload</span>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-medium text-foreground">
                    diagnostico-berkana.zip
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 max-w-md leading-relaxed">
                    Arquivo ZIP completo contendo todo o código-fonte, componentes, tela de radar, disparo automático para <code className="text-primary font-mono">fabianaberkana@gmail.com</code> e configuração do <code className="text-primary font-mono">vercel.json</code>.
                  </p>
                </div>

                <a
                  href="/diagnostico-berkana.zip"
                  download="diagnostico-berkana.zip"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gold-gradient text-primary-foreground font-semibold text-sm shadow-glow hover:scale-105 active:scale-95 transition-all whitespace-nowrap cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar Arquivo ZIP</span>
                </a>
              </div>
            </div>

            {/* How to Deploy the ZIP */}
            <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-3">
              <div className="font-semibold text-foreground flex items-center gap-2">
                <FileCode className="w-4 h-4 text-primary" />
                <span>O que fazer com o arquivo ZIP (Passo a Passo)</span>
              </div>

              <ol className="text-xs space-y-3 text-muted-foreground list-decimal list-inside pl-1 leading-relaxed">
                <li>
                  <strong className="text-foreground">Extraia o arquivo:</strong> Descompacte o arquivo <code className="text-primary font-mono bg-background px-1 py-0.5 rounded">diagnostico-berkana.zip</code> no seu computador.
                </li>
                <li>
                  <strong className="text-foreground">Opção A (Mais fácil - GitHub):</strong> Crie um novo repositório no seu GitHub (ex: <code>diagnostico-berkana</code>) e envie os arquivos descompactados. Em seguida, acesse <a href="https://vercel.com/new" target="_blank" rel="noreferrer" className="text-primary underline">vercel.com/new</a> e importe o repositório.
                </li>
                <li>
                  <strong className="text-foreground">Opção B (Via Terminal Vercel CLI):</strong> Abra o terminal dentro da pasta extraída e execute:
                  <div className="mt-1.5 flex items-center justify-between bg-background/80 p-2.5 rounded-xl font-mono text-xs border border-border">
                    <span className="text-primary">npx vercel --prod</span>
                    <button
                      onClick={() => handleCopy('npx vercel --prod', 'cli-cmd')}
                      className="px-2.5 py-1 text-[11px] rounded bg-muted hover:text-foreground flex items-center gap-1"
                    >
                      {copiedKey === 'cli-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'cli-cmd' ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                </li>
                <li>
                  <strong className="text-foreground">Variáveis na Vercel:</strong> Nas configurações da Vercel (<strong>Settings → Environment Variables</strong>), adicione <code className="text-primary">RECIPIENT_EMAIL=fabianaberkana@gmail.com</code> e a sua chave gratuita do <a href="https://resend.com" target="_blank" rel="noreferrer" className="text-primary underline">Resend</a> (veja a aba "Configuração do E-mail").
                </li>
              </ol>
            </div>
          </div>
        )}

        {/* TAB 1: EMAIL SETUP */}
        {activeTab === 'email' && (
          <div className="mt-5 space-y-5 text-sm animate-rise">
            {/* Method Selector */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setEmailMethod('resend')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  emailMethod === 'resend'
                    ? 'border-primary bg-primary/20 text-primary'
                    : 'border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                Opção 1: Resend (Recomendado na Vercel · 2 min)
              </button>
              <button
                onClick={() => setEmailMethod('gmail')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  emailMethod === 'gmail'
                    ? 'border-primary bg-primary/20 text-primary'
                    : 'border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                Opção 2: Gmail Próprio (Senha de App)
              </button>
              <button
                onClick={() => setEmailMethod('smtp')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  emailMethod === 'smtp'
                    ? 'border-primary bg-primary/20 text-primary'
                    : 'border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                Opção 3: Outro SMTP (Zoho / Titan / Host)
              </button>
            </div>

            {/* OPTION 1: RESEND */}
            {emailMethod === 'resend' && (
              <div className="space-y-4 animate-rise">
                <div className="p-4 rounded-2xl bg-muted/40 border border-border">
                  <div className="flex items-center justify-between font-semibold text-foreground mb-1">
                    <span>Método 1: Resend.com (O mais simples para Vercel)</span>
                    <span className="text-xs text-primary font-mono font-normal">Grátis (3.000 e-mails/mês)</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                    O Resend é o serviço oficial e mais rápido para Vercel. Não requer portas SMTP nem senhas pessoais.
                  </p>

                  <ol className="text-xs space-y-2.5 text-muted-foreground list-decimal list-inside pl-1">
                    <li>
                      Acesse <a href="https://resend.com" target="_blank" rel="noreferrer" className="text-primary underline font-medium">resend.com</a> e crie uma conta gratuita.
                    </li>
                    <li>
                      Vá no menu lateral em <strong>API Keys</strong> e clique em <strong>Create API Key</strong>.
                    </li>
                    <li>
                      Copie a chave gerada (começa com <code className="text-primary font-mono bg-background px-1 py-0.5 rounded">re_...</code>).
                    </li>
                    <li>
                      No painel da Vercel (onde você publicou o app), vá em <strong>Settings → Environment Variables</strong>.
                    </li>
                    <li>
                      Adicione as 2 variáveis abaixo:
                    </li>
                  </ol>

                  {/* Variables to copy */}
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between bg-background/80 p-2.5 rounded-xl font-mono text-xs border border-border">
                      <div>
                        <span className="text-muted-foreground">Nome: </span>
                        <span className="text-primary font-bold">RESEND_API_KEY</span>
                        <br />
                        <span className="text-muted-foreground text-[11px]">Valor: sua chave re_...</span>
                      </div>
                      <button
                        onClick={() => handleCopy('RESEND_API_KEY', 'resend-key')}
                        className="px-2.5 py-1 text-xs rounded bg-muted hover:text-foreground flex items-center gap-1"
                      >
                        {copiedKey === 'resend-key' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'resend-key' ? 'Copiado!' : 'Copiar'}</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between bg-background/80 p-2.5 rounded-xl font-mono text-xs border border-border">
                      <div>
                        <span className="text-muted-foreground">Nome: </span>
                        <span className="text-primary font-bold">RECIPIENT_EMAIL</span>
                        <br />
                        <span className="text-foreground text-[11px]">fabianaberkana@gmail.com</span>
                      </div>
                      <button
                        onClick={() => handleCopy('fabianaberkana@gmail.com', 'recipient-email')}
                        className="px-2.5 py-1 text-xs rounded bg-muted hover:text-foreground flex items-center gap-1"
                      >
                        {copiedKey === 'recipient-email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'recipient-email' ? 'Copiado!' : 'Copiar'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* OPTION 2: GMAIL COM SENHA DE APP */}
            {emailMethod === 'gmail' && (
              <div className="space-y-4 animate-rise">
                <div className="p-4 rounded-2xl bg-muted/40 border border-border">
                  <div className="flex items-center justify-between font-semibold text-foreground mb-1">
                    <span>Método 2: Seu próprio Gmail (com Senha de App)</span>
                    <span className="text-xs text-primary font-mono font-normal">100% Gratuito</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                    O Google exige uma <strong>Senha de App (16 letras)</strong> para autenticar em sites:
                  </p>

                  <ol className="text-xs space-y-2.5 text-muted-foreground list-decimal list-inside pl-1">
                    <li>
                      Acesse <a href="https://myaccount.google.com/security" target="_blank" rel="noreferrer" className="text-primary underline font-medium">myaccount.google.com/security</a>.
                    </li>
                    <li>
                      Ative a <strong>Verificação em 2 etapas</strong>.
                    </li>
                    <li>
                      Acesse <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" className="text-primary underline">myaccount.google.com/apppasswords</a>.
                    </li>
                    <li>
                      Crie um app com o nome <code className="text-primary">Diagnostico Berkana</code> e copie o código amarelo de 16 letras.
                    </li>
                    <li>
                      No painel da Vercel (<strong>Settings → Environment Variables</strong>), adicione:
                    </li>
                  </ol>

                  {/* Gmail Variables List */}
                  <div className="mt-3 space-y-1.5 font-mono text-xs">
                    <div className="p-2 rounded bg-background/80 border border-border flex justify-between">
                      <span>SMTP_HOST = smtp.gmail.com</span>
                      <button onClick={() => handleCopy('smtp.gmail.com', 'gh')} className="text-primary">
                        {copiedKey === 'gh' ? 'Copiado!' : 'Copiar'}
                      </button>
                    </div>
                    <div className="p-2 rounded bg-background/80 border border-border flex justify-between">
                      <span>SMTP_PORT = 465</span>
                      <button onClick={() => handleCopy('465', 'gp')} className="text-primary">
                        {copiedKey === 'gp' ? 'Copiado!' : 'Copiar'}
                      </button>
                    </div>
                    <div className="p-2 rounded bg-background/80 border border-border flex justify-between">
                      <span>SMTP_USER = seu-email@gmail.com</span>
                    </div>
                    <div className="p-2 rounded bg-background/80 border border-border flex justify-between">
                      <span>SMTP_PASS = sua-senha-de-app-16-letras</span>
                    </div>
                    <div className="p-2 rounded bg-background/80 border border-border flex justify-between">
                      <span>RECIPIENT_EMAIL = fabianaberkana@gmail.com</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* OPTION 3: OTHER SMTP */}
            {emailMethod === 'smtp' && (
              <div className="space-y-4 animate-rise">
                <div className="p-4 rounded-2xl bg-muted/40 border border-border">
                  <div className="font-semibold text-foreground mb-1">
                    Método 3: E-mail Corporativo Próprio (Hostgator, Locaweb, Zoho, Titan)
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                    Você pode conectar qualquer provedor SMTP configurando as credenciais no painel da Vercel:
                  </p>

                  <div className="space-y-1.5 font-mono text-xs">
                    <div className="p-2 rounded bg-background/80 border border-border">
                      <span className="text-muted-foreground">SMTP_HOST = </span>
                      <span className="text-primary">smtp.seudominio.com.br</span>
                    </div>
                    <div className="p-2 rounded bg-background/80 border border-border">
                      <span className="text-muted-foreground">SMTP_PORT = </span>
                      <span className="text-primary">587</span> (ou 465)
                    </div>
                    <div className="p-2 rounded bg-background/80 border border-border">
                      <span className="text-muted-foreground">SMTP_USER = </span>
                      <span className="text-primary">contato@seudominio.com.br</span>
                    </div>
                    <div className="p-2 rounded bg-background/80 border border-border">
                      <span className="text-muted-foreground">SMTP_PASS = </span>
                      <span className="text-primary">senha_do_email</span>
                    </div>
                    <div className="p-2 rounded bg-background/80 border border-border">
                      <span className="text-muted-foreground">RECIPIENT_EMAIL = </span>
                      <span className="text-primary">fabianaberkana@gmail.com</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Interactive Live Test Button */}
            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  Testar Envio de E-mail Agora
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Dispara um diagnóstico de teste para fabianaberkana@gmail.com
                </p>
              </div>

              <button
                type="button"
                onClick={handleSendTestEmail}
                disabled={isTesting}
                className="px-4 py-2 rounded-xl bg-gold-gradient text-primary-foreground font-semibold text-xs shadow-glow hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                {isTesting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    <span>Disparando...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar Teste</span>
                  </>
                )}
              </button>
            </div>

            {/* Test Feedback Result */}
            {testResult && (
              <div
                className={`p-3.5 rounded-2xl text-xs border ${
                  testResult.success
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-red-950/40 border-red-500/40 text-red-200'
                } animate-rise`}
              >
                <p className="font-semibold mb-0.5">
                  {testResult.success ? '✓ Verificação Concluída:' : '✕ Atenção:'}
                </p>
                <p className="leading-relaxed opacity-90">{testResult.message}</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: VERCEL PUBLICATION */}
        {activeTab === 'vercel' && (
          <div className="mt-5 space-y-4 text-sm animate-rise">
            <div className="p-4 rounded-2xl bg-muted/40 border border-border">
              <div className="font-semibold text-foreground mb-1">
                1. Conectar repositório na Vercel
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Acesse <a href="https://vercel.com/new" target="_blank" rel="noreferrer" className="text-primary underline">vercel.com/new</a>, selecione seu repositório GitHub e clique em <strong>Deploy</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-muted/40 border border-border">
              <div className="font-semibold text-foreground mb-1">
                2. Configurar URL Amigável (Domínio Próprio ou Grátis)
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                No painel do projeto na Vercel, acesse <strong>Settings → Domains</strong>:
              </p>
              <ul className="text-xs space-y-1.5 text-muted-foreground list-disc list-inside">
                <li>
                  <strong className="text-foreground">Subdomínio Grátis Vercel:</strong> Ex: <code className="text-primary bg-muted/80 px-1 py-0.5 rounded">diagnostico-berkana.vercel.app</code>
                </li>
                <li>
                  <strong className="text-foreground">Seu Domínio Próprio:</strong> Ex: <code className="text-primary bg-muted/80 px-1 py-0.5 rounded">prosperidade.fabianaberkana.com.br</code>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-accent/20 border border-border flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed text-muted-foreground">
                <strong className="text-foreground block mb-0.5">vercel.json já configurado:</strong>
                O roteamento de página única (SPA) e as Serverless Functions (<code className="text-primary font-mono">/api/send-diagnosis</code>) já estão configuradas.
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
          <a
            href="/diagnostico-berkana.zip"
            download="diagnostico-berkana.zip"
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar diagnostico-berkana.zip</span>
          </a>
          <button
            onClick={onClose}
            className="rounded-full bg-gold-gradient px-6 py-2.5 text-xs font-semibold text-primary-foreground shadow-glow"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
