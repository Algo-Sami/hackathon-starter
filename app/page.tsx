import Link from "next/link";
import { ArrowRight, Compass, Target, Mail, Phone, MapPin, Clock } from "lucide-react";
import {
  homeFeatureSummary,
  howItWorksSteps,
  featuresList,
  aboutTeamMembers,
} from "@/config/content";
import { siteConfig } from "@/config/site";
import { ContactForm } from "@/components/contact/ContactForm";
import { t } from "@/lib/i18n";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Portion */}
      <section
        id="home"
        className="py-20 sm:py-24 lg:py-28 border-b border-border bg-background scroll-mt-16"
      >
        <div className="site-container text-center max-w-[840px]">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary-light text-primary border border-primary-accent/30 mb-6">
            <span>{t("home.hero.badge")}</span>
          </div>

          {/* Headline: 48px desktop, 36px mobile */}
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-foreground leading-[1.15] mb-6">
            {t("home.hero.title")}
          </h1>

          {/* One sentence supporting text */}
          <p className="text-base sm:text-lg text-muted max-w-[660px] mx-auto leading-relaxed mb-8">
            {t("home.hero.subtitle")}
          </p>

          {/* Two buttons: Primary and Secondary (~40px tall) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="w-full sm:w-auto h-10 px-6 inline-flex items-center justify-center text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded transition-colors shadow-xs"
            >
              <span>{t("home.hero.getStarted")}</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>

            <Link
              href="/#features"
              className="w-full sm:w-auto h-10 px-6 inline-flex items-center justify-center text-sm font-medium text-foreground bg-background hover:bg-surface border border-border rounded transition-colors"
            >
              {t("home.hero.learnMore")}
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Features Portion (Summary + 6 Feature Grid) */}
      <section
        id="features"
        className="py-20 lg:py-24 bg-surface border-b border-border scroll-mt-16"
      >
        <div className="site-container">
          {/* Header */}
          <div className="text-center max-w-[680px] mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-3">
              {t("featuresPage.hero.title")}
            </h2>
            <p className="text-sm sm:text-base text-muted">
              {t("featuresPage.hero.subtitle")}
            </p>
          </div>

          {/* 3-Item Quick Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
            {homeFeatureSummary.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  className="bg-background border border-border rounded p-6 sm:p-7 flex flex-col transition-colors hover:border-border/80"
                >
                  <div className="w-10 h-10 rounded bg-primary-light flex items-center justify-center text-primary mb-5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground tracking-tight mb-2">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {t(feature.descriptionKey)}
                  </p>
                </div>
              );
            })}
          </div>

          {/* 6 Capabilities Grid */}
          <div className="pt-8 border-t border-border">
            <div className="text-center max-w-[600px] mx-auto mb-10">
              <h3 className="text-xl font-semibold text-foreground tracking-tight mb-2">
                {t("home.features.sectionTitle")}
              </h3>
              <p className="text-sm text-muted">
                {t("home.features.sectionSubtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuresList.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.id}
                    className="bg-background border border-border rounded p-6 flex flex-col transition-colors hover:border-border/80"
                  >
                    <div className="w-9 h-9 rounded bg-primary-light flex items-center justify-center text-primary mb-4">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-base font-semibold text-foreground tracking-tight mb-1.5">
                      {t(feature.titleKey)}
                    </h4>
                    <p className="text-xs sm:text-sm text-muted leading-relaxed">
                      {t(feature.descriptionKey)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3. "How It Works" Portion (3 Numbered Steps) */}
      <section className="py-20 lg:py-24 bg-background border-b border-border">
        <div className="site-container">
          <div className="text-center max-w-[680px] mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-3">
              {t("home.howItWorks.sectionTitle")}
            </h2>
            <p className="text-sm sm:text-base text-muted">
              {t("home.howItWorks.sectionSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {howItWorksSteps.map((step) => (
              <div
                key={step.step}
                className="relative bg-surface border border-border rounded p-7 flex flex-col"
              >
                <div className="text-2xl font-bold text-primary mb-4 font-mono">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-foreground tracking-tight mb-2">
                  {t(step.titleKey)}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {t(step.descriptionKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. About Portion (Mission, Our Goal, Team) */}
      <section
        id="about"
        className="py-20 lg:py-24 bg-surface border-b border-border scroll-mt-16"
      >
        <div className="site-container">
          {/* Header */}
          <div className="text-center max-w-[680px] mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-3">
              {t("about.hero.title")}
            </h2>
            <p className="text-sm sm:text-base text-muted">
              {t("about.hero.subtitle")}
            </p>
          </div>

          {/* Mission & Goal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[900px] mx-auto mb-16">
            <div className="bg-background border border-border rounded p-7 sm:p-8">
              <div className="w-10 h-10 rounded bg-primary-light flex items-center justify-center text-primary mb-5">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-foreground tracking-tight mb-3">
                {t("about.mission.title")}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {t("about.mission.text")}
              </p>
            </div>

            <div className="bg-background border border-border rounded p-7 sm:p-8">
              <div className="w-10 h-10 rounded bg-primary-light flex items-center justify-center text-primary mb-5">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-foreground tracking-tight mb-3">
                {t("about.goal.title")}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {t("about.goal.text")}
              </p>
            </div>
          </div>

          {/* Team Cards (3 dummy member cards with initials in a circle) */}
          <div className="max-w-[960px] mx-auto">
            <div className="text-center mb-10">
              <h3 className="text-xl font-semibold text-foreground tracking-tight mb-2">
                {t("about.team.title")}
              </h3>
              <p className="text-sm text-muted">
                {t("about.team.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {aboutTeamMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-background border border-border rounded p-6 sm:p-8 text-center flex flex-col items-center transition-colors hover:border-border/80"
                >
                  <div className="w-16 h-16 rounded-full bg-primary-light border border-primary-accent/30 text-primary font-semibold text-lg flex items-center justify-center mb-4 select-none">
                    {member.initials}
                  </div>
                  <h4 className="text-base font-semibold text-foreground tracking-tight mb-1">
                    {t(member.nameKey)}
                  </h4>
                  <p className="text-xs text-muted font-medium">
                    {t(member.roleKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Contact Portion (Contact Form + Contact Info Beside It) */}
      <section
        id="contact"
        className="py-20 lg:py-24 bg-background border-b border-border scroll-mt-16"
      >
        <div className="site-container max-w-[1000px]">
          <div className="text-center max-w-[680px] mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-3">
              {t("contact.title")}
            </h2>
            <p className="text-sm sm:text-base text-muted">
              {t("contact.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Form Column */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

            {/* Info Beside Form */}
            <div className="lg:col-span-5 bg-surface border border-border rounded p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground tracking-tight mb-1">
                  {t("contact.info.title")}
                </h3>
                <p className="text-xs text-muted">
                  {siteConfig.tagline}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-primary-light flex items-center justify-center text-primary shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">
                      {t("contact.info.emailLabel")}
                    </h4>
                    <a
                      href={`mailto:${siteConfig.contact.email}`}
                      className="text-sm text-foreground hover:text-primary transition-colors break-all"
                    >
                      {siteConfig.contact.email}
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-primary-light flex items-center justify-center text-primary shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">
                      {t("contact.info.phoneLabel")}
                    </h4>
                    <a
                      href={`tel:${siteConfig.contact.phone.replace(/[^0-9+]/g, "")}`}
                      className="text-sm text-foreground hover:text-primary transition-colors"
                    >
                      {siteConfig.contact.phone}
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-primary-light flex items-center justify-center text-primary shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">
                      {t("contact.info.addressLabel")}
                    </h4>
                    <p className="text-sm text-foreground leading-relaxed">
                      {siteConfig.contact.address}
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-primary-light flex items-center justify-center text-primary shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">
                      {t("contact.info.hoursLabel")}
                    </h4>
                    <p className="text-sm text-foreground">
                      {siteConfig.contact.hours}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Closing Call-to-Action Strip */}
      <section className="py-16 sm:py-20 bg-surface">
        <div className="site-container text-center max-w-[720px]">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-4">
            {t("home.cta.title")}
          </h2>
          <p className="text-base text-muted leading-relaxed mb-8">
            {t("home.cta.subtitle")}
          </p>
          <div className="flex justify-center">
            <Link
              href="/register"
              className="h-10 px-6 inline-flex items-center justify-center text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded transition-colors shadow-xs"
            >
              {t("home.cta.button")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
