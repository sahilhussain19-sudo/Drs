import React from 'react';

interface CategoryIconProps {
  active?: boolean;
  className?: string;
}

/* --------------------------------------------------------------------------
   SHARED 3D DEEP-SILVER & EMERALD-GREEN SVG GRADIENT DEFS
   -------------------------------------------------------------------------- */

export const TopbarBell3D: React.FC<{ className?: string }> = React.memo(
  ({ className = 'w-[21px] h-[21px]' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="bellSilverBody" x1="5" y1="3" x2="19" y2="19" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#c4cddb" />
          <stop offset="38%" stopColor="#838e9e" />
          <stop offset="78%" stopColor="#4f5866" />
          <stop offset="100%" stopColor="#353c47" />
        </linearGradient>
        <linearGradient id="bellSilverRim" x1="4" y1="16" x2="20" y2="18.5" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#b9c3d2" />
          <stop offset="50%" stopColor="#6f7a8a" />
          <stop offset="100%" stopColor="#3c434f" />
        </linearGradient>
        <radialGradient id="bellClapperGlow" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#fed7aa" />
          <stop offset="45%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#c2410c" />
        </radialGradient>
      </defs>

      {/* Top crown pin */}
      <circle cx="12" cy="3.6" r="1.35" fill="#9ca7b8" />

      {/* Glowing amber clapper */}
      <circle cx="12" cy="18.9" r="2.15" fill="url(#bellClapperGlow)" />

      {/* Main 3D sculpted bell dome */}
      <path
        d="M12 4.3C8.55 4.3 6.2 6.85 6.2 10.6v3.15c0 .8-.35 1.55-.95 2.08l-.9.78c-.32.28-.12.82.3.82h14.7c.42 0 .62-.54.3-.82l-.9-.78c-.6-.53-.95-1.28-.95-2.08V10.6C17.8 6.85 15.45 4.3 12 4.3z"
        fill="url(#bellSilverBody)"
      />

      {/* Specular highlight curve on left dome */}
      <path
        d="M8.5 7.4c-.85 1.05-1.15 2.4-1.15 4.2v2.1"
        stroke="white"
        strokeOpacity="0.32"
        strokeWidth="1.25"
        strokeLinecap="round"
      />

      {/* Flared bottom bevel lip */}
      <rect x="4.1" y="16.25" width="15.8" height="1.5" rx="0.75" fill="url(#bellSilverRim)" />
    </svg>
  )
);

export const TopbarMascot3D: React.FC<{ className?: string }> = React.memo(
  ({ className = 'w-[24px] h-[24px]' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <defs>
        <radialGradient id="mascotHeadGlow" cx="38%" cy="30%" r="68%">
          <stop offset="0%" stopColor="#b8f3ff" />
          <stop offset="45%" stopColor="#3bc4f8" />
          <stop offset="85%" stopColor="#0f7cd6" />
          <stop offset="100%" stopColor="#0b4f9c" />
        </radialGradient>
        <linearGradient id="mascotBase" x1="5" y1="16" x2="19" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#67d7fb" />
          <stop offset="50%" stopColor="#1b8ee0" />
          <stop offset="100%" stopColor="#0f4c94" />
        </linearGradient>
      </defs>

      {/* Rounded pedestal collar */}
      <path
        d="M5.5 19.6c0-2.45 2.9-3.9 6.5-3.9s6.5 1.45 6.5 3.9c0 .8-.55 1.4-1.35 1.4H6.85c-.8 0-1.35-.6-1.35-1.4z"
        fill="url(#mascotBase)"
      />
      <path
        d="M7.2 17.1c1.35-.65 3.05-.95 4.8-.95s3.45.3 4.8.95"
        stroke="white"
        strokeOpacity="0.35"
        strokeWidth="0.9"
        strokeLinecap="round"
      />

      {/* 3D glossy cyan head */}
      <circle cx="12" cy="10.1" r="6.35" fill="url(#mascotHeadGlow)" />

      {/* Top-left glossy reflection */}
      <ellipse
        cx="9.6"
        cy="6.7"
        rx="2.1"
        ry="1.05"
        transform="rotate(-24 9.6 6.7)"
        fill="white"
        fillOpacity="0.45"
      />

      {/* Crisp smiling visor */}
      <path
        d="M8.85 10.65c.65 1.5 1.8 2.25 3.15 2.25s2.5-.75 3.15-2.25"
        stroke="white"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  )
);

/* --------------------------------------------------------------------------
   TOP CATEGORY BAR — 3D DEEP SILVER (INACTIVE) & 3D EMERALD (ACTIVE)
   -------------------------------------------------------------------------- */

export const CategoryExplore3D: React.FC<CategoryIconProps> = React.memo(
  ({ active = false, className = 'w-[22px] h-[22px]' }) => {
    const idPrefix = active ? 'expAct' : 'expSil';
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <defs>
          <radialGradient id={`${idPrefix}Sphere`} cx="35%" cy="32%" r="68%">
            <stop offset="0%" stopColor={active ? '#86efac' : '#c4cedc'} />
            <stop offset="48%" stopColor={active ? '#22c55e' : '#7b8697'} />
            <stop offset="100%" stopColor={active ? '#146b33' : '#3d4553'} />
          </radialGradient>
          <linearGradient id={`${idPrefix}Ring`} x1="2" y1="16" x2="22" y2="8" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={active ? '#4ade80' : '#9ca6b5'} />
            <stop offset="50%" stopColor={active ? '#1ad96a' : '#6f7989'} />
            <stop offset="100%" stopColor={active ? '#15803d' : '#414957'} />
          </linearGradient>
        </defs>

        {/* Rear half of tilted Saturn ring */}
        <path
          d="M3.2 14.9C1.8 12.6 5.2 8.7 10.6 6.6c5.4-2.1 10.7-1.9 11.9.4"
          stroke={`url(#${idPrefix}Ring)`}
          strokeWidth="2.1"
          strokeLinecap="round"
          opacity="0.72"
        />

        {/* 3D Planet Sphere */}
        <circle cx="12" cy="12" r="5.65" fill={`url(#${idPrefix}Sphere)`} />

        {/* Subtle sphere specular dot */}
        <ellipse
          cx="10.1"
          cy="9.5"
          rx="1.65"
          ry="0.9"
          transform="rotate(-25 10.1 9.5)"
          fill="white"
          fillOpacity={active ? 0.42 : 0.28}
        />

        {/* Front half of tilted Saturn ring */}
        <path
          d="M22.5 7c1.2 2.3-2.1 6.1-7.5 8.2C9.6 17.3 4.4 17.2 3.2 14.9"
          stroke={`url(#${idPrefix}Ring)`}
          strokeWidth="2.25"
          strokeLinecap="round"
        />
      </svg>
    );
  }
);

export const CategoryFantasy3D: React.FC<CategoryIconProps> = React.memo(
  ({ active = false, className = 'w-[22px] h-[22px]' }) => {
    const idPrefix = active ? 'fanAct' : 'fanSil';
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id={`${idPrefix}BatA`} x1="5" y1="3" x2="18" y2="16" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={active ? '#86efac' : '#c0cad8'} />
            <stop offset="55%" stopColor={active ? '#22c55e' : '#7b8697'} />
            <stop offset="100%" stopColor={active ? '#15803d' : '#48505f'} />
          </linearGradient>
          <linearGradient id={`${idPrefix}BatB`} x1="7" y1="8" x2="19" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={active ? '#22c55e' : '#656f80'} />
            <stop offset="100%" stopColor={active ? '#14532d' : '#353c48'} />
          </linearGradient>
          <radialGradient id={`${idPrefix}Ball`} cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor={active ? '#bbf7d0' : '#cfd7e3'} />
            <stop offset="55%" stopColor={active ? '#22c55e' : '#758091'} />
            <stop offset="100%" stopColor={active ? '#14532d' : '#373e4a'} />
          </radialGradient>
        </defs>

        {/* Cricket bat blade (beveled 2-tone for crisp 3D spine) */}
        <path
          d="M14.7 4.2l4.8 4.8c.55.55.55 1.45 0 2l-6.4 6.4-4.8-4.8 6.4-6.4c.55-.55 1.45-.55 2 0z"
          fill={`url(#${idPrefix}BatA)`}
        />
        <path
          d="M19.5 9c.55.55.55 1.45 0 2l-6.4 6.4-2.4-2.4 7.4-7.4 1.4 1.4z"
          fill={`url(#${idPrefix}BatB)`}
          opacity="0.7"
        />

        {/* Handle & grip */}
        <path
          d="M8.8 14.8l1.6 1.6-4.1 4.1c-.45.45-1.15.45-1.6 0s-.45-1.15 0-1.6l4.1-4.1z"
          fill={`url(#${idPrefix}BatA)`}
        />
        <path
          d="M7.6 16l1.6 1.6"
          stroke={active ? '#14532d' : '#2e3440'}
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* Bat spine ridge highlight */}
        <path
          d="M11.6 14.4l5.2-5.2"
          stroke="white"
          strokeOpacity="0.32"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* 3D Cricket Ball + speed arc */}
        <path
          d="M13.6 18.8c1.15.9 2.7 1.15 4.05.65"
          stroke={active ? '#4ade80' : '#6a7484'}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle cx="17.8" cy="17.1" r="2.65" fill={`url(#${idPrefix}Ball)`} />
        <circle cx="17" cy="16.2" r="0.65" fill="white" fillOpacity="0.35" />
      </svg>
    );
  }
);

export const CategoryCasino3D: React.FC<CategoryIconProps> = React.memo(
  ({ active = false, className = 'w-[22px] h-[22px]' }) => {
    const idPrefix = active ? 'casAct' : 'casSil';
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id={`${idPrefix}Spade`} x1="6" y1="3" x2="18" y2="21" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={active ? '#86efac' : '#c2ccd9'} />
            <stop offset="48%" stopColor={active ? '#22c55e' : '#7b8697'} />
            <stop offset="100%" stopColor={active ? '#14532d' : '#3a4250'} />
          </linearGradient>
        </defs>

        {/* Plump 3D sculpted Spade */}
        <path
          d="M12 2.7C8.95 6.85 4.2 9.95 4.2 14.15c0 2.45 1.9 4.25 4.25 4.25 1.25 0 2.3-.55 3-1.42-.18 1.55-.88 2.85-2.18 3.62h5.46c-1.3-.77-2-2.07-2.18-3.62.7.87 1.75 1.42 3 1.42 2.35 0 4.25-1.8 4.25-4.25C19.8 9.95 15.05 6.85 12 2.7z"
          fill={`url(#${idPrefix}Spade)`}
        />

        {/* Specular highlight curve on left lobe */}
        <path
          d="M10.8 6.4C8.95 8.7 6.3 11.1 6.3 13.75c0 .95.4 1.75 1.05 2.25"
          stroke="white"
          strokeOpacity="0.28"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    );
  }
);

export const CategoryGames3D: React.FC<CategoryIconProps> = React.memo(
  ({ active = false, className = 'w-[22px] h-[22px]' }) => {
    const idPrefix = active ? 'gamAct' : 'gamSil';
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id={`${idPrefix}CardBack`} x1="3" y1="4" x2="15" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={active ? '#4ade80' : '#7b8696'} />
            <stop offset="100%" stopColor={active ? '#14532d' : '#363d49'} />
          </linearGradient>
          <linearGradient id={`${idPrefix}CardFront`} x1="8" y1="3" x2="21" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={active ? '#86efac' : '#c0cad8'} />
            <stop offset="50%" stopColor={active ? '#22c55e' : '#798495'} />
            <stop offset="100%" stopColor={active ? '#15803d' : '#404856'} />
          </linearGradient>
        </defs>

        {/* Left rear fanned card */}
        <rect
          x="3.6"
          y="5.6"
          width="10.4"
          height="14.2"
          rx="2.1"
          transform="rotate(-11 8.8 12.7)"
          fill={`url(#${idPrefix}CardBack)`}
          stroke={active ? '#14532d' : '#2b313b'}
          strokeWidth="0.6"
        />

        {/* Right rear fanned accent card */}
        <rect
          x="10.2"
          y="5.4"
          width="10.2"
          height="14"
          rx="2.1"
          transform="rotate(10 15.3 12.4)"
          fill={`url(#${idPrefix}CardBack)`}
          stroke={active ? '#14532d' : '#2b313b'}
          strokeWidth="0.6"
        />

        {/* Center front 3D metallic card */}
        <rect
          x="6.8"
          y="4.1"
          width="10.4"
          height="14.8"
          rx="2.2"
          fill={`url(#${idPrefix}CardFront)`}
          stroke="white"
          strokeOpacity="0.24"
          strokeWidth="0.7"
        />

        {/* Recessed emblem cutout inside center card (matches reference card) */}
        <circle cx="12" cy="10.3" r="1.45" fill={active ? '#14532d' : '#2c323d'} />
        <path
          d="M11.1 11.4h1.8l.55 2.55h-2.9l.55-2.55z"
          fill={active ? '#14532d' : '#2c323d'}
        />
      </svg>
    );
  }
);

export const CategorySports3D: React.FC<CategoryIconProps> = React.memo(
  ({ active = false, className = 'w-[22px] h-[22px]' }) => {
    const idPrefix = active ? 'spoAct' : 'spoSil';
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <defs>
          <radialGradient id={`${idPrefix}Ball`} cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor={active ? '#bbf7d0' : '#c6d0de'} />
            <stop offset="52%" stopColor={active ? '#22c55e' : '#788394'} />
            <stop offset="100%" stopColor={active ? '#14532d' : '#353c48'} />
          </radialGradient>
        </defs>

        {/* 3D Spherical Football */}
        <circle cx="12" cy="12" r="8.6" fill={`url(#${idPrefix}Ball)`} />

        {/* Faceted dark panels */}
        <polygon
          points="12,8.1 15.4,10.6 14.1,14.6 9.9,14.6 8.6,10.6"
          fill={active ? '#14532d' : '#2c333f'}
        />
        {/* Outer edge patches */}
        <path
          d="M12 3.4l2.1 2.2H9.9L12 3.4zM20.2 9.4l-2.4 1.3-.9-2.7 3.3 1.4zM3.8 9.4l3.3-1.4-.9 2.7-2.4-1.3zM17.3 18.8l-.6-2.8 2.4-1.3-1.8 4.1zM6.7 18.8l-1.8-4.1 2.4 1.3-.6 2.8z"
          fill={active ? '#14532d' : '#2f3643'}
          opacity="0.88"
        />

        {/* Seam lines connecting central pentagon */}
        <path
          d="M12 8.1V5.6M15.4 10.6l2.4-.7M8.6 10.6l-2.4-.7M14.1 14.6l2.2 1.8M9.9 14.6l-2.2 1.8"
          stroke={active ? '#14532d' : '#2d3440'}
          strokeWidth="1.05"
          strokeLinecap="round"
        />

        {/* Subtle glossy highlight */}
        <ellipse
          cx="9.1"
          cy="7.2"
          rx="1.9"
          ry="1"
          transform="rotate(-30 9.1 7.2)"
          fill="white"
          fillOpacity="0.28"
        />
      </svg>
    );
  }
);

/* --------------------------------------------------------------------------
   BOTTOM NAVIGATION BAR — 3D DEEP SILVER METALLIC ICONS
   -------------------------------------------------------------------------- */

export const NavVipDiamond3D: React.FC<{ active?: boolean; className?: string }> = React.memo(
  ({ active = false, className = 'w-[22px] h-[22px]' }) => {
    const idPrefix = active ? 'vipGold' : 'vipSil';
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id={`${idPrefix}Crown`} x1="4" y1="4" x2="20" y2="10" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={active ? '#fef08a' : '#c4cedc'} />
            <stop offset="55%" stopColor={active ? '#facc15' : '#8691a2'} />
            <stop offset="100%" stopColor={active ? '#ca8a04' : '#586272'} />
          </linearGradient>
          <linearGradient id={`${idPrefix}Pavilion`} x1="3" y1="9" x2="21" y2="21" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={active ? '#fde047' : '#8d97a8'} />
            <stop offset="50%" stopColor={active ? '#f59e0b' : '#5b6575'} />
            <stop offset="100%" stopColor={active ? '#b45309' : '#353c48'} />
          </linearGradient>
        </defs>

        {/* Diamond silhouette with crisp subtle metallic edge when active */}
        <polygon
          points="6.2,4.2 17.8,4.2 21.8,9.5 12,20.6 2.2,9.5"
          fill={`url(#${idPrefix}Pavilion)`}
          stroke={active ? '#fef9c3' : 'none'}
          strokeOpacity={active ? 0.65 : 0}
          strokeWidth={active ? 0.9 : 0}
        />
        {/* Crown highlight top slab */}
        <polygon points="6.2,4.2 17.8,4.2 21.8,9.5 2.2,9.5" fill={`url(#${idPrefix}Crown)`} />

        {/* Center V-emblem & facet lines */}
        <path
          d="M2.2 9.5h19.6M7.4 4.2L9.2 9.5 12 20.6M16.6 4.2L14.8 9.5 12 20.6"
          stroke={active ? '#92400e' : '#2a303b'}
          strokeOpacity={active ? 0.35 : 0.45}
          strokeWidth="0.95"
          strokeLinejoin="round"
        />
        {!active && <circle cx="12" cy="11.2" r="2.7" fill="#323946" fillOpacity="0.55" />}
        <path
          d="M9.7 9.8l2.3 3 2.3-3"
          stroke={active ? '#1a1204' : '#cfd7e3'}
          strokeWidth={active ? '1.85' : '1.3'}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
);

export const NavEarnRupee3D: React.FC<{ className?: string }> = React.memo(
  ({ className = 'w-[22px] h-[22px]' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="earnBackBill" x1="3" y1="4" x2="19" y2="15" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8791a2" />
          <stop offset="100%" stopColor="#434c5a" />
        </linearGradient>
        <linearGradient id="earnFrontBill" x1="4" y1="7" x2="21" y2="19" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#c0cad8" />
          <stop offset="52%" stopColor="#7b8697" />
          <stop offset="100%" stopColor="#464f5e" />
        </linearGradient>
      </defs>

      {/* Stacked top bill behind */}
      <rect
        x="4"
        y="5.2"
        width="14.5"
        height="9.2"
        rx="1.8"
        transform="rotate(-7 11.2 9.8)"
        fill="url(#earnBackBill)"
      />

      {/* Front sculpted metallic note */}
      <rect
        x="4"
        y="8.4"
        width="16.4"
        height="10.8"
        rx="2.1"
        fill="url(#earnFrontBill)"
        stroke="white"
        strokeOpacity="0.22"
        strokeWidth="0.65"
      />

      {/* Recessed inner border */}
      <rect
        x="5.8"
        y="10.1"
        width="12.8"
        height="7.4"
        rx="1.2"
        stroke="#2b313d"
        strokeOpacity="0.4"
        strokeWidth="0.85"
      />

      {/* Crisp embossed ₹ symbol */}
      <path
        d="M9.8 11.4h4.4M9.8 13.1h4.4M11.6 11.4c1.35 0 1.45 2.6-.1 2.75l2.25 2.45"
        stroke="#242a34"
        strokeWidth="1.45"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
);

export const NavRaceTrophy3D: React.FC<{ className?: string }> = React.memo(
  ({ className = 'w-[22px] h-[22px]' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="trophyMetal" x1="5" y1="3" x2="19" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#c4cedc" />
          <stop offset="48%" stopColor="#7c8798" />
          <stop offset="100%" stopColor="#3d4554" />
        </linearGradient>
      </defs>

      {/* Curved metallic handles */}
      <path
        d="M7 6H4.6c-.9 0-1.6.7-1.6 1.6v1.2c0 1.9 1.55 3.45 3.45 3.45H7.5M17 6h2.4c.9 0 1.6.7 1.6 1.6v1.2c0 1.9-1.55 3.45-3.45 3.45H16.5"
        stroke="url(#trophyMetal)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Sculpted cup bowl */}
      <path
        d="M6.6 4.2h10.8v5.5c0 3.05-2.4 5.45-5.4 5.45s-5.4-2.4-5.4-5.45V4.2z"
        fill="url(#trophyMetal)"
      />

      {/* Specular highlight stripe on left bowl */}
      <path
        d="M8.5 5.8v3.7c0 1.5.75 2.75 1.8 3.45"
        stroke="white"
        strokeOpacity="0.28"
        strokeWidth="1.15"
        strokeLinecap="round"
      />

      {/* Center starburst emblem */}
      <circle cx="12" cy="9.2" r="2.2" fill="#2c333f" fillOpacity="0.55" />
      <circle cx="12" cy="9.2" r="1" fill="#cbd5e1" />

      {/* Neck & two-tier pedestal */}
      <rect x="10.7" y="15" width="2.6" height="3.2" fill="url(#trophyMetal)" />
      <rect x="7.5" y="18.1" width="9" height="2.2" rx="1" fill="url(#trophyMetal)" />
    </svg>
  )
);

export const NavPromosGift3D: React.FC<{ className?: string }> = React.memo(
  ({ className = 'w-[22px] h-[22px]' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="giftLidGrad" x1="3" y1="8" x2="21" y2="12" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#c2ccd9" />
          <stop offset="55%" stopColor="#818c9d" />
          <stop offset="100%" stopColor="#4c5564" />
        </linearGradient>
        <linearGradient id="giftBoxGrad" x1="4" y1="12" x2="20" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#949ead" />
          <stop offset="55%" stopColor="#626c7c" />
          <stop offset="100%" stopColor="#3a4250" />
        </linearGradient>
      </defs>

      {/* Sculpted twin bow loops */}
      <path
        d="M12 8.2C9.4 8.2 7.3 6.95 7.3 5.4c0-1.15.95-2 2.15-2 1.4 0 2.35 1.45 2.55 4.8zM12 8.2c2.6 0 4.7-1.25 4.7-2.8 0-1.15-.95-2-2.15-2-1.4 0-2.35 1.45-2.55 4.8z"
        stroke="url(#giftLidGrad)"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      {/* Lower 3D gift box body */}
      <path
        d="M4.8 11.8h14.4v7.3c0 1.05-.85 1.9-1.9 1.9H6.7c-1.05 0-1.9-.85-1.9-1.9v-7.3z"
        fill="url(#giftBoxGrad)"
      />

      {/* Overhanging 3D top lid */}
      <rect
        x="3.5"
        y="8.1"
        width="17"
        height="3.9"
        rx="1.2"
        fill="url(#giftLidGrad)"
        stroke="white"
        strokeOpacity="0.2"
        strokeWidth="0.6"
      />

      {/* Shadow line under lid */}
      <line x1="4.8" y1="12.2" x2="19.2" y2="12.2" stroke="#222731" strokeOpacity="0.55" strokeWidth="1" />

      {/* Recessed vertical ribbon */}
      <rect x="10.8" y="8.1" width="2.4" height="12.9" fill="#2d3440" fillOpacity="0.45" />
    </svg>
  )
);
