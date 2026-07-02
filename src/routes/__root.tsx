import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { AuthProvider } from "@/hooks/use-auth";
import { Toaster } from "@/components/ui/sonner";
import { PlatformBootstrap } from "@/components/learning/platform-bootstrap";
import { RealtimeSyncProvider } from "@/contexts/realtime-sync-context";
import { OpeningAnimation } from "@/components/ui/opening-animation";
import { ThemeProvider } from "@/contexts/theme-context";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Lost in the nebula</h2>
        <p className="mt-2 text-sm text-muted-foreground">This page drifted off the route map.</p>
        <Link to="/" className="mt-6 inline-flex rounded-md gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow">Back to home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button onClick={() => { router.invalidate(); reset(); }} className="mt-6 rounded-md gradient-primary px-4 py-2 text-sm text-primary-foreground">Try again</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "NebulaLearn — Courses, Competitions & Live Learning" },
      { name: "description", content: "Learn AI, cybersecurity, data, and cloud. Join hackathons, attend live webinars, store projects, and showcase your GitHub repos." },
      { property: "og:title", content: "NebulaLearn — Courses, Competitions & Live Learning" },
      { property: "og:description", content: "Learn AI, cybersecurity, data, and cloud. Join hackathons, attend live webinars, store projects, and showcase your GitHub repos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { name: "twitter:title", content: "NebulaLearn — Courses, Competitions & Live Learning" },
      { name: "twitter:description", content: "Learn AI, cybersecurity, data, and cloud. Join hackathons, attend live webinars, store projects, and showcase your GitHub repos." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1949dcbc-3518-4b82-b0be-6c2dea0d2248/id-preview-a48830f7--3b662031-25a7-465e-b274-106f696bafb3.lovable.app-1779007533251.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1949dcbc-3518-4b82-b0be-6c2dea0d2248/id-preview-a48830f7--3b662031-25a7-465e-b274-106f696bafb3.lovable.app-1779007533251.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <RealtimeSyncProvider>
            <PlatformBootstrap />
            <OpeningAnimation>
              <Outlet />
            </OpeningAnimation>
            <Toaster />
          </RealtimeSyncProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
