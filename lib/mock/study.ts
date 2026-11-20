import type { Attempt, ConceptNode, Flashcard, Quiz, Rating } from "@/lib/types";

/** Attempts per question. Attempt “2” has no evaluation yet (frame 39 state). */
export const attempts: Record<string, Attempt | null> = {
  "dejepis/7/1": {
    id: "1",
    submitted: "Odevzdáno včera · 64 slov",
    words: 64,
    summary: "Příčiny máš správně. Chybí ti rozlišit, co válku spustilo.",
    answer: {
      before: "Velmoci soupeřily o vliv a zbrojily, Evropa byla rozdělená do dvou bloků.",
      flagged: "„Hlavní příčinou války byl podle mě atentát v Sarajevu.“",
      note: "Atentát byl záminkou, ne příčinou.",
      after: "Po něm Rakousko-Uhersko vyhlásilo válku Srbsku.",
    },
    criteria: [
      { title: "Uvádí soupeření velmocí", detail: "Kolonie, trhy a vliv v Evropě.", met: true },
      { title: "Zmiňuje spojenecké bloky", detail: "Trojspolek a Dohoda.", met: true },
      {
        title: "Odlišuje příčinu od záminky",
        detail: "Atentát označuješ za hlavní příčinu.",
        mobileDetail: "Atentát byl záminkou, ne příčinou.",
        met: false,
        citation: { n: 1, label: "Studijní podklad, kap. 4", mobileLabel: "Podklad, kap. 4" },
      },
    ],
    next: "Odliš napětí před válkou od události, která spustila červencovou krizi.",
  },
  "dejepis/7/2": null,
};

export const quizzes: Quiz[] = [
  {
    id: "prvni-svetova-valka",
    title: "Dějepis · První světová válka",
    questions: [
      {
        text: "Které spojenecké bloky stály proti sobě před rokem 1914?",
        options: [
          { key: "A", text: "Trojspolek a Dohoda" },
          { key: "B", text: "NATO a Varšavská smlouva" },
          { key: "C", text: "Svatá aliance a Rýnský spolek" },
          { key: "D", text: "Malá dohoda a Osa" },
        ],
        correct: "A",
        why: "Evropa byla před válkou rozdělená do dvou bloků: Trojspolku a Dohody. Spojenecké závazky pak zatáhly do konfliktu další mocnosti.",
        citation: "Studijní podklad · Příčiny konfliktu",
      },
      {
        text: "Co bylo bezprostřední záminkou první světové války?",
        options: [
          { key: "A", text: "Soupeření mocností o kolonie" },
          { key: "B", text: "Atentát v Sarajevu" },
          { key: "C", text: "Vznik Trojspolku" },
          { key: "D", text: "Závody v námořním zbrojení" },
        ],
        correct: "B",
        why: "Atentát spustil červencovou krizi v roce 1914. Soupeření velmocí a zbrojení naproti tomu patřily k dlouhodobým příčinám války.",
        citation: "Studijní podklad · Příčiny konfliktu",
      },
      {
        text: "Kdo spáchal atentát na Františka Ferdinanda d’Este?",
        options: [
          { key: "A", text: "Gavrilo Princip" },
          { key: "B", text: "Tomáš Garrigue Masaryk" },
          { key: "C", text: "Otto von Bismarck" },
          { key: "D", text: "Vilém II." },
        ],
        correct: "A",
        why: "28. června 1914 zastřelil Gavrilo Princip následníka trůnu Františka Ferdinanda d’Este.",
        citation: "Časová osa 1900–1914",
      },
      {
        text: "Která mocnost vydala Srbsku ultimátum?",
        options: [
          { key: "A", text: "Německo" },
          { key: "B", text: "Rusko" },
          { key: "C", text: "Rakousko-Uhersko" },
          { key: "D", text: "Francie" },
        ],
        correct: "C",
        why: "Rakousko-Uhersko vydalo Srbsku ultimátum a po jeho odmítnutí vyhlásilo válku.",
        citation: "Studijní podklad · Příčiny konfliktu",
      },
      {
        text: "Co patřilo k dlouhodobým příčinám války?",
        options: [
          { key: "A", text: "Červencová krize" },
          { key: "B", text: "Soupeření velmocí o kolonie a trhy" },
          { key: "C", text: "Atentát v Sarajevu" },
          { key: "D", text: "Vyhlášení války Srbsku" },
        ],
        correct: "B",
        why: "Velmoci soupeřily o kolonie a trhy a uzavíraly spojenectví. To je dlouhodobý tlak, který válku umožnil.",
        citation: "Studijní podklad · Příčiny konfliktu",
      },
      {
        text: "Ve kterém roce začala první světová válka?",
        options: [
          { key: "A", text: "1848" },
          { key: "B", text: "1900" },
          { key: "C", text: "1914" },
          { key: "D", text: "1918" },
        ],
        correct: "C",
        why: "Po atentátu v červnu 1914 přišla červencová krize a válka.",
        citation: "Časová osa 1900–1914",
      },
      {
        text: "Jak se nazývá krize, která následovala po atentátu?",
        options: [
          { key: "A", text: "Červencová krize" },
          { key: "B", text: "Marocká krize" },
          { key: "C", text: "Balkánská krize" },
          { key: "D", text: "Hospodářská krize" },
        ],
        correct: "A",
        why: "Atentát v Sarajevu spustil červencovou krizi v roce 1914.",
        citation: "Časová osa 1900–1914",
      },
      {
        text: "Který z důsledků války patří k politickým změnám v Evropě?",
        options: [
          { key: "A", text: "Vznik Trojspolku" },
          { key: "B", text: "Rozpad monarchií" },
          { key: "C", text: "Závody ve zbrojení" },
          { key: "D", text: "Soupeření o kolonie" },
        ],
        correct: "B",
        why: "Mapa pojmů řadí rozpad monarchií mezi důsledky první světové války.",
        citation: "Mapa pojmů · Důsledky",
      },
    ],
  },
];

export const quizSetup = {
  subjects: [
    { value: "dejepis", label: "Dějepis" },
    { value: "matematika", label: "Matematika" },
    { value: "anglictina", label: "Angličtina" },
  ],
  topics: [{ value: "prvni-svetova-valka", label: "První světová válka" }],
  counts: ["5", "8", "12", "Vše"] as const,
};

export const flashcardDeck = {
  title: "Kartičky · Dějepis",
  cards: [
    {
      question: "Jaký je rozdíl mezi příčinou a záminkou války?",
      hint: "Nápověda: jedno je dlouhodobé, druhé okamžité",
      answer: "Příčina je dlouhodobý tlak, který válku umožnil. Záminka je konkrétní událost, která ji spustila.",
      detail: "V roce 1914 bylo příčinou soupeření velmocí a spojenecké bloky, záminkou atentát v Sarajevu.",
      citation: "Studijní podklad, kap. 4",
    },
    {
      question: "Které spojenecké bloky stály proti sobě před rokem 1914?",
      hint: "Nápověda: dva bloky",
      answer: "Trojspolek a Dohoda.",
      detail: "Spojenecké závazky během několika dní zatáhly do konfliktu další mocnosti.",
      citation: "Studijní podklad, kap. 4",
    },
    {
      question: "Kdy a kde byl spáchán atentát na Františka Ferdinanda d’Este?",
      hint: "Nápověda: léto 1914",
      answer: "28. června 1914 v Sarajevu.",
      detail: "Atentát spáchal Gavrilo Princip a spustil červencovou krizi.",
      citation: "Časová osa 1900–1914",
    },
    {
      question: "Co následovalo po odmítnutí ultimáta Srbskem?",
      hint: "Nápověda: Rakousko-Uhersko",
      answer: "Rakousko-Uhersko vyhlásilo Srbsku válku.",
      detail: "Spojenecké závazky pak zatáhly do konfliktu další mocnosti.",
      citation: "Studijní podklad, kap. 4",
    },
    {
      question: "O co soupeřily velmoci před rokem 1914?",
      hint: "Nápověda: mimo Evropu i v ní",
      answer: "O kolonie, trhy a vliv v Evropě.",
      detail: "Soupeření velmocí patřilo k dlouhodobým příčinám války.",
      citation: "Studijní podklad, kap. 4",
    },
    {
      question: "Co znamenala červencová krize?",
      hint: "Nápověda: z atentátu válka",
      answer: "Období po atentátu, kdy se spor Rakouska-Uherska a Srbska rozšířil na spojenecké bloky.",
      detail: "Jak se z atentátu stala válka, rozebírá krok 4 studijní osnovy.",
      citation: "Časová osa 1900–1914",
    },
  ] satisfies Flashcard[],
};

export const ratings: Rating[] = [
  { key: 1, label: "Ještě neumím", interval: "za 10 min", tone: "error" },
  { key: 2, label: "Částečně", interval: "za 1 den", tone: "warning" },
  { key: 3, label: "Umím", interval: "za 4 dny", tone: "success" },
];

/** Concept map of question dejepis/7. Coordinates are node top-left corners on the 812 × 880 canvas. */
export const conceptMap: { edges: Record<string, string>; nodes: ConceptNode[] } = {
  edges: {
    priciny: "M406 274l0 46q0 12-12 12l-232 0q-12 0-12 12l0 46",
    zaminka: "M406 274l0 116",
    dusledky: "M406 274l0 46q0 12 12 12l232 0q12 0 12 12l0 46",
    rivalita: "M150 430l0 53q0 12-12 12l-41 0q-12 0-12 12l0 53",
    bloky: "M150 430l0 53q0 12 12 12l61 0q12 0 12 12l0 53",
    atentat: "M406 430l0 130",
    monarchie: "M662 430l0 130",
  },
  nodes: [
    { id: "valka", label: "První světová válka", x: 310, y: 316, root: true },
    { id: "priciny", label: "Dlouhodobé příčiny", x: 71, y: 480, parent: "valka" },
    { id: "zaminka", label: "Záminka", x: 362, y: 480, parent: "valka" },
    { id: "dusledky", label: "Důsledky", x: 615, y: 480, parent: "valka" },
    { id: "rivalita", label: "Rivalita mocností", x: 13, y: 650, parent: "priciny" },
    { id: "bloky", label: "Spojenecké bloky", x: 161, y: 650, parent: "priciny" },
    {
      id: "atentat",
      label: "Atentát v Sarajevu",
      x: 320,
      y: 650,
      parent: "zaminka",
      detail: {
        kind: "Záminka",
        text: "28. června 1914 zastřelil Gavrilo Princip následníka trůnu Františka Ferdinanda d’Este. Atentát spustil červencovou krizi a stal se bezprostřední záminkou války.",
        citation: "Studijní podklad, kap. 4",
        related: ["Červencová krize", "Rakousko-Uhersko a Srbsko"],
      },
    },
    { id: "monarchie", label: "Rozpad monarchií", x: 587, y: 650, parent: "dusledky" },
  ],
};
