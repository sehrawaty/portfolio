/** Section pattern (CLAUDE.md §3): uppercase label eyebrow → h2 → content. */
export default function Section({
  id,
  label,
  heading,
  children,
}: {
  id: string;
  label: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="shell section-y">
      <p className="t-label">{label}</p>
      <h2 className="t-h2 mt-3">{heading}</h2>
      <div className="mt-12">{children}</div>
    </section>
  );
}
