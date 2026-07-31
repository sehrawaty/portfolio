/**
 * The signature element (CLAUDE.md §6).
 *
 * Depicts the real request path through an internal project-management
 * platform built during the Ayuka internship: a React client calls an
 * Express API; the request crosses JWT verification, then an RBAC guard
 * resolving role against required permission; only a request surviving
 * both gates reaches the service layer and MongoDB.
 *
 * Exactly one path is drawn in --accent: the successful authenticated
 * request. The two rejection edges are drawn in --line and labelled —
 * they are what make this a real system rather than a CRUD sketch.
 */
export default function ArchitectureDiagram() {
  return (
    <svg
      viewBox="0 0 520 400"
      role="img"
      aria-labelledby="arch-title arch-desc"
      className="h-auto w-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id="arch-title">
        Request flow through an authenticated project-management API
      </title>
      <desc id="arch-desc">
        A React client sends a request to an Express API. The request passes
        through JWT verification, which rejects unauthenticated requests with
        401, then through a role-based access control guard resolving admin,
        manager, and member roles, which rejects mismatches with 403. Requests
        passing both gates reach the service layer, which reads and writes
        MongoDB and returns a dashboard payload.
      </desc>

      <g
        style={{
          fontFamily: "var(--font-jetbrains-mono), ui-monospace, monospace",
        }}
      >
        {/* ---- Accent path: the successful authenticated request ---- */}
        <g stroke="var(--accent)" strokeWidth="1.5">
          <path d="M110 56 L110 96" markerEnd="url(#arrow-accent)" />
          <path d="M110 136 L110 176" markerEnd="url(#arrow-accent)" />
          <path d="M110 216 L110 256" markerEnd="url(#arrow-accent)" />
          <path d="M110 296 L110 336" markerEnd="url(#arrow-accent)" />
        </g>

        {/* ---- Return path: dashboard payload back to the client ---- */}
        <path
          d="M190 356 L330 356 L330 36 L190 36"
          stroke="var(--line)"
          strokeWidth="1.5"
          strokeDasharray="3 4"
          markerEnd="url(#arrow-line)"
        />
        <text
          x="342"
          y="192"
          fill="var(--muted)"
          fontSize="10"
          letterSpacing="0.04em"
        >
          200 payload
        </text>

        {/* ---- Rejection edges ---- */}
        <g stroke="var(--line)" strokeWidth="1.5">
          <path d="M190 196 L246 196" markerEnd="url(#arrow-line)" />
          <path d="M190 276 L246 276" markerEnd="url(#arrow-line)" />
        </g>
        <text x="254" y="200" fill="var(--muted)" fontSize="11">
          401 unauthenticated
        </text>
        <text x="254" y="280" fill="var(--muted)" fontSize="11">
          403 role mismatch
        </text>

        {/* ---- Nodes ---- */}
        <Node y={16} label="react client" />
        <Node y={96} label="express api" />
        <Node y={176} label="jwt verify" note="decode + attach principal" />
        <Node y={256} label="rbac guard" note="admin · manager · member" />
        <Node y={336} label="mongodb" />
      </g>

      <defs>
        <marker
          id="arrow-accent"
          viewBox="0 0 8 8"
          refX="7"
          refY="4"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L8 4 L0 8 z" fill="var(--accent)" />
        </marker>
        <marker
          id="arrow-line"
          viewBox="0 0 8 8"
          refX="7"
          refY="4"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L8 4 L0 8 z" fill="var(--line)" />
        </marker>
      </defs>
    </svg>
  );
}

function Node({
  y,
  label,
  note,
}: {
  y: number;
  label: string;
  note?: string;
}) {
  return (
    <g>
      <rect
        x="20"
        y={y}
        width="180"
        height="40"
        rx="8"
        fill="var(--surface)"
        stroke="var(--line)"
        strokeWidth="1"
      />
      <text
        x="36"
        y={note ? y + 18 : y + 25}
        fill="var(--ink)"
        fontSize="13"
        letterSpacing="0.01em"
      >
        {label}
      </text>
      {note && (
        <text x="36" y={y + 32} fill="var(--muted)" fontSize="10">
          {note}
        </text>
      )}
    </g>
  );
}
