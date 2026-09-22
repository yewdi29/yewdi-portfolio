import Link from "next/link";
import Header from "@/components/dossier/Header";
import Sheet from "@/components/dossier/Sheet";
import { formatMonthYear, padNumber } from "@/lib/format";
import { getAllProjects } from "@/lib/projects";
import { hasSupabase } from "@/lib/supabase/env";
import { deleteProjectAction, logoutAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const projects = await getAllProjects();

  return (
    <Sheet>
      <Header />
      <section className="sheet-pad pb-24 pt-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="meta text-mute">Private</p>
            <h1 className="mt-3 font-sans text-display text-ink">Entries</h1>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/admin/new" className="meta text-ink">
              New
            </Link>
            {hasSupabase() ? (
              <form action={logoutAction}>
                <button className="meta text-mute">Leave</button>
              </form>
            ) : null}
          </div>
        </div>

        {!hasSupabase() ? (
          <p className="mt-10 max-w-lg text-[13px] leading-relaxed text-mute">
            Showing seed entries. Connect Supabase to add, edit, and publish
            from this sheet.
          </p>
        ) : null}

        <ul className="mt-16 border-t border-rule">
          {projects.map((project) => (
            <li
              key={project.id}
              className="grid grid-cols-1 items-baseline gap-2 border-b border-rule py-5 sm:grid-cols-[3rem_7rem_1fr_auto] sm:gap-6"
            >
              <span className="meta tabular text-ink">
                {padNumber(project.number)}
              </span>
              <span className="meta tabular text-mute">
                {formatMonthYear(project.occurred_on)}
              </span>
              <div>
                <p className="text-[1.1rem] tracking-[-0.02em]">{project.title}</p>
                <p className="meta mt-1 text-mute">
                  {project.published ? "Published" : "Draft"}
                </p>
              </div>
              <div className="flex gap-4">
                <Link href={`/work/${project.slug}`} className="meta text-mute">
                  View
                </Link>
                {hasSupabase() && !project.id.startsWith("seed-") ? (
                  <>
                    <Link href={`/admin/${project.id}`} className="meta text-ink">
                      Edit
                    </Link>
                    <form action={deleteProjectAction}>
                      <input type="hidden" name="id" value={project.id} />
                      <button className="meta text-mute">Remove</button>
                    </form>
                  </>
                ) : (
                  <span className="meta text-mute">Seed</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </Sheet>
  );
}
