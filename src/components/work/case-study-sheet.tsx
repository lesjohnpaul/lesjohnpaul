"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";

/** Side panel for a case study opened from the homepage; closing returns to the exact scroll spot. */
export function CaseStudySheet({ title, summary, children }: { title: string; summary: string; children: ReactNode }) {
  const router = useRouter();
  return (
    <Sheet open onOpenChange={(open) => !open && router.back()}>
      <SheetContent side="right" className="w-full gap-0 overflow-y-auto p-6 sm:max-w-3xl md:p-10">
        <SheetTitle className="sr-only">{title}</SheetTitle>
        <SheetDescription className="sr-only">{summary}</SheetDescription>
        {children}
      </SheetContent>
    </Sheet>
  );
}
