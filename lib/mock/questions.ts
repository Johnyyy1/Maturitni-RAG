import type { Question, Source } from "@/lib/types";

export const ww1Sources: Source[] = [
  {
    n: 1,
    title: "Studijní podklad",
    chip: "Studijní podklad, kap. 4",
    meta: "Kapitola 4 · Příčiny konfliktu · s. 42",
    listMeta: "Kapitola 4 · s. 42",
    icon: "book-open",
    before:
      "Napětí v Evropě narůstalo už před rokem 1914. Velmoci soupeřily o kolonie a trhy a uzavíraly spojenectví, která měla zaručit bezpečnost.",
    passage:
      "Soupeření velmocí o vliv a jejich spojenecké závazky patřily k dlouhodobým příčinám války. Atentát v Sarajevu se stal bezprostřední záminkou.",
    after:
      "Rakousko-Uhersko vydalo Srbsku ultimátum a po jeho odmítnutí vyhlásilo válku. Spojenecké závazky pak během několika dní zatáhly do konfliktu další mocnosti.",
  },
  {
    n: 2,
    title: "Časová osa 1900–1914",
    chip: "Časová osa 1900–1914",
    meta: "Přehled událostí",
    listMeta: "Přehled událostí",
    icon: "calendar-range",
    before: "Přehled událostí, které vedly k první světové válce.",
    passage: "28. června 1914 zastřelil Gavrilo Princip následníka trůnu Františka Ferdinanda d’Este. Atentát spustil červencovou krizi.",
    after: "Během července 1914 se krize rozšířila na spojenecké bloky.",
  },
];

/** One prompt per question: the question page and the exam show the same task. */
const prompts = {
  quadraticFunction: "Popiš vlastnosti kvadratické funkce, urči vrchol její paraboly a vysvětli, jak koeficient a ovlivňuje tvar grafu.",
  quadraticEquation: "Urči větší z kořenů rovnice x² − 5x + 6 = 0.",
  linearFunction: "Popiš lineární funkci, vysvětli význam koeficientů k a q a urči, kdy je funkce rostoucí.",
  revolution1848: "Vysvětli příčiny revolucí roku 1848 v Evropě a popiš jejich průběh a výsledky v habsburské monarchii.",
  unitedKingdom: "Talk about the United Kingdom: its countries and capital cities, its political system and one tradition you find interesting.",
};

const quadraticSources: Source[] = [
  {
    n: 1,
    title: "Studijní podklad",
    chip: "Studijní podklad, kap. 2",
    meta: "Kapitola 2 · Kvadratická funkce · s. 18",
    listMeta: "Kapitola 2 · s. 18",
    icon: "book-open",
    before: "Kvadratická funkce je dána předpisem f(x) = ax² + bx + c, kde a ≠ 0. Jejím grafem je parabola.",
    passage:
      "Vrchol paraboly má souřadnice V = [−b/2a; f(−b/2a)]. Je-li a > 0, parabola je otevřená nahoru a funkce má ve vrcholu minimum. Je-li a < 0, je otevřená dolů a má ve vrcholu maximum.",
    after: "Čím větší je absolutní hodnota koeficientu a, tím je parabola užší.",
  },
  {
    n: 2,
    title: "Řešené příklady",
    chip: "Řešené příklady, př. 3",
    meta: "Sbírka úloh · příklad 3",
    listMeta: "Sbírka úloh · př. 3",
    icon: "radical",
    before: "Příklad 3: Urči vrchol a průsečíky s osami funkce f(x) = x² − 4x + 3.",
    passage:
      "Doplněním na čtverec dostaneme f(x) = (x − 2)² − 1, takže vrchol je V = [2; −1]. Diskriminant D = 16 − 12 = 4 je kladný, parabola proto protíná osu x ve dvou bodech: x = 1 a x = 3.",
    after: "Průsečík s osou y je bod [0; 3].",
  },
];

export const questions: Question[] = [
  {
    subject: "dejepis",
    id: "7",
    title: "Příčiny první světové války",
    trail: ["Dějepis", "Moderní dějiny"],
    context: "Moderní dějiny · ústní okruh 7",
    exam: {
      type: "text",
      title: "Příčiny první světové války",
      label: "Dějepis · ústní okruh 7",
      prompt: "Vysvětli dlouhodobé příčiny první světové války a odliš je od bezprostřední záminky.",
    },
    detail: {
      tags: ["Ústní okruh", "Publikovaný balíček · verze 2"],
      prompt: "Vysvětli dlouhodobé příčiny první světové války a odliš je od bezprostřední záminky.",
      duration: "Asi 10 minut ústně",
      outline: [
        { title: "Evropa před rokem 1914", question: "Jaké velmoci soupeřily a o co?", state: "done" },
        { title: "Spojenectví a zbrojení", question: "Proč vznikly dva bloky a co znamenaly?", state: "current" },
        { title: "Nacionalismus na Balkáně", question: "Jaké napětí panovalo v regionu?", state: "todo" },
        { title: "Sarajevo a červencová krize", question: "Jak se z atentátu stala válka?", state: "todo" },
      ],
      sources: ww1Sources,
      lastAttempt: {
        when: "Včera",
        status: "Potřeba opakovat",
        note: "Chybělo rozlišení mezi příčinou a záminkou.",
        attempt: "1",
      },
      tutor: {
        thread: [
          { role: "student", text: "Jaký je rozdíl mezi příčinou války a její záminkou?" },
          {
            role: "tutor",
            text:
              "Příčina je dlouhodobý tlak, který válku umožnil: soupeření velmocí o kolonie a vliv, závody ve zbrojení a pevné spojenecké bloky.\n\n" +
              "Záminka je konkrétní událost, která konflikt spustila. Tou byl atentát na Františka Ferdinanda v Sarajevu 28. června 1914, po kterém přišla červencová krize.",
            citations: [1, 2],
          },
        ],
        answers: {
          "Shrň to do tří bodů":
            "1. Velmoci soupeřily o kolonie, trhy a vliv [1].\n2. Evropa se rozdělila do dvou spojeneckých bloků a zbrojila [1].\n3. Záminkou byl atentát v Sarajevu 28. června 1914 [2].",
          "Co byla červencová krize?":
            "Červencová krize přišla po atentátu v Sarajevu [2]. Rakousko-Uhersko vydalo Srbsku ultimátum a po jeho odmítnutí vyhlásilo válku. Spojenecké závazky pak během několika dní zatáhly do konfliktu další mocnosti [1].",
          "Vyzkoušej mě":
            "Dobře. Co bylo bezprostřední záminkou první světové války a proč to nebyla její příčina? Odpověz vlastními slovy [1].",
        },
        fallback:
          "Podle podkladu patřilo soupeření velmocí o vliv a jejich spojenecké závazky k dlouhodobým příčinám války [1]. Atentát v Sarajevu se stal bezprostřední záminkou [2].",
      },
      map: true,
    },
  },
  {
    subject: "matematika",
    id: "4",
    title: "Kvadratická funkce",
    trail: ["Matematika", "Funkce"],
    context: "Funkce · otázka 4",
    exam: { type: "text", title: "Kvadratická funkce", label: "Matematika · otázka 4", prompt: prompts.quadraticFunction },
    detail: {
      tags: ["Ústní otázka", "Publikovaný balíček · verze 2"],
      prompt: prompts.quadraticFunction,
      duration: "Asi 15 minut ústně",
      outline: [
        { title: "Předpis a definiční obor", question: "Jak vypadá předpis f(x) = ax² + bx + c?", state: "done" },
        { title: "Graf jako parabola", question: "Kdy je parabola otevřená nahoru a kdy dolů?", state: "done" },
        { title: "Vrchol paraboly", question: "Jak najdeš souřadnice vrcholu?", state: "done" },
        { title: "Průsečíky s osami", question: "Jak souvisí diskriminant s počtem nulových bodů?", state: "current" },
        { title: "Monotonie a extrémy", question: "Kde funkce roste, klesá a kde má minimum?", state: "todo" },
      ],
      sources: quadraticSources,
      tutor: {
        thread: [
          { role: "student", text: "Jak najdu vrchol paraboly?" },
          {
            role: "tutor",
            text:
              "Vrchol leží na ose souměrnosti paraboly. První souřadnici spočítáš jako x = −b/2a, druhou dosazením do předpisu [1].\n\n" +
              "Například u f(x) = x² − 4x + 3 vyjde x = 2 a f(2) = −1, takže vrchol je V = [2; −1] [2].",
            citations: [1, 2],
          },
        ],
        answers: {
          "Shrň to do tří bodů":
            "1. Grafem kvadratické funkce je parabola [1].\n2. Znaménko koeficientu a určuje, zda je otevřená nahoru, nebo dolů [1].\n3. Vrchol najdeš jako x = −b/2a nebo doplněním na čtverec [2].",
          "Co říká diskriminant?":
            "Diskriminant D = b² − 4ac určuje počet průsečíků paraboly s osou x: pro D > 0 dva, pro D = 0 jeden a pro D < 0 žádný [2]. U f(x) = x² − 4x + 3 je D = 4, funkce má proto dva nulové body [2].",
          "Vyzkoušej mě": "Dobře. Urči vrchol paraboly f(x) = x² + 2x − 3 a řekni, jestli má funkce ve vrcholu minimum, nebo maximum [1].",
        },
        fallback:
          "Podle podkladu je grafem kvadratické funkce parabola s vrcholem V = [−b/2a; f(−b/2a)] [1]. Znaménko koeficientu a určuje, zda má funkce ve vrcholu minimum, nebo maximum [1].",
      },
    },
  },
  {
    subject: "matematika",
    id: "2",
    title: "Kvadratické rovnice",
    trail: ["Matematika", "Funkce a rovnice"],
    context: "Funkce a rovnice · otázka 2",
    exam: { type: "number", label: "Matematika · otázka 2", title: "Kvadratické rovnice", prompt: prompts.quadraticEquation, key: { value: 3 } },
    detail: {
      tags: ["Písemná úloha", "Publikovaný balíček · verze 2"],
      prompt: prompts.quadraticEquation,
      duration: "Asi 5 minut písemně",
      outline: [
        { title: "Tvar kvadratické rovnice", question: "Jak poznáš kvadratickou rovnici a její koeficienty?", state: "done" },
        { title: "Diskriminant", question: "Kolik řešení rovnice má?", state: "current" },
        { title: "Vzorec pro kořeny", question: "Jak z diskriminantu spočítáš kořeny?", state: "todo" },
        { title: "Vietovy vzorce", question: "Jak ověříš kořeny bez dosazení?", state: "todo" },
      ],
      sources: [
        {
          n: 1,
          title: "Studijní podklad",
          chip: "Studijní podklad, kap. 3",
          meta: "Kapitola 3 · Kvadratické rovnice · s. 24",
          listMeta: "Kapitola 3 · s. 24",
          icon: "book-open",
          before: "Kvadratická rovnice má tvar ax² + bx + c = 0, kde a ≠ 0.",
          passage:
            "Diskriminant D = b² − 4ac určuje počet řešení. Pro D > 0 má rovnice dva kořeny x₁,₂ = (−b ± √D) / 2a, pro D = 0 jeden dvojnásobný kořen a pro D < 0 nemá v reálných číslech řešení.",
          after: "Pro kořeny platí Vietovy vzorce: x₁ + x₂ = −b/a a x₁ · x₂ = c/a.",
        },
        {
          n: 2,
          title: "Řešené příklady",
          chip: "Řešené příklady, př. 5",
          meta: "Sbírka úloh · příklad 5",
          listMeta: "Sbírka úloh · př. 5",
          icon: "radical",
          before: "Příklad 5: Vyřeš rovnici x² − 7x + 10 = 0.",
          passage: "D = 49 − 40 = 9, takže x₁,₂ = (7 ± 3) / 2. Kořeny jsou x₁ = 5 a x₂ = 2.",
          after: "Zkouška: 5 + 2 = 7 a 5 · 2 = 10, což odpovídá Vietovým vzorcům.",
        },
      ],
      tutor: {
        thread: [
          { role: "student", text: "Kdy má kvadratická rovnice dva kořeny?" },
          {
            role: "tutor",
            text:
              "Rozhoduje diskriminant D = b² − 4ac. Když je kladný, má rovnice dva různé reálné kořeny [1].\n\n" +
              "Například u x² − 7x + 10 = 0 vyjde D = 9, kořeny jsou proto dva: 5 a 2 [2].",
            citations: [1, 2],
          },
        ],
        answers: {
          "Shrň to do tří bodů":
            "1. Kvadratická rovnice má tvar ax² + bx + c = 0, kde a ≠ 0 [1].\n2. Počet řešení určuje diskriminant D = b² − 4ac [1].\n3. Kořeny ověříš Vietovými vzorci [2].",
          "Jak ověřím kořeny?": "Použij Vietovy vzorce: součet kořenů je −b/a a jejich součin c/a [1]. U x² − 7x + 10 = 0 platí 5 + 2 = 7 a 5 · 2 = 10 [2].",
          "Vyzkoušej mě": "Dobře. Kolik kořenů má rovnice x² + 4x + 4 = 0 a proč [1]?",
        },
        fallback:
          "Podle podkladu rozhoduje o počtu řešení kvadratické rovnice diskriminant D = b² − 4ac [1]. Kořeny pak spočítáš vzorcem x₁,₂ = (−b ± √D) / 2a [1].",
      },
    },
  },
  {
    subject: "matematika",
    id: "1",
    title: "Lineární funkce",
    trail: ["Matematika", "Funkce"],
    context: "Funkce · otázka 1",
    exam: { type: "text", title: "Lineární funkce", label: "Matematika · otázka 1", prompt: prompts.linearFunction },
    detail: {
      tags: ["Ústní otázka", "Publikovaný balíček · verze 2"],
      prompt: prompts.linearFunction,
      duration: "Asi 10 minut ústně",
      outline: [
        { title: "Předpis a graf", question: "Proč je grafem lineární funkce přímka?", state: "current" },
        { title: "Směrnice k", question: "Jak k ovlivňuje sklon a monotonii?", state: "todo" },
        { title: "Absolutní člen q", question: "Kde graf protíná osu y?", state: "todo" },
        { title: "Konstantní funkce", question: "Co se stane, když k = 0?", state: "todo" },
      ],
      sources: [
        {
          n: 1,
          title: "Studijní podklad",
          chip: "Studijní podklad, kap. 1",
          meta: "Kapitola 1 · Lineární funkce · s. 8",
          listMeta: "Kapitola 1 · s. 8",
          icon: "book-open",
          before: "Lineární funkce je dána předpisem f(x) = kx + q, kde k a q jsou reálná čísla.",
          passage:
            "Grafem lineární funkce je přímka. Pro k > 0 je funkce rostoucí, pro k < 0 klesající a pro k = 0 konstantní. Číslo q udává průsečík grafu s osou y v bodě [0; q].",
          after: "Čím větší je absolutní hodnota k, tím je přímka strmější.",
        },
        {
          n: 2,
          title: "Řešené příklady",
          chip: "Řešené příklady, př. 1",
          meta: "Sbírka úloh · příklad 1",
          listMeta: "Sbírka úloh · př. 1",
          icon: "radical",
          before: "Příklad 1: Načrtni graf funkce f(x) = 2x − 1.",
          passage: "Průsečík s osou y je [0; −1]. Protože k = 2 > 0, funkce roste: zvětší-li se x o 1, hodnota funkce se zvětší o 2.",
          after: "Průsečík s osou x je bod [½; 0].",
        },
      ],
      tutor: {
        thread: [
          { role: "student", text: "Co znamená k v předpisu lineární funkce?" },
          {
            role: "tutor",
            text:
              "Koeficient k je směrnice. Určuje, jak strmá přímka je a jestli funkce roste, nebo klesá [1].\n\n" +
              "U f(x) = 2x − 1 je k = 2, takže se hodnota funkce při posunu x o 1 zvětší o 2 [2].",
            citations: [1, 2],
          },
        ],
        answers: {
          "Shrň to do tří bodů":
            "1. Grafem lineární funkce f(x) = kx + q je přímka [1].\n2. Pro k > 0 funkce roste, pro k < 0 klesá [1].\n3. Číslo q udává průsečík s osou y [2].",
          "Co je konstantní funkce?": "Když je k = 0, předpis se zjednoduší na f(x) = q. Grafem je přímka rovnoběžná s osou x a funkce neroste ani neklesá [1].",
          "Vyzkoušej mě": "Dobře. Je funkce f(x) = −3x + 2 rostoucí, nebo klesající? A kde protíná osu y [1]?",
        },
        fallback: "Podle podkladu je grafem lineární funkce přímka. Koeficient k určuje její sklon a číslo q průsečík s osou y [1].",
      },
    },
  },
  {
    subject: "dejepis",
    id: "3",
    title: "Revoluce roku 1848",
    trail: ["Dějepis", "Moderní dějiny"],
    context: "Moderní dějiny · ústní okruh 3",
    exam: { type: "text", title: "Revoluce roku 1848", label: "Dějepis · ústní okruh 3", prompt: prompts.revolution1848 },
    detail: {
      tags: ["Ústní okruh", "Publikovaný balíček · verze 2"],
      prompt: prompts.revolution1848,
      duration: "Asi 10 minut ústně",
      outline: [
        { title: "Evropa po Vídeňském kongresu", question: "Proč byla společnost nespokojená?", state: "done" },
        { title: "Březen 1848 ve Vídni a v Praze", question: "Jaké požadavky lidé vznesli?", state: "current" },
        { title: "Slovanský sjezd a červnové bouře", question: "Jak se revoluce v Praze vyhrotila?", state: "todo" },
        { title: "Porážka revoluce", question: "Které změny přetrvaly?", state: "todo" },
      ],
      sources: [
        {
          n: 1,
          title: "Studijní podklad",
          chip: "Studijní podklad, kap. 2",
          meta: "Kapitola 2 · Revoluční rok 1848 · s. 21",
          listMeta: "Kapitola 2 · s. 21",
          icon: "book-open",
          before: "Po Vídeňském kongresu panoval v Evropě konzervativní pořádek, který potlačoval liberální a národní hnutí.",
          passage:
            "V roce 1848 vypukly revoluce v řadě evropských zemí. V habsburské monarchii lidé žádali ústavu, občanské svobody a zrušení poddanství. Poddanství bylo zrušeno v září 1848 a tato změna revoluci přetrvala.",
          after: "Revoluce byla v letech 1848–1849 potlačena a nastolen neoabsolutismus.",
        },
        {
          n: 2,
          title: "Časová osa 1848–1849",
          chip: "Časová osa 1848–1849",
          meta: "Přehled událostí",
          listMeta: "Přehled událostí",
          icon: "calendar-range",
          before: "Přehled hlavních událostí revolučního roku.",
          passage:
            "V březnu 1848 propukla revoluce ve Vídni. V červnu se v Praze sešel Slovanský sjezd a po něm vypukly červnové bouře, které vojsko generála Windischgrätze potlačilo.",
          after: "V březnu 1849 byl rozpuštěn Kroměřížský sněm.",
        },
      ],
      tutor: {
        thread: [
          { role: "student", text: "Co bylo nejdůležitějším výsledkem revoluce u nás?" },
          {
            role: "tutor",
            text:
              "Nejtrvalejší změnou bylo zrušení poddanství v září 1848. Většina ostatních požadavků po porážce revoluce zanikla [1].\n\n" +
              "Revoluce v Praze skončila po červnových bouřích, které vojsko potlačilo [2].",
            citations: [1, 2],
          },
        ],
        answers: {
          "Shrň to do tří bodů":
            "1. Lidé žádali ústavu, občanské svobody a zrušení poddanství [1].\n2. V Praze se revoluce vyhrotila v červnových bouřích [2].\n3. Revoluce byla potlačena, zrušení poddanství ale přetrvalo [1].",
          "Co byly červnové bouře?": "Červnové bouře bylo povstání v Praze v červnu 1848, které následovalo po Slovanském sjezdu. Vojsko generála Windischgrätze ho potlačilo [2].",
          "Vyzkoušej mě": "Dobře. Která změna z roku 1848 přetrvala i po porážce revoluce a proč byla důležitá [1]?",
        },
        fallback: "Podle podkladu přinesla revoluce roku 1848 v habsburské monarchii hlavně zrušení poddanství, které přetrvalo i po jejím potlačení [1].",
      },
    },
  },
  {
    subject: "anglictina",
    id: "1",
    title: "The United Kingdom",
    trail: ["Angličtina", "Reálie"],
    context: "Reálie · okruh 1",
    exam: { type: "text", title: "The United Kingdom", label: "Angličtina · okruh 1", prompt: prompts.unitedKingdom },
    detail: {
      tags: ["Ústní okruh", "Publikovaný balíček · verze 2"],
      prompt: prompts.unitedKingdom,
      duration: "Asi 10 minut ústně",
      outline: [
        { title: "Countries and capitals", question: "Which four countries form the UK?", state: "done" },
        { title: "Political system", question: "Who is the head of state and who governs?", state: "current" },
        { title: "Traditions", question: "Which tradition would you describe?", state: "todo" },
        { title: "Your opinion", question: "What would you like to visit and why?", state: "todo" },
      ],
      sources: [
        {
          n: 1,
          title: "Studijní podklad",
          chip: "Studijní podklad, unit 1",
          meta: "Unit 1 · The United Kingdom · p. 6",
          listMeta: "Unit 1 · p. 6",
          icon: "languages",
          before: "The United Kingdom of Great Britain and Northern Ireland lies off the north-west coast of Europe.",
          passage:
            "The UK consists of four countries: England, Scotland, Wales and Northern Ireland. Their capitals are London, Edinburgh, Cardiff and Belfast. The UK is a constitutional monarchy: the King is the head of state and the Prime Minister leads the government.",
          after: "Parliament has two chambers, the House of Commons and the House of Lords.",
        },
        {
          n: 2,
          title: "Svátky a tradice",
          chip: "Svátky a tradice",
          meta: "Reálie · přehled tradic",
          listMeta: "Přehled tradic",
          icon: "calendar-range",
          before: "Many British traditions are connected with the calendar year.",
          passage: "On 5 November people celebrate Bonfire Night with fireworks and bonfires. It recalls the failed Gunpowder Plot of 1605.",
          after: "Other well-known traditions include Burns Night in Scotland and St David’s Day in Wales.",
        },
      ],
      tutor: {
        thread: [
          { role: "student", text: "Které země tvoří Spojené království?" },
          {
            role: "tutor",
            text:
              "Spojené království tvoří čtyři země: England, Scotland, Wales a Northern Ireland. Jejich hlavní města jsou London, Edinburgh, Cardiff a Belfast [1].\n\n" +
              "K ústní odpovědi se hodí přidat i jednu tradici, třeba Bonfire Night 5. listopadu [2].",
            citations: [1, 2],
          },
        ],
        answers: {
          "Shrň to do tří bodů":
            "1. The UK consists of England, Scotland, Wales and Northern Ireland [1].\n2. It is a constitutional monarchy with the King as head of state [1].\n3. A well-known tradition is Bonfire Night on 5 November [2].",
          "Jak mluvit o politickém systému?": "Můžeš říct: The UK is a constitutional monarchy. The King is the head of state and the Prime Minister leads the government. Parliament has two chambers [1].",
          "Vyzkoušej mě": "Dobře. In English, please: What are the four countries of the UK and their capitals [1]?",
        },
        fallback: "Podle podkladu tvoří Spojené království čtyři země a jde o konstituční monarchii, v jejímž čele stojí král [1].",
      },
    },
  },
];

export function questionHref(q: Pick<Question, "subject" | "id">, view = "") {
  return `/predmety/${q.subject}/otazky/${q.id}${view ? `/${view}` : ""}`;
}

/** Questions that can be tried in the exam view: they have a prompt to answer. */
export const examQuestions = questions.filter((q) => q.exam.prompt);
