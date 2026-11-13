// Classes partagées. Boutons en pilule, une seule couleur d'accent.
const base =
  "inline-flex h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 text-sm font-semibold transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

export const btnPrimary = `${base} bg-accent text-accent-ink hover:bg-accent-hover`;
export const btnSecondary = `${base} border border-line bg-surface text-ink hover:border-ink/25`;
export const btnOnPanel = `${base} bg-panel-ink text-panel hover:bg-white`;
export const btnGhostOnPanel = `${base} border border-white/20 text-panel-ink hover:border-white/45`;

export const container = "mx-auto w-full max-w-[1280px] px-4 md:px-8";

export const inputBase =
  "h-11 w-full rounded-xl border border-line bg-surface px-3.5 text-[15px] text-ink placeholder:text-muted/80 transition-colors hover:border-ink/25 focus:border-accent focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent";

export const selectBase = `${inputBase} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 256 256'%3E%3Cpath fill='%237d8899' d='M213.66 101.66l-80 80a8 8 0 0 1-11.32 0l-80-80a8 8 0 0 1 11.32-11.32L128 164.69l74.34-74.35a8 8 0 0 1 11.32 11.32Z'/%3E%3C/svg%3E")] bg-[length:12px] bg-[right_14px_center] bg-no-repeat pr-9`;

export const labelBase = "text-sm font-medium text-ink";

export const h2 = "font-display text-3xl font-bold tracking-tight text-balance md:text-[2.5rem] md:leading-[1.08]";
export const lead = "max-w-[62ch] text-base leading-relaxed text-muted md:text-lg";
