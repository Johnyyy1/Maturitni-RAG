import type { DueItem, Subject } from "@/lib/types";

export const student = {
  name: "Anna Králová",
  firstNameVocative: "Anno",
  initials: "AK",
  role: "Student",
  dueCards: 6,
};

export const editor = {
  name: "Petr Novák",
  initials: "PN",
  role: "Redaktor",
  workspace: "Redakční prostor",
  school: "Gymnázium Ústí",
};

export const studyPackage = { title: "Maturita 2027", label: "Studijní balíček" };

export const subjects: Subject[] = [
  { slug: "dejepis", name: "Dějepis", area: "Moderní dějiny", icon: "landmark", done: 12, total: 25, progress: 0.43, firstQuestion: 7 },
  { slug: "matematika", name: "Matematika", area: "Funkce a rovnice", icon: "radical", done: 8, total: 24, progress: 0.297, firstQuestion: 4 },
  { slug: "anglictina", name: "Angličtina", area: "Reálie", icon: "languages", done: 10, total: 20, progress: 0.447, firstQuestion: 1 },
];

export const today = {
  dateLabel: "Pátek 20. listopadu",
  greeting: "Dobré ráno",
  /** Question in progress. Title, progress and link come from the question itself. */
  continueItem: {
    subject: "matematika",
    id: "4",
    meta: "Matematika · Funkce · otázka 4",
    mobileMeta: "Matematika · otázka 4",
    badge: "Rozpracováno včera",
    mobileBadge: "Rozpracováno",
    vertex: "V = [0; 0]",
  },

};

export const dueItems: DueItem[] = [
  { title: "Kvadratické rovnice", icon: "radical", status: "wrong", statusLabel: "Posledně nesprávně", mobileStatusLabel: "Posledně nesprávně", action: "Zkusit znovu", href: "/predmety/matematika/otazky/2" },
  { title: "Nepravidelná slovesa", icon: "languages", status: "cards", statusLabel: "12 kartiček", mobileStatusLabel: "12 kartiček", action: "Projít", href: "/karticky" },
  { title: "Revoluce roku 1848", icon: "landmark", status: "wrong", statusLabel: "Posledně nesprávně", mobileStatusLabel: "Posledně nesprávně", action: "Zkusit znovu", href: "/predmety/dejepis/otazky/3" },
  { title: "Lineární funkce", icon: "book-open", status: "planned", statusLabel: "Naplánováno na dnes", mobileStatusLabel: "Naplánováno", action: "Otevřít", href: "/predmety/matematika/otazky/1" },
];

/** Minutes studied per day this week; Saturday and Sunday are still ahead. */
export const week = {
  total: "3 h 40 min",
  delta: "o 25 min víc než minule",
  days: [
    { label: "Po", minutes: 33 },
    { label: "Út", minutes: 53 },
    { label: "St", minutes: 24 },
    { label: "Čt", minutes: 65 },
    { label: "Pá", minutes: 45, today: true },
    { label: "So", minutes: 0 },
    { label: "Ne", minutes: 0 },
  ],
};

export function getSubject(slug: string) {
  return subjects.find((s) => s.slug === slug);
}
