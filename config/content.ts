import {
  Zap,
  Boxes,
  ShieldCheck,
  Globe,
  Layers,
  Code2,
  LucideIcon,
} from "lucide-react";

export interface FeatureItem {
  id: string;
  icon: LucideIcon;
  titleKey: string;
  descriptionKey: string;
}

export interface HowItWorksStep {
  step: string;
  titleKey: string;
  descriptionKey: string;
}

export interface TeamMember {
  id: string;
  initials: string;
  nameKey: string;
  roleKey: string;
}

export interface FooterLink {
  labelKey: string;
  href: string;
}

export interface FooterSection {
  titleKey: string;
  links: FooterLink[];
}

export const homeFeatureSummary: FeatureItem[] = [
  {
    id: "fast",
    icon: Zap,
    titleKey: "home.features.items.fast.title",
    descriptionKey: "home.features.items.fast.description",
  },
  {
    id: "modular",
    icon: Boxes,
    titleKey: "home.features.items.modular.title",
    descriptionKey: "home.features.items.modular.description",
  },
  {
    id: "accessible",
    icon: ShieldCheck,
    titleKey: "home.features.items.accessible.title",
    descriptionKey: "home.features.items.accessible.description",
  },
];

export const howItWorksSteps: HowItWorksStep[] = [
  {
    step: "01",
    titleKey: "home.howItWorks.step1.title",
    descriptionKey: "home.howItWorks.step1.description",
  },
  {
    step: "02",
    titleKey: "home.howItWorks.step2.title",
    descriptionKey: "home.howItWorks.step2.description",
  },
  {
    step: "03",
    titleKey: "home.howItWorks.step3.title",
    descriptionKey: "home.howItWorks.step3.description",
  },
];

export const aboutTeamMembers: TeamMember[] = [
  {
    id: "member1",
    initials: "SJ",
    nameKey: "about.team.members.member1.name",
    roleKey: "about.team.members.member1.role",
  },
  {
    id: "member2",
    initials: "AR",
    nameKey: "about.team.members.member2.name",
    roleKey: "about.team.members.member2.role",
  },
  {
    id: "member3",
    initials: "MP",
    nameKey: "about.team.members.member3.name",
    roleKey: "about.team.members.member3.role",
  },
];

export const featuresList: FeatureItem[] = [
  {
    id: "feature1",
    icon: Zap,
    titleKey: "featuresPage.items.feature1.title",
    descriptionKey: "featuresPage.items.feature1.description",
  },
  {
    id: "feature2",
    icon: Boxes,
    titleKey: "featuresPage.items.feature2.title",
    descriptionKey: "featuresPage.items.feature2.description",
  },
  {
    id: "feature3",
    icon: ShieldCheck,
    titleKey: "featuresPage.items.feature3.title",
    descriptionKey: "featuresPage.items.feature3.description",
  },
  {
    id: "feature4",
    icon: Globe,
    titleKey: "featuresPage.items.feature4.title",
    descriptionKey: "featuresPage.items.feature4.description",
  },
  {
    id: "feature5",
    icon: Layers,
    titleKey: "featuresPage.items.feature5.title",
    descriptionKey: "featuresPage.items.feature5.description",
  },
  {
    id: "feature6",
    icon: Code2,
    titleKey: "featuresPage.items.feature6.title",
    descriptionKey: "featuresPage.items.feature6.description",
  },
];

export const footerSections: FooterSection[] = [
  {
    titleKey: "footer.productTitle",
    links: [
      { labelKey: "nav.features", href: "/#features" },
      { labelKey: "nav.home", href: "/#home" },
      { labelKey: "nav.signup", href: "/register" },
      { labelKey: "nav.login", href: "/login" },
    ],
  },
  {
    titleKey: "footer.companyTitle",
    links: [
      { labelKey: "nav.about", href: "/#about" },
      { labelKey: "nav.contact", href: "/#contact" },
    ],
  },
];

export const chatSuggestionChips = [
  "chat.chips.chip1",
  "chat.chips.chip2",
  "chat.chips.chip3",
];
