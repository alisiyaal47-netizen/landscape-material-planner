import type { CSSProperties } from "react";

export type IconName =
  "leaf" | "gravel" | "ruler" | "layers" | "bag" | "plan" | "arrow" | "check";
const paths: Record<IconName, React.ReactNode> = {
  leaf: (
    <>
      <path d="M19 4C10 3 4 7 5 14c1 6 12 6 14-10Z" />
      <path d="m4 21 10-12M9 15l-1-5M9 15l6 1" />
    </>
  ),
  gravel: (
    <>
      <path d="m3 15 3-4 5 1 2 5-4 3-5-1ZM13 5l5-2 3 4-2 4-5-1ZM16 15l4-1 2 4-3 3-4-2Z" />
    </>
  ),
  ruler: (
    <>
      <path d="m3 16 13-13 5 5L8 21ZM7 12l2 2m1-5 2 2m1-5 2 2" />
    </>
  ),
  layers: (
    <>
      <path d="m3 8 9-5 9 5-9 5ZM3 12l9 5 9-5M3 16l9 5 9-5" />
    </>
  ),
  bag: (
    <>
      <path d="M7 4h10l-2 5 5 9a2 2 0 0 1-2 3H6a2 2 0 0 1-2-3l5-9ZM9 9h6M9 15h6" />
    </>
  ),
  plan: (
    <>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 3h6v4H9ZM9 12h6M9 16h4" />
    </>
  ),
  arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
  check: <path d="m5 12 4 4L19 6" />,
};

export function Icon({
  name,
  size = 24,
  style,
}: {
  name: IconName;
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={style}
    >
      {paths[name]}
    </svg>
  );
}
