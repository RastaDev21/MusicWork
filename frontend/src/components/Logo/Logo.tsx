export default function Logo() {
  return (
    <svg
      viewBox="0 0 680 240"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "160px", height: "auto" }}
    >
      <defs>
        <mask id="text-gaps" maskUnits="userSpaceOnUse">
          <rect x="0" y="0" width="680" height="240" fill="white" />
          <rect x="144" y="98" width="195" height="80" fill="black" rx="2" />
          <rect x="339" y="98" width="110" height="80" fill="black" rx="2" />
          <rect x="459" y="98" width="46" height="80" fill="black" rx="2" />
          <rect x="233" y="185" width="212" height="17" fill="black" rx="2" />
        </mask>
      </defs>

      <g opacity="0.22">
        <path
          d="M155 155 Q155 52 323 52 Q491 52 491 155"
          fill="none"
          stroke="#9C6FE4"
          strokeWidth="14"
          strokeLinecap="round"
          mask="url(#text-gaps)"
        />
        <rect x="141" y="146" width="26" height="44" rx="13" fill="#9C6FE4" />
        <rect x="479" y="146" width="26" height="44" rx="13" fill="#9C6FE4" />
      </g>

      <text
        x="148"
        y="162"
        fontFamily="'Segoe UI',Arial,sans-serif"
        fontSize="68"
        fontWeight="800"
        fill="#ffffff"
        letterSpacing="-1"
      >
        Music
      </text>
      <text
        x="343"
        y="162"
        fontFamily="'Segoe UI',Arial,sans-serif"
        fontSize="68"
        fontWeight="800"
        fill="#9C6FE4"
        letterSpacing="-1"
      >
        Wo
      </text>

      <g transform="translate(430, 118)">
        <rect x="20" y="0" width="5" height="44" rx="2.5" fill="#9C6FE4" />
        <ellipse
          cx="11"
          cy="41"
          rx="11"
          ry="7.5"
          transform="rotate(-16,11,41)"
          fill="#9C6FE4"
        />
        <path d="M25 0 Q42 6 40 20 Q31 16 25 18Z" fill="#9C6FE4" />
      </g>

      <text
        x="463"
        y="162"
        fontFamily="'Segoe UI',Arial,sans-serif"
        fontSize="68"
        fontWeight="800"
        fill="#9C6FE4"
        letterSpacing="-1"
      >
        k
      </text>
      <text
        x="340"
        y="200"
        textAnchor="middle"
        fontFamily="'Segoe UI',Arial,sans-serif"
        fontSize="16"
        fill="#9C6FE4"
        letterSpacing="3"
      >
        A REDE DOS MÚSICOS
      </text>
    </svg>
  );
}
