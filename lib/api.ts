/**
 * RAG backend interface. Everything here is a stub over lib/mock; swap the bodies for real
 * fetch calls without changing the signatures.
 */
import { attempts } from "@/lib/mock/study";
import { imports, packages } from "@/lib/mock/catalog";
import { questions } from "@/lib/mock/questions";
import type { Attempt, ImportJob, Package, Question } from "@/lib/types";

export class TutorUnavailableError extends Error {
  constructor() {
    super("Tutor teď neodpovídá");
    this.name = "TutorUnavailableError";
  }
}

export class NoVerifiedSourceError extends Error {
  constructor() {
    super("K této části nemám ověřený podklad");
    this.name = "NoVerifiedSourceError";
  }
}

export async function getQuestion(subject: string, id: string): Promise<Question | undefined> {
  return questions.find((q) => q.subject === subject && q.id === id);
}

/** `null` means the attempt exists but the AI evaluation is not available yet. */
export async function getAttempt(subject: string, id: string, attempt: string): Promise<Attempt | null | undefined> {
  return attempts[`${subject}/${id}/${attempt}`];
}

export async function submitAttempt(subject: string, id: string, answer: string): Promise<{ attempt: string }> {
  void subject;
  void id;
  void answer;
  return { attempt: "1" };
}

export async function getImport(id: string): Promise<ImportJob | undefined> {
  return imports.find((i) => i.id === id);
}

export type PackageFilter = "vse" | "maturita" | "odborne";

export function searchPackages(query: string, filter: PackageFilter): Package[] {
  // Texts carry non-breaking spaces (Czech typography); compare on plain spaces.
  const norm = (t: string) => t.replace(/\s+/g, " ").toLocaleLowerCase("cs");
  const q = norm(query.trim());
  return packages.filter(
    (p) => (filter === "vse" || p.category === filter) && (!q || [p.title, p.description, ...p.subjects].some((t) => norm(t).includes(q))),
  );
}

/**
 * Streams a tutor answer token by token. Citations are inline markers `[n]` that refer to the
 * question's sources. Add `?simulace=tutor-nedostupny` to the URL to simulate an outage.
 */
export async function* askTutor(question: Question, text: string, signal?: AbortSignal): AsyncGenerator<string> {
  if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("simulace") === "tutor-nedostupny") {
    await wait(500, signal);
    throw new TutorUnavailableError();
  }
  const tutor = question.detail?.tutor;
  if (!tutor || !question.detail?.sources.length) throw new NoVerifiedSourceError();

  const answer = tutor.answers[text.trim()] ?? tutor.fallback;
  await wait(450, signal);
  for (const token of answer.match(/\S+\s*/g) ?? []) {
    await wait(28, signal);
    yield token;
  }
}

function wait(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) return reject(signal.reason);
    const t = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(t);
      reject(signal.reason);
    }, { once: true });
  });
}
