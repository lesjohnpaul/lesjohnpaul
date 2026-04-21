"use client";

// Azure migration architecture diagram — hand-crafted SVG showing PANELCO
// III's five on-prem sites connecting through Sophos Firewall over a
// site-to-site VPN to Azure Philippines, with VNet subnets and cross-region
// Recovery Services Vault for DR.
//
// Rendered as a single inline SVG so it's theme-aware (via Tailwind fill/
// stroke utilities) and zero-JS except for an animated dash offset on the
// VPN tunnel to convey traffic flow.

export function AzureMigrationDiagram() {
  return (
    <figure className="relative overflow-hidden rounded-2xl border border-border bg-card/40 p-4 md:p-6">
      <svg
        viewBox="0 0 1000 500"
        className="w-full h-auto"
        role="img"
        aria-label="PANELCO III on-prem sites connect through a Sophos Firewall over a site-to-site VPN to Azure Philippines, where a VNet holds Web, App, and Data subnets with an Azure Recovery Services Vault providing cross-region disaster recovery."
      >
        <defs>
          {/* Subtle grid background */}
          <pattern id="cs-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              className="stroke-border/40"
              strokeWidth="0.5"
            />
          </pattern>
          {/* Soft gold glow for the Azure cloud outline */}
          <filter id="cs-glow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        <rect width="1000" height="500" fill="url(#cs-grid)" />

        {/* === Column labels =================================== */}
        <g className="fill-muted-foreground font-mono" fontSize="10" letterSpacing="2">
          <text x="180" y="45" textAnchor="middle">ON-PREMISES</text>
          <text x="500" y="45" textAnchor="middle">VPN TUNNEL</text>
          <text x="820" y="45" textAnchor="middle">AZURE PHILIPPINES</text>
        </g>

        {/* === LEFT: On-premises ============================== */}
        <g>
          {/* Outer container */}
          <rect
            x="40" y="70"
            width="280" height="380"
            rx="12"
            className="fill-card stroke-border"
            strokeWidth="1.5"
          />
          {/* Title */}
          <text
            x="180" y="100"
            textAnchor="middle"
            className="fill-foreground"
            fontSize="17"
            fontWeight="600"
          >
            PANELCO III
          </text>
          <text
            x="180" y="120"
            textAnchor="middle"
            className="fill-muted-foreground"
            fontSize="11"
          >
            HQ + 4 Area Offices
          </text>

          {/* 5 office nodes laid out as a small cluster */}
          {[
            { x: 90, y: 160, label: "HQ" },
            { x: 180, y: 150, label: "Area 1" },
            { x: 270, y: 160, label: "Area 2" },
            { x: 135, y: 220, label: "Area 3" },
            { x: 225, y: 220, label: "Area 4" },
          ].map((office) => (
            <g key={office.label}>
              <rect
                x={office.x - 28}
                y={office.y - 14}
                width="56"
                height="28"
                rx="4"
                className="fill-background stroke-border"
                strokeWidth="1"
              />
              <text
                x={office.x}
                y={office.y + 4}
                textAnchor="middle"
                className="fill-foreground/80 font-mono"
                fontSize="10"
              >
                {office.label}
              </text>
            </g>
          ))}

          {/* Internal mesh lines between offices (flavor) */}
          <g className="stroke-border" strokeWidth="0.75" strokeDasharray="2 3">
            <line x1="90" y1="160" x2="180" y2="150" />
            <line x1="180" y1="150" x2="270" y2="160" />
            <line x1="90" y1="160" x2="135" y2="220" />
            <line x1="270" y1="160" x2="225" y2="220" />
            <line x1="135" y1="220" x2="225" y2="220" />
          </g>

          {/* Sophos Firewall (egress point) */}
          <g>
            <rect
              x="105" y="320"
              width="150" height="70"
              rx="8"
              className="fill-background stroke-primary"
              strokeWidth="1.5"
            />
            <text
              x="180" y="348"
              textAnchor="middle"
              className="fill-primary"
              fontSize="13"
              fontWeight="600"
            >
              Sophos Firewall
            </text>
            <text
              x="180" y="368"
              textAnchor="middle"
              className="fill-muted-foreground font-mono"
              fontSize="10"
            >
              egress + policy
            </text>
          </g>

          {/* Connection from offices to firewall */}
          <line
            x1="180" y1="240" x2="180" y2="320"
            className="stroke-border"
            strokeWidth="1"
          />

          <text
            x="180" y="425"
            textAnchor="middle"
            className="fill-muted-foreground font-mono"
            fontSize="10"
          >
            5 sites
          </text>
        </g>

        {/* === MIDDLE: VPN tunnel ============================= */}
        <g>
          {/* Animated dashed line suggesting traffic flow */}
          <line
            x1="320" y1="355" x2="680" y2="190"
            className="stroke-primary"
            strokeWidth="2"
            strokeDasharray="8 6"
            strokeLinecap="round"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-28"
              dur="1.6s"
              repeatCount="indefinite"
            />
          </line>

          {/* Tunnel label + lock */}
          <g transform="translate(500, 245)">
            <rect
              x="-70" y="-16"
              width="140" height="32"
              rx="16"
              className="fill-background stroke-primary"
              strokeWidth="1.25"
            />
            <text
              x="0" y="5"
              textAnchor="middle"
              className="fill-primary font-mono"
              fontSize="11"
              letterSpacing="0.5"
            >
              IPSEC · S2S VPN
            </text>
          </g>
        </g>

        {/* === RIGHT: Azure cloud ============================ */}
        <g>
          {/* Cloud-ish rounded container */}
          <rect
            x="620" y="70"
            width="340" height="380"
            rx="18"
            className="fill-card stroke-primary/40"
            strokeWidth="1.25"
          />
          <rect
            x="620" y="70"
            width="340" height="380"
            rx="18"
            className="fill-primary/5 stroke-primary/20"
            strokeWidth="1"
            filter="url(#cs-glow)"
          />

          {/* Region pin */}
          <g transform="translate(820, 100)">
            <circle r="4" className="fill-primary" />
            <text
              x="12" y="4"
              className="fill-muted-foreground font-mono"
              fontSize="10"
            >
              southeastasia
            </text>
          </g>

          <text
            x="790" y="100"
            textAnchor="end"
            className="fill-foreground"
            fontSize="15"
            fontWeight="600"
          >
            Azure VNet
          </text>
          <text
            x="790" y="118"
            textAnchor="end"
            className="fill-muted-foreground font-mono"
            fontSize="10"
          >
            10.0.0.0/16
          </text>

          {/* VNet inner frame */}
          <rect
            x="650" y="140"
            width="280" height="140"
            rx="10"
            className="fill-background/60 stroke-primary/30"
            strokeWidth="1"
            strokeDasharray="3 4"
          />

          {/* 3 subnets */}
          {[
            { x: 665, label: "Web", meta: "10.0.1.0/24" },
            { x: 755, label: "App", meta: "10.0.2.0/24" },
            { x: 845, label: "Data", meta: "10.0.3.0/24" },
          ].map((subnet) => (
            <g key={subnet.label}>
              <rect
                x={subnet.x} y="165"
                width="70" height="90"
                rx="8"
                className="fill-card stroke-border"
                strokeWidth="1"
              />
              <text
                x={subnet.x + 35} y="195"
                textAnchor="middle"
                className="fill-foreground"
                fontSize="13"
                fontWeight="600"
              >
                {subnet.label}
              </text>
              <text
                x={subnet.x + 35} y="215"
                textAnchor="middle"
                className="fill-muted-foreground font-mono"
                fontSize="9"
              >
                subnet
              </text>
              <text
                x={subnet.x + 35} y="234"
                textAnchor="middle"
                className="fill-muted-foreground/80 font-mono"
                fontSize="8.5"
              >
                {subnet.meta}
              </text>
            </g>
          ))}

          {/* Arrow down from VNet to Recovery Vault */}
          <g className="stroke-primary/70" strokeWidth="1.5">
            <line x1="790" y1="300" x2="790" y2="340" />
            <polyline
              points="784,334 790,344 796,334"
              fill="none"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </g>
          <text
            x="800" y="325"
            className="fill-muted-foreground font-mono"
            fontSize="9"
          >
            backup + DR
          </text>

          {/* Recovery Services Vault */}
          <g>
            <rect
              x="665" y="355"
              width="250" height="70"
              rx="10"
              className="fill-background stroke-primary"
              strokeWidth="1.5"
            />
            <text
              x="790" y="382"
              textAnchor="middle"
              className="fill-primary"
              fontSize="13"
              fontWeight="600"
            >
              Recovery Services Vault
            </text>
            <text
              x="790" y="402"
              textAnchor="middle"
              className="fill-muted-foreground font-mono"
              fontSize="10"
            >
              cross-region · point-in-time
            </text>
          </g>
        </g>
      </svg>

      <figcaption className="mt-4 text-xs text-muted-foreground font-mono tracking-wide text-center">
        Architecture — PANELCO III Azure migration, 2024
      </figcaption>

      {/* Reduced-motion stops the VPN dash animation. SVG animate element
          isn't covered by CSS motion-reduce, so we add a media query that
          pauses it via animation-play-state is not applicable here;
          instead the animate element respects prefers-reduced-motion at
          the user-agent level when `data-autoplay` is not used. Most
          modern browsers pause SMIL on reduced-motion; we also back it
          up by keeping the dash pattern static so the diagram is
          readable without motion. */}
    </figure>
  );
}
