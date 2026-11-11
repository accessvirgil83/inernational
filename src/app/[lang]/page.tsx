import Link from "next/link";
import { ArrowUpRight, Download, Mail, Github, Code, Sparkles, Briefcase, GraduationCap } from "lucide-react";
import { getDictionary, type Locale } from "@/lib/get-dictionary";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export async function generateStaticParams() {
  return [{ lang: "ru" }, { lang: "kk" }];
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const safeLang = (lang === "kk" ? "kk" : "ru") as Locale;
  const dict = await getDictionary(safeLang);

  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-8 py-10 space-y-16">
      {/* Hero Section */}
      <section className="flex flex-col items-start gap-6 py-6 md:py-12 border-b">
        <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-xs">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Next.js 16 • React 19 • shadcn/ui
        </Badge>
        <div className="space-y-3 max-w-3xl">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
            {dict.hero.greeting}
          </h1>
          <p className="text-xl sm:text-2xl font-medium text-primary">
            {dict.hero.role}
          </p>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {dict.hero.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button asChild size="lg" className="gap-2">
            <a href="#contact">
              <Mail className="h-4 w-4" />
              {dict.hero.contactBtn}
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <a href="#" download>
              <Download className="h-4 w-4" />
              {dict.hero.resumeBtn}
            </a>
          </Button>
          <Button asChild variant="ghost" size="lg" className="gap-2">
            <a
              href="https://github.com/accessvirgil83/inernational"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-4 w-4" />
              {dict.hero.githubBtn}
            </a>
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="space-y-6">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {dict.about.title}
          </h2>
        </div>
        <Card>
          <CardContent className="pt-6 text-muted-foreground leading-relaxed">
            <p>{dict.about.content}</p>
          </CardContent>
        </Card>
      </section>

      {/* Skills Section */}
      <section id="skills" className="space-y-6">
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5 text-primary" />
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {dict.skills.title}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Frontend</CardTitle>
              <CardDescription>Пользовательские интерфейсы и веб-технологии</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge>Next.js 16</Badge>
              <Badge>React 19</Badge>
              <Badge>TypeScript</Badge>
              <Badge>Tailwind CSS</Badge>
              <Badge>shadcn/ui</Badge>
              <Badge variant="secondary">HTML5 Canvas</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Backend & Tools</CardTitle>
              <CardDescription>Серверный стек, архитектура и CI/CD</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge>Node.js</Badge>
              <Badge>pnpm</Badge>
              <Badge>GitHub Actions</Badge>
              <Badge>Git</Badge>
              <Badge variant="secondary">Docker</Badge>
              <Badge variant="secondary">REST API</Badge>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="space-y-6">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {dict.projects.title}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="flex flex-col justify-between hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl flex items-center justify-between">
                <span>{dict.projects.p1_title}</span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
              <CardDescription className="pt-2 leading-relaxed">
                {dict.projects.p1_desc}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2 pt-2">
              <Badge variant="outline">Next.js 16</Badge>
              <Badge variant="outline">GitHub Pages</Badge>
              <Badge variant="outline">RU / KK i18n</Badge>
            </CardContent>
          </Card>

          <Card className="flex flex-col justify-between hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl flex items-center justify-between">
                <span>{dict.projects.p2_title}</span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
              <CardDescription className="pt-2 leading-relaxed">
                {dict.projects.p2_desc}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2 pt-2">
              <Badge variant="outline">React 19</Badge>
              <Badge variant="outline">TypeScript</Badge>
              <Badge variant="outline">Tailwind</Badge>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="space-y-6 pb-12">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-2xl">{dict.contact.title}</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              {dict.contact.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button variant="secondary" size="lg" asChild className="gap-2">
              <a href="mailto:accessvirgil83@gmail.com">
                <Mail className="h-4 w-4" />
                {dict.contact.sendEmail}
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="gap-2 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 border-primary-foreground/20"
            >
              <Link href="/">
                ← Басты бет / На главную
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
