import { skills } from "@/content/skills";

/** Plain grouped lists. No bars, no percentages, no ratings (CLAUDE.md §4). */
export default function Skills() {
  return (
    <dl className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
      {skills.map((group) => (
        <div key={group.label}>
          <dt className="t-label">{group.label}</dt>
          <dd className="mt-3">
            <ul className="space-y-1.5">
              {group.items.map((item) => (
                <li key={item} className="t-small text-ink">
                  {item}
                </li>
              ))}
            </ul>
          </dd>
        </div>
      ))}
    </dl>
  );
}
