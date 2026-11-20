import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ConceptMap } from "@/components/concept-map";
import { RouteLoading } from "@/components/loading";
import { loadQuestion } from "@/lib/load";
import { conceptMap } from "@/lib/mock/study";

type Props = PageProps<"/predmety/[predmet]/otazky/[id]/mapa">;

/** Only question dejepis/7 has a concept map in the package. */
export function generateStaticParams() {
  return [{ predmet: "dejepis", id: "7" }];
}

export const metadata: Metadata = { title: "Mapa pojmů" };

export default function MapPage(props: Props) {
  return (
    <Suspense fallback={<RouteLoading />}>
      <MapContent {...props} />
    </Suspense>
  );
}

async function MapContent({ params }: Props) {
  const { question } = await loadQuestion(params);
  if (question.subject !== "dejepis" || question.id !== "7") notFound();
  return <ConceptMap question={question} nodes={conceptMap.nodes} edges={conceptMap.edges} />;
}
