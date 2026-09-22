import Header from "@/components/dossier/Header";
import Sheet from "@/components/dossier/Sheet";
import { hasSupabase } from "@/lib/supabase/env";
import { loginAction } from "../actions";

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <Sheet>
      <Header />
      <section className="sheet-pad flex min-h-[70vh] items-center pb-24 pt-16">
        <div className="w-full max-w-md">
          <p className="meta text-mute">Private</p>
          <h1 className="mt-4 font-sans text-display text-ink">Studio</h1>
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-mute">
            Sign in to date, number, and publish dossier entries.
          </p>

          {!hasSupabase() ? (
            <p className="mt-10 text-[13px] leading-relaxed text-ink">
              Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
              <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to <code>.env.local</code>,
              run <code>supabase/migrations/001_projects.sql</code>, then create
              one Auth user. The public site already reads the seed entries
              without this.
            </p>
          ) : (
            <form action={loginAction} className="mt-12 space-y-6">
              <Field label="Email" name="email" type="email" />
              <Field label="Password" name="password" type="password" />
              {searchParams.error ? (
                <p className="text-[13px] text-ink">That sign-in did not work.</p>
              ) : null}
              <button
                type="submit"
                className="meta border-b border-ink pb-1 text-ink"
              >
                Enter
              </button>
            </form>
          )}
        </div>
      </section>
    </Sheet>
  );
}

function Field({
  label,
  name,
  type,
}: {
  label: string;
  name: string;
  type: string;
}) {
  return (
    <label className="block">
      <span className="meta text-mute">{label}</span>
      <input
        name={name}
        type={type}
        required
        className="mt-2 w-full border-b border-rule bg-transparent py-2 text-[15px] outline-none focus:border-ink"
      />
    </label>
  );
}
