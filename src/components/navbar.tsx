"use client";

import * as React from "react";
import Link from "next/link";
import { Github } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  lang: "ru" | "kk";
  dict: {
    home: string;
    about: string;
    skills: string;
    projects: string;
    contact: string;
  };
}

export function Navbar({ lang, dict }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-8">
        <Link
          href={`/${lang}/`}
          className="flex items-center gap-2 font-bold tracking-tight text-lg hover:opacity-80 transition-opacity"
        >
          <span className="text-xl">⚡</span>
          <span>DevPortfolio</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href={`/${lang}/#about`} className="hover:text-foreground transition-colors">
            {dict.about}
          </Link>
          <Link href={`/${lang}/#skills`} className="hover:text-foreground transition-colors">
            {dict.skills}
          </Link>
          <Link href={`/${lang}/#projects`} className="hover:text-foreground transition-colors">
            {dict.projects}
          </Link>
          <Link href={`/${lang}/#contact`} className="hover:text-foreground transition-colors">
            {dict.contact}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle currentLang={lang} />
          <ThemeToggle />
          <Button variant="ghost" size="icon" asChild aria-label="GitHub Repository">
            <a
              href="https://github.com/accessvirgil83/inernational"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
