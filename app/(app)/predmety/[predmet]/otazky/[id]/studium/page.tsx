import { Suspense } from "react";
import { RouteLoading } from "@/components/loading";
import { BookX, ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import { ReportSourceButton } from "@/components/actions";
import { StudyView } from "@/components/study";
import { GlassIconButton } from "@/components/ui/buttons";
import { StateCard } from "@/components/ui/state";
import { loadQuestion, questionParams } from "@/lib/load";
import { questionHref } from "@/lib/mock/questions";

export const generateStaticParams = questionParams;

export async function generateMetadata({ params }: PageProps<"/predmety/[predmet]/otazky/[id]/studium">): Promise<Metadata> {
  const { question } = await loadQuestion(params);
  return { title: `Studium · ${question.title}` };
}

export default function StudyPage(props: PageProps<"/predmety/[predmet]/otazky/[id]/studium">) {
  return (
    <Suspense fallback={<RouteLoading />}>
      <StudyPageContent {...props} />
    </Suspense>
  );
}

async function StudyPageContent({ params }: PageProps<"/predmety/[predmet]/otazky/[id]/studium">) {
  const { question } = await loadQuestion(params);

  if (!question.detail?.sources.length) {
    return (
      <div className="mx-auto flex max-w-[620px] flex-col gap-6 px-4 pt-3 lg:pt-[22px]">
        <GlassIconButton href={questionHref(question)} icon={ChevronLeft} label="Zpět na otázku" />
        <h1 className="text-[32px] leading-[1.1] font-semibold tracking-[-0.9px]">{question.title}</h1>
        <StateCard
          role="status"
          icon={BookX}
          tone="warning"
          title="K této části nemám ověřený podklad"
          text="Tutor neodpoví, dokud nenajde zdroj v balíčku. Můžeš otevřít osnovu nebo napsat redakci."
          actions={<ReportSourceButton />}
        />
      </div>
    );
  }

  return <StudyView question={question} />;
}
