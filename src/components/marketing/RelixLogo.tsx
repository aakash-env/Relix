import React from "react";

export function RelixLogo({
  className = "w-6 h-6",
  color = "currentColor",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <mask id="relix-diamond-cutout">
          {/* Outer diamond */}
          <polygon points="50,2 98,50 50,98 2,50" fill="white" />
          {/* Center diamond hole */}
          <polygon points="50,30 70,50 50,70 30,50" fill="black" />
          {/* Fine vertical slit gap down center line */}
          <line x1="50" y1="0" x2="50" y2="30" stroke="black" strokeWidth="1.5" />
          <line x1="50" y1="70" x2="50" y2="100" stroke="black" strokeWidth="1.5" />
        </mask>
      </defs>

      {/* Group of 17 crisp vertical stripes masked by diamond silhouette */}
      <g mask="url(#relix-diamond-cutout)">
        <line x1="7" y1="0" x2="7" y2="100" stroke={color} strokeWidth="3" />
        <line x1="13" y1="0" x2="13" y2="100" stroke={color} strokeWidth="3" />
        <line x1="19" y1="0" x2="19" y2="100" stroke={color} strokeWidth="3" />
        <line x1="25" y1="0" x2="25" y2="100" stroke={color} strokeWidth="3" />
        <line x1="31" y1="0" x2="31" y2="100" stroke={color} strokeWidth="3" />
        <line x1="37" y1="0" x2="37" y2="100" stroke={color} strokeWidth="3" />
        <line x1="43" y1="0" x2="43" y2="100" stroke={color} strokeWidth="3" />
        <line x1="49" y1="0" x2="49" y2="100" stroke={color} strokeWidth="3" />
        <line x1="51" y1="0" x2="51" y2="100" stroke={color} strokeWidth="3" />
        <line x1="57" y1="0" x2="57" y2="100" stroke={color} strokeWidth="3" />
        <line x1="63" y1="0" x2="63" y2="100" stroke={color} strokeWidth="3" />
        <line x1="69" y1="0" x2="69" y2="100" stroke={color} strokeWidth="3" />
        <line x1="75" y1="0" x2="75" y2="100" stroke={color} strokeWidth="3" />
        <line x1="81" y1="0" x2="81" y2="100" stroke={color} strokeWidth="3" />
        <line x1="87" y1="0" x2="87" y2="100" stroke={color} strokeWidth="3" />
        <line x1="93" y1="0" x2="93" y2="100" stroke={color} strokeWidth="3" />
      </g>
    </svg>
  );
}