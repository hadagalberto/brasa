/**
 * Brazilian Portuguese dictionary. Typed from the English dictionary so the
 * compiler rejects missing keys. Copy is written for readers in Brazil — not
 * translated word by word from English.
 */
import type { Dictionary } from './en';

export const ptBr: Dictionary = {
  common: {
    skipLink: 'Ir para o conteúdo',
    search: 'Buscar',
    searchDialog: 'Buscar no site',
    searchPlaceholder: 'Busque docs, guias e notas…',
    searchIntro: 'Comece a digitar para buscar em todo o site.',
    searchIntroTitle: 'Encontre um guia, um componente ou um campo da configuração.',
    searchIntroHint: 'Experimente um assunto — ou vá direto a uma página popular.',
    searchNoResults: (query: string) => `Nada encontrado para “${query}”.`,
    searchNoResultsHint: 'Tente um termo mais curto ou navegue pela documentação.',
    searchBrowseDocs: 'Ver toda a documentação',
    searchSearching: (query: string) => `Buscando por “${query}”…`,
    searchNoMatches: (query: string) => `Nenhum resultado para “${query}”`,
    searchMatches: (count: number, query: string) =>
      `${count} ${count === 1 ? 'resultado' : 'resultados'} para “${query}”`,
    searchUnavailable: 'Índice de busca indisponível',
    searchUnavailableTitle: 'A busca é gerada junto com o site.',
    searchUnavailableHint: 'Execute npm run build para gerar o índice do Pagefind.',
    searchNavigate: 'navegar',
    searchOpen: 'abrir',
    searchClose: 'fechar',
    searchPowered: 'Com Pagefind',
    searchOpenLabel: 'Buscar (Ctrl K)',
    email: 'E-mail',
    openMenu: 'Abrir menu',
    closeMenu: 'Fechar menu',
    mainNav: 'Principal',
    mainNavMobile: 'Principal (mobile)',
    siteMenu: 'Menu do site',
    searchMobile: 'Buscar documentação e notas',
    toggleTheme: 'Alternar tema de cor',
    themeLight: 'Ativar tema claro',
    themeDark: 'Ativar tema escuro',
    copyLabel: 'Copiar comando de instalação',
    copied: 'Copiado para a área de transferência',
    githubLabel: (name: string) => `${name} no GitHub`,
    language: 'Idioma',
    onThisPage: 'Nesta página',
    backToTop: 'Voltar ao topo',
    readMore: 'Leia mais',
    pagination: 'Paginação',
    docsPages: 'Páginas da documentação',
  },
  dashboard: {
    live: 'no ar',
    waiting: 'aguardando novos pushes',
    build: 'build',
    cache: 'cache 97%',
    ago: (time: string) => `push · há ${time} · 8f2k41`,
    logs: [
      'dependências restauradas do cache · 214 pacotes',
      'compilando 214 rotas em 4 runners',
      'dados das rotas pré-buscaram · gru, iad, fra',
      'testes de fumaça passando — 18/18',
      'publicado · preview-8f2k.brasa.cloud',
    ],
  },
  nav: [
    { label: 'Início', href: '/' },
    { label: 'Preços', href: '/pricing' },
    { label: 'Novidades', href: '/changelog' },
    { label: 'Documentação', href: '/docs' },
    { label: 'Blog', href: '/blog' },
  ],
  footer: {
    description:
      'Brasa é um tema open-source para Astro, com visual escuro: tokens OKLCH, acento em brasa, tipografia editorial e velocidade obsessiva para sites de produto, blogs e documentação.',
    columns: [
      {
        title: 'Produto',
        links: [
          { label: 'Preços', href: '/pricing' },
          { label: 'Novidades', href: '/changelog' },
          { label: 'Sobre', href: '/about' },
          { label: 'Contato', href: '/contact' },
        ],
      },
      {
        title: 'Aprenda',
        links: [
          { label: 'Documentação', href: '/docs' },
          { label: 'Styleguide', href: '/styleguide' },
          { label: 'Todos os artigos', href: '/blog' },
          { label: 'Assuntos', href: '/blog/tags' },
        ],
      },
      {
        title: 'Tema',
        links: [
          { label: 'Instalação', href: '/docs/installation' },
          { label: 'Componentes', href: '/docs/components' },
          {
            label: 'Reportar um problema',
            href: 'https://github.com/hadagalberto/brasa/issues/new',
            external: true,
          },
          {
            label: 'Releases',
            href: 'https://github.com/hadagalberto/brasa/releases',
            external: true,
          },
        ],
      },
      {
        title: 'Jurídico',
        links: [
          { label: 'Privacidade', href: '/legal/privacy' },
          { label: 'Termos', href: '/legal/terms' },
          {
            label: 'Licença MIT',
            href: 'https://github.com/hadagalberto/brasa/blob/main/LICENSE',
            external: true,
          },
          { label: 'Feed RSS', href: '/rss.xml' },
        ],
      },
    ],
    newsletter: {
      heading: 'Notas da forja',
      description:
        'Uma carta curta sempre que algo sai — novas seções, notas de performance, de vez em quando uma captura da brasa. Sem rastreamento, nunca.',
      placeholder: 'voce@exemplo.com',
      action: 'Inscrever',
      note: 'Um e-mail por mês. Cancele quando quiser — preferimos ser sentidos do que silenciados.',
      success: 'Você está na lista. Até a próxima.',
      invalid: 'Informe um e-mail válido.',
    },
    copyright: (year: number, author: string) => `© ${year} ${author} · Licenciado sob MIT.`,
    note: 'Brasa é open-source sob a licença MIT. Feito com Astro, quente por design e intenção.',
  },
  home: {
    title: 'Brasa — prévias de deploy para times',
    description:
      'Brasa Cloud transforma cada branch em uma prévia rápida, compartilhável e protegida por SSO. Um tema Astro open-source com alma de brasa.',
    hero: {
      eyebrow: 'Brasa Cloud · prévias de deploy para times',
      title: { before: 'Cada push, uma ', em: 'prévia', after: ' viva.' },
      lede: 'Brasa Cloud transforma cada branch em um site rápido e compartilhável — protegido por SSO, esperto com cache e no ar antes do café esfriar. Aponte seu time para uma URL, não para uma captura de tela.',
      primary: 'Veja em ação',
      secondary: 'Dar star no GitHub',
      micro: 'grátis para repositórios públicos · sem cartão · configuração em dois minutos',
      logoCaption: 'Agilizando entregas semanais em',
    },
    features: {
      eyebrow: 'Por que Brasa Cloud',
      title: { before: 'Prévias que realmente ', em: 'puxam', after: ' o peso.' },
      lede: 'Seis cartões, a história inteira — tudo que acontece entre o último git push e um merge em que você confia.',
      cards: [
        {
          title: 'Uma URL para cada branch',
          body: 'Cada push ganha um link estável que permanece ativo enquanto o branch existir. Quem revisa chega exatamente à mudança — nunca à main, nunca a um arquivo zip.',
          live: 'no ar',
          building: 'compilando',
          production: 'produção',
        },
        {
          title: 'Cache que realmente acerta',
          body: 'Cache por conteúdo restaura tudo que não mudou. Um site com 400 rotas recompila em segundos, não em pausas para café.',
          hit: 'cache 97%',
          rebuild: 'rebuild 6,2s',
        },
        {
          title: 'Protegido por padrão',
          body: 'Prévias ficam atrás do SSO do seu time. Precisa de olhares externos? Gere uma senha por branch e revogue com um clique.',
          sso: 'SSO · Okta',
          password: 'senha do branch',
          revoked: 'revogada há 2h',
        },
        {
          title: 'Comentários no contexto',
          body: 'Designers e PMs comentam na própria prévia. O feedback fica onde a mudança acontece, não em três ferramentas de distância.',
          comment: 'O brilho do hero ficou perfeito. Pode publicar.',
          approvals: '2 aprovações · mesclado às 14:02',
        },
        {
          title: 'Reversão em um clique',
          body: 'Cada deploy é um snapshot. Restaure qualquer prévia ou estado de produção na hora — sem arqueologia de git.',
          snapshot: 'v142 → v138 · 4s · sem indisponibilidade',
        },
        {
          title: 'Slack, onde você já está',
          body: 'O bot publica a prévia no instante em que ela fica no ar. Threads, aprovações e reações ficam onde seu time já conversa.',
          slack: 'Prévia pronta — feat/ember-glow · 6,2s',
        },
      ],
    },
    how: {
      eyebrow: 'Como funciona',
      title: { before: 'Três passos. Nenhum novo ', em: 'fluxo', after: '.' },
      lede: 'Brasa Cloud se conecta ao repositório que você já tem. Sem escavação de YAML, sem nada novo para ensinar ao time.',
      steps: [
        {
          title: 'Conecte seu repositório',
          body: 'Vincule GitHub ou GitLab em dois cliques. Brasa Cloud detecta framework, grafo de build e variáveis de ambiente — e nunca mais pergunta.',
        },
        {
          title: 'Faça push de um branch',
          body: 'Cada push dispara um build isolado em runners compartilhados. Logs aparecem ao vivo e falhas apontam para o commit exato — não para o pipeline.',
        },
        {
          title: 'Compartilhe a prévia',
          body: 'Pegue o link, jogue no Slack ou no pull request. Comentários se acumulam no contexto, e você mescla quando fizer sentido.',
        },
      ],
    },
    code: {
      eyebrow: 'Interface',
      title: { before: 'Três formas de ', em: 'publicar', after: '.' },
      lede: 'A mesma plataforma em três linguagens — escolha a que seu fluxo já fala, ou conecte as três ao CI.',
      label: 'Formas de fazer deploy',
    },
    metrics: {
      heading: 'Brasa Cloud em números',
      items: [
        { value: 41, suffix: ' mil', label: 'prévias servidas por semana', sub: 'em três regiões' },
        {
          value: 99.98,
          decimals: 2,
          suffix: '%',
          label: 'disponibilidade das prévias',
          sub: 'últimos doze meses',
        },
        {
          value: 4.6,
          decimals: 1,
          suffix: 's',
          label: 'mediana do push ao ar',
          sub: 'p50, todos os frameworks',
        },
        {
          value: 132,
          label: 'times publicando todo dia',
          sub: 'de estúdios de duas pessoas a grandes plataformas',
        },
      ],
    },
    testimonials: {
      eyebrow: 'Depoimentos',
      title: { before: 'Times que pararam de ', em: 'esperar', after: ' a revisão.' },
      lede: 'Seis dos times que usam Brasa Cloud todos os dias — passe o mouse ou foque a fileira para pausar.',
      label: 'O que os times dizem sobre Brasa Cloud',
      roles: [
        'Líder de Engenharia, Alto Labs',
        'Engenheira sênior, Fjord & Co',
        'Líder de Documentação, Cadence',
        'Líder de Plataforma, Kilnworks',
        'Sócia, Studio Halfmoon',
        'Diretora de Design, Northloop',
      ],
      quotes: [
        'Nossas revisões saíram de um dia para uma tarde. Os designers finalmente comentam a coisa real, não capturas de tela.',
        'Paramos de dizer “funciona na minha máquina”. A prévia virou a reunião.',
        'Esse cache é honestamente absurdo. Nosso site de documentação com 400 páginas recompila em segundos.',
        'SSO junto com senhas por branch fez o jurídico parar de dizer não para compartilhar builds.',
        'Clientes clicam num link quente e sentem o site antes mesmo da fatura.',
        'A primeira ferramenta de deploy que nossos designers abrem de propósito. Isso diz tudo.',
      ],
    },
    pricing: {
      eyebrow: 'Preços',
      title: { before: 'Comece grátis. Pague quando o time ', em: 'crescer', after: '.' },
      lede: 'Todos os planos incluem prévias públicas ilimitadas — a diferença é quem precisa ver as privadas.',
      noteBefore: 'Planos, assentos, limites e faturamento estão na',
      noteLink: 'FAQ abaixo',
      tiers: [
        {
          name: 'Starter',
          price: 'R$ 0',
          unit: 'para sempre',
          blurb:
            'Repositórios públicos, experimentos de fim de semana e aquele projeto paralelo em que você ainda acredita.',
          features: [
            'Prévias públicas ilimitadas',
            '2 builds simultâneos',
            'Apps do GitHub e GitLab',
            'Suporte da comunidade',
          ],
          cta: 'Começar de graça',
        },
        {
          name: 'Team',
          price: 'R$ 60',
          unit: 'por assento / mês',
          blurb: 'Para times de produto que abrem uma prévia antes de abrir o pull request.',
          features: [
            'Tudo do Starter',
            'Prévias privadas com SSO',
            'App do Slack + notificações',
            'Retenção de 30 dias',
          ],
          cta: 'Testar 14 dias grátis',
        },
        {
          name: 'Enterprise',
          price: 'Sob consulta',
          unit: '',
          blurb:
            'Para times de plataforma com auditoria, regiões próprias e um número de telefone.',
          features: [
            'Tudo do Team',
            'SAML SSO + logs de auditoria',
            'Regiões de build dedicadas',
            'Fila prioritária com SLA',
          ],
          cta: 'Fale com a gente',
        },
      ],
    },
    faq: {
      eyebrow: 'FAQ',
      title: { before: 'As perguntas que ', em: 'compras', after: ' sempre fazem.' },
      lede: 'Cinco minutos de leitura antes de escrever para o suporte — ou para o jurídico.',
      items: [
        {
          q: 'Qual a diferença das prévias que nosso CI já gera?',
          a: 'Artefatos de CI são pacotes estáticos que você baixa e hospeda. As prévias do Brasa são sites rodando: compilados, com dados realistas, protegidos pelo seu SSO e servidos pela região mais perto de quem revisa. Sem tarballs, sem adivinhar qual artefato é o mais recente.',
        },
        {
          q: 'Pessoas de fora do nosso SSO podem ver uma prévia?',
          a: 'Sim — gere uma senha por branch no painel ou pela CLI. Ela vale para um branch, expira quando ele é mesclado e pode ser revogada com um clique. Quem revisa de fora nunca mexe na autenticação de produção.',
        },
        {
          q: 'O que acontece quando um branch é mesclado ou apagado?',
          a: 'A prévia é coletada em até uma hora e a URL mostra uma página aquecida e com a sua marca dizendo que o branch foi mesclado, em vez de um 404 seco. Links em pull requests antigos continuam contando a história certa.',
        },
        {
          q: 'Builds de prévia consomem nossos minutos de CI?',
          a: 'Não. Os builds rodam em runners isolados do Brasa, dimensionados por framework, com cache por conteúdo que pula o que o build anterior já produziu. Seu CI continua fazendo o que faz de melhor: testes.',
        },
        {
          q: 'Podemos hospedar o Brasa Cloud nós mesmos?',
          a: 'Planos Enterprise rodam imagens single-tenant dentro da sua VPC, com seu armazenamento e seu SSO. O coração open-source da plataforma — incluindo este tema — continua MIT.',
        },
      ],
    },
    cta: {
      eyebrow: 'Comece agora',
      title: { before: 'Dê a cada branch um lugar para ', em: 'brilhar', after: '.' },
      lede: 'Esta página é a demonstração inicial do tema Brasa — basta um matiz de acento num arquivo de configuração para ser seu. MIT, fácil de hospedar e sem frameworks de JS.',
      primary: 'Pegue o tema — é MIT',
      secondary: 'Explore o styleguide',
    },
  },
  pricing: {
    eyebrow: 'Preços',
    title: { before: 'Preços honestos, ', em: 'contas', after: ' tranquilas.' },
    lede: 'Comece grátis em repositórios públicos. Faça upgrade quando o time precisar de prévias privadas, SSO e uma fila mais rápida. Todos os planos incluem prévias públicas ilimitadas.',
    monthly: 'Mensal',
    yearly: 'Anual',
    save: 'Economize 20%',
    perMonth: '/ mês',
    billedYearly: 'cobrado anualmente',
    mostPopular: 'Mais popular',
    tiers: [
      {
        name: 'Starter',
        monthly: 'R$ 0',
        yearly: 'R$ 0',
        unit: 'para sempre',
        blurb: 'Para repositórios públicos, experimentos e aquele projeto que se recusa a morrer.',
        features: [
          'Prévias públicas ilimitadas',
          '2 builds simultâneos',
          'Apps do GitHub e GitLab',
          'Suporte da comunidade',
          'Logs de build por 7 dias',
        ],
        cta: 'Começar de graça',
      },
      {
        name: 'Team',
        monthly: 'R$ 60',
        yearly: 'R$ 48',
        unit: 'por assento / mês',
        blurb: 'Para times de produto que revisam no navegador, não numa thread de capturas.',
        features: [
          'Tudo do Starter',
          'Prévias privadas com SSO',
          'App do Slack + notificações',
          'Retenção de 30 dias',
          'Senhas por branch',
          'Comentários nas prévias',
        ],
        cta: 'Testar 14 dias grátis',
      },
      {
        name: 'Business',
        monthly: 'R$ 120',
        yearly: 'R$ 96',
        unit: 'por assento / mês',
        blurb:
          'Para organizações em crescimento que precisam de governança sem uma maratona de compras.',
        features: [
          'Tudo do Team',
          'SAML SSO + SCIM',
          'Log de auditoria',
          'Acesso por função',
          'Retenção de 90 dias',
          'Cache de build compartilhado',
        ],
        cta: 'Escolher Business',
      },
      {
        name: 'Enterprise',
        monthly: 'Sob consulta',
        yearly: 'Sob consulta',
        unit: 'contrato anual',
        blurb:
          'Para times de plataforma com regiões, armazenamento e revisão de segurança próprios.',
        features: [
          'Tudo do Business',
          'Deploy single-tenant ou na VPC',
          'Regiões de build dedicadas',
          'Fila prioritária com SLA',
          'Políticas de retenção customizadas',
          'Engenheiro de suporte dedicado',
        ],
        cta: 'Fale com a gente',
      },
    ],
    compare: {
      eyebrow: 'Compare os planos',
      title: 'Todos os detalhes, lado a lado',
      lede: 'Uma tabela discreta, a resposta inteira. Em telas pequenas cada plano vira um cartão, para nada se perder na horizontal.',
      tier: 'Plano',
      groups: ['Builds', 'Colaboração', 'Segurança e governança', 'Suporte'],
      rows: [
        {
          label: 'Projetos com prévia pública',
          values: ['Ilimitados', 'Ilimitados', 'Ilimitados', 'Ilimitados'],
        },
        {
          label: 'Projetos com prévia privada',
          values: ['—', 'Ilimitados', 'Ilimitados', 'Ilimitados'],
        },
        { label: 'Builds simultâneos', values: ['2', '6', '16', 'Sob consulta'] },
        { label: 'Retenção da prévia', values: ['7 dias', '30 dias', '90 dias', 'Personalizada'] },
        { label: 'Cache por conteúdo', values: [true, true, true, true] },
        { label: 'Comentários nas prévias', values: [false, true, true, true] },
        { label: 'Notificações no Slack', values: [false, true, true, true] },
        { label: 'SSO do time (OAuth)', values: [false, true, true, true] },
        { label: 'SAML SSO + SCIM', values: [false, false, true, true] },
        { label: 'Log de auditoria', values: [false, false, true, true] },
        {
          label: 'Regiões de deploy',
          values: ['Compartilhadas', 'Compartilhadas', 'Compartilhadas + 1', 'Dedicadas'],
        },
        {
          label: 'Suporte',
          values: ['Comunidade', 'E-mail', 'E-mail prioritário', 'Engenheiro dedicado + SLA'],
        },
      ],
      included: 'Incluído',
      notIncluded: 'Não incluído',
    },
    faq: {
      eyebrow: 'Dúvidas',
      title: 'Antes de escolher um plano',
      lede: 'As cinco que mais recebemos. Ainda com curiosidade? Escreva — quem responde é gente.',
      items: [
        {
          q: 'Posso trocar de plano depois?',
          a: 'Sim. Upgrades valem na hora e são proporcionais aos dias restantes. Downgrades entram no fim do ciclo de cobrança, e nada do que já foi compilado é removido.',
        },
        {
          q: 'O que conta como assento?',
          a: 'Uma pessoa que pode iniciar uma prévia ou deixar um comentário. Quem só recebe um link privado não ocupa assento em nenhum plano.',
        },
        {
          q: 'Há desconto para open-source e educação?',
          a: 'Sim — Team é grátis para mantenedores de projetos open-source públicos e para estudantes em tempo integral. Envie um link e ativamos no mesmo dia.',
        },
        {
          q: 'Como funciona a cobrança anual?',
          a: 'Você paga uma vez por doze meses e a taxa mensal mostrada é o valor efetivo. O seletor acima nunca move os cartões, só os números.',
        },
        {
          q: 'Existe teste grátis para prévias privadas?',
          a: 'Quatorze dias, sem cartão. Você pode convidar o time inteiro, conectar o SSO e manter todas as prévias criadas no período se fizer upgrade.',
        },
        {
          q: 'O que acontece se eu cancelar?',
          a: 'Seus dados ficam exportáveis por 30 dias. As prévias param de ser compiladas, mas os links públicos continuam funcionando até o fim do período pago.',
        },
      ],
    },
    cta: {
      title: { before: 'Ainda decidindo? ', em: 'Experimente', after: ' num branch real.' },
      lede: 'Conecte um repositório público e veja a primeira prévia em menos de dois minutos. Sem cartão, sem ligação de vendas.',
      primary: 'Começar de graça',
      secondary: 'Fale com a gente',
    },
  },
  changelog: {
    eyebrow: 'Novidades',
    title: { before: 'O que ', em: 'mudou', after: ',' },
    lede: 'Cada versão do Brasa Cloud e do tema open-source, numa linha do tempo honesta. As datas marcam o dia em que a mudança entrou no ar.',
    feed: 'Feed RSS',
  },
  about: {
    eyebrow: 'Sobre',
    title: { before: 'Feito por gente que ', em: 'odeava', after: ' esperar prévias.' },
    lede: 'Brasa é um projeto pequeno e independente sobre uma ideia simples: revise a coisa em si, não uma captura dela. O tema que você lê é open source e sempre será.',
    story: {
      eyebrow: 'A versão curta',
      title: 'Primeiro uma ferramenta, depois um tema',
      paragraphs: [
        'Brasa Cloud nasceu em 2024 como uma ferramenta interna de um time cansado de discutir builds que só existiam no notebook de alguém. Ela fazia uma coisa: transformar um branch em um link que qualquer pessoa podia abrir.',
        'A interface ao redor virou a parte interessante. Continuávamos reconstruindo as mesmas superfícies escuras, acentos em brasa e tipografia editorial em todo projeto, então extraímos tudo num tema Astro e demos o mesmo nome.',
        'Hoje o tema é o coração público do projeto. Vem com conteúdo real, uma biblioteca de componentes acessível e opiniões suficientes para um site novo parecer pronto no primeiro dia — sem deixar de ser fácil de desmontar.',
      ],
    },
    values: {
      eyebrow: 'O que mantemos',
      title: 'Três regras, sem cartazes',
      items: [
        {
          title: 'Rápido é feature',
          body: 'Uma página que chega instantaneamente parece cara. Enviamos menos JavaScript do que muitos pacotes de ícones e tratamos o Lighthouse como piso, não como meta.',
        },
        {
          title: 'Quente, não alto',
          body: 'Superfícies escuras por luminosidade, um único acento em brasa, tipografia com um pouco de personalidade. Controle faz mais do que outro gradiente.',
        },
        {
          title: 'Aberto por padrão',
          body: 'O tema é MIT. A documentação explica o porquê, não só o como, para você ir embora quando quiser — levando as melhores partes com você.',
        },
      ],
    },
    numbers: {
      heading: 'Brasa em números',
      items: [
        { value: 132, label: 'times publicando todo dia' },
        { value: 41, suffix: ' mil', label: 'prévias por semana' },
        { value: 12, label: 'capítulos no manual' },
        { value: 100, suffix: '%', label: 'open source' },
      ],
    },
    author: {
      eyebrow: 'A pessoa por trás',
      title: 'Hadagalberto Junior',
      role: 'Designer, desenvolvedor e guardião da brasa',
      body: 'Projeto e construo interfaces em São Paulo, Brasil. Brasa é o que acontece quando uma obsessão por design systems encontra uma tolerância irracional por reescrever CSS de madrugada. O português que você lê aqui é nativo, não um acréscimo de máquina.',
      cta: 'Diga oi',
    },
    cta: {
      title: { before: 'Experimente o tema uma ', em: 'volta', after: '.' },
      lede: 'MIT, fácil de hospedar e a um arquivo de configuração de distância de ser seu.',
      primary: 'Leia a documentação',
      secondary: 'Veja o styleguide',
    },
  },
  contact: {
    eyebrow: 'Contato',
    title: { before: 'Fale com uma ', em: 'pessoa', after: '.' },
    lede: 'Dúvida sobre o tema, um detalhe de cobrança ou uma prévia que se comportou mal? Escreva uma vez — respondemos todas as mensagens, em geral em até um dia útil.',
    form: {
      title: 'Envie uma mensagem',
      description:
        'Campos com asterisco são obrigatórios. Nada é rastreado; o formulário tem um endpoint estático que você troca na configuração.',
      name: 'Seu nome',
      namePlaceholder: 'Marina Cole',
      email: 'E-mail',
      emailPlaceholder: 'voce@empresa.com',
      topic: 'Sobre o que é?',
      topicPlaceholder: 'Escolha um assunto',
      topics: [
        'Dúvida sobre o tema',
        'Preços e cobrança',
        'Suporte técnico',
        'Parceria ou imprensa',
        'Outro assunto',
      ],
      message: 'Mensagem',
      messagePlaceholder: 'Conte o que você está construindo — e o que está no caminho.',
      consent: 'Concordo que minha mensagem seja armazenada para responder a esta conversa.',
      submit: 'Enviar mensagem',
      sending: 'Enviando…',
      successTitle: 'Mensagem enviada.',
      successBody:
        'Obrigado por escrever. Vamos responder no endereço que você informou — em geral em até um dia útil.',
      reset: 'Enviar outra mensagem',
      errors: {
        name: 'Informe seu nome (pelo menos dois caracteres).',
        email: 'Informe um e-mail válido.',
        topic: 'Escolha um assunto.',
        message: 'Escreva pelo menos vinte caracteres para que possamos ajudar.',
        consent: 'Concorde antes de enviar sua mensagem.',
      },
    },
    details: {
      title: 'Outros caminhos',
      emailTitle: 'E-mail',
      emailBody: 'ola@brasa.cloud',
      githubTitle: 'GitHub',
      githubBody: 'Issues, discussões e releases acontecem em aberto.',
      responseTitle: 'Tempo de resposta',
      responseBody: 'Em até um dia útil, em inglês ou português.',
    },
    faq: {
      eyebrow: 'Antes de escrever',
      title: 'Respostas que evitam uma ida e volta',
      items: [
        {
          q: 'Onde reporto um bug do tema?',
          a: 'Abra uma issue no GitHub com a menor reprodução que conseguir. Inclua as versões do Astro e do Brasa e um link, se a página for pública.',
        },
        {
          q: 'Vocês fazem consultoria?',
          a: 'De vez em quando, para times adotando o tema em escala. Conte sobre o projeto e somos honestos sobre termos o encaixe certo.',
        },
        {
          q: 'Posso usar o tema comercialmente?',
          a: 'Sim. A licença MIT permite uso comercial, modificação e redistribuição. Mantenha o arquivo de licença e pronto.',
        },
      ],
    },
  },
  legal: {
    eyebrow: 'Jurídico',
    updated: 'Última atualização',
    privacy: {
      title: 'Privacidade',
      description: 'O que o Brasa Cloud e este tema coletam, por quê e como fazer para parar.',
      intro:
        'Coletamos o mínimo possível. Esta página descreve os dados tratados pelo serviço de demonstração Brasa Cloud e por este tema estático. Foi escrita para ser lida, não para ser ignorada.',
      sections: [
        {
          heading: '1. Quem é responsável',
          paragraphs: [
            'Brasa Cloud é um projeto independente mantido por Hadagalberto Junior. Para dúvidas sobre dados, escreva para ola@brasa.cloud.',
          ],
        },
        {
          heading: '2. O que coletamos',
          paragraphs: [
            'Quando você entra em contato, guardamos nome, e-mail, assunto e mensagem para poder responder. Quando você gera uma prévia, guardamos logs de build e os metadados de commit necessários para exibi-la.',
          ],
          list: [
            'Mensagens enviadas pelo formulário de contato',
            'Logs de build e referências de commit',
            'Contagens agregadas e anônimas de visualizações',
            'E-mail da newsletter, se você se inscrever',
          ],
        },
        {
          heading: '3. O que não coletamos',
          paragraphs: [
            'Não há rastreadores de publicidade, scripts de analytics de terceiros nem gravações de sessão neste site. O tema não vem com rastreamento por padrão. Não vendemos dados pessoais, nunca.',
          ],
        },
        {
          heading: '4. Cookies e armazenamento local',
          paragraphs: [
            'O único dado guardado no seu navegador é a preferência de tema (escuro ou claro), mantida no local storage para a página não piscar ao carregar. O Pagefind roda inteiro no navegador e não envia suas buscas para lugar nenhum.',
          ],
        },
        {
          heading: '5. Por quanto tempo guardamos dados',
          paragraphs: [
            'Mensagens de contato ficam guardadas por doze meses. Logs de prévia seguem a retenção do seu plano. Endereços da newsletter permanecem até você cancelar.',
          ],
        },
        {
          heading: '6. Seus direitos',
          paragraphs: [
            'Você pode pedir uma cópia dos seus dados, uma correção ou a exclusão a qualquer momento. Escreva para ola@brasa.cloud e respondemos em até trinta dias. Se assinou a newsletter, todo e-mail traz um link de cancelamento em um clique.',
          ],
        },
        {
          heading: '7. Mudanças nesta política',
          paragraphs: [
            'Se a política mudar de forma relevante, atualizamos a data acima e, quando a mudança afetar você, enviamos um e-mail direto. As versões anteriores ficam no repositório do projeto.',
          ],
        },
      ],
    },
    terms: {
      title: 'Termos',
      description: 'Os termos curtos e legíveis para usar o Brasa Cloud e o tema Brasa.',
      intro:
        'Estes termos cobrem o serviço de demonstração Brasa Cloud e o uso do tema open-source. O tema em si é licenciado sob MIT; o serviço segue as regras práticas abaixo.',
      sections: [
        {
          heading: '1. Uso do serviço',
          paragraphs: [
            'Você pode usar o Brasa Cloud para compilar e compartilhar prévias de repositórios que possui ou tem autorização para alterar. Não use o serviço para distribuir malware, se passar por outra pessoa ou atacar infraestrutura.',
          ],
        },
        {
          heading: '2. Seu conteúdo',
          paragraphs: [
            'Você mantém a propriedade do seu código, texto e dados. Você nos concede uma licença limitada para compilar e servir esse conteúdo apenas para entregar as prévias que você pediu. Não usamos seus repositórios para treinar modelos nem para publicidade.',
          ],
        },
        {
          heading: '3. Uso razoável',
          paragraphs: [
            'Planos grátis são para repositórios públicos e experimentos não comerciais. Uso comercial de prévias privadas exige plano pago. Podemos limitar volumes anômalos de build, mas avisamos antes de suspender qualquer coisa.',
          ],
        },
        {
          heading: '4. Tema open-source',
          paragraphs: [
            'O tema Astro Brasa é fornecido sob a licença MIT, sem garantia. Você pode copiar, modificar e usá-lo em projetos comerciais desde que o aviso de licença seja mantido. Fontes e bibliotecas de terceiros mantêm suas próprias licenças.',
          ],
        },
        {
          heading: '5. Disponibilidade',
          paragraphs: [
            'Buscamos disponibilidade contínua, mas não a garantimos. Manutenções programadas são anunciadas no changelog. Planos pagos com SLA seguem os termos desse acordo.',
          ],
        },
        {
          heading: '6. Encerramento',
          paragraphs: [
            'Você pode parar de usar o serviço quando quiser. Podemos suspender uma conta que descumpra repetidamente estes termos, com aviso sempre que possível. A exportação de dados fica disponível por trinta dias após o encerramento.',
          ],
        },
        {
          heading: '7. Contato',
          paragraphs: [
            'Dúvidas sobre estes termos vão para ola@brasa.cloud. Respondemos em até um dia útil e preferimos esclarecer a aplicar.',
          ],
        },
      ],
    },
  },
  notFound: {
    title: 'Página não encontrada',
    eyebrow: 'Erro 404',
    heading: { before: 'Esta brasa', em: 'apagou', after: '.' },
    body: 'A página que você procura não existe — talvez tenha mudado de lugar, ou a URL perdeu a faísca. Experimente a busca ou recomece pela página inicial.',
    searchLabel: 'Buscar no site',
    searchPlaceholder: 'O que você procurava?',
    primary: 'Voltar ao início',
    secondary: 'Ver a documentação',
    suggestions: 'Páginas populares',
  },
  blog: {
    allEssays: 'Todos os artigos',
    featured: 'Em destaque',
    latest: 'Publicações recentes',
    readTime: (minutes: number) => `${minutes} min de leitura`,
    by: (author: string) => `Por ${author}`,
    writtenBy: 'Escrito por',
    readEssays: (count: number) =>
      count === 1 ? 'Leia o artigo' : `Leia todos os ${count} artigos`,
    updated: 'Atualizado em',
    tags: 'Assuntos',
    allTags: 'Todos os assuntos',
    tagCount: (count: number) => `${count} ${count === 1 ? 'artigo' : 'artigos'}`,
    authors: 'Autores',
    postsBy: (author: string) => `Artigos de ${author}`,
    related: 'Continue lendo',
    prev: 'Artigo anterior',
    next: 'Próximo artigo',
    share: 'Compartilhe este artigo',
    shareOn: (network: string) => `Compartilhar no ${network}`,
    copyLink: 'Copiar link',
    linkCopied: 'Link copiado para a área de transferência',
    page: (n: number) => `Página ${n}`,
    prevPage: 'Página anterior',
    nextPage: 'Próxima página',
    onThisPage: 'Nesta página',
    noPosts: 'Ainda não há artigos por aqui.',
    backToBlog: 'Voltar a todos os artigos',
    pages: {
      eyebrow: 'A forja · artigos',
      title: { before: 'Notas da ', em: 'forja', after: ' ' },
      lede: 'Artigos sobre prévias de deploy, performance, acessibilidade e design systems — escritos enquanto construímos o tema Brasa, com os comprovantes anexados.',
      description:
        'Notas da forja — artigos sobre prévias de deploy, performance, acessibilidade e design systems, do time que constrói o tema Brasa.',
      subscribe: 'Assine',
      topicsLabel: 'Assuntos',
      all: 'todos',
      featuredLabel: 'Artigo em destaque',
      latestLabel: 'Publicações recentes',
      tags: {
        eyebrow: 'A forja · assuntos',
        title: 'Navegue por assunto',
        lede: (topicCount: number, essayCount: number) =>
          `${topicCount} ${topicCount === 1 ? 'assunto' : 'assuntos'} em ${essayCount} ${essayCount === 1 ? 'artigo' : 'artigos'}. Cada página de assunto é uma lista de leitura completa.`,
        aria: 'Todos os assuntos',
        description:
          'Todos os assuntos do blog Brasa: prévias de deploy, performance, acessibilidade, design systems e cultura de engenharia.',
      },
      tagPage: {
        eyebrow: 'Assunto',
        count: (count: number) =>
          `${count} ${count === 1 ? 'artigo' : 'artigos'}, mais recentes primeiro.`,
        description: (label: string) => `Todos os artigos do blog Brasa sobre “${label}”.`,
        aria: (label: string) => `Artigos sobre ${label}`,
      },
      archive: {
        eyebrow: 'A forja · arquivo',
        lede: 'O arquivo, mais recente primeiro. A primeira página mantém o artigo em destaque e os seis últimos.',
        back: 'Voltar à primeira página',
        sectionLabel: (page: number) => `Artigos, página ${page}`,
      },
      author: {
        eyebrow: 'Autor',
        count: (count: number) => (count === 1 ? 'O artigo dele' : `Todos os ${count} artigos`),
      },
    },
  },
  docs: {
    title: 'Documentação',
    shortTitle: 'Documentação',
    indexEyebrow: 'O manual',
    indexTitle: 'Tudo sobre o Brasa, num só lugar',
    indexLede:
      'Doze capítulos curtos que vão de um repositório vazio a um tema publicado. Comece do início ou vá direto ao que precisa.',
    updated: 'Atualizado em',
    pageCount: (count: number) => `${count} páginas neste manual`,
    browse: 'Ver documentação',
    navigation: 'Navegação da documentação',
    sections: 'Seções da documentação',
    onThisPage: 'Nesta página',
    backToTop: 'Voltar ao topo',
    edit: 'Editar esta página',
    previous: 'Anterior',
    next: 'Próxima',
    pages: {
      eyebrow: 'O manual · v0.1',
      title: { before: 'Deixe do seu ', em: 'jeito', after: '. E publique.' },
      lede: 'Brasa é um tema Astro completo, não um starter com metade da fiação faltando. Este manual cobre todas as superfícies — tokens, content collections, componentes MDX, busca, acessibilidade — com exemplos que você pode colar no seu projeto.',
      description:
        'O manual do Brasa: instalação, configuração, tokens, criação de conteúdo, componentes, acessibilidade, performance e deploy.',
      startInstallation: 'Comece pela instalação',
      searchDocs: 'Buscar na documentação',
      stats: { pages: 'Páginas', sections: 'Seções', license: 'Licença' },
      startHere: {
        eyebrow: 'Comece aqui',
        title: 'Três passos até um site rodando',
        lede: 'Tudo depois disso é opcional. Estas três páginas são o caminho que a maioria percorre.',
        cards: [
          {
            title: 'Instalação',
            description:
              'Crie um projeto, instale as dependências e rode a prévia local em menos de dois minutos.',
            meta: '01 · Comece aqui',
          },
          {
            title: 'Configuração',
            description:
              'O arquivo de configuração tipado: identidade, navegação, idiomas, recursos e matiz do acento.',
            meta: '02 · Do seu jeito',
          },
          {
            title: 'Tokens de design',
            description:
              'Cores OKLCH, tipografia fluida, raios e movimento — e como alterar tudo com segurança.',
            meta: '03 · A paleta',
          },
        ],
      },
      groups: {
        'Getting started': 'Primeiros passos',
        Guides: 'Guias',
        Reference: 'Referência',
        Resources: 'Recursos',
      },
      groupCopy: {
        'Getting started': 'Instale o tema, configure o site e redefina a paleta num só lugar.',
        Guides: 'Crie conteúdo, traduza textos e publique a saída estática em qualquer lugar.',
        Reference:
          'Cada componente, token e decisão de acessibilidade, documentados com exemplos ao vivo.',
        Resources: 'Respostas para as dúvidas que aparecem depois do primeiro deploy.',
      },
      pagesLabel: (count: number) => `${count} páginas`,
      help: {
        eyebrow: 'Ainda travado?',
        title: 'Leia o FAQ ou abra uma issue',
        lede: 'O FAQ cobre as surpresas comuns de configuração. Para todo o resto, as discussões do repositório são o lugar certo — bugs inclusive.',
        cta: 'Leia o FAQ',
      },
    },
  },
  styleguide: {
    title: 'Guia de estilo',
    description:
      'Todos os tokens e componentes do Brasa, ao vivo nos dois temas: cores OKLCH, tipografia fluida, espaçamento, sombras, movimento e a biblioteca completa de componentes.',
    intro: {
      eyebrow: 'Sistema de design',
      title: 'Cada token, nos dois temas.',
      lede: 'Um único matiz de acento comanda toda a paleta — as amostras abaixo leem seus valores calculados ao vivo. Fixe seu tema pelo seletor no cabeçalho; os painéis em Cor mostram os dois temas lado a lado.',
      hueLabel: 'Matiz do acento — demonstração ao vivo',
      hueBodyBefore:
        'Arraste para recalcular a escala em brasa, os gradientes, o brilho e as cores da sintaxe. É assim que',
      hueBodyAfter: 'reestiliza o site a partir de um único número.',
    },
    color: {
      eyebrow: 'Cor',
      title: 'Superfícies OKLCH, tinta quente.',
      lede: 'Escuro primeiro: uma tela quase preta com um toque de marrom, superfícies em camadas por luminosidade, linhas finas misturadas à tinta. O modo claro é papel quente com o mesmo acento em brasa.',
      darkBadge: 'Escuro · padrão',
      lightBadge: 'Claro',
      emberScale: 'Escala em brasa — relativa ao matiz',
      sameBothThemes: 'igual nos dois temas',
      gradientAria: 'O gradiente em brasa, do vermelho-alaranjado profundo ao âmbar',
    },
    typography: {
      eyebrow: 'Tipografia',
      title: 'Serif editorial, grotesk preciso.',
      lede: 'Fraunces com dimensionamento óptico para títulos, Geist para interface e corpo, Geist Mono para código e sobrecabeçalhos. A escala é fluida (clamp) e reduz o espaçamento entre letras à medida que cresce.',
      fontPairing: 'Combinação de fontes',
      pairingBefore: 'Estrutura grotesk com',
      pairingEm: 'ênfase serifada',
      pairingAfter: '— itálico de display para as palavras que carregam calor.',
      families: 'Famílias',
      familyFraunces: 'Fraunces Variable — display, opsz 9–144, itálico',
      familyGeist: 'Geist Variable — interface e corpo, wght 100–900',
      familyMono: 'Geist Mono Variable — código, sobrecabeçalhos, metadados',
    },
    space: {
      eyebrow: 'Espaço, raio, elevação',
      title: 'Raios generosos, profundidade suave.',
      lede: 'Uma escala de espaçamento baseada em 0,25rem, cantos arredondados que nunca passam de 2rem e sombras em camadas quentes em vez de pretas.',
      spacing: 'Espaçamento',
      radii: 'Raios',
      shadows: 'Sombras',
    },
    motion: {
      eyebrow: 'Movimento',
      title: 'Rápido, suave, intencional.',
      lede: '150–400ms com uma cubic-bezier ease-out personalizada. Passe o mouse pelas trilhas para comparar as curvas. Os títulos desta página aparecem com animation-timeline: view() — role para ver. Tudo cede ao prefers-reduced-motion.',
      durations: 'Durações: --dur-1 150ms · --dur-2 250ms · --dur-3 400ms',
      texture: 'Textura',
      textureBody:
        'Uma camada de grão de filme (turbulência SVG em opacidade muito baixa) cobre todas as páginas, e os heroes têm um brilho em brasa lento que segue o ponteiro — experimente a caixa abaixo.',
      glowHint: 'mova o ponteiro aqui',
    },
    a11y: {
      eyebrow: 'Detalhes de acessibilidade',
      title: 'Foco em brasa, seleção quente.',
      lede: 'Os anéis de foco são em brasa com 3px de deslocamento. A seleção de texto recebe o acento. A barra de rolagem é fina e quente. Use Tab nos botões para ver o anel.',
      selectionBody:
        'Experimente selecionar esta frase — o destaque fica em brasa e mantém a tinta quente legível.',
      tabToMe: 'Dê o Tab em mim',
      thenMe: 'Depois em mim',
      andMe: 'E em mim',
    },
    components: {
      eyebrow: 'Componentes',
      title: 'A biblioteca principal, ao vivo.',
      lede: 'Cada componente abaixo é a marcação real de produção — as mesmas instâncias que o site usa. Mude o seletor no cabeçalho para conferir os dois temas.',
      button: {
        label: 'Button',
        primary: 'Primário',
        secondary: 'Secundário',
        ghost: 'Fantasma',
        link: 'Link',
        disabled: 'Desabilitado',
        small: 'Pequeno',
        medium: 'Médio',
        large: 'Grande',
        asAnchor: 'Como link',
      },
      badge: {
        label: 'Badge',
        ember: 'ember',
        solid: 'solid',
        outline: 'outline',
        neutral: 'neutral',
      },
      card: {
        label: 'Card',
        staticTitle: 'Cartão estático',
        staticBody: 'Uma superfície discreta com borda finíssima e a menor elevação.',
        interactiveTitle: 'Cartão interativo',
        interactiveBody: 'No hover ele sobe um nível, a borda esquenta e a sombra aprofunda.',
      },
      spotlight: {
        label: 'SpotlightCard',
        hoverTitle: 'Brilho no hover',
        hoverBody: 'Um banho radial e uma borda em brasa seguem o cursor pelo cartão.',
        themesTitle: 'Ambos os temas',
        themesBody:
          'O efeito lê o acento semântico, então acompanha a demonstração de matiz acima.',
        reducedTitle: 'Movimento reduzido',
        reducedBody: 'As transições colapsam a zero para quem prefere movimento reduzido.',
      },
      heading: {
        label: 'Heading',
        sectionEyebrow: 'Título de seção',
        sectionTitle: 'Sobrecabeçalho, título e lede.',
        sectionLede:
          'Alinhado ao início por padrão, com título equilibrado e um lede legível numa medida confortável.',
        centeredEyebrow: 'Variante centralizada',
        centeredTitle: 'Mesmas partes, centralizadas.',
        centeredLede:
          'Para CTAs de encerramento e mudanças de seção — os traços do sobrecabeçalho se espelham dos dois lados.',
      },
      icon: { label: 'Icon' },
      prose: {
        label: 'Prose',
        title: 'Prose, para MDX de texto longo',
        lede: 'Tudo que um post de blog ou uma página de docs precisa: links que',
        link: 'sublinham suavemente',
        strong: 'ênfase forte',
        afterStrong: ' em tinta quente,',
        em: 'observações em itálico',
        afterEm: ', código inline ',
        beforeKbd: ', dicas de teclado como ',
        tail: ', listas que marcam com brasa, citações em itálico de display e tabelas com linhas finas.',
        ul: [
          'Itens sem ordem levam um pequeno traço em brasa,',
          'alinhados ao ritmo do texto,',
          'nunca o ponto padrão do navegador.',
        ],
        ol: ['Listas ordenadas mantêm os numerais monoespaçados,', 'tingidos pelo acento.'],
        quote: '“A paleta é o produto. Acerte as brasas e o resto vem atrás.”',
        figureAria: 'Placa de marca Brasa: a marca da chama sobre a escala em brasa',
        svgHue: 'ember · oklch · matiz 35',
        caption: 'Legendas ficam centralizadas, pequenas e discretas.',
        table: {
          token: 'Token',
          role: 'Função',
          notes: 'Observações',
          canvasRole: 'fundo da página',
          canvasNotes: 'quase preto com tom marrom',
          surfaceRole: 'camadas elevadas',
          surfaceNotes: 'luminosidade, não bordas',
          emberRole: 'o acento',
        },
      },
    },
    typeScale: {
      hero: 'Sites que ainda brilham',
      display: 'Prévias de deploy para times',
      bodyLg: 'O texto corrido usa Geist num tamanho fluido e com entrelinhas generosas.',
      body: 'O texto secundário herda o tamanho base de 1rem e um ritmo de 1,75.',
      mono: 'const ember = oklch(0.685 0.19 35);',
    },
  },
};
