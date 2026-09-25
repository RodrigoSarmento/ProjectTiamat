import type { IStoryChapter } from '../Story.types';
import { CharacterId } from '../characters';
import { StoryFlag } from '../flags';

export const prologueChapter = {
  id: 'prologue',
  entry: 'dreaming',
  nodes: {
    dreaming: {
      type: 'passage',
      title: 'TELA PRETA - Sonhando',
      backgroundColor: 'black',
      text: 'De olhos fechados, você já não consegue mais distinguir exatamente o que é o seu corpo e o que é o movimento da rua. Cada curva te inclina devagar para um lado, cada freada te empurra um pouco para a frente, é como se você fosse o próprio movimento do ônibus.\n\nO ronco grave do motor vibra em suas costas. Vozes distantes se misturam ao chiado dos freios e ao balanço repetitivo da viagem como uma canção de ninar.\n\nEntão surge uma luz no fim do túnel, ela cresce lentamente em sua direção, convidando você a mergulhar nela. Dentro dela, você se vê:',
      choices: [
        {
          id: 'corporate',
          label: 'Como um grande figurão corporativo',
          next: 'wake-on-bus-corporate',
          consequences: [
            {
              type: 'flag',
              value: StoryFlag.dreamedCorporate,
            },
          ],
        },
        {
          id: 'financial',
          label: 'Livre de todos os seus problemas financeiros',
          next: 'wake-on-bus-financial',
          consequences: [
            {
              type: 'flag',
              value: StoryFlag.dreamedFinancial,
            },
          ],
        },
        {
          id: 'crime',
          label: 'Como uma lenda do crime',
          next: 'wake-on-bus-crime',
          consequences: [
            {
              type: 'flag',
              value: StoryFlag.dreamedCrime,
            },
          ],
        },
        {
          id: 'peace',
          label: 'Finalmente em paz fora do caos de Nova São Paulo',
          next: 'wake-on-bus-peace',
          consequences: [
            {
              type: 'flag',
              value: StoryFlag.dreamedPeace,
            },
          ],
        },
      ],
    },
    'wake-on-bus-corporate': {
      type: 'passage',
      title: 'TELA PRETA - Sonhando',
      text: 'A luz toma forma e, quando você percebe, Nova São Paulo está abaixo dos seus pés.\n\nDo outro lado de uma enorme parede de vidro, os prédios se estendem até onde a vista alcança. Carros atravessam o céu entre as torres e propagandas gigantes iluminam uma cidade que, dali de cima, parece estranhamente pequena.\n\nVocê veste um terno feito sob medida e, atrás de você, pessoas sem rostos definidos aguardam em silêncio. Gente importante, todos esperam que você faça algo primeiro.\n\nFinalmente você conseguiu, agora você é quem está no topo. Ninguém manda você fazer nada, ninguém controla seus horários, ninguém controla a sua vida. É você quem possui o poder.\n\nEm toda sua vida você nunca chegou perto de viver o que está diante dos seus olhos, mas a sensação é tão real, tão boa, que pouco importa.\n\nVocê tenta alcançá-la...\n\nSó mais um pouco e...\n\nAlgo te prende. Algo grande, algo forte, algo profundamente desagradável te impede de mergulhar em seu sonho: a torcicolo do cochilo no ônibus.',
      next: 'wake-voice',
    },
    'wake-on-bus-financial': {
      type: 'passage',
      title: 'TELA PRETA - Sonhando',
      text: 'A luz cresce em um clarão intenso te cegando completamente.\nAos poucos sua visão se recupera, mas nada de extraordinário aparece diante dos seus olhos, na verdade o cenário é bem familiar: você está sentado à mesa de casa.\n\nVocê desliza o dedo pela tela do seu celular procurando alguma notificação do aplicativo do seu banco. Uma cobrança, uma parcela atrasada, alguma empresa lembrando que possui uma parte do dinheiro que você ainda nem ganhou.\n\nNão encontra nada.\n\nEntão abre sua conta. O número diante dos seus olhos parece errado. Você nem sabia que naquela parte da tela cabiam tantos dígitos.\n\nVocê esfrega os olhos e confere novamente.\n\nEles continuam lá. Dinheiro suficiente para hoje, para amanhã, para o mês seguinte e para os próximos anos.\n\nVocê não tem lembrança de já ter vivido algo como aquilo em nenhum momento da sua vida, mas a sensação é tão real, tão aconchegante, que pouco importa.\n\nVocê tenta alcançá-la...\n\nSó mais um pouco e...\n\nAlgo te prende. Algo grande, algo forte, algo profundamente desagradável te impede de mergulhar em seu sonho: a torcicolo do cochilo no ônibus.',
      next: 'wake-voice',
    },
    'wake-on-bus-crime': {
      type: 'passage',
      title: 'TELA PRETA - Sonhando',
      text: '...',
      next: 'wake-voice',
    },
    'wake-on-bus-peace': {
      type: 'passage',
      title: 'TELA PRETA - Sonhando',
      text: 'A luz fica mais forte.\nQuando seus olhos se acostumam, você demora alguns segundos para entender onde está.\n\nOnde você se encontra não existem prédios, não existem propagandas, não existem drones ou naves cruzando o céu, muito menos o ruído caótico de uma grande metrópole.\n\nÀ sua frente há apenas uma casa pequena com uma árvore onde a silhueta de uma mulher empurra uma criança em um balanço preso aos galhos mais grossos. Por trás deles, apenas um lindo horizonte tão distante que você consegue enxergar onde o céu toca a terra.\n\nVocê está parado do lado de fora da casa, sem saber onde fica aquele lugar ou quem são aquelas pessoas.\n\nTalvez nem importe.\n\nO vento passa pelas folhas das árvores e você fecha os olhos. Uma sensação de calmaria domina seu peito e se expande por todo seu corpo.  Por alguns segundos, não existe absolutamente nada que precise ser feito.\n\nAo abrir os olhos, você vê as duas figuras te convidando para se aproximar, você começa a caminhar, mas algo parece empurrar elas para mais longe a cada passo que você dá.\n\nVocê tenta alcançá-las...\n\nSó mais um pouco...\n\nAlgo te prende. Algo grande, algo forte, algo profundamente desagradável te impede de mergulhar em seu sonho: a torcicolo do cochilo no ônibus.',
      next: 'wake-voice',
    },
    'wake-voice': {
      type: 'passage',
      title: 'TELA PRETA - Sonhando',
      characterId: CharacterId.maleVoice,
      text: 'Ô! Acorda aê!',
      next: 'wake-on-bus',
    },
    'wake-on-bus': {
      type: 'passage',
      backgroundImage: 'gameplay_page',
      text: 'Você acorda repentinamente e seu pescoço logo protesta contra isso. Logo em seguida vêm o barulho da rua, a luz artificial atravessando as sujas janelas do ônibus magnético e dezenas de trabalhadores se levantando ao mesmo tempo.\nO ônibus corporativo da New Human CORPE termina sua decida até o nível mais baixo da cidade de Nova São Paulo, onde parte da antiga cidade divide espaço com seus novos mega prédios e fábricas das corporações.\n\nPela janela você reconhece a entrada da fábrica onde trabalha: um enorme portão metálico amarelo corta uma parede de concreto que parece continuar indefinidamente para todos os lados. Acima dele, o logotipo em neon branco da New Human CORPE brilha mais forte do que qualquer iluminação ao redor. O ônibus desacelera enquanto entra no terminal de funcionários.\n\nAo seu lado, Jô, seu colega de trabalho. Um homem preto de meia-idade, com o rosto marcado por poucas horas de sono e uma disposição irritantemente incompatível com alguém que acordou cedo para trabalhar.',
      next: 'jo-offer',
    },
    'jo-offer': {
      type: 'passage',
      lines: [
        {
          characterId: CharacterId.jo,
          text: 'É com essa energia que tu vai trampar 80h essa semana?',
        },
        {
          text: 'Ele balança uma lata azul diante do seu rosto.',
        },
        {
          characterId: CharacterId.jo,
          text: 'Bora, mata isso aí! Vamo pro paraíso.',
        },
      ],
      next: 'drink-offer',
    },
    'drink-offer': {
      type: 'passage',
      text: 'O homem te oferece o resto de uma lata de Blue Energy, um energético barato tão ácido que algumas pessoas usam para desentupir pia.',
      choices: [
        {
          id: 'accept-drink',
          label: 'Aceitar a bebida',
          next: 'accepted-drink',
          consequences: [
            {
              type: 'temporaryStatus',
              value: {
                energy: 1,
              },
            },
          ],
        },
        {
          id: 'refuse-drink',
          label: 'Recusar a bebida',
          next: 'refused-drink',
        },
      ],
    },
    'accepted-drink': {
      type: 'passage',
      lines: [
        {
          text: 'A bebida desce pela sua garganta como uma bota, mas alguns segundos depois de chegar ao seu estômago, você sente um pico de energia instantânea que faz até a sua torcicolo repensarem a existência. Vocês começam a se organizar para sair do ônibus.',
        },
        {
          text: '[Sistema do Ônibus]\n\n Terminal de Funcionários New Human, preparem suas credenciais. Próxima estação: Terminal Blá blá blá.\n\n As portas se abrem.',
        },
      ],
      next: 'riding-bus',
    },
    'refused-drink': {
      type: 'passage',
      lines: [
        {
          text: 'Jô termina a bebida, amassa e joga fora. Em seguida vocês se organizam para sair do ônibus.\n\nUma voz robótica invade o ônibus:',
        },
        {
          text: '[Sistema do Ônibus]\n\n Terminal de Funcionários New Human, preparem suas credenciais. Próxima estação: Terminal Blá blá blá.\n\n As portas se abrem.',
        },
      ],
      next: 'riding-bus',
    },
    'riding-bus': {
      type: 'passage',
      lines: [
        {
          text: 'A fábrica possui o seu próprio terminal de ônibus corporativos que chegam continuamente através de túneis magnéticos. Cada linha percorre determinados níveis de Nova São Paulo, recolhendo funcionários em pontos estratégicos para levá-los até o seu setor de trabalho. ',
        },
        {
          text: 'Dezenas de pessoas descem quase ao mesmo tempo em que dezenas de pessoas tentam entrar no ônibus. O turno da noite tenta ansiosamente voltar para casa enquanto o turno da manhã se prepara para a jornada do dia. Duas multidões cansadas atravessam uma à outra sob placas de neon branco ofuscante:\n\nNew Human CORPE onde construímos o futuro da humanidade',
        },
        {
          text: 'Uma outra placa mostra: \n\nACIDENTES NOS ÚLTIMOS 30 DIAS: 7\n\nA luz do número na placa oscila repetidas vezes e quando estabiliza se lê:\n\nACIDENTES NOS ÚLTIMOS 30 DIAS: 8.\n\nNinguém parece se importar. ',
        },
        {
          text: 'Você e Jô entram na corrente de trabalhadores em direção aos bloqueios de acesso. Com o grande portão amarelo já aberto, surgem as primeiras catracas da fábrica, organizadas por setor. Cada funcionário se posiciona na entrada correspondente à sua área, confirma a identidade através do chip de identificação e, depois de liberado, segue para um segundo controle, onde registra oficialmente o início do turno. Enquanto a multidão avança lentamente, Jô se aproxima de você e abaixa a voz.',
        },
      ],
      next: 'jo-offer-service',
    },
    'jo-offer-service': {
      type: 'passage',
      choices: [
        {
          id: 'continue-dialog-with-jo',
          label:
            'Você sempre fala "coisa simples" antes de explicar a parte que dá cadeia.',
          next: 'jo-answer',
        },
        {
          id: 'ask-about-service',
          label: 'Que tipo de serviço?',
          next: 'jo-job-first-answer',
          once: true,
          consequences: [
            {
              type: 'flag',
              value: StoryFlag.askedJoAboutService,
            },
          ],
        },
      ],
    },
    'jo-job-first-answer': {
      type: 'passage',
      characterId: CharacterId.jo,
      text: 'Serviço serviço.',
      next: 'jo-job-first-answer-part-2',
    },
    'jo-job-first-answer-part-2': {
      type: 'passage',
      text: 'A palavra significa outra coisa quando vocês dois usam dessa maneira. A fila avança mais um pouco.',
      next: 'jo-offer-service',
    },
    'jo-answer': {
      type: 'passage',
      characterId: CharacterId.jo,
      text: 'Por que se eu começar pela parte da cadeia, você peida. Mas dessa vez é fácil: um engenheiro daqui foi mandado embora há uns tempos. Um tal de Elias, trabalhava com arquitetura e engenharia das bonecas. O cliente quer o histórico dele.',
      next: 'jo-job-talk',
    },
    'jo-job-talk': {
      type: 'passage',
      choices: [
        {
          id: 'what-history',
          label: 'Histórico de quê?',
          next: 'jo-client-history-answer',
        },
        {
          id: 'who-is-the-client',
          label: 'Quem é o cliente?',
          once: true,
          next: 'jo-client-answer',
        },
        {
          id: 'why-client-wants',
          label: 'Por que ele quer isso?',
          once: true,
          next: 'jo-client-why-wants-answer',
        },
      ],
    },
    'jo-client-answer': {
      type: 'passage',
      characterId: CharacterId.jo,
      text: 'Não sei, peguei o serviço com o Orelha, ele só me falou o que precisava fazer e quanto eu ia ganhar. "Nós" vamos ganhar, não é mesmo amigão?',
      next: 'jo-job-talk',
    },
    'jo-client-why-wants-answer': {
      type: 'passage',
      characterId: CharacterId.jo,
      text: 'Porra, eu sei lá, cara! Vai ver ele tem alguma treta com o maluco. Tu quer que o cara te pague ou te dê uma entrevista?',
      next: 'jo-job-talk',
    },
    'jo-client-history-answer': {
      type: 'passage',
      characterId: CharacterId.jo,
      text: 'Projetos que trabalhou, setores que trabalhou, endereço de residência, nome dos pais, data de nascimento blá blá blá... pelo que eu entendi, ele quer a ficha completa dele na New Human. Basicamente é só hackear qualquer computador do cuzão do teu chefe. Posso contar contigo?',
      choices: [
        {
          id: 'i-ll-think',
          label: 'Vou pensar no teu caso',
          consequences: [
            {
              type: 'flag',
              value: StoryFlag.answerYesToJoCase,
            },
          ],
          next: 'approaching-line',
        },
        {
          id: 'not-sure',
          label: 'Não sei se quero me meter nisso',
          consequences: [
            {
              type: 'flag',
              value: StoryFlag.answerNoToJoCase,
            },
          ],
          next: 'approaching-line',
        },
      ],
    },
    'approaching-line': {
      type: 'passage',
      text: 'A conversa termina quando vocês notam uma confusão na fila da Montagem. Aparentemente tem algum problema lá na frente.',
      next: 'approaching-line-gus-blocked',
    },
    'approaching-line-gus-blocked': {
      type: 'passage',
      lines: [
        {
          text: 'Por entre as diversas cabeças da fila você consegue identificar o problema: um funcionário está discutindo com o terminal de acesso e dando murros na máquina.\n\n"Gus", um dos operadores da linhagem de montagem que você conhece de vista, aproxima novamente o pulso do leitor.',
        },
        {
          text: '[Terminal de Acesso]\n\nCREDENCIAL NÃO IDENTIFICADA.\n\nA máquina recebe mais um murro.',
        },
        {
          text: 'Porra! Não é possível cara! Eu entrei com essa merda ontem! ',
          characterId: CharacterId.gus,
        },
        {
          text: 'Ele tenta outra vez:\n\n[Terminal de Acesso]\n\nCREDENCIAL NÃO IDENTIFICADA.',
        },
        {
          text: 'Você possui mais uma tentativa antes do bloqueio da credencial.\n\nAtrás dele, a fila começa a se aborrecer. Um relógio acima das catracas marca: \n\n05:47\n\n Gus olha para um dos seguranças que parece ignorar o problema:',
        },

        {
          characterId: CharacterId.gus,
          text: 'Meu chip tá funcionando, é essa máquina que tá com problema. Libera pra mim. ',
        },
        {
          characterId: CharacterId.securityGuard,
          text: 'Não posso, você precisa abrir um chamado com o TI.',
          portraitPosition: 'left',
        },
        {
          characterId: CharacterId.gus,
          text: 'Cara, seis horas começa o turno, tu sabe que um chamado dura pelo menos 20min pra fazer...',
        },
        {
          characterId: CharacterId.securityGuard,
          text: 'Então é melhor você fazer rápido.',
          portraitPosition: 'left',
        },
        {
          text: 'O segurança dá uma olhada para o relógio e volta para o seu posto.\n\nO relógio agora marca: \n\n05:48',
        },
        {
          text: 'Gus olha desesperado para os lados sem saber o que fazer. Alguns tentam passar na frente do Gus, mas suas credenciais também não funcionam.\nNo meio do mar de funcionários, seus olhos se cruzam.',
        },
        {
          characterId: CharacterId.gus,
          text: 'Ei, você!',
        },
      ],
      choices: [
        {
          id: 'dont-look',
          label: 'Desviar o olhar',
          next: 'dont-look-answer',
          isQuickChoice: true,
          consequences: [{ type: 'flag', value: StoryFlag.dontLookAtGus }],
        },
        {
          id: 'dont-react',
          label: 'Não Reagir',
          next: 'dont-react-answer',
          isQuickChoice: true,
          consequences: [{ type: 'flag', value: StoryFlag.dontReactToGus }],
        },
        {
          id: 'focus',
          label: 'Focar o Olhar',
          next: 'focus-answer',
          isQuickChoice: true,
          consequences: [{ type: 'flag', value: StoryFlag.focusOnGus }],
        },
      ],
    },
    'dont-look-answer': {
      type: 'passage',
      characterId: CharacterId.gus,
      text: 'Filho da mãe... Ei, ei! Eu sei que você me viu, para de fingir, seu otário! Eu sei que tu é da manutenção, vem dá uma força aqui, vê se tu sabe arrumar essa merda!',
      next: 'gus-approaching',
    },
    'dont-react-answer': {
      type: 'passage',
      characterId: CharacterId.gus,
      text: 'Ei! Tu é da manutenção, né? Técnico de Manutenção, algo assim, né? Eu lembro de você! A gente já se esbarrou algumas vezes no refeitório, me dá uma ajuda aqui, por favor!',
      next: 'gus-approaching',
    },
    'focus-answer': {
      type: 'passage',
      lines: [
        { text: 'O Gus de encara por alguns segundos.' },
        {
          characterId: CharacterId.gus,
          text: 'Qual foi, seu esquisito? Deu pau que nem as bonecas da última leva? Vai ficar só assistindo o circo pegar fogo ou vai mexer essa bunda e ajudar em alguma coisa?? ',
        },
      ],
      next: 'gus-approaching',
    },
    'gus-approaching': {
      type: 'passage',
      text: 'Você percebe que não tem para onde fugir. Vai ser preciso fazer a coisa mais chata qu um humano pode fazer: interagir com seus semelhantes. O que fazer agora?',
    },
  },
} satisfies IStoryChapter;
