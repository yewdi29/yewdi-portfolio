import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectArticle from "@/components/dossier/ProjectArticle";
import ProjectOverlay from "@/components/dossier/ProjectOverlay";
import { loadVisibleProject } from "@/lib/projects";

export const dynamic = "force-dynamic";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await loadVisibleProject(params.slug);
  if (!project) return { title: "Work" };
  return {
    title: project.title,
    description: project.summary ?? project.subtitle ?? undefined,
  };
}

export default async function WorkPage({ params }: Props) {
  const project = await loadVisibleProject(params.slug);
  if (!project) notFound();

  return (
    <ProjectOverlay slug={project.slug}>
      <ProjectArticle project={project} rise={false} />
    </ProjectOverlay>
  );
}
