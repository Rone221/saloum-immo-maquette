"use client";

import { useSearchParams } from "next/navigation";
import { LeadForm } from "./lead-form";

export function ContactForm() {
  const sp = useSearchParams();
  const sujet = sp.get("sujet") ?? undefined;
  return <LeadForm key={sujet ?? "defaut"} variant="contact" defaultSujet={sujet} />;
}
