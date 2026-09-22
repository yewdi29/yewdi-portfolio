import { resume, type ResumeRole } from "@/lib/resume";
import Rise from "./Rise";

export default function Resume({ delay = 0 }: { delay?: number }) {
  const experienceStart = delay;
  const educationStart = delay + 80 + resume.experience.length * 45;

  return (
    <div className="min-w-0 flex-1">
      <Section title="Experience" roles={resume.experience} delay={experienceStart} />
      <Section
        title="Education"
        roles={resume.education}
        delay={educationStart}
        className="mt-10"
      />
    </div>
  );
}

function Section({
  title,
  roles,
  delay,
  className = "",
}: {
  title: string;
  roles: ResumeRole[];
  delay: number;
  className?: string;
}) {
  return (
    <div className={className}>
      <Rise delay={delay}>
        <p className="meta mb-3 text-mute">{title}</p>
      </Rise>
      <ul>
        {roles.map((role, index) => (
          <Rise
            key={`${role.title}-${role.org}-${role.start}`}
            as="li"
            delay={delay + 50 + index * 45}
            className="grid grid-cols-1 items-baseline gap-x-6 border-t border-rule py-2.5 last:border-b sm:grid-cols-[9.5rem_1fr_auto]"
          >
            <span className="meta tabular text-mute">
              {role.start.toUpperCase()}
              {role.end !== role.start ? ` — ${role.end.toUpperCase()}` : ""}
            </span>
            <span className="text-[14px] leading-snug tracking-[-0.01em] text-ink">
              {role.title}
              <span className="text-mute"> — {role.org}</span>
            </span>
            {role.place ? (
              <span className="meta hidden text-mute sm:inline">{role.place}</span>
            ) : (
              <span />
            )}
          </Rise>
        ))}
      </ul>
    </div>
  );
}
