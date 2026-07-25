import ProjectGrid from "../../components/ProjectGrid";

export const metadata = {
  title: "Works",
  description:
    "Selected product design, landing page, and branding work by Sreedev VP.",
  alternates: {
    canonical: "/works",
  },
  openGraph: {
    url: "/works",
  },
};

export default function WorksPage() {
  return (
    <main className="standalone-main">
      <ProjectGrid />
    </main>
  );
}
