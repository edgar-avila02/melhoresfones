import fs from 'node:fs';

const seoData = {
  "melhores-fones-de-ouvido-para-academia": {
    seo_title: "Melhor Fone para Academia: Top Modelos de 2026",
    seo_description: "Descubra os melhores fones para treinar com firmeza, resistência ao suor e som potente na academia. Confira o ranking testado!"
  },
  "melhores-fones-tws": {
    seo_title: "Melhores Fones TWS Sem Fio de 2026: Guia Completo",
    seo_description: "Guia comparativo com os melhores fones True Wireless (TWS) do ano. Veja autonomia, cancelamento de ruído e os modelos ideais."
  },
  "melhores-fones-bluetooth-qcy": {
    seo_title: "Melhores Fones Bluetooth QCY em 2026: Top Modelos",
    seo_description: "Buscando fone QCY bom e barato? Comparamos os modelos Bluetooth mais recomendados com bateria duradoura e ótimo som. Veja o ranking!"
  },
  "melhores-marcas-de-fone-de-ouvido": {
    seo_title: "Melhores Marcas de Fone de Ouvido em 2026: Guia",
    seo_description: "Sony, JBL, Apple ou Sennheiser? Conheça as melhores marcas de fone de ouvido do mercado e descubra qual vale o seu investimento."
  },
  "qcy-h3-review": {
    seo_title: "Review QCY H3: Headphone ANC Vale a Pena em 2026?",
    seo_description: "Analisamos o headphone QCY H3: cancelamento de ruído ativo, conforto e qualidade sonora na prática. Veja se vale a pena comprar!"
  },
  "fone-qcy-e-bom": {
    seo_title: "Fone QCY é Bom Mesmo? Vale a Pena Comprar em 2026",
    seo_description: "Descubra se fone QCY é bom, durável e com som de qualidade. Testamos os modelos mais vendidos e revelamos se compensa comprar."
  },
  "qcy-t13-review": {
    seo_title: "Review QCY T13: Vale a Pena Comprar Esse Fone?",
    seo_description: "O QCY T13 é o fone TWS barato mais popular. Testamos som, bateria de até 30 horas e conforto diário. Confira nossa análise honesta!"
  },
  "qcy-t17-so-funciona-um-lado": {
    seo_title: "QCY T17 Só Funciona de Um Lado? Como Resolver",
    seo_description: "Seu QCY T17 só toca de um lado? Aprenda o passo a passo para resetar, emparelhar os dois lados e resolver a falha em poucos minutos."
  },
  "como-resetar-o-fone-qcy-t1c": {
    seo_title: "Como Resetar o Fone QCY T1C: Guia Fácil e Rápido",
    seo_description: "Passo a passo simples para resetar os fones QCY T1C de fábrica e corrigir problemas de sincronização ou conexão no Bluetooth."
  },
  "como-conectar-fone-qcy": {
    seo_title: "Como Conectar Fone QCY: Pareie os Dois Lados Fácil",
    seo_description: "Aprenda como conectar e sincronizar os fones QCY no celular e notebook, ativando os dois lados sem erros. Veja o tutorial prático!"
  },
  "fone-qcy-nao-carrega": {
    seo_title: "Fone QCY Não Carrega? Veja Como Consertar Agora",
    seo_description: "Fone QCY não carrega na case ou os LEDs não acendem? Confira 5 soluções práticas para destravar o carregamento dos seus fones."
  },
  "qcy-ht07-vs-ht05": {
    seo_title: "QCY HT05 ou HT07? Comparativo Completo e Veredito",
    seo_description: "Dúvida entre QCY HT05 e HT07? Comparamos ANC, som, conforto e bateria para te ajudar a escolher o melhor fone custo-benefício."
  },
  "fone-qcy-ht05-e-bom": {
    seo_title: "QCY HT05 Melobuds é Bom? Review Completo de 2026",
    seo_description: "Testamos o QCY HT05 Melobuds ANC: veja qualidade do som, isolamento de ruído, bateria e se ele realmente é o melhor fone barato."
  },
  "fone-qcy-so-conecta-um-lado": {
    seo_title: "Fone QCY Só Conecta Um Lado? Como Consertar Fácil",
    seo_description: "Apenas um lado do fone QCY está conectando? Veja o guia prático passo a passo para sincronizar ambos os lados e voltar a ouvir seu som."
  },
  "melhores-fones-kz": {
    seo_title: "Melhores Fones KZ em 2026: Guia e Melhores Modelos",
    seo_description: "Quer som audiófilo gastando pouco? Confira os melhores fones in-ear da KZ para músicos, jogos e uso diário com cabo destacável."
  },
  "melhor-equalizacao-para-grave": {
    seo_title: "Melhor Equalização para Graves Fortes e Limpos",
    seo_description: "Aprenda a regular o equalizador para ter graves potentes e profundos sem distorção. Dicas práticas para Spotify e equalizadores."
  },
  "melhor-fone-de-ouvido-para-natacao": {
    seo_title: "Melhores Fones para Natação em 2026: Top 6 Modelos",
    seo_description: "Pratica natação? Conheça os melhores fones à prova d'água IPX8 e condução óssea para ouvir música debaixo d'água nos treinos."
  },
  "melhor-fone-de-ouvido-conducao-ossea": {
    seo_title: "Melhores Fones por Condução Óssea em 2026: Top 11",
    seo_description: "Veja quais são os melhores fones por condução óssea para corrida, ciclismo e esportes sem tapar os ouvidos. Ranking testado!"
  },
  "como-desativar-o-fone-de-ouvido-do-celular": {
    seo_title: "Como Desativar Modo Fone de Ouvido no Celular",
    seo_description: "Celular travado no modo fone mesmo sem nada conectado? Aprenda métodos práticos para desativar o ícone de fone e restaurar o áudio."
  },
  "melhor-fone-de-ouvido-com-cartao-de-memoria": {
    seo_title: "Melhor Fone com Cartão de Memória: Top 5 de 2026",
    seo_description: "Quer ouvir música sem precisar do celular por perto? Veja os melhores fones de ouvido com entrada para cartão Micro SD e boa bateria."
  },
  "melhor-fone-de-ouvido-intra-auricular": {
    seo_title: "Melhores Fones Intra-Auriculares de 2026: Top 12",
    seo_description: "Guia comparativo com os melhores fones intra-auriculares (in-ear) do mercado. Isolamento acústico, som potente e conforto prolongado."
  },
  "como-usar-os-airdots-xiaomi": {
    seo_title: "Como Usar o Redmi AirDots Xiaomi: Manual Completo",
    seo_description: "Aprenda como parear, resetar e usar os comandos de toque do Xiaomi Redmi AirDots sem erros. Tutorial detalhado para iniciantes."
  },
  "melhor-fone-de-ouvido-bluetooth-jbl": {
    seo_title: "Melhores Fones Bluetooth JBL em 2026: Qual Comprar",
    seo_description: "Confira o ranking dos melhores fones de ouvido Bluetooth da JBL: opções TWS e headphones com grave potente, ANC e longa bateria."
  },
  "melhor-fone-de-ouvido-profissional": {
    seo_title: "Melhores Fones Profissionais de 2026: Monitoração",
    seo_description: "Procurando fidelidade acústica para estúdio, edição ou produção musical? Veja os melhores fones de ouvido profissionais testados."
  },
  "melhorar-fone-de-ouvido": {
    seo_title: "Como Melhorar a Qualidade de Som do Fone de Ouvido",
    seo_description: "Dicas práticas para melhorar o áudio do seu fone: equalização, ponteiras corretas e codecs de alta resolução para turbinar o som."
  },
  "melhor-fone-de-ouvido-que-isola-o-som-externo": {
    seo_title: "Melhores Fones que Isolam Som Externo em 2026",
    seo_description: "Trabalhe ou estude em silêncio absoluto. Selecionamos os fones com o melhor cancelamento de ruído ativo (ANC) e isolamento passivo."
  },
  "o-que-fazer-quando-o-fone-de-ouvido-nao-conecta": {
    seo_title: "Fone de Ouvido Não Conecta? Veja Como Resolver Já",
    seo_description: "Dispositivo não encontra ou não conecta no fone de ouvido Bluetooth? Descubra as causas comuns e como resolver o problema rapidamente."
  },
  "o-que-fazer-quando-o-fone-de-ouvido-fica-chiando": {
    seo_title: "Fone com Chiado ou Ruído? Saiba Como Resolver Já",
    seo_description: "Seu fone de ouvido está chiando no celular ou PC? Entenda o que causa a interferência e como eliminar o chiado em poucos passos."
  },
  "o-que-fazer-quando-o-fone-de-ouvido-fica-baixo": {
    seo_title: "Fone de Ouvido Muito Baixo? Veja Como Aumentar Já",
    seo_description: "O volume do seu fone de ouvido está baixo demais mesmo no máximo? Veja soluções simples para destravar o limite de áudio no celular e PC."
  },
  "o-que-fazer-quando-fone-de-ouvido-cai-na-agua": {
    seo_title: "Fone de Ouvido Caiu na Água? Saiba Como Salvar Já",
    seo_description: "Seu fone de ouvido molhou ou caiu na água? Siga este passo a passo de emergência para secar e salvar o aparelho antes que queime."
  },
  "fone-so-funciona-quando-reinicia-o-notebook": {
    seo_title: "Fone Só Funciona Reiniciando o PC? Como Consertar",
    seo_description: "Precisa reiniciar o computador para o fone funcionar? Veja como corrigir conflitos de drivers de áudio no Windows de forma definitiva."
  },
  "como-escolher-o-melhor-fone-de-ouvido": {
    seo_title: "Como Escolher o Melhor Fone de Ouvido: Guia Rápido",
    seo_description: "Intra-auricular, headphone ou TWS? Saiba o que observar em bateria, conforto e qualidade de som antes de comprar seu novo fone."
  },
  "como-carregar-fone-de-ouvido-bluetooth-redmi": {
    seo_title: "Como Carregar Fone Xiaomi Redmi Bluetooth Correto",
    seo_description: "Aprenda como carregar o fone Bluetooth Redmi da forma certa para proteger a vida útil da bateria e do estojo de carregamento."
  },
  "pode-usar-fone-de-ouvido-quando-esta-trovejando": {
    seo_title: "Pode Usar Fone Durante Tempestades? Mitos e Fatos",
    seo_description: "Usar fones de ouvido durante chuva com raios atrai descargas elétricas? Explicamos o que a ciência diz sobre o uso com fio e sem fio."
  },
  "pode-usar-fone-de-ouvido-com-o-celular-carregando": {
    seo_title: "Pode Usar Fone com Celular Carregando? Há Riscos?",
    seo_description: "Usar fones de ouvido enquanto o smartphone está na tomada oferece perigo? Entenda as precauções necessárias para evitar acidentes."
  },
  "quando-aparece-fone-de-ouvido-conectado": {
    seo_title: "Celular Travado no Modo Fone? Veja Como Resolver",
    seo_description: "O celular acusa fone conectado mesmo sem nenhum plugado? Veja como limpar a entrada P2 e resolver o bug do sistema no Android e iOS."
  },
  "como-limpar-fone-de-ouvido-apple": {
    seo_title: "Como Limpar Fone Apple AirPods sem Danificar",
    seo_description: "Passo a passo seguro para higienizar seus AirPods e EarPods da Apple. Remova cera e sujeira sem prejudicar as telas acústicas."
  },
  "como-consertar-fone-de-ouvido-jbl-bluetooth": {
    seo_title: "Como Consertar Fone JBL Bluetooth: 9 Soluções",
    seo_description: "Seu fone JBL Bluetooth parou de funcionar ou não emparelha? Confira 9 soluções práticas para consertar falhas comuns em casa."
  },
  "como-conectar-fone-de-ouvido-jbl-no-celular": {
    seo_title: "Como Conectar Fone JBL no Celular: Passo a Passo",
    seo_description: "Tutorial direto para parear fone de ouvido JBL Bluetooth no celular Android ou iPhone em poucos segundos sem complicação."
  },
  "melhores-fones-gamer-custo-beneficio": {
    seo_title: "Melhores Headsets Gamer Custo-Benefício de 2026",
    seo_description: "Procurando headset gamer barato com bom microfone e áudio espacial imersivo? Confira a seleção dos 12 melhores modelos do ano!"
  },
  "quando-foi-inventado-o-fone-de-ouvido": {
    seo_title: "Quem Inventou o Fone de Ouvido? História Completa",
    seo_description: "Descubra quem inventou o primeiro fone de ouvido, como ele evoluiu para os modelos sem fio e fatos curiosos sobre a história do áudio."
  },
  "como-fazer-um-fone-de-ouvido": {
    seo_title: "Como Fazer um Fone Caseiro: Guia Passo a Passo",
    seo_description: "Aprenda como funciona a estrutura de um fone de ouvido e o processo para montar um modelo caseiro usando materiais simples e solda."
  },
  "melhor-fone-de-ouvido-com-microfone-bluetooth": {
    seo_title: "Melhores Fones Bluetooth com Microfone em 2026",
    seo_description: "Precisa de chamadas nítidas em reuniões e chamadas no home office? Veja os melhores fones Bluetooth com microfone claro e cancelamento."
  },
  "fone-de-ouvido-bright-e-bom": {
    seo_title: "Fone de Ouvido Bright é Bom? Análise dos Modelos",
    seo_description: "Os fones de ouvido da Bright são baratos, mas será que duram? Analisamos construção, qualidade sonora e custo-benefício da marca."
  },
  "melhor-fone-de-ouvido-gamer": {
    seo_title: "Melhores Fones Gamer em 2026: Top Headsets Baratos",
    seo_description: "Qual o melhor headset gamer para jogos competitivos? Comparamos conforto, isolamento acústico e precisão de passos para você vencer."
  },
  "faz-mal-dormir-com-fone-de-ouvido": {
    seo_title: "Dormir com Fone de Ouvido Faz Mal? Riscos e Dicas",
    seo_description: "Gosta de dormir ouvindo música ou podcasts? Entenda os riscos para a saúde auditiva e quais os cuidados para descansar com segurança."
  },
  "como-usar-o-fone-de-ouvido-dentro-da-camisa": {
    seo_title: "Como Usar Fone por Dentro da Camisa Corretamente",
    seo_description: "Evite que os fios do seu fone fiquem enroscando durante o dia a dia ou treino. Veja técnicas práticas para passar o cabo com discrição."
  },
  "como-usar-fone-de-ouvido-no-iphone": {
    seo_title: "Como Usar Fone de Ouvido no iPhone: Guia de Áudio",
    seo_description: "Aprenda a conectar, equalizar e personalizar os ajustes de áudio nos fones de ouvido no iPhone para ter a melhor experiência sonora."
  },
  "como-usar-o-microfone-do-fone-de-ouvido-no-pc": {
    seo_title: "Como Usar Microfone do Fone no PC: Guia Prático",
    seo_description: "Microfone do fone de ouvido não funciona no computador? Veja como configurar entradas de áudio e adaptadores P2/P3 no Windows."
  },
  "como-aumentar-o-som-do-fone-de-ouvido": {
    seo_title: "Como Aumentar o Volume do Fone Além do Limite",
    seo_description: "Som do fone baixo demais no celular? Descubra truques e aplicativos seguros para aumentar o volume e melhorar a potência do áudio."
  },
  "como-saber-se-o-fone-de-ouvido-bluetooth-esta-carregado": {
    seo_title: "Como Saber se o Fone Bluetooth Está Carregado",
    seo_description: "Luzes de LED apagadas ou piscando? Aprenda a identificar quando o fone de ouvido Bluetooth e o estojo estão com 100% de carga."
  },
  "como-conectar-fone-de-ouvido-bluetooth-no-pc": {
    seo_title: "Como Conectar Fone Bluetooth no PC ou Notebook",
    seo_description: "Guia simples e rápido para parear qualquer fone de ouvido Bluetooth no Windows 10 e 11 sem erros de reconhecimento ou áudio."
  },
  "fone-de-ouvido-com-fio-nao-conecta": {
    seo_title: "Fone de Ouvido com Fio Não Conecta? Como Resolver",
    seo_description: "O celular ou computador não reconhece seu fone de ouvido P2? Veja como resolver problemas de mal contato e sujeira no conector."
  },
  "como-conectar-o-fone-de-ouvido-no-celular-samsung": {
    seo_title: "Como Conectar Fone no Celular Samsung: Guia Fácil",
    seo_description: "Aprenda a parear fones Bluetooth e Galaxy Buds no celular Samsung em poucos cliques, configurando o som para máxima qualidade."
  },
  "como-usar-fone-de-ouvido-bluetooth": {
    seo_title: "Como Usar Fone Bluetooth: Funções e Cuidados",
    seo_description: "Comprou seu primeiro fone sem fio? Confira dicas de conexão, comandos de toque, autonomia de bateria e limpeza para prolongar a vida útil."
  },
  "como-consertar-fone-de-ouvido-que-so-funciona-um-lado": {
    seo_title: "Fone Só Funciona Um Lado? Aprenda Como Consertar",
    seo_description: "Apenas um lado do seu fone está tocando música? Veja soluções práticas tanto para modelos com fio quanto para fones Bluetooth TWS."
  },
  "como-colocar-fone-de-ouvido-na-orelha": {
    seo_title: "Fone Caindo da Orelha? Como Encaixar Corretamente",
    seo_description: "Fones escorregando do ouvido toda hora? Aprenda a escolher as ponteiras certas e a técnica de encaixe perfeita para não cair mais."
  },
  "melhores-fones-de-ouvido-bluetooth-baratos": {
    seo_title: "Fones Bluetooth Bons e Baratos em 2026: Top 12",
    seo_description: "Economize sem perder qualidade de áudio. Conheça os 12 melhores fones de ouvido Bluetooth baratos e com ótimo custo-benefício em 2026!"
  },
  "melhor-fone-de-ouvido-para-corrida": {
    seo_title: "Melhores Fones de Ouvido para Corrida em 2026",
    seo_description: "Corra com fixação firme e proteção contra suor. Selecionamos os melhores fones para corrida de rua e esteira em 2026. Confira!"
  },
  "como-carregar-fone-de-ouvido-bluetooth": {
    seo_title: "Como Carregar Fone Bluetooth: Dicas para a Bateria",
    seo_description: "Evite viciar a bateria dos seus fones sem fio. Saiba qual carregador usar, tempo ideal na tomada e cuidados essenciais no dia a dia."
  },
  "como-usar-fone-de-ouvido": {
    seo_title: "Como Usar Fones de Ouvido sem Prejudicar a Audição",
    seo_description: "Ouça suas músicas com segurança. Entenda a regra dos 60/60 para volume, tempo de uso e como evitar perda auditiva precoce."
  },
  "como-limpar-fone-de-ouvido": {
    seo_title: "Como Limpar Fone de Ouvido: Guia Fácil e Seguro",
    seo_description: "Aprenda a limpar e higienizar fones intra-auriculares e headphones sem danificar os componentes internos. Passo a passo descomplicado!"
  },
  "como-consertar-fone-de-ouvido": {
    seo_title: "Como Consertar Fone de Ouvido: 6 Soluções Práticas",
    seo_description: "Mal contato no conector, cabo quebrado ou som abafado? Aprenda a consertar os problemas mais frequentes em fones de ouvido em casa."
  },
  "melhor-fone-de-ouvido-com-fio": {
    seo_title: "Melhores Fones de Ouvido com Fio em 2026: Top 12",
    seo_description: "Prefere zero latência e som de alta definição sem depender de bateria? Confira os melhores fones com fio para música, jogos e estúdio."
  },
  "melhores-fones-de-ouvidos-sem-fio": {
    seo_title: "10 Melhores Fones Bluetooth para Comprar em 2026",
    seo_description: "Liberdade total sem fios. Analisamos os 10 melhores fones Bluetooth do mercado com cancelamento de ruído, som premium e bateria longa."
  },
  "como-conectar-o-fone-de-ouvido-no-celular": {
    seo_title: "Como Conectar Fone Bluetooth no Celular Fácil",
    seo_description: "Tutorial passo a passo para conectar qualquer fone de ouvido Bluetooth no smartphone Android ou iPhone sem falhas de conexão."
  },
  "melhor-headphone-sem-fio": {
    seo_title: "Melhores Headphones Bluetooth de 2026: Top 12",
    seo_description: "Conforto circumaural e graves envolventes. Conheça os 12 melhores headphones Bluetooth do ano para trabalhar, estudar e relaxar."
  },
  "headphone-ou-headset": {
    seo_title: "Headphone ou Headset: Qual a Diferença e Escolha",
    seo_description: "Não sabe se compra um headphone ou headset? Explicamos as diferenças de microfone, qualidade sonora e para quem cada um é indicado."
  },
  "melhores-fones-de-ouvido-bluetooth-over-ear": {
    seo_title: "Melhores Fones Over-Ear Bluetooth de 2026: Top 7",
    seo_description: "Almofadas que envolvem a orelha inteira para máximo isolamento e conforto. Veja os melhores fones over-ear sem fio do mercado."
  },
  "como-funciona-o-fone-de-ouvido-bluetooth": {
    seo_title: "Como Funciona o Fone Bluetooth: Guia Explicativo",
    seo_description: "Entenda como o som viaja pelo ar via ondas de rádio no Bluetooth, o papel dos codecs SBC, AAC e LDAC e como funciona o pareamento."
  },
  "fone-de-ouvido-bluetooth-mais-potente": {
    seo_title: "Fones Bluetooth Mais Potentes de 2026: Top 12",
    seo_description: "Gosta de ouvir música com volume alto e graves que vibram? Conheça os 12 fones de ouvido Bluetooth mais potentes do mercado testados."
  },
  "fone-de-ouvido-bluetooth-que-dura-mais-tempo": {
    seo_title: "Fones Bluetooth com Maior Duração de Bateria 2026",
    seo_description: "Fones que tocam até 70 horas longe da tomada. Confira o ranking dos modelos Bluetooth com as baterias mais duradouras do mercado."
  },
  "quanto-tempo-dura-um-fone-de-ouvido-bluetooth": {
    seo_title: "Quanto Tempo Dura um Fone Bluetooth? Vida Útil",
    seo_description: "Quantos anos dura a bateria de um fone Bluetooth? Saiba a vida útil média dos fones sem fio e dicas de ouro para fazê-los durar mais."
  }
};

const postsPath = 'src/data/posts.json';
const posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));

let count = 0;
let errors = [];

posts.forEach((post, i) => {
  const seo = seoData[post.slug];
  if (!seo) {
    errors.push(`Post sem SEO definido: ${post.slug}`);
    return;
  }

  if (seo.seo_title.length > 50) {
    errors.push(`Título excede 50 caracteres (${seo.seo_title.length}): "${seo.seo_title}"`);
  }
  if (seo.seo_description.length > 150) {
    errors.push(`Descrição excede 150 caracteres (${seo.seo_description.length}): "${seo.seo_description}"`);
  }

  post.seo_title = seo.seo_title;
  post.seo_description = seo.seo_description;
  count++;
});

if (errors.length > 0) {
  console.error('Erros encontrados:');
  errors.forEach(e => console.error(' -', e));
  process.exit(1);
}

fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2), 'utf8');
console.log(`✅ Sucesso! Atualizados ${count} posts em posts.json com seo_title (máx 50) e seo_description (máx 150).`);
