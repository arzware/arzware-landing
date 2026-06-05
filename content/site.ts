export const navItems = [
  { label: "Services", href: "#services" },
  { label: "Systems", href: "#systems" },
  { label: "Process", href: "#process" },
  { label: "Use Cases", href: "#use-cases" },
  { label: "AI", href: "#ai" },
  { label: "Contact", href: "#contact" },
] as const;

export const serviceReveals = [
  {
    id: "websites",
    eyebrow: "Website systems",
    title: "Websites that convert and clarify.",
    short: "Premium websites that explain your business clearly and guide visitors toward action.",
    expanded:
      "Your website should do more than look modern. It should build trust, capture the right leads, and connect cleanly to the systems behind your business.",
    cta: "Build a better website",
    visual: ["Hero message", "Service cards", "Lead form", "Analytics ready"],
  },
  {
    id: "software",
    eyebrow: "Custom software",
    title: "Software shaped around your workflow.",
    short: "Custom tools for the exact way your team manages work.",
    expanded:
      "When off-the-shelf tools create more work than they remove, Arzware builds custom systems for requests, customers, bookings, approvals, tasks, and internal operations.",
    cta: "Plan a custom system",
    visual: ["Requests", "Owners", "Approvals", "Status pipeline"],
  },
  {
    id: "dashboards",
    eyebrow: "Dashboards & CRM-lite",
    title: "Dashboards that make operations visible.",
    short: "See customers, requests, tasks, and bottlenecks in one clean place.",
    expanded:
      "Arzware builds dashboards and CRM-lite systems that help owners and teams understand what is happening without digging through spreadsheets, inboxes, or WhatsApp threads.",
    cta: "Design a dashboard",
    visual: ["Customer activity", "Filters", "Metrics", "Request table"],
  },
  {
    id: "automation",
    eyebrow: "Automation",
    title: "Automation that removes repetitive work.",
    short: "Connect forms, notifications, reminders, and follow-ups.",
    expanded:
      "Automation helps your team spend less time copying, chasing, and repeating. Arzware connects the right steps while keeping important actions visible.",
    cta: "Automate a workflow",
    visual: ["Trigger", "Condition", "Action", "Notification"],
  },
  {
    id: "ai",
    eyebrow: "AI-assisted systems",
    title: "AI assistance, without losing control.",
    short: "Use AI to speed up admin work while keeping human review.",
    expanded:
      "AI can summarize requests, draft responses, classify leads, support content, or recommend next steps. Arzware designs review points so your team stays in control.",
    cta: "Explore responsible AI",
    visual: ["Input", "Suggested summary", "Confidence", "Approve"],
  },
  {
    id: "mobile",
    eyebrow: "Mobile experiences",
    title: "Mobile apps when the business case is real.",
    short: "Focused mobile tools for customers, staff, field teams, or repeat engagement.",
    expanded:
      "Not every business needs an app. When mobile access, push notifications, camera/location use, field work, or repeat customer engagement matters, Arzware can build focused mobile experiences.",
    cta: "Discuss a mobile experience",
    visual: ["Booking", "Staff tasks", "Customer portal", "Push update"],
  },
] as const;

export const services = [
  ["Websites and landing pages", "Fast, premium, conversion-focused websites connected to the systems behind the business."],
  ["Web apps and internal tools", "Custom portals, admin panels, and workflow tools built around real business processes."],
  ["Dashboards and CRM-lite systems", "One clean place to manage customers, requests, bookings, orders, tasks, or reports."],
  ["Automation workflows", "Repetitive steps reduced through connected forms, notifications, routing, and follow-ups."],
  ["AI-assisted business tools", "Summaries, drafting, classification, recommendations, and review queues where AI helps without taking control."],
  ["Mobile apps", "Built only when mobile access, push notifications, field work, or repeat engagement justify the complexity."],
] as const;

export const processSteps = [
  ["Discover", "Understand the business, users, bottlenecks, and goals."],
  ["Map", "Turn scattered workflows into a clear system plan."],
  ["Design", "Create premium interfaces and practical user journeys."],
  ["Build", "Develop fast, scalable, maintainable systems."],
  ["Launch", "Deploy, test, train, and refine."],
  ["Improve", "Use feedback and analytics to keep the system useful."],
] as const;

export const useCases = [
  ["Clinics & Dentists", "Patient intake, booking, reminders, dashboards, and follow-up workflows.", ["Patient intake", "Reminder queue", "Visit dashboard"]],
  ["Restaurants", "Menu systems, reservations, customer capture, internal dashboards, and order workflows.", ["Reservation flow", "Menu admin", "Order visibility"]],
  ["Service Businesses", "Lead capture, quote requests, job status tracking, and CRM-lite follow-up.", ["Quote intake", "Job status", "Follow-up CRM"]],
  ["Consultants & Growing Teams", "Premium landing pages, client portals, reporting dashboards, and document workflows.", ["Client portal", "Reports", "Document workflow"]],
] as const;

export const trustBlocks = [
  "Clear scope before build",
  "Workflow map before design",
  "Responsive interfaces",
  "Performance-focused frontend",
  "Secure form handling",
  "Analytics-ready launch",
  "Maintainable codebase",
  "Documentation and handover available",
] as const;

export const principles = [
  "Business-first planning",
  "Premium interface design",
  "Automation-first thinking",
  "Responsible AI integration",
  "Maintainable technical foundations",
  "Senior-led delivery",
] as const;
