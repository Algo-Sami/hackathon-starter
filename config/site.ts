export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  url: string;
  eventDetails: {
    name: string;
    city: string;
    attendees: string;
    budget: string;
    duration: string;
  };
  navItems: Array<{
    key: string;
    href: string;
    label: string;
  }>;
}

export const siteConfig: SiteConfig = {
  name: "EventMind AI",
  tagline: "Intelligent Event Planning & Decision System",
  description:
    "Converts unstructured event messages in English & Roman Urdu into a valid, explainable, and incrementally updateable five-area event plan.",
  url: "https://hackathon-starter-kappa.vercel.app",
  eventDetails: {
    name: "Physical Hackathon Islamabad",
    city: "Islamabad, Pakistan",
    attendees: "150 Students (50 Teams) + 10 Staff + 17 Judges",
    budget: "Rs 650,000",
    duration: "4.0 Hours",
  },
  navItems: [
    { key: "nav.dashboard", href: "/", label: "Dashboard" },
    { key: "nav.plan", href: "/plan", label: "Event Plan" },
    { key: "nav.messages", href: "/messages", label: "Messages" },
    { key: "nav.trace", href: "/trace", label: "AI Trace" },
    { key: "nav.about", href: "/about", label: "About / Brief" },
  ],
};
