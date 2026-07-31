import { site } from "@/content/site";

/** Resend reference (plan §2): top hairline, small muted type, no logo lockup. */
export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="shell flex flex-col justify-between gap-4 py-16 sm:flex-row">
        <p className="t-small text-muted">
          © {new Date().getFullYear()} {site.name}
        </p>
        <p className="t-small text-muted">
          Built with Next.js, deployed on Vercel.
        </p>
      </div>
    </footer>
  );
}
