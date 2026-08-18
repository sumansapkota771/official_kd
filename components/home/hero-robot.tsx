/**
 * The hero AI-robot illustration, rendered as inline SVG so the orbital ring
 * can be animated: a node travels the ring on a loop while a bright pulse
 * glides along it — a living "compute orbit" around the robot.
 *
 * The geometry mirrors `public/images/ai-robot-hero.png` exactly; this is the
 * same flat-shaded design, no gradients. When `animate` is false the ring
 * holds still (reduced motion / narrow viewports).
 */
export function HeroRobot({ animate }: { animate: boolean }) {
  return (
    <svg viewBox="0 0 1000 1000" className="h-full w-full" aria-hidden="true">
      {/* ground shadow */}
      <ellipse cx="500" cy="700" rx="265" ry="24" fill="#141a3c" opacity="0.12" />

      {/* orbital ring — back half (behind the head), carrying the orbiting node so
          it slips behind the robot on its far pass instead of cutting across the face */}
      <g transform="rotate(-15 500 515)">
        <path
          d="M 950 515 A 450 175 0 0 0 50 515"
          fill="none"
          stroke="#2bb673"
          strokeWidth="11"
          strokeLinecap="round"
          opacity="0.4"
        />
        {/* invisible path the travelling node follows */}
        <path
          id="kd-robot-ring-path"
          d="M 950 515 A 450 175 0 0 1 50 515 A 450 175 0 0 1 950 515"
          fill="none"
          stroke="none"
        />
        {animate ? (
          <circle r="13" fill="#2bb673">
            <animateMotion dur="7s" repeatCount="indefinite">
              <mpath href="#kd-robot-ring-path" xlinkHref="#kd-robot-ring-path" />
            </animateMotion>
          </circle>
        ) : (
          <circle cx="500" cy="690" r="13" fill="#2bb673" />
        )}
      </g>

      {/* ears */}
      <rect x="276" y="408" width="44" height="112" rx="22" fill="#3a3db0" />
      <rect x="680" y="408" width="44" height="112" rx="22" fill="#3a3db0" />

      {/* head block (flat-shaded 3D: top face + right shading) */}
      <rect x="330" y="310" width="340" height="270" rx="84" fill="#2e3192" />
      <rect x="330" y="310" width="340" height="96" rx="84" fill="#25277a" />
      <rect x="596" y="314" width="72" height="262" rx="68" fill="#0b0e24" opacity="0.3" />

      {/* visor */}
      <rect x="362" y="392" width="276" height="112" rx="28" fill="#0b0e24" />

      {/* eyes */}
      <circle cx="448" cy="450" r="26" fill="#2bb673" />
      <circle cx="441" cy="443" r="8" fill="#ffffff" opacity="0.85" />
      <circle cx="552" cy="450" r="26" fill="#2bb673" />
      <circle cx="545" cy="443" r="8" fill="#ffffff" opacity="0.85" />

      {/* mouth grille */}
      <rect x="474" y="534" width="8" height="26" rx="4" fill="#2bb673" opacity="0.9" />
      <rect x="496" y="534" width="8" height="26" rx="4" fill="#2bb673" opacity="0.9" />
      <rect x="518" y="534" width="8" height="26" rx="4" fill="#2bb673" opacity="0.9" />

      {/* antenna + signal dots */}
      <line x1="500" y1="310" x2="500" y2="246" stroke="#2bb673" strokeWidth="8" strokeLinecap="round" />
      <circle cx="500" cy="238" r="18" fill="#2bb673" />
      <circle cx="500" cy="238" r="8" fill="#0b0e24" />
      <circle cx="470" cy="200" r="5" fill="#2bb673" opacity="0.6" />
      <circle cx="455" cy="180" r="4" fill="#2bb673" opacity="0.45" />
      <circle cx="442" cy="162" r="3" fill="#2bb673" opacity="0.3" />

      {/* orbital ring — front half (in front of the head) with the gliding pulse */}
      <g transform="rotate(-15 500 515)">
        {/* bright pulse gliding along the ring */}
        <path
          d="M 950 515 A 450 175 0 0 1 50 515"
          fill="none"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.9"
          className={animate ? "robot-ring-pulse" : undefined}
        />
        <path
          d="M 950 515 A 450 175 0 0 1 50 515"
          fill="none"
          stroke="#2bb673"
          strokeWidth="11"
          strokeLinecap="round"
        />
      </g>

      {/* neural lattice: left */}
      <circle cx="168" cy="610" r="13" fill="#2e3192" />
      <line x1="168" y1="610" x2="240" y2="556" stroke="#2e3192" strokeWidth="3" opacity="0.55" />
      <circle cx="240" cy="556" r="9" fill="#2bb673" />
      <line x1="240" y1="556" x2="308" y2="596" stroke="#2bb673" strokeWidth="3" opacity="0.55" />
      <circle cx="308" cy="596" r="13" fill="#2e3192" />

      {/* neural lattice: top-left */}
      <circle cx="152" cy="260" r="11" fill="#2bb673" />
      <line x1="152" y1="260" x2="222" y2="316" stroke="#2bb673" strokeWidth="3" opacity="0.55" />
      <circle cx="222" cy="316" r="9" fill="#2e3192" />
      <line x1="222" y1="316" x2="296" y2="286" stroke="#2e3192" strokeWidth="3" opacity="0.55" />
      <circle cx="296" cy="286" r="11" fill="#2bb673" />

      {/* neural lattice: right */}
      <circle cx="806" cy="268" r="12" fill="#2bb673" />
      <line x1="806" y1="268" x2="744" y2="330" stroke="#2bb673" strokeWidth="3" opacity="0.55" />
      <circle cx="744" cy="330" r="9" fill="#2e3192" />
      <line x1="744" y1="330" x2="674" y2="302" stroke="#2e3192" strokeWidth="3" opacity="0.55" />
      <circle cx="674" cy="302" r="12" fill="#2bb673" />

      {/* neural lattice: bottom-right */}
      <circle cx="852" cy="668" r="11" fill="#2e3192" />
      <line x1="852" y1="668" x2="788" y2="606" stroke="#2e3192" strokeWidth="3" opacity="0.55" />
      <circle cx="788" cy="606" r="15" fill="#2bb673" />

      {/* sparkles */}
      <path d="M 700 196 V 224 M 686 210 H 714" stroke="#2bb673" strokeWidth="6" strokeLinecap="round" />
      <path d="M 300 688 V 712 M 288 700 H 312" stroke="#2e3192" strokeWidth="6" strokeLinecap="round" />
      <path d="M 120 468 V 492 M 108 480 H 132" stroke="#2bb673" strokeWidth="5" strokeLinecap="round" />
      <path d="M 880 470 V 490 M 870 480 H 890" stroke="#2e3192" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}
