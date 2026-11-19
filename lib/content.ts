export const company = {
  name: "Polaris Consulting",
  tagline: "Consulting for a Better Tomorrow",
  email: "polarisconsulting05@gmail.com",
  phoneDisplay: "+91 97278 34759",
  phoneE164: "919727834759",
};

export const whatsappLink = (text?: string) =>
  `https://wa.me/${company.phoneE164}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const navLinks = [
  { href: "/custom-erp", label: "Custom ERP" },
  { href: "/crm-agent", label: "CRM Agent" },
  { href: "/#consulting", label: "Consulting" },
];

export const statements = {
  home: "Most software asks your business to change the way it works. So teams keep side sheets and chat groups, you pay for features nobody uses, and management still waits for reports. We start from the other end: your process first, then the software.",
  erp: "Software that does not fit costs more than it saves. Teams work around it with side sheets and chat groups, and you pay for features nobody needs while the ones you do need are missing. Your business should not change to fit the software. The software should fit the business.",
};

export const process = [
  {
    title: "Understand",
    body: "We map how your teams actually work: processes, people, approvals and pain points. Nothing is designed before this is clear.",
  },
  {
    title: "Improve",
    body: "We remove unnecessary steps and define clear workflows first, so you never digitise a broken process.",
  },
  {
    title: "Build",
    body: "We build ERP modules around the improved process and shape reports so management sees what matters.",
  },
];

export type ModuleId =
  | "sales"
  | "purchase"
  | "inventory"
  | "production"
  | "quality"
  | "finance"
  | "hr"
  | "dashboards";

export const erpModules: {
  id: ModuleId;
  name: string;
  outcome: string;
  features: string[];
}[] = [
  {
    id: "sales",
    name: "Sales & CRM",
    outcome: "Never lose a lead or an order.",
    features: ["Leads", "Customers", "Quotations", "Orders"],
  },
  {
    id: "purchase",
    name: "Purchase",
    outcome: "Approvals and spending under control.",
    features: ["Requests", "Approvals", "Purchase orders", "Vendors"],
  },
  {
    id: "inventory",
    name: "Inventory & Stores",
    outcome: "Right stock, less money blocked.",
    features: ["Stock", "Locations", "Material movement", "Tracking"],
  },
  {
    id: "production",
    name: "Production",
    outcome: "Fewer delays, better use of capacity.",
    features: ["Planning", "Work orders", "Production tracking"],
  },
  {
    id: "quality",
    name: "Quality",
    outcome: "Fewer rejections and returns.",
    features: ["Inspections", "Quality checks", "Records"],
  },
  {
    id: "finance",
    name: "Finance & Accounts",
    outcome: "Cleaner books, faster collections.",
    features: ["Invoicing", "Receivables", "Payables", "Ledgers"],
  },
  {
    id: "hr",
    name: "HR & Payroll",
    outcome: "Accurate payroll, less admin.",
    features: ["Employees", "Attendance", "Leave", "Payroll"],
  },
  {
    id: "dashboards",
    name: "Dashboards & Reports",
    outcome: "A live view of the business.",
    features: ["MIS", "KPIs", "Management reports"],
  },
];

export const erpBenefits = [
  { title: "Lower costs", body: "Less rework, tighter stock and controlled purchasing." },
  { title: "Faster operations", body: "One connected flow from enquiry to delivery, with no chasing." },
  { title: "Full control", body: "Clear roles, approvals and records in a single system." },
  { title: "Clear visibility", body: "The numbers you need to decide, live and in one place." },
];

export const erpInvestment = [
  {
    title: "Costs less than a standard ERP",
    body: "You pay for what your business needs, not for features you will never use.",
  },
  {
    title: "Priced to your scale",
    body: "Cost depends on the size of your business and the complexity of your processes.",
  },
  {
    title: "Only the modules you need",
    body: "Choose the modules that matter most to your operations.",
  },
];

export const consultingServices = [
  { title: "Process improvement", body: "Review processes, remove unnecessary steps and reduce delays." },
  { title: "SOPs and work instructions", body: "Create clear and standard ways of doing work." },
  { title: "Inventory and material planning", body: "Improve stock levels, material planning and movement." },
  {
    title: "Production and operations",
    body: "Improve production planning, manpower, capacity and shop-floor processes.",
  },
  {
    title: "Purchase and procurement",
    body: "Improve purchasing, approvals, vendor management and planning.",
  },
  { title: "Gap assessments", body: "Find process, system and operational gaps and define improvements." },
  { title: "Reports and dashboards", body: "Give management better information to track the business." },
];

export const crm = {
  today: [
    {
      title: "Manual WhatsApp",
      body: "Poor targeting and little use of the customer data you already have.",
    },
    {
      title: "No message after the bill",
      body: "The first step in building a relationship with the customer never happens.",
    },
    {
      title: "Special days missed",
      body: "Festivals, birthdays and anniversaries pass without a word.",
    },
  ],
  opportunity: [
    "Most revenue growth comes from repeat customers, not new ones.",
    "WhatsApp is where your customers already are, and where they actually read messages.",
    "The moment after a sale is when trust is highest, so it is the best time to engage.",
  ],
  teaser: [
    { title: "A thank-you the moment a bill is generated" },
    { title: "Birthday, anniversary and festival greetings, on time" },
    { title: "Offers targeted by spend, purchase history or last visit" },
  ],
  solution: [
    {
      title: "Bulk and automated messaging",
      body: "Reach your entire customer base in minutes through the official WhatsApp Business API.",
    },
    {
      title: "Greetings and post-billing texts",
      body: "A personalised thank-you goes out with every bill. Birthday, anniversary and festival greetings follow on time, with the customer's name and your branding.",
    },
    {
      title: "Targeted offers and campaigns",
      body: "Group customers by purchase history, spend or last visit, schedule campaigns, and see exactly who received, read and responded.",
    },
  ],
  workflow: [
    { title: "Billing software", body: "A bill is generated" },
    { title: "Data sync", body: "Customer and bill data synced" },
    { title: "Polaris agent", body: "Segments, triggers, templates" },
    { title: "WhatsApp API", body: "Approved templates sent" },
    { title: "Customer", body: "Delivered, read, tracked" },
  ],
  gains: [
    { title: "More repeat purchases", body: "Higher lifetime value from the customers you already have." },
    { title: "Stronger loyalty", body: "A more personal brand that customers remember." },
    { title: "More footfall", body: "Targeted campaigns that bring customers back in." },
    { title: "Better reviews", body: "Feedback and review requests that build your reputation." },
  ],
  features: [
    "Post-bill messaging",
    "Smart greetings",
    "Bulk campaigns",
    "Customer segmentation",
    "Feedback forms",
    "Review booster",
    "Approved message templates",
    "Campaign scheduling",
  ],
  implementation: [
    { title: "Discovery and data review", phase: "Development" },
    { title: "WhatsApp Business API setup and template approval", phase: "Development" },
    { title: "Integration with billing and customer data", phase: "Development" },
    { title: "Automation setup", phase: "Development" },
    { title: "Testing and team training", phase: "Training and deployment" },
    { title: "Go live and monitoring", phase: "Training and deployment" },
  ],
};
