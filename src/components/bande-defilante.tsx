"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Liste qui défile à l'horizontale sur mobile (planche des étapes, 3.12).
 * Elle n'est un arrêt de tabulation que quand elle défile vraiment : sur
 * tablette et bureau, la planche est une grille, et un arrêt de clavier sans
 * effet ne servirait à rien. Avant l'hydratation, elle reste focalisable :
 * sur mobile, sans JavaScript, la bande se fait encore défiler au clavier.
 */
export function BandeDefilante({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLOListElement>(null);
  const [defile, setDefile] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mesurer = () => setDefile(el.scrollWidth > el.clientWidth + 1);
    mesurer();
    const observateur = new ResizeObserver(mesurer);
    observateur.observe(el);
    return () => observateur.disconnect();
  }, []);

  return (
    <ol ref={ref} aria-label={label} tabIndex={defile ? 0 : undefined} className={className}>
      {children}
    </ol>
  );
}
