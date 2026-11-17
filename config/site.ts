export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  url: string;
  contact: {
    email: string;
    phone: string;
    address: string;
    hours: string;
  };
  social: {
    github: string;
    twitter: string;
    linkedin: string;
  };
  navItems: Array<{
    key: string;
    href: string;
  }>;
}

export const siteConfig: SiteConfig = {
  name: "YourApp",
  tagline: "A clean, modern foundation for your next product.",
  description: "A reusable, production-ready starter built with Next.js App Router, TypeScript, and Tailwind CSS.",
  url: "https://yourapp.example.com",
  contact: {
    email: "hello@yourapp.example.com",
    phone: "+1 (555) 234-5678",
    address: "100 Innovation Way, Suite 400, San Francisco, CA 94105",
    hours: "Monday – Friday, 9:00 AM – 6:00 PM EST",
  },
  social: {
    github: "https://github.com",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
  },
  navItems: [
    { key: "nav.home", href: "/#home" },
    { key: "nav.features", href: "/#features" },
    { key: "nav.about", href: "/#about" },
    { key: "nav.contact", href: "/#contact" },
  ],
};
