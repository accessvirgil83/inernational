import Link from "next/link";
import { Github, Globe, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { HorseGame } from "@/components/horse-game";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RootHomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-between p-4 sm:p-8 bg-gradient-to-b from-background via-muted/30 to-background">
      {/* Top bar */}
      <div className="w-full max-w-5xl flex items-center justify-between py-2">
        <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <Globe className="h-4 w-4 text-primary" />
          <span>International / Inernational</span>
        </div>
        <div className="flex items-center gap-2">
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

      {/* Main hero & Game */}
      <div className="w-full max-w-3xl flex flex-col items-center gap-8 my-auto py-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Портфолио & Резюме
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
            Next.js 16 • shadcn/ui • GitHub Pages • Екі тілді портал (RU / KK)
          </p>
        </div>

        {/* Kazakh Horse Runner Easter Egg Game */}
        <HorseGame />

        {/* Language Selection Card */}
        <Card className="w-full max-w-xl shadow-lg border-primary/10">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Тілді таңдаңыз / Выберите язык</CardTitle>
            <CardDescription>
              Түйіндеме мен портфолионы көру үшін тілді таңдаңыз
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              asChild
              size="lg"
              className="h-16 flex items-center justify-between px-5 text-base shadow-sm group"
            >
              <Link href="/kk/">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇰🇿</span>
                  <div className="text-left">
                    <div className="font-bold leading-tight">Қазақша</div>
                    <div className="text-xs text-primary-foreground/80 font-normal">
                      Портфолио & Түйіндеме
                    </div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-16 flex items-center justify-between px-5 text-base shadow-sm group hover:border-primary"
            >
              <Link href="/ru/">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇷🇺</span>
                  <div className="text-left">
                    <div className="font-bold leading-tight">Русский</div>
                    <div className="text-xs text-muted-foreground font-normal">
                      Портфолио & Резюме
                    </div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-muted-foreground py-4">
        <p>© 2026 Inernational. Next.js 16 Static Export & GitHub Pages</p>
      </footer>
    </main>
  );
}
