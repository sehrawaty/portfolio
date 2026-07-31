import { ArrowUpRight } from "lucide-react";
import { site } from "@/content/site";

/** No form — direct links only, per the owner's decision. Static export holds. */
export default function Contact() {
  return (
    <div>
      <p className="t-body measure text-muted">
        Open to backend and applied-AI roles. The fastest way to reach me is
        email.
      </p>

      <ul className="mt-10 space-y-4">
        <li>
          <ContactLink href={`mailto:${site.email}`} external={false}>
            {site.email}
          </ContactLink>
        </li>
        <li>
          <ContactLink href={site.linkedin}>LinkedIn</ContactLink>
        </li>
        <li>
          <ContactLink href={site.github}>GitHub</ContactLink>
        </li>
      </ul>
    </div>
  );
}

function ContactLink({
  href,
  children,
  external = true,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className="t-body inline-flex items-center gap-1.5 font-medium text-accent transition-colors hover:text-accent-ink"
      style={{ transitionDuration: "var(--dur-hover)" }}
    >
      {children}
      {external && <ArrowUpRight size={16} aria-hidden="true" />}
    </a>
  );
}
