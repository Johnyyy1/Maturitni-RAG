import { Suspense } from "react";
import { ModeHeader } from "@/components/shell/app-shell";
import { loadQuestion } from "@/lib/load";
import { questionHref } from "@/lib/mock/questions";

type Props = LayoutProps<"/predmety/[predmet]/otazky/[id]">;

/** Studovat and Mapa share one mobile header: it stays mounted while switching, so the control never moves. */
export default function ModeLayout({ children, params }: Props) {
  return (
    <>
      <Suspense fallback={<div className="mx-4 mt-3 h-11 lg:hidden" />}>
        <Header params={params} />
      </Suspense>
      {children}
    </>
  );
}

async function Header({ params }: Pick<Props, "params">) {
  const { question: q } = await loadQuestion(params);
  return (
    <ModeHeader
      back={questionHref(q)}
      items={[
        { label: "Studovat", value: "studium", href: questionHref(q, "studium") },
        ...(q.detail?.map ? [{ label: "Mapa", value: "mapa", href: questionHref(q, "mapa") }] : []),
        ...(q.exam.prompt ? [{ label: "Vyzkoušet se", value: "zkouska", href: questionHref(q, "zkouska") }] : []),
      ]}
    />
  );
}
