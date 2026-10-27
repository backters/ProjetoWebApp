export interface Pillar {
  id: number;
  name: string;
  subtitle: string;
  category: 'Essência & Propósito' | 'Pessoas & Cultura' | 'Operação & Resiliência' | 'Prosperidade & Legado';
  reflection: string;
  unblockAction: string;
}

export const PILLARS: Pillar[] = [
  {
    id: 1,
    name: 'Missão e Valores',
    subtitle: 'Essência e princípios que orientam decisões',
    category: 'Essência & Propósito',
    reflection: 'As decisões diárias da liderança refletem com fidelidade os valores proclamados pela empresa?',
    unblockAction: 'Revisitar acordos fundamentais e alinhar contratos internos à verdade do negócio.'
  },
  {
    id: 2,
    name: 'Propósito Organizacional',
    subtitle: 'Sentido do negócio além do lucro',
    category: 'Essência & Propósito',
    reflection: 'A empresa possui clareza sobre qual transformação real gera na vida dos clientes e da sociedade?',
    unblockAction: 'Resgatar o chamado original dos fundadores e conectar a equipe a esse impacto vital.'
  },
  {
    id: 3,
    name: 'Cultura e Clima',
    subtitle: 'Ambiente interno e bem-estar',
    category: 'Pessoas & Cultura',
    reflection: 'O ar que se respira na organização nutre segurança psicológica e leveza, ou sobrecarga e tensão?',
    unblockAction: 'Limpar ruídos relacionais e instituir rituais de escuta empática e celebração.'
  },
  {
    id: 4,
    name: 'Comunicação Interna',
    subtitle: 'Clareza, fluidez e respeito na troca',
    category: 'Pessoas & Cultura',
    reflection: 'Informações circulam com transparência, ou existem gargalos, boatos e mensagens implícitas?',
    unblockAction: 'Simplificar canais e alinhar expectativas com honestidade compassiva.'
  },
  {
    id: 5,
    name: 'Liderança e Decisão',
    subtitle: 'Condução clara e coerente',
    category: 'Essência & Propósito',
    reflection: 'Os líderes agem com presença e coerência sistêmica, inspirando sem recorrer à força impositiva?',
    unblockAction: 'Fortalecer a postura de liderança servidora e clarear alçadas decisórias.'
  },
  {
    id: 6,
    name: 'Engajamento da Equipe',
    subtitle: 'Motivação e comprometimento',
    category: 'Pessoas & Cultura',
    reflection: 'Os colaboradores vestem o projeto com entusiasmo autêntico e sentimento de pertencimento?',
    unblockAction: 'Reconhecer talentos individuais e criar planos de desenvolvimento com autonomia real.'
  },
  {
    id: 7,
    name: 'Produtividade com Equilíbrio',
    subtitle: 'Resultados mantendo o bem-estar',
    category: 'Operação & Resiliência',
    reflection: 'As metas são alcançadas com sustentabilidade física e mental, sem esgotamento contínuo?',
    unblockAction: 'Otimizar rotinas eliminando desperdícios de energia e respeitando pausas regenerativas.'
  },
  {
    id: 8,
    name: 'Inovação e Criatividade',
    subtitle: 'Abertura para novas ideias e evolução',
    category: 'Operação & Resiliência',
    reflection: 'Há espaço seguro para experimentar, errar de forma rápida e propor soluções originais?',
    unblockAction: 'Abrir fóruns de co-criação e incentivar testes práticos sem punição por tentativa.'
  },
  {
    id: 9,
    name: 'Crises e Resiliência',
    subtitle: 'Capacidade de adaptação e recuperação',
    category: 'Operação & Resiliência',
    reflection: 'Como o ecossistema empresarial responde diante de imprevistos, perdas ou oscilações de mercado?',
    unblockAction: 'Desenvolver planos de contingência e ancoragem emocional coletiva em tempos de desafio.'
  },
  {
    id: 10,
    name: 'Fluxo Financeiro',
    subtitle: 'Organização e fluxo de recursos',
    category: 'Prosperidade & Legado',
    reflection: 'O dinheiro entra, circula e multiplica com abundância limpa e previsibilidade consciente?',
    unblockAction: 'Sanar drenos financeiros inconscientes e harmonizar a relação com o merecimento da empresa.'
  },
  {
    id: 11,
    name: 'Reputação da Marca',
    subtitle: 'Percepção de clientes e mercado',
    category: 'Prosperidade & Legado',
    reflection: 'A marca é lembrada com admiração espontânea, confiança inabalável e alto valor percebido?',
    unblockAction: 'Aprimorar a experiência do cliente e comunicar histórias autênticas de sucesso.'
  },
  {
    id: 12,
    name: 'Legado e Impacto',
    subtitle: 'Contribuição além do financeiro',
    category: 'Prosperidade & Legado',
    reflection: 'Se a empresa completasse 50 anos hoje, qual marca positiva e perene deixaria no mundo?',
    unblockAction: 'Estruturar iniciativas com propósito socioambiental e transbordar sabedoria no setor.'
  }
];

export const WHATSAPP_PHONE = '5511930057499';
export const WHATSAPP_DEFAULT_URL = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
  'Olá Fabiana! Fiz o Diagnóstico Estratégico de Prosperidade e quero agendar minha devolutiva.'
)}`;

export function getDiagnosis(average: number): string {
  if (average >= 8) {
    return 'Sua empresa vibra em alta frequência. Os pilares estão alinhados e a prosperidade encontra caminho aberto. O momento é de expandir com consciência e consolidar o seu legado.';
  }
  if (average >= 6) {
    return 'Há uma base sólida e energia em movimento, mas alguns pilares pedem atenção. Ao harmonizar esses pontos, o fluxo de prosperidade se amplia e os resultados ganham leveza.';
  }
  if (average >= 4) {
    return 'Existem bloqueios sistêmicos que estão retendo o potencial da sua empresa. Desobstruir esses campos é o primeiro passo para que crescimento e bem-estar voltem a fluir juntos.';
  }
  return 'Sua empresa sinaliza um pedido de cuidado profundo. Este é um convite para realinhar a essência do negócio — e toda transformação começa exatamente pela consciência que você acabou de ter.';
}
