import Cover from "@/components/dossier/Cover";
import DossierFrame from "@/components/dossier/DossierFrame";
import Sheet from "@/components/dossier/Sheet";
import { getPublishedProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function DossierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const projects = await getPublishedProjects();

  return (
    <Sheet>
      <DossierFrame home={<Cover projects={projects} />}>{children}</DossierFrame>
    </Sheet>
  );
}
