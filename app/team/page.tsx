import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { leadership } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "Team",
  description: "The people behind KodeDristi's client work and course programs.",
};

const TEAM = [
  ...leadership,
  { name: "Bipan Pandey", role: "Graphics Designer", bio: "Crafts visual identity and graphics across KodeDristi's brand, products and events." },
  { name: "Pratima Khanal", role: "Marketing & PR Lead", bio: "Owns brand communications, community and public relations for KodeDristi." },
  { name: "Rishab Dev Chudali", role: "Flutter Developer", bio: "Builds cross-platform mobile applications for clients and in-house products." },
  { name: "Sanjish Thapa Magar", role: "Backend Developer", bio: "Designs and ships reliable APIs and backend services for client systems." },
  { name: "Rakesh Singh", role: "QA Engineer", bio: "Keeps every release verified across automated and manual testing." },
  { name: "Anish Basnet", role: "Legal & Accounting", bio: "Handles legal compliance, contracts and financial operations." },
  { name: "Abiskar Dahal", role: "Database Engineer", bio: "Designs data models and keeps systems consistent and performant at scale." },
  { name: "Sujal Panday", role: "Frontend Developer", bio: "Builds polished, accessible front-end experiences for client applications." },
  { name: "Sunny Jha", role: "IT Support Engineer", bio: "Keeps infrastructure, devices and internal tooling running smoothly." },
];

export default function TeamPage() {
  return (
    <>
      <PageHero
        eyebrow="Company"
        title="Team"
        description="A small, senior bench across engineering, design and instruction — the same people on your project are the ones teaching our courses."
      >
        <Button href="/careers" size="lg">
          View Open Roles <ArrowRight className="h-4 w-4" />
        </Button>
      </PageHero>

      <section className="py-16 sm:py-20">
        <Container className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((person) => (
            <div key={person.name} className="card p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-blue text-lg font-bold text-white">
                {person.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <h3 className="mt-4 font-semibold text-text-primary">{person.name}</h3>
              <p className="text-sm font-medium text-brand-blue">{person.role}</p>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">{person.bio}</p>
            </div>
          ))}
        </Container>
      </section>
    </>
  );
}
