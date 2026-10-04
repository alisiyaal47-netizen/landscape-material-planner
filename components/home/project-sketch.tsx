export function ProjectSketch() {
  return (
    <div className="project-sketch">
      <div className="sketch-header">
        <span className="eyebrow">EVERY GOOD PROJECT STARTS WITH A PLAN</span>
        <span aria-hidden="true">↗</span>
      </div>
      <svg
        width="460"
        height="320"
        viewBox="0 0 460 320"
        role="img"
        aria-labelledby="sketch-title sketch-description"
      >
        <title id="sketch-title">A simple garden project plan</title>
        <desc id="sketch-description">
          An illustrative overhead drawing of a gravel path between a patio and
          planting beds, with length and width measurement markers. No
          calculated quantities.
        </desc>
        <defs>
          <pattern
            id="grid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M20 0H0V20"
              fill="none"
              stroke="#dedfd4"
              strokeWidth=".6"
            />
          </pattern>
          <pattern
            id="stones"
            width="17"
            height="19"
            patternUnits="userSpaceOnUse"
          >
            <ellipse cx="4" cy="5" rx="2" ry="1.5" fill="#acaa97" />
            <ellipse cx="12" cy="14" rx="2.5" ry="1.7" fill="#c0b9a4" />
          </pattern>
        </defs>
        <rect width="460" height="320" fill="url(#grid)" />
        <rect
          x="64"
          y="48"
          width="330"
          height="227"
          rx="5"
          fill="#f9f7ef"
          stroke="#83937c"
          strokeWidth="2"
        />
        <path d="M65 200h329v74H65Z" fill="#e4ddcd" />
        <path
          d="M120 200v74m55-74v74m55-74v74m55-74v74m55-74v74M65 237h329"
          stroke="#b8b09e"
        />
        <path d="M196 49h63v151h-63Z" fill="#ded8c8" />
        <path
          d="M196 49h63v151h-63Z"
          fill="url(#stones)"
          stroke="#9e9e8d"
          strokeWidth="1.5"
        />
        <rect x="80" y="64" width="99" height="117" rx="28" fill="#e0e7d6" />
        <rect x="277" y="64" width="99" height="117" rx="28" fill="#e0e7d6" />
        <g fill="#b7c7a6" stroke="#7c9270" strokeWidth="1.5">
          <circle cx="110" cy="99" r="20" />
          <circle cx="147" cy="140" r="19" />
          <circle cx="310" cy="102" r="21" />
          <circle cx="345" cy="147" r="18" />
        </g>
        <g stroke="#6b855e" strokeWidth="1.5" fill="none">
          <path d="m99 99 11-7 9 11m-9-11 2 18M337 147l8-9 7 12m-7-12v25M301 103l9-10 10 9m-10-9v23m-173 22 10-8 11 8m-11-8v21" />
        </g>
        <g stroke="#285544" strokeWidth="1.3">
          <path d="M420 49v151m-5-151h10m-10 151h10M196 27h63m-63-5v10m63-10v10" />
        </g>
        <g
          fill="#355345"
          fontFamily="Arial, sans-serif"
          fontSize="10"
          letterSpacing="1.2"
        >
          <text x="227" y="17" textAnchor="middle">
            WIDTH
          </text>
          <text transform="translate(437 125) rotate(90)" textAnchor="middle">
            LENGTH
          </text>
          <text x="227" y="295" textAnchor="middle">
            YOUR NEXT OUTDOOR PROJECT
          </text>
          <text transform="translate(231 126) rotate(-90)" textAnchor="middle">
            GRAVEL PATH
          </text>
        </g>
        <path d="M28 262v-25m-5 8 5-8 5 8" stroke="#285544" fill="none" />
        <text x="28" y="277" textAnchor="middle" fill="#355345" fontSize="10">
          N
        </text>
      </svg>
      <div className="sketch-footer">
        <span>
          <i />A little preparation goes a long way.
        </span>
        <span>PLAN / 01</span>
      </div>
    </div>
  );
}
