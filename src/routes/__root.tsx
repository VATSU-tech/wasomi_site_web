import {
  Outlet,
  Link,
  createRootRoute,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import appCss from "../styles.css?url";
import { ThemeProvider } from "@/components/theme-provider";
import { AppQueryProvider } from '@/providers/query-provider';
import { Toaster } from '@/components/ui/sonner';
import { AosProvider } from "@/components/aos-provider";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { cn } from "@/lib/utils";
import { AudioStoryWidget } from "@/components/site/AudioStoryWidget";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 bg-mesh">
      <div className="max-w-md text-center" data-aos="zoom-in">
        <h1 className="font-display text-8xl font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Page introuvable
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Cette page n'existe pas ou a été déplacée.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant hover:shadow-glow transition-smooth"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      {
        httpEquiv: "Permissions-Policy",
        content: "camera=(), microphone=(), geolocation=(), bluetooth=()",
      },
      { title: "Wasomi — École d'excellence" },
      {
        name: "description",
        content:
          "Wasomi forme les talents de demain à travers des programmes innovants et un accompagnement personnalisé.",
      },
      { name: "author", content: "Wasomi" },
      { property: "og:title", content: "Wasomi — École d'excellence" },
      { property: "og:description", content: "Forme les talents de demain." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/jpeg", href: "/icon.jpg" },
      { rel: "apple-touch-icon", href: "/icon.jpg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "School",
                  name: "Complexe Scolaire Wasomi",
                  alternateName: "CS Wasomi",
                  telephone: "+243997742651",
                  email: "cswasomi@gmail.com",
                  foundingDate: "2021",
                  address: {
                    "@type": "PostalAddress",
                    streetAddress: "Rue N°5, Q. Résidentiel, C. Bungulu",
                    addressLocality: "Beni",
                    addressRegion: "Nord-Kivu",
                    addressCountry: "CD",
                  },
                  url: "https://wasomi.cd/",
                },
                {
                  "@type": "WebSite",
                  name: "CS Wasomi",
                  url: "https://wasomi.cd/",
                  inLanguage: "fr",
                },
              ],
            }),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');var r=document.documentElement;r.classList.toggle('dark',t==='dark');r.setAttribute('data-theme',t==='dark'?'indigo-midnight':'indigo-light');}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAppPortal = pathname.startsWith('/app');

  return (
    <ThemeProvider>
      <AppQueryProvider>
      <AosProvider>
        {isAppPortal ? (
          <div data-theme="school" className="min-h-screen">
            <Outlet />
            <Toaster />
          </div>
        ) : (
          <>
            <div className="scroll-progress" />
            <a href="#main-content" className="skip-to-content">
              Aller au contenu
            </a>
            <div className="site-shell min-h-screen flex flex-col overflow-x-clip">
              <Navbar />
              <main
                id="main-content"
                className={cn("flex-1 min-w-0", pathname === "/" ? "" : "pt-24")}
              >
                <div
                  key={pathname}
                  className="animate-page-in"
                >
                  <Outlet />
                </div>
              </main>
              <Footer />
              <AudioStoryWidget />
              <BackToTop />
              <Toaster />
            </div>
          </>
        )}
      </AosProvider>
      </AppQueryProvider>
    </ThemeProvider>
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Retour en haut de page"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "back-to-top size-11 rounded-2xl bg-gradient-primary text-primary-foreground shadow-xl flex items-center justify-center hover:-translate-y-1 transition-transform",
        visible && "visible",
      )}
    >
      <ArrowUp className="size-5" />
    </button>
  );
}
