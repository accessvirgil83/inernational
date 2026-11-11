import { getDictionary, type Locale } from "@/lib/get-dictionary";
import { Navbar } from "@/components/navbar";

export async function generateStaticParams() {
  return [{ lang: "ru" }, { lang: "kk" }];
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const safeLang = (lang === "kk" ? "kk" : "ru") as Locale;
  const dict = await getDictionary(safeLang);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar lang={safeLang} dict={dict.nav} />
      <div className="flex-1">{children}</div>
      <footer className="border-t py-8 text-center text-sm text-muted-foreground bg-muted/20">
        <div className="container mx-auto px-4">
          <p>© 2026 Inernational. {dict.footer.copyright}</p>
        </div>
      </footer>
    </div>
  );
}
