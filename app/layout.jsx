import "./globals.css";
import InteractiveBackground from "../components/InteractiveBackground";
import PageEffects from "../components/PageEffects";
import SiteHeader from "../components/SiteHeader";

export const metadata = {
  title: {
    default: "Sreedev VP - Product Designer",
    template: "%s - Sreedev VP",
  },
  description:
    "Sreedev VP is a product designer working across UI/UX, visual design, branding, and digital product experiences.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
              try {
                const saved = localStorage.getItem("sreedev-theme");
                const theme = saved === "dark" ? "dark" : "light";
                document.documentElement.dataset.theme = theme;
                document.documentElement.style.colorScheme = theme;
              } catch (_) {
                document.documentElement.dataset.theme = "light";
              }
            })();`,
          }}
        />
      </head>
      <body>
        <PageEffects />
        <InteractiveBackground />
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
