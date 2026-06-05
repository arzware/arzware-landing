"use client";

import { FormEvent, useEffect, useState } from "react";
import { navItems, principles, processSteps, serviceReveals, services, trustBlocks, useCases } from "../../content/site";

function ArrowIcon() {
  return <svg className="arrow" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11m0 0-4-4m4 4-4 4" /></svg>;
}

function LogoMark() {
  return <span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 36 36"><path d="M18 3 31 10.5v15L18 33 5 25.5v-15L18 3Z"/><path d="m11.8 23 6.2-13.7L24.2 23h-3.1l-1-2.5h-4.2l-1 2.5h-3.1Zm5-4.8h2.4L18 15.1l-1.2 3.1Z"/></svg></span>;
}

function SectionHeader({ eyebrow, title, body, dark = false }: { eyebrow: string; title: string; body?: string; dark?: boolean }) {
  return <div className="section-header" data-reveal><p className="eyebrow"><span />{eyebrow}</p><h2>{title}</h2>{body ? <p className={dark ? "section-body on-dark" : "section-body"}>{body}</p> : null}</div>;
}

function Button({ children, href, variant = "primary" }: { children: React.ReactNode; href: string; variant?: "primary" | "secondary" }) {
  return <a className={`btn ${variant === "secondary" ? "btn-secondary" : "btn-primary"}`} href={href}>{children}<ArrowIcon /></a>;
}

function MiniWindow({ title, rows = 3, dark = false }: { title: string; rows?: number; dark?: boolean }) {
  return <div className={dark ? "mini-window dark-window" : "mini-window"}><div className="window-top"><span/><span/><span/><small>{title}</small></div>{Array.from({ length: rows }).map((_, i) => <div className="window-row" key={i}><b style={{ width: `${54 + i * 12}%` }} /><em /></div>)}</div>;
}

function HeroMockup() {
  return <div className="hero-system" aria-label="Layered website and business system mockup" data-reveal>
    <div className="system-layer layer-dashboard"><MiniWindow title="Dashboard" rows={4} dark /></div>
    <div className="system-layer layer-crm"><div className="record-card"><small>CRM-lite record</small><strong>Maya Haddad</strong><p>New quote request · assigned</p><span>Follow-up today</span></div></div>
    <div className="system-layer layer-form"><MiniWindow title="Smart intake" rows={3} /></div>
    <div className="system-layer layer-ai"><div className="ai-panel"><small>AI review</small><p>Suggested summary ready</p><button type="button">Approve</button></div></div>
    <div className="system-layer layer-mobile"><div className="phone-mock"><span/><b>Booking</b><p>Confirmed</p><em>Push update</em></div></div>
    <div className="website-mockup">
      <div className="browser-bar"><span/><span/><span/><small>arzware.com/client-system</small></div>
      <div className="mock-hero"><p>Modern service business</p><h3>Clear offer. Connected intake.</h3><button type="button">Request quote</button></div>
      <div className="mock-grid"><div/><div/><div/></div>
      <div className="automation-line"><i/><i/><i/><i/></div>
    </div>
  </div>;
}

function WorkflowComparison() {
  const before = ["Website", "WhatsApp", "Spreadsheet", "Manual follow-up", "Lost visibility"];
  const after = ["Website", "Smart intake", "CRM-lite record", "Dashboard", "Automation", "Team review"];
  return <div className="workflow-comparison" data-reveal>
    <div className="workflow before"><strong>Before</strong>{before.map((item) => <span key={item}>{item}</span>)}</div>
    <div className="workflow after"><strong>After</strong>{after.map((item) => <span key={item}>{item}</span>)}</div>
  </div>;
}

function ServiceVisual({ items, id }: { items: readonly string[]; id: string }) {
  return <div className={`service-visual visual-${id}`} aria-hidden="true">
    <div className="visual-screen"><div className="visual-top"><span/><span/><span/></div>{items.map((item, index) => <div className="visual-chip" key={item} style={{ transitionDelay: `${index * 80}ms` }}><b>{item}</b><em /></div>)}</div>
  </div>;
}

function PremiumServiceCards() {
  return <section className="premium-cards-section" id="premium-systems" aria-labelledby="premium-title">
    <div className="shell"><SectionHeader eyebrow="Signature systems" title="Systems built around how your business actually works." body="From premium websites to dashboards, automations, and AI-assisted tools, every build is designed to reduce friction and improve clarity." dark /></div>
    <div className="stacked-cards shell">
      {serviceReveals.map((card, index) => <article className="reveal-card" key={card.id} data-reveal style={{ top: `${96 + index * 14}px` }}>
        <div className="card-copy"><p className="card-number">0{index + 1} · {card.eyebrow}</p><h3>{card.title}</h3><p className="short-copy">{card.short}</p><p>{card.expanded}</p><Button href="#contact" variant="secondary">{card.cta}</Button></div>
        <ServiceVisual items={card.visual} id={card.id} />
      </article>)}
    </div>
  </section>;
}

function ConnectedMap() {
  const modules = ["Website", "Forms", "Customer Data", "Dashboard", "Automation", "AI Assist", "Notifications", "Reports"];
  return <div className="operations-map" data-reveal>{modules.map((module, index) => <div className="map-node" key={module} style={{ transitionDelay: `${index * 80}ms` }}><span>{String(index + 1).padStart(2, "0")}</span>{module}</div>)}</div>;
}

function ContactForm() {
  const [status, setStatus] = useState("We’ll use this to prepare the right modernization conversation.");
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const nextErrors: Record<string, string[]> = {};
    if (String(data.name ?? "").trim().length < 2) nextErrors.name = ["Name is required"];
    if (String(data.company ?? "").trim().length < 1) nextErrors.company = ["Company is required"];
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email ?? ""))) nextErrors.email = ["Use a valid email address"];
    if (String(data.need ?? "").trim().length < 1) nextErrors.need = ["Choose what you need help with"];
    if (String(data.message ?? "").trim().length < 12) nextErrors.message = ["Tell us what needs to work better"];
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); setStatus("Please fix the highlighted fields."); return; }
    const subject = encodeURIComponent(`Arzware project brief from ${String(data.name)}`);
    const body = encodeURIComponent(Object.entries(data).map(([key, value]) => `${key}: ${value}`).join("\n"));
    window.location.href = `mailto:hello@arzware.com?subject=${subject}&body=${body}`;
    setStatus("Your email app should open with the project brief prepared.");
    form.reset();
  }

  return <form className="lead-form" onSubmit={handleSubmit} noValidate data-reveal>
    <h3>Tell us what needs to work better.</h3>
    <div className="form-grid">
      <Field id="name" label="Name" error={errors.name?.[0]} required />
      <Field id="company" label="Company" error={errors.company?.[0]} required />
      <Field id="email" label="Email" type="email" error={errors.email?.[0]} required />
      <Field id="phone" label="Phone / WhatsApp" error={errors.phone?.[0]} />
      <Field id="businessType" label="Business type" error={errors.businessType?.[0]} />
      <label>What do you need help with? <span>*</span><select name="need" required defaultValue=""><option value="" disabled>Choose one</option><option>Website / landing page</option><option>Dashboard</option><option>Internal system</option><option>Automation</option><option>AI-assisted workflow</option><option>Mobile app</option><option>Not sure yet</option></select>{errors.need ? <em>{errors.need[0]}</em> : null}</label>
    </div>
    <Field id="website" label="Current website URL" error={errors.website?.[0]} />
    <label>What feels outdated, manual, scattered, or unclear? <span>*</span><textarea name="message" rows={5} required />{errors.message ? <em>{errors.message[0]}</em> : null}</label>
    <button className="btn btn-primary" type="submit">Send a project brief <ArrowIcon /></button>
    <p className="form-status" role="status" aria-live="polite">{status}</p>
  </form>;
}

function Field({ id, label, type = "text", error, required = false }: { id: string; label: string; type?: string; error?: string; required?: boolean }) {
  return <label htmlFor={id}>{label} {required ? <span>*</span> : null}<input id={id} name={id} type={type} required={required} aria-invalid={!!error} />{error ? <em>{error}</em> : null}</label>;
}

export default function ArzwareLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeCase, setActiveCase] = useState(0);

  useEffect(() => {
    document.documentElement.classList.add("js");
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (reduced || !("IntersectionObserver" in window)) nodes.forEach((node) => node.classList.add("is-visible"));
    else {
      const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }), { threshold: 0.12, rootMargin: "0px 0px -80px" });
      nodes.forEach((node) => observer.observe(node));
      return () => { window.removeEventListener("scroll", onScroll); observer.disconnect(); };
    }
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <>
    <a className="skip-link" href="#main">Skip to main content</a>
    <header className={scrolled ? "site-header is-scrolled" : "site-header"}>
      <nav className="nav shell" aria-label="Primary navigation"><a className="brand" href="#top"><LogoMark />Arzware</a><button className="menu-button" type="button" aria-expanded={menuOpen} aria-controls="nav-links" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}><span/><span/><span/></button><div className={menuOpen ? "nav-links is-open" : "nav-links"} id="nav-links">{navItems.map((item) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>)}<a className="nav-cta" href="#contact">Book a Call</a></div></nav>
    </header>

    <main id="main">
      <section className="hero dark-section" id="top" aria-labelledby="hero-title"><div className="shell hero-layout"><div className="hero-copy" data-reveal><p className="eyebrow"><span/>Software systems for cleaner operations</p><h1 id="hero-title"><span>More than a better website.</span><span>A better digital system behind it.</span></h1><p>Arzware builds premium websites, dashboards, automations, internal tools, and AI-assisted workflows for businesses ready to replace scattered manual work with cleaner digital operations.</p><div className="hero-actions"><Button href="#contact">Book a modernization call</Button><Button href="#premium-systems" variant="secondary">Explore what we build</Button></div></div><HeroMockup /></div></section>

      <section className="problem-section" id="systems"><div className="shell split"><div data-reveal><p className="eyebrow"><span/>Problem / opportunity</p><h2>Most businesses do not have a website problem. They have a system problem.</h2><p>Your website, forms, WhatsApp messages, spreadsheets, bookings, follow-ups, and internal decisions often live in separate places. Arzware connects the pieces into cleaner digital operations.</p><Button href="#operations" variant="secondary">See how systems connect</Button></div><WorkflowComparison /></div></section>

      <PremiumServiceCards />

      <section className="operations-section dark-section" id="operations"><div className="shell"><SectionHeader eyebrow="Connected operations" title="Not isolated tools. Connected digital operations." body="A modern business needs intake, data, follow-up, visibility, and automation working together. Arzware designs the system before building the screens." dark /><ConnectedMap /><div className="center-cta"><Button href="#contact">Map your workflow</Button></div></div></section>

      <section className="services-section" id="services"><div className="shell"><SectionHeader eyebrow="Services" title="What Arzware builds" body="Premium front-end experiences, custom software, and business systems designed to make work clearer." /><div className="service-list">{services.map(([title, copy], index) => <article key={title} data-reveal><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{copy}</p></article>)}</div><Button href="#premium-systems" variant="secondary">Explore services</Button></div></section>

      <section className="process-section dark-section" id="process"><div className="shell"><SectionHeader eyebrow="Process" title="A clear process before a single screen is built." body="Arzware starts by understanding how your business works, then designs and builds the right system around it." dark /><div className="timeline">{processSteps.map(([title, copy], index) => <article key={title} data-reveal><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{copy}</p></article>)}</div><div className="center-cta"><Button href="#contact">Start with a system audit</Button></div></div></section>

      <section className="use-cases" id="use-cases"><div className="shell"><SectionHeader eyebrow="Use cases" title="Built for businesses where better systems create better service." /><div className="case-layout"><div className="case-tabs" role="tablist" aria-label="Use cases">{useCases.map(([title], index) => <button key={title} role="tab" aria-selected={activeCase === index} onClick={() => setActiveCase(index)}>{title}</button>)}</div><div className="case-card" data-reveal><h3>{useCases[activeCase][0]}</h3><p>{useCases[activeCase][1]}</p><div>{useCases[activeCase][2].map((item) => <span key={item}>{item}</span>)}</div></div></div><Button href="#contact" variant="secondary">Find your use case</Button></div></section>

      <section className="ai-section dark-section" id="ai"><div className="shell split"><div data-reveal><p className="eyebrow"><span/>Responsible AI</p><h2>AI where it helps. Human review where it matters.</h2><p>Arzware designs AI-assisted workflows that help with summaries, routing, drafting, classification, recommendations, and content support. Sensitive decisions and customer-critical actions remain visible and reviewable.</p><Button href="#contact">Discuss an AI-assisted workflow</Button></div><div className="ai-flow" data-reveal>{["Input", "AI Assist", "Human Review", "Approved Action"].map((item) => <span key={item}>{item}</span>)}</div></div></section>

      <section className="why-section"><div className="shell split"><div data-reveal><p className="eyebrow"><span/>Why Arzware</p><h2>Designed like a product. Built like infrastructure. Managed like a business system.</h2><ul className="principles">{principles.map((item) => <li key={item}>{item}</li>)}</ul></div><div className="evolving-mockup" data-reveal><MiniWindow title="System foundation" rows={5} /><MiniWindow title="Operations layer" rows={4} dark /></div></div></section>

      <section className="trust-section"><div className="shell"><SectionHeader eyebrow="Trust" title="Built with clarity, not guesswork." /><div className="trust-grid">{trustBlocks.map((item) => <article key={item} data-reveal><span>✓</span>{item}</article>)}</div><div className="center-cta"><Button href="#contact" variant="secondary">Request a project estimate</Button></div></div></section>

      <section className="final-cta dark-section"><div className="shell split"><div data-reveal><h2>Ready to turn your digital setup into a cleaner system?</h2><p>Tell us what feels outdated, manual, scattered, or unclear. We’ll help identify what should become a website, dashboard, automation, app, or internal tool.</p><div className="hero-actions"><Button href="#contact">Book a modernization call</Button><Button href="#contact" variant="secondary">Send a project brief</Button></div></div><div className="aligning-pieces" data-reveal><span/><span/><span/><span/><strong>One clean system</strong></div></div></section>

      <section className="contact-section" id="contact"><div className="shell split"><div data-reveal><p className="eyebrow"><span/>Contact</p><h2>Tell us what needs to work better.</h2><p>One clear primary action: book a modernization call. If you already know the problem, send a project brief and we’ll prepare the right discovery path.</p><div className="contact-links"><a href="mailto:hello@arzware.com">Email</a><a href="https://wa.me/" rel="noreferrer">Ask a quick question on WhatsApp</a></div></div><ContactForm /></div></section>
    </main>

    <footer className="footer dark-section"><div className="shell footer-grid"><div><a className="brand" href="#top"><LogoMark />Arzware</a><p>Arzware builds modern websites, software systems, dashboards, automations, and AI-assisted workflows for businesses ready to operate cleaner.</p></div><div className="footer-links"><a href="#services">Services</a><a href="#process">Process</a><a href="#use-cases">Use Cases</a><a href="#contact">Contact</a><a href="mailto:hello@arzware.com">Email</a><a href="https://wa.me/" rel="noreferrer">WhatsApp</a><a href="#top">Legal</a></div></div></footer>
  </>;
}
