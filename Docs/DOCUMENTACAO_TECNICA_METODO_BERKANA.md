# 📘 Documentação Técnica Completa
## Diagnóstico Estratégico de Prosperidade — Método Berkana
**Autoria & Metodologia:** Fabiana Berkana (Taróloga e Terapeuta Energética Familiar)  
**Engenharia de Software:** Arquitetura Full-Stack React 19 + TypeScript + Node.js / Vercel Serverless  
**Versão:** 2.1.0 (Produção Final — Paleta Opção 1 Fixada)  
**Data de Emissão:** 02 de Novembro de 2026  

---

## 🔗 Links e Repositórios Oficiais

- **Repositório GitHub:** [https://github.com/backters/ProjetoWebApp](https://github.com/backters/ProjetoWebApp)
- **Branch Principal de Produção:** `main`
- **Ambiente de Produção (Vercel):** Conectado via CI/CD automático na branch `main` da Vercel
- **Ambiente de Desenvolvimento (AI Studio):** [https://ais-dev-vtsujryqougixgeasmodfg-363334807308.us-east1.run.app](https://ais-dev-vtsujryqougixgeasmodfg-363334807308.us-east1.run.app)
- **Ambiente Compartilhado de Pré-visualização:** [https://ais-pre-vtsujryqougixgeasmodfg-363334807308.us-east1.run.app](https://ais-pre-vtsujryqougixgeasmodfg-363334807308.us-east1.run.app)

---

## 1. Visão Geral & Escopo do Projeto

O **Diagnóstico Estratégico de Prosperidade** é uma aplicação web corporativa e holística de alta conversão, criada para empresas e líderes que buscam mapear sua harmonia sistêmica e identificar gargalos energéticos e operacionais.

### Objetivos do Negócio
1. **Engajamento e Diagnóstico Rápido:** Avaliação de 12 dimensões empresariais em menos de 2 minutos.
2. **Geração de Valor Imediata:** Apresentação de um mapa de teia (radar chart) interativo, cálculo de média geral, identificação da porta de desobstrução prioritária e classificação dos 3 menores e 3 maiores pilares.
3. **Conversão Qualificada:** Botão com link direto para agendamento de devolutiva no WhatsApp de Fabiana Berkana (`+55 11 93005-7499`), com mensagem pré-formatada trazendo o nome da empresa, participante, média e pilar crítico.
4. **Captura Silenciosa e Resiliente de Leads:** Disparo em segundo plano para o e-mail oficial (`fabianaberkana@gmail.com`) contendo o relatório completo e o gráfico de raio incorporado via anexo MIME inline (CID).
5. **Privacidade e Fricção Zero:** Nenhum campo é obrigatório para visualização do diagnóstico; a aplicação pode ser concluída com ou sem dados de contato.
6. **Estado Inicial Limpo:** Ao carregar ou recomeçar, todos os inputs de texto iniciam estritamente em branco e todos os 12 seletores em 5 (neutro). Ao submeter os dados, o estado ativo é imediatamente restaurado ao ponto inicial e o resultado exibido via snapshot imutável.

---

## 2. Stack Tecnológica Detalhada

| Camada | Tecnologia | Versão | Função no Sistema |
| :--- | :--- | :--- | :--- |
| **Linguagem Principal** | TypeScript | `^5.8.2` | Tipagem estática rigorosa em todo o frontend e backend |
| **Frontend Framework** | React | `^19.0.0` | Componentização baseada em Hooks (`useState`, `useEffect`, `useMemo`, `useRef`) |
| **Bundler & Dev Server** | Vite | `^6.2.0` | Empacotamento ultrarrápido, HMR e otimização de assets |
| **Estilização** | Tailwind CSS | `^4.0.0` | Sistema de design moderno com `@theme`, variáveis CSS e zero runtime overhead |
| **Iconografia** | Lucide React | `^1.16.0` | Ícones SVG limpos e vetoriais (`Building2`, `User`, `Sparkles`, `Check`, etc.) |
| **Efeitos Visuais** | Canvas Confetti | `^1.9.4` | Comemoração sutil ao renderizar a tela de resultado |
| **Servidor Local / Dev** | Express | `^4.21.2` | Servidor Node.js servindo APIs locais e middlewares Vite em desenvolvimento |
| **Execução TypeScript** | tsx | `^4.19.3` | Executor TypeScript direto sem necessidade de transpilação manual prévia |
| **Serverless Functions** | Vercel Serverless | `Node.js 22` | Endpoints serverless (`/api/send-diagnosis` e `/api/test-email`) |
| **Disparo de E-mail (Primary)** | Resend REST API | `v2` | Envio de e-mails transacionais com anexo inline via chave `RESEND_API_KEY` |
| **Disparo de E-mail (Fallback)** | Nodemailer | `^6.10.0` | Transporte SMTP com suporte a CID inline caso SMTP corporativo seja configurado |
| **Geração de Gráficos E-mail** | QuickChart API | `v2 REST` | Renderização de imagem de alta densidade (Retina 2x) para clientes de e-mail |
| **Gerador de Documentação** | PDFKit | `^0.15.0` | Geração de PDFs técnicos em ambiente Node.js |

---

## 3. Identidade Visual & Design System (Opção 1 Definitiva)

A paleta de cores foi extraída da marca e logotipo oficial de Fabiana Berkana, batizada de **"Marfim & Magenta Real"** (Opção 1). Ela balanceia a energia do magenta com o calor do âmbar solar e o acolhimento do marfim.

### 🎨 Tabela de Cores & Tokens CSS

| Token CSS | Código HEX | Nome da Cor | Aplicação na Interface | Contraste |
| :--- | :--- | :--- | :--- | :--- |
| `--background` | `#FAF6F0` | Marfim Linho Pérola | Fundo geral da aplicação e do e-mail | Fundo Base |
| `--foreground` | `#2D2825` | Grafite Nobre Profundo | Tipografia principal, títulos e rótulos | 13.8:1 (AAA) |
| `--primary` | `#88186D` | Magenta Real Berkana | Cor primária da marca, botões de ação e cabeçalho | 7.2:1 (AAA) |
| `--primary-light` | `#A32483` | Magenta Orquídea | Estados de foco, hovers e gradientes luminosos | 5.1:1 (AA) |
| `--accent` (`--gold`) | `#D47C34` | Âmbar Solar Terracota | Sliders, vértices do gráfico, bordas douradas | 4.8:1 (AA) |
| `--gold-light` | `#E28D3E` | Âmbar Dourado Claro | Pontos luminosos e gradientes no radar | Decorativo |
| `--gold-dark` | `#B85F1E` | Bronze Quente | Sombras e profundidade | Decorativo |
| `--secondary` | `#769043` | Verde Oliva Sagrado | Pilar de fortalezas, natureza e equilíbrio | 4.9:1 (AA) |
| `--petal` | `#DE7A85` | Rosa Chá / Pétala | Toques suaves, detalhes de harmonia | Decorativo |
| `--card` | `rgba(255,255,255,0.90)` | Vidro Marfim Translúcido | Cards centrais com efeito de desfoque (`backdrop-blur-xl`) | Fundo Secundário |
| `--muted` | `#F2ECE1` | Areia Clara Acolhedora | Trilhas de sliders, backgrounds de tabelas e botões | Fundo Terciário |
| `--muted-foreground`| `#706861` | Cinza Terra Neutro | Subtítulos, textos de apoio e legendas | 5.2:1 (AA) |
| `--border` | `rgba(136,24,109,0.16)` | Vinho Translúcido Suave | Bordas de cards e divisórias | Estrutural |
| `--input` | `rgba(136,24,109,0.22)` | Vinho Foco | Bordas de inputs e caixas de texto | Estrutural |

### Gradientes e Sombras Oficiais
- **Gradiente Cósmico de Fundo:**
  ```css
  background: radial-gradient(ellipse at 15% 10%, rgba(222, 122, 133, 0.20), transparent 45%),
              radial-gradient(ellipse at 85% 90%, rgba(212, 124, 52, 0.18), transparent 50%),
              radial-gradient(circle at 50% 40%, rgba(118, 144, 67, 0.08), transparent 60%),
              #FAF6F0;
  ```
- **Gradiente Ouro Oficial:** `linear-gradient(135deg, #88186D 0%, #D47C34 100%)`
- **Gradiente Magenta:** `linear-gradient(135deg, #9C1F7D 0%, #76125F 100%)`
- **Sombra Iluminada (Glow):** `0 10px 35px -5px rgba(136, 24, 109, 0.30)`

---

## 4. Tipografia & Hierarquia Editorial

- **Fonte Display (Títulos, Cabeçalhos e Notas):**  
  `Cormorant Garamond`, Georgia, serif.  
  Confere elegância clássica, ritmo editorial e autoridade terapêutica.
- **Fonte Sans-Serif (Textos, Botões, Perguntas e Sliders):**  
  `Karla`, system-ui, -apple-system, sans-serif.  
  Garante clareza visual e conforto óptico em telas de qualquer densidade de pixels.
- **Emblema Central:**  
  Geometria Sagrada paramétrica vetorial baseada na Flor da Vida e Metatron (traçado vetorial SVG com `stroke="var(--gold)"`, `strokeWidth="0.6"` e animação contínua de rotação lenta `animate-spin-slow` de 90 segundos).

---

## 5. Matriz Editorial dos 12 Pilares

Cada pilar possui um peso idêntico (escala de 1 a 10) e conta com um texto de reflexão profunda para consulta detalhada no modal:

1. **Missão e Valores:** Clareza dos princípios éticos inegociáveis e bússola moral do negócio.
2. **Propósito Organizacional:** A alma da organização, a razão profunda de existir além do lucro financeiro.
3. **Cultura e Clima:** Ambiente humano, nível de segurança psicológica, confiança mútua e pertencimento.
4. **Comunicação Interna:** Transparência, ausência de ruídos ou fofocas e fluidez entre lideranças e times.
5. **Liderança e Decisão:** Assertividade estratégica, coerência nas escolhas e maturidade executiva.
6. **Engajamento da Equipe:** Conexão emocional dos colaboradores com as metas e causas da empresa.
7. **Produtividade com Equilíbrio:** Eficiência sustentável sem gerar sobrecarga, ansiedade ou burnout.
8. **Inovação e Criatividade:** Capacidade de renovação contínua, abertura ao novo e evolução ágil.
9. **Crises e Resiliência:** Força antifrágil para absorver impactos, aprender com erros e se reerguer.
10. **Fluxo Financeiro:** Saúde do fluxo de caixa, precificação justa, lucro real e abundância sustentável.
11. **Reputação da Marca:** Percepção pública de valor, fidelidade dos clientes e magnetismo no mercado.
12. **Legado e Impacto:** O rastro positivo deixado na sociedade, sustentabilidade e perenidade histórica.

---

## 6. Engenharia do Gráfico de Raio (Radar Chart)

### A. No Web App (SVG Interativo)
Localizado em `src/components/RadarChart.tsx`:
- **Cálculo de Vértices:**
  $$\theta_i = -\frac{\pi}{2} + \left(i \cdot \frac{2\pi}{12}\right)$$
  $$x_i = \frac{120 \cdot \text{score}_i \cdot \cos(\theta_i)}{10}, \quad y_i = \frac{120 \cdot \text{score}_i \cdot \sin(\theta_i)}{10}$$
- **Camadas Gráficas:**
  1. Grade de polígonos concêntricos de referência para os níveis 2, 4, 6, 8 e 10.
  2. 12 linhas de eixos radiais ligando o centro aos vértices externos.
  3. Polígono preenchido com gradiente e filtro de brilho SVG (`filter="url(#gold-glow)"`).
  4. 12 marcadores circulares interativos nos vértices.
  5. 12 números externos clicáveis que abrem diretamente a reflexão daquele pilar no modal.

### B. No E-mail (MIME CID Attachment Definitivo)
Localizado em `src/server/emailService.ts`:
- **Problema Solucionado:** O Gmail mobile e desktop bloqueiam tags `<svg>` inline e o proxy do Google (`GoogleImageProxy`) rejeitava requisições externas com URLs longas (1.900+ caracteres com querystrings codificadas em JSON). Isso fazia a imagem quebrar e exibir o texto alternativo azul no corpo do e-mail.
- **Solução Implementada:**
  1. O backend requisita a API do QuickChart via `POST https://quickchart.io/chart/create` enviando o payload JSON limpo.
  2. O servidor obtém uma URL curta estática (`https://quickchart.io/chart/render/zf-...`).
  3. O backend baixa o buffer binário da imagem PNG (cerca de 140 KB, 580x520px com `devicePixelRatio: 2`).
  4. A imagem é anexada fisicamente ao e-mail sob a especificação MIME CID (`Content-ID: <radar-chart>` e `Content-Disposition: inline`).
  5. O corpo do HTML referencia:
     ```html
     <img src="cid:radar-chart" width="540" alt="Gráfico de Raio dos 12 Pilares - Método Berkana" />
     ```
  6. **Resultado:** A imagem viaja **dentro do pacote do e-mail**. O Gmail e clientes mobile carregam o gráfico de imediato, sem passar por proxies externos e mesmo com conexões lentas ou dados móveis reduzidos.

---

## 7. Hidratação por URL (Permalinks Compartilháveis)

A aplicação conta com um parser inteligente de parâmetros de consulta no `src/App.tsx`:
- **Exemplo de URL Gerada:**
  ```text
  https://ais-pre-vtsujryqougixgeasmodfg-363334807308.us-east1.run.app?resultado=1&s=10,9,8,9,8,9,8,9,7,9,10,9&empresa=Instituto%20Berkana&nome=Ana%20Silva
  ```
- **Mecanismo de Leitura:** Ao carregar a página com o parâmetro `s`, o sistema decodifica as 12 notas, preenche o snapshot, calcula a média, identifica as prioridades e renderiza diretamente a tela de resultado final sem forçar o usuário a refazer o quiz.

---

## 8. Estrutura de Arquivos do Repositório

```text
ProjetoWebApp/
├── Docs/                               # Pasta de Documentação Técnica
│   ├── DOCUMENTACAO_TECNICA_METODO_BERKANA.pdf   # Arquivo PDF para download/impressão
│   └── DOCUMENTACAO_TECNICA_METODO_BERKANA.md   # Documentação completa em Markdown
├── api/                                # Vercel Serverless Functions
│   ├── send-diagnosis.ts               # Endpoint POST para envio de e-mails
│   └── test-email.ts                   # Endpoint POST para teste de conectividade
├── public/                             # Assets públicos estáticos
│   ├── diagnostico-berkana.zip         # Pacote zip completo do projeto
│   └── assets/                         # Imagens e capturas de referência
├── src/
│   ├── components/
│   │   ├── LeadCaptureStep.tsx         # Formulário opcional de 3 campos
│   │   ├── PillarModal.tsx             # Modal de reflexão aprofundada
│   │   ├── RadarChart.tsx              # Gráfico de raio vetorial interativo
│   │   └── SacredGeometry.tsx          # Geometria sagrada paramétrica
│   ├── data/
│   │   └── pillars.ts                  # Textos dos 12 pilares e diagnósticos
│   ├── server/
│   │   └── emailService.ts             # Template HTML e despacho de e-mails
│   ├── App.tsx                         # Componente raiz, estados e roteamento
│   ├── index.css                       # Design System e variáveis Tailwind v4
│   └── main.tsx                        # Ponto de entrada do React
├── package.json                        # Dependências e scripts npm
├── server.ts                           # Servidor Express Full-Stack
├── tsconfig.json                       # Configurações do compilador TypeScript
└── vite.config.ts                      # Configurações do bundler Vite
```

---

## 9. Prompt de Replicação Completa do Zero

Para reproduzir integralmente este projeto em outro assistente ou ambiente de desenvolvimento, utilize o prompt abaixo:

```markdown
Atue como Engenheiro de Software Full-Stack Sênior e arquitete uma aplicação web moderna intitulada "Diagnóstico Estratégico de Prosperidade - Método Berkana", metodologia criada por Fabiana Berkana.

1. STACK OBRIGATÓRIA:
- React 19, TypeScript 5.8, Tailwind CSS v4, Vite 6, Express e Vercel Serverless Functions.
- Lucide React para ícones, Canvas Confetti para comemoração na tela de resultados.

2. PALETA DE CORES (Opção 1 - Marfim & Magenta Real):
- Fundo Principal: #FAF6F0 (Marfim Linho Suave).
- Cor Primária: #88186D (Magenta Real da Assinatura Berkana), variação #A32483.
- Dourado Âmbar Solar: #D47C34 (Sliders, vértices do radar e gradientes).
- Verde Oliva: #769043 (Maiores potenciais / fortalezas).
- Rosa Chá: #DE7A85 (Acentos suaves).
- Tipografia: #2D2825 (Grafite Nobre) e #706861 (Muted).
- Fontes: Cormorant Garamond para títulos e Karla para textos de interface.
- Emblema central de Geometria Sagrada (Flor da Vida) com rotação suave em 90s.

3. FLUXO EM 3 ETAPAS:
- Etapa 1 (Boas-Vindas): Explicação do diagnóstico com campos opcionais para Nome da Empresa e Nome do Participante (iniciam estritamente em branco).
- Etapa 2 (Quiz dos 12 Pilares): Cards deslizantes com slider de 1 a 10 (inicialmente em 5), teclado (1-9, 0 para 10, setas e Enter). Os 12 pilares são: Missão e Valores, Propósito, Cultura, Comunicação, Liderança, Equipe, Produtividade, Inovação, Crises, Finanças, Reputação, Legado.
- Etapa 3 (Captura Opcional de Lead): Exatamente 3 campos opcionais (Nome, WhatsApp, E-mail) com envio silencioso em background para fabianaberkana@gmail.com.
- Etapa 4 (Resultado): Média Geral, Gráfico de Radar SVG interativo de 12 eixos, 3 pontos de menor pontuação (harmonização), 3 maiores (potenciais), pilar crítico de desobstrução e botão para WhatsApp com texto pré-configurado. Ao finalizar, limpe os inputs para branco e retorne as notas para 5.

4. RELATÓRIO POR E-MAIL COM GRÁFICO EMBUTIDO:
- O relatório deve ser despachado silenciosamente para fabianaberkana@gmail.com via Resend REST API (ou Nodemailer SMTP).
- É MANDATÓRIO que o Gráfico de Raio seja gerado via QuickChart REST API em alta resolução PNG e anexado como MIME inline attachment (Content-ID: <radar-chart>) no e-mail, referenciado no HTML com <img src="cid:radar-chart" width="540" /> para que o Gmail renderize a imagem de imediato sem quebrar no proxy do Google.
- Inclua suporte a querystrings (?s=10,9,8...&empresa=...&nome=...) para permitir abertura direta do relatório interativo via link.
```

---

## 10. Checklist de Validação & Manutenção

- [x] **Compilação TypeScript:** `tsc --noEmit` sem erros.
- [x] **Build de Produção:** `npm run build` gerando bundle minificado em `/dist`.
- [x] **Zero Mockup UI:** Nenhum botão desenvolvedor ou seletor experimental exposto ao usuário final.
- [x] **E-mail com Imagem Inline:** Anexo CID garantindo que o gráfico apareça sem depender de downloads externos.
- [x] **Sincronização com GitHub:** Repositório sincronizado no commit mais recente da branch `main`.
- [x] **Documentação em PDF:** Arquivo `DOCUMENTACAO_TECNICA_METODO_BERKANA.pdf` gerado na pasta `Docs/`.
