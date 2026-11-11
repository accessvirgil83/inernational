"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LanguageToggle({ currentLang }: { currentLang: "ru" | "kk" }) {
  const pathname = usePathname();

  // If path is like /inernational/ru/... or /ru/...
  // We compute the sibling path with the other language
  const targetLang = currentLang === "ru" ? "kk" : "ru";
  const targetPath = pathname
    ? pathname.replace(new RegExp(`/${currentLang}(/|$)`), `/${targetLang}$1`)
    : `/${targetLang}/`;

  return (
    <Button variant="outline" size="sm" asChild className="h-9 px-3 gap-1 font-medium">
      <Link href={targetPath} title={`Switch to ${targetLang.toUpperCase()}`}>
        <span className="text-sm">{currentLang === "ru" ? "🇰🇿" : "🇷🇺"}</span>
        <span className="text-xs uppercase">{targetLang}</span>
      </Link>
    </Button>
  );
}
