/** Icon keys map to lucide-react components in components/icon.tsx (data stays serializable). */
export type IconName =
  | "landmark"
  | "radical"
  | "languages"
  | "book-open"
  | "calendar-range"
  | "atom"
  | "dna"
  | "school"
  | "lock-open";

export type SubjectSlug = "dejepis" | "matematika" | "anglictina";

export interface Subject {
  slug: SubjectSlug;
  name: string;
  area: string;
  icon: IconName;
  done: number;
  total: number;
  /** Fill of the progress track, 0–1. */
  progress: number;
  /** Question opened from the sidebar. */
  firstQuestion: number;
}

export interface Source {
  n: number;
  title: string;
  /** Label in a citation chip. */
  chip: string;
  meta: string;
  icon: IconName;
  /** Short line in the “Zdroje k otázce” list. */
  listMeta: string;
  before: string;
  passage: string;
  after: string;
}

export type StepState = "done" | "current" | "todo";

export interface OutlineStep {
  title: string;
  question: string;
  state: StepState;
}

export interface ExamText {
  type: "text";
  title: string;
  prompt: string;
  label: string;
}

export interface ExamNumber {
  type: "number";
  label: string;
  title: string;
  prompt: string;
  /** Unit choices; omitted when the answer is a plain number. */
  units?: string[];
  /** Answer key: closed tasks are evaluated against it, not by AI. */
  key: { value: number; unit?: string };
}

export type ExamTask = ExamText | ExamNumber;

export interface QuestionDetail {
  tags: string[];
  prompt: string;
  duration: string;
  outline: OutlineStep[];
  sources: Source[];
  lastAttempt?: { when: string; status: string; note: string; attempt: string };
  /** Opening thread of the study chat and canned answers keyed by suggestion (mock tutor). */
  tutor: { thread: TutorMessage[]; answers: Record<string, string>; fallback: string };
  /** The package has a concept map for this question. */
  map?: boolean;
}

export interface Question {
  subject: SubjectSlug;
  id: string;
  title: string;
  /** Breadcrumb trail, e.g. ["Dějepis", "Moderní dějiny"]. */
  trail: string[];
  /** Context line above the title in the study view. */
  context: string;
  exam: ExamTask;
  /** Missing when the package has no verified study material yet. */
  detail?: QuestionDetail;
}

export type DueStatus = "wrong" | "cards" | "planned";

export interface DueItem {
  title: string;
  icon: IconName;
  status: DueStatus;
  statusLabel: string;
  mobileStatusLabel: string;
  action: string;
  href: string;
}

export interface Criterion {
  title: string;
  detail: string;
  /** Shorter note on mobile (frame 38). */
  mobileDetail?: string;
  met: boolean;
  citation?: { n: number; label: string; mobileLabel: string };
}

export interface Attempt {
  id: string;
  submitted: string;
  words: number;
  summary: string;
  answer: { before: string; flagged: string; note: string; after: string };
  criteria: Criterion[];
  next: string;
}

export interface QuizOption {
  key: "A" | "B" | "C" | "D";
  text: string;
}

export interface QuizQuestion {
  text: string;
  options: QuizOption[];
  correct: QuizOption["key"];
  why: string;
  citation: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

export interface Flashcard {
  question: string;
  hint: string;
  answer: string;
  detail: string;
  citation: string;
}

export interface Rating {
  key: 1 | 2 | 3;
  label: string;
  interval: string;
  tone: "error" | "warning" | "success";
}

export interface ConceptNode {
  id: string;
  label: string;
  x: number;
  y: number;
  root?: boolean;
  parent?: string;
  detail?: {
    kind: string;
    text: string;
    citation: string;
    related?: string[];
  };
}

export interface Package {
  id: string;
  title: string;
  description: string;
  access: "open" | "school";
  questions: number;
  subjects: string[];
  category: "maturita" | "odborne";
  status: string;
  added: boolean;
  /** Cover mesh colors (hero-d, hero-a, hero-b, hero-c); default is the blue hero. */
  cover?: [string, string, string, string];
}

export interface UpcomingPackage {
  title: string;
  kind: string;
  icon: IconName;
}

export interface ImportRow {
  title: string;
  subject: string;
  change: "new" | "update";
  error?: string;
  version: string;
}

export interface ImportJob {
  id: string;
  file: string;
  pkg: string;
  newCount: number;
  updatedCount: number;
  rows: ImportRow[];
}

export interface TutorMessage {
  role: "student" | "tutor";
  text: string;
  /** Source numbers cited by a tutor answer. */
  citations?: number[];
}
