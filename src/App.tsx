import { useState } from "react";
import ConfigPage from "./ConfigPage";

// ── Nav module types ───────────────────────────────────────────────────────

interface NavModule {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;        // tailwind bg class for the icon dot
  accent: string;       // tailwind text class for active state
  custom?: boolean;
}

// ── SVG icon set ───────────────────────────────────────────────────────────

const icons: Record<string, React.ReactNode> = {
  dashboard: (
    <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
    </svg>
  ),
  crm: (
    <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  ),
  finance: (
    <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
    </svg>
  ),
  hr: (
    <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
    </svg>
  ),
  manufacturing: (
    <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l5.654-4.654m5.714-4.144a9 9 0 0 1-6.284 6.284c-1.505.376-3.441.02-4.985-1.425L5.09 8.28a9 9 0 0 1 6.285-6.285c1.505-.375 3.44-.019 4.985 1.425Z" />
    </svg>
  ),
  inventory: (
    <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>
  ),
  schedules: (
    <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
    </svg>
  ),
  health: (
    <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
  ),
  learning: (
    <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 3.741-1.342" />
    </svg>
  ),
  shopping: (
    <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
    </svg>
  ),
  config: (
    <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  ),
  custom: (
    <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
    </svg>
  ),
};

const ICON_OPTIONS = ["crm", "finance", "hr", "manufacturing", "inventory", "schedules", "health", "learning", "shopping", "dashboard", "config", "custom"];

const PRESET_MODULES: NavModule[] = [
  { id: "dashboard", label: "Dashboard", icon: icons.dashboard, color: "bg-slate-600", accent: "text-slate-300" },
];

const CORE_MODULES: NavModule[] = [
  { id: "crm", label: "CRM", icon: icons.crm, color: "bg-violet-600", accent: "text-violet-300" },
  { id: "finance", label: "Finance", icon: icons.finance, color: "bg-emerald-600", accent: "text-emerald-300" },
  { id: "hr", label: "Human Resources", icon: icons.hr, color: "bg-blue-600", accent: "text-blue-300" },
  { id: "manufacturing", label: "Manufacturing", icon: icons.manufacturing, color: "bg-orange-600", accent: "text-orange-300" },
  { id: "inventory", label: "Inventory", icon: icons.inventory, color: "bg-amber-600", accent: "text-amber-300" },
];

const OPS_MODULES: NavModule[] = [
  { id: "schedules", label: "Schedules", icon: icons.schedules, color: "bg-sky-600", accent: "text-sky-300" },
  { id: "health", label: "Health", icon: icons.health, color: "bg-rose-600", accent: "text-rose-300" },
  { id: "learning", label: "Learning", icon: icons.learning, color: "bg-indigo-600", accent: "text-indigo-300" },
  { id: "shopping", label: "Shopping", icon: icons.shopping, color: "bg-teal-600", accent: "text-teal-300" },
];

const SYSTEM_MODULES: NavModule[] = [
  { id: "config", label: "Configuration", icon: icons.config, color: "bg-cyan-600", accent: "text-cyan-300" },
];

const COLOR_OPTIONS = [
  { label: "Violet", bg: "bg-violet-600", text: "text-violet-300" },
  { label: "Emerald", bg: "bg-emerald-600", text: "text-emerald-300" },
  { label: "Blue", bg: "bg-blue-600", text: "text-blue-300" },
  { label: "Orange", bg: "bg-orange-600", text: "text-orange-300" },
  { label: "Amber", bg: "bg-amber-600", text: "text-amber-300" },
  { label: "Sky", bg: "bg-sky-600", text: "text-sky-300" },
  { label: "Rose", bg: "bg-rose-600", text: "text-rose-300" },
  { label: "Indigo", bg: "bg-indigo-600", text: "text-indigo-300" },
  { label: "Teal", bg: "bg-teal-600", text: "text-teal-300" },
  { label: "Cyan", bg: "bg-cyan-600", text: "text-cyan-300" },
  { label: "Slate", bg: "bg-slate-500", text: "text-slate-300" },
  { label: "Pink", bg: "bg-pink-600", text: "text-pink-300" },
];

// ── Placeholder module pages ───────────────────────────────────────────────

interface KPI { label: string; value: string; delta: string; up: boolean; }
interface Activity { actor: string; action: string; target: string; time: string; }

const MODULE_DATA: Record<string, {
  description: string;
  kpis: KPI[];
  activities: Activity[];
  tableLabel: string;
  rows: Record<string, string>[];
  rowCols: string[];
}> = {
  dashboard: {
    description: "Overview of all active ERP modules and system health.",
    kpis: [
      { label: "Active Users", value: "1,248", delta: "+12 this week", up: true },
      { label: "Open Tasks", value: "384", delta: "-23 since yesterday", up: false },
      { label: "System Uptime", value: "99.97%", delta: "30-day average", up: true },
      { label: "API Requests", value: "2.4M", delta: "+8% vs last month", up: true },
    ],
    activities: [
      { actor: "Marcus Chen", action: "closed deal", target: "Acme Corp — $142,000", time: "2m ago" },
      { actor: "Finance Bot", action: "processed payroll", target: "Q3 September run", time: "18m ago" },
      { actor: "Sarah O.", action: "approved leave", target: "James T. — Annual × 5d", time: "1h ago" },
      { actor: "Inventory", action: "triggered reorder", target: "SKU-4821 — Raw Material", time: "2h ago" },
      { actor: "Admin", action: "added module", target: "Supply Chain v2", time: "4h ago" },
    ],
    tableLabel: "Module Health",
    rowCols: ["Module", "Status", "Records", "Last Sync"],
    rows: [
      { Module: "CRM", Status: "Healthy", Records: "8,421", "Last Sync": "2m ago" },
      { Module: "Finance", Status: "Healthy", Records: "24,103", "Last Sync": "5m ago" },
      { Module: "HR", Status: "Warning", Records: "1,248", "Last Sync": "1h ago" },
      { Module: "Manufacturing", Status: "Healthy", Records: "3,770", "Last Sync": "12m ago" },
      { Module: "Inventory", Status: "Healthy", Records: "15,882", "Last Sync": "3m ago" },
    ],
  },
  crm: {
    description: "Customer pipeline, accounts, contacts, and support tickets.",
    kpis: [
      { label: "Open Deals", value: "147", delta: "+14 this month", up: true },
      { label: "Pipeline Value", value: "$4.2M", delta: "+$320K vs last month", up: true },
      { label: "Conversion Rate", value: "24.3%", delta: "-1.2% vs Q2", up: false },
      { label: "Avg. Deal Size", value: "$28,500", delta: "+$3,200 vs last month", up: true },
    ],
    activities: [
      { actor: "Marcus Chen", action: "moved deal to", target: "Proposal — TechStart Inc.", time: "4m ago" },
      { actor: "Layla Kim", action: "logged call with", target: "GlobalTrade Co.", time: "22m ago" },
      { actor: "AutoBot", action: "created follow-up", target: "Orbit Systems — 3d overdue", time: "1h ago" },
      { actor: "Sara Patel", action: "closed won", target: "Nexus Corp — $88,000", time: "3h ago" },
    ],
    tableLabel: "Recent Deals",
    rowCols: ["Company", "Stage", "Value", "Owner", "Close Date"],
    rows: [
      { Company: "Acme Corp", Stage: "Negotiation", Value: "$142,000", Owner: "Marcus Chen", "Close Date": "Sep 15, 2026" },
      { Company: "TechStart Inc.", Stage: "Proposal", Value: "$64,500", Owner: "Layla Kim", "Close Date": "Sep 22, 2026" },
      { Company: "Orbit Systems", Stage: "Discovery", Value: "$31,200", Owner: "Sara Patel", "Close Date": "Oct 05, 2026" },
      { Company: "GlobalTrade Co.", Stage: "Qualified", Value: "$95,000", Owner: "Marcus Chen", "Close Date": "Oct 12, 2026" },
    ],
  },
  finance: {
    description: "General ledger, accounts payable/receivable, budgeting, and reporting.",
    kpis: [
      { label: "Revenue (MTD)", value: "$1.84M", delta: "+11% vs Aug 2026", up: true },
      { label: "Expenses (MTD)", value: "$1.21M", delta: "+4% vs Aug 2026", up: false },
      { label: "Gross Margin", value: "34.2%", delta: "+2.1pp vs Q2", up: true },
      { label: "Pending Invoices", value: "38", delta: "Total $412,000", up: false },
    ],
    activities: [
      { actor: "Finance Bot", action: "processed invoice", target: "INV-2026-0841 — $24,500", time: "8m ago" },
      { actor: "Helen Wu", action: "approved journal", target: "JE-4421 — Depreciation Q3", time: "45m ago" },
      { actor: "AP System", action: "flagged overdue", target: "Vendor Apex Ltd — 32d", time: "2h ago" },
      { actor: "Helen Wu", action: "closed period", target: "August 2026", time: "1d ago" },
    ],
    tableLabel: "Recent Transactions",
    rowCols: ["Ref", "Account", "Type", "Amount", "Date"],
    rows: [
      { Ref: "JE-4432", Account: "Revenue — Software", Type: "Credit", Amount: "$84,000", Date: "Sep 04, 2026" },
      { Ref: "JE-4431", Account: "Salaries & Wages", Type: "Debit", Amount: "$142,000", Date: "Sep 03, 2026" },
      { Ref: "INV-0841", Account: "Accounts Receivable", Type: "Debit", Amount: "$24,500", Date: "Sep 02, 2026" },
      { Ref: "PO-2218", Account: "Cost of Goods Sold", Type: "Debit", Amount: "$38,200", Date: "Sep 01, 2026" },
    ],
  },
  hr: {
    description: "Employee management, org structure, leave, payroll, and recruitment.",
    kpis: [
      { label: "Headcount", value: "1,248", delta: "+12 since Aug 2026", up: true },
      { label: "Open Positions", value: "34", delta: "Across 8 departments", up: false },
      { label: "Leave Requests", value: "21", delta: "Pending approval", up: false },
      { label: "Turnover Rate", value: "3.1%", delta: "-0.4% vs last quarter", up: true },
    ],
    activities: [
      { actor: "Sara O.", action: "approved leave", target: "James T. — Annual × 5d", time: "1h ago" },
      { actor: "HR Bot", action: "sent offer letter", target: "Candidate — Lead Engineer", time: "2h ago" },
      { actor: "Payroll", action: "processed run", target: "September 2026 — 1,248 staff", time: "6h ago" },
      { actor: "Recruiter", action: "advanced candidate", target: "Final round — UX Designer", time: "1d ago" },
    ],
    tableLabel: "Recent Hires",
    rowCols: ["Name", "Department", "Role", "Start Date", "Status"],
    rows: [
      { Name: "Amara Diallo", Department: "Engineering", Role: "Senior Backend Engineer", "Start Date": "Sep 01, 2026", Status: "Active" },
      { Name: "Leo Tanaka", Department: "Finance", Role: "Financial Analyst", "Start Date": "Aug 15, 2026", Status: "Active" },
      { Name: "Priya Nair", Department: "CRM", Role: "Account Executive", "Start Date": "Aug 01, 2026", Status: "Probation" },
      { Name: "Omar Khalid", Department: "HR", Role: "HR Business Partner", "Start Date": "Jul 15, 2026", Status: "Active" },
    ],
  },
  manufacturing: {
    description: "Production orders, BOM management, shop floor scheduling, and quality control.",
    kpis: [
      { label: "Active Orders", value: "83", delta: "+7 since Monday", up: true },
      { label: "OEE", value: "78.4%", delta: "+2.1% vs last week", up: true },
      { label: "Defect Rate", value: "0.8%", delta: "-0.3% vs Q2 avg", up: true },
      { label: "On-Time Delivery", value: "91.2%", delta: "-2.1% vs target", up: false },
    ],
    activities: [
      { actor: "WC-04 Line", action: "completed batch", target: "WO-2026-0481 — 2,400 units", time: "18m ago" },
      { actor: "QC Bot", action: "flagged batch", target: "WO-2026-0479 — 12 defects", time: "1h ago" },
      { actor: "Planner", action: "scheduled order", target: "WO-2026-0490 — Start Sep 6", time: "3h ago" },
      { actor: "MES", action: "reported downtime", target: "WC-02 — 45min maintenance", time: "4h ago" },
    ],
    tableLabel: "Active Work Orders",
    rowCols: ["Order", "Product", "Qty", "Work Center", "Status"],
    rows: [
      { Order: "WO-0482", Product: "Motor Assembly A4", Qty: "500", "Work Center": "WC-01", Status: "In Progress" },
      { Order: "WO-0483", Product: "Circuit Board Rev3", Qty: "1,200", "Work Center": "WC-03", Status: "In Progress" },
      { Order: "WO-0484", Product: "Gear Housing K2", Qty: "300", "Work Center": "WC-04", Status: "Draft" },
      { Order: "WO-0485", Product: "Sensor Module V7", Qty: "800", "Work Center": "WC-02", Status: "Scheduled" },
    ],
  },
  inventory: {
    description: "Stock tracking, warehouse locations, reorder rules, and movement history.",
    kpis: [
      { label: "SKU Count", value: "4,821", delta: "+34 this month", up: true },
      { label: "Stock Value", value: "$3.6M", delta: "+$240K vs Aug", up: true },
      { label: "Low Stock Alerts", value: "18", delta: "Reorder triggered for 6", up: false },
      { label: "Fulfillment Rate", value: "97.4%", delta: "+0.6% vs last month", up: true },
    ],
    activities: [
      { actor: "WH-01", action: "received shipment", target: "PO-4421 — 800 units Raw Material", time: "12m ago" },
      { actor: "Auto-Reorder", action: "raised PO for", target: "SKU-4821 — 500 units", time: "1h ago" },
      { actor: "Pick System", action: "picked items for", target: "SO-8812 — 14 lines", time: "2h ago" },
      { actor: "Auditor", action: "completed cycle count", target: "Zone B3 — 412 SKUs", time: "1d ago" },
    ],
    tableLabel: "Low Stock Items",
    rowCols: ["SKU", "Description", "On Hand", "Reorder Point", "Status"],
    rows: [
      { SKU: "SKU-4821", Description: "Raw Material — Grade A Steel", "On Hand": "42", "Reorder Point": "100", Status: "Critical" },
      { SKU: "SKU-2210", Description: "Circuit Board Rev3 — Bare", "On Hand": "88", "Reorder Point": "150", Status: "Low" },
      { SKU: "SKU-1104", Description: "Gear Housing K2 Blank", "On Hand": "65", "Reorder Point": "80", Status: "Low" },
      { SKU: "SKU-3380", Description: "Sensor Module V7 Base", "On Hand": "23", "Reorder Point": "50", Status: "Critical" },
    ],
  },
  schedules: {
    description: "Calendar events, resource booking, shift planning, and maintenance schedules.",
    kpis: [
      { label: "Events This Week", value: "142", delta: "+18 vs last week", up: true },
      { label: "Resource Conflicts", value: "4", delta: "Needs resolution", up: false },
      { label: "Maintenance Due", value: "7", delta: "Next 30 days", up: false },
      { label: "Utilization", value: "82%", delta: "+3% vs last week", up: true },
    ],
    activities: [
      { actor: "Scheduler", action: "booked room for", target: "Q3 Review — Boardroom A", time: "10m ago" },
      { actor: "System", action: "flagged conflict", target: "WC-02 vs WC-04 — Sep 7", time: "1h ago" },
      { actor: "Tech Team", action: "scheduled maintenance", target: "WC-01 — Sep 10, 06:00", time: "3h ago" },
      { actor: "HR Bot", action: "published shifts for", target: "WH-01 — Week 37", time: "6h ago" },
    ],
    tableLabel: "Upcoming Events",
    rowCols: ["Event", "Type", "Resource", "Start", "Duration"],
    rows: [
      { Event: "Q3 Review", Type: "Meeting", Resource: "Boardroom A", Start: "Sep 06, 10:00", Duration: "2h" },
      { Event: "WC-01 Maintenance", Type: "Maintenance", Resource: "WC-01", Start: "Sep 10, 06:00", Duration: "4h" },
      { Event: "Payroll Sync", Type: "Automated", Resource: "Finance Bot", Start: "Sep 11, 00:00", Duration: "30m" },
      { Event: "Warehouse Count", Type: "Audit", Resource: "WH-01 Zone B3", Start: "Sep 12, 08:00", Duration: "6h" },
    ],
  },
  health: {
    description: "Employee health programs, wellness tracking, medical leave, and benefits administration.",
    kpis: [
      { label: "Active Programs", value: "12", delta: "+2 this quarter", up: true },
      { label: "Enrollment Rate", value: "76%", delta: "+4% vs Q2", up: true },
      { label: "Claims This Month", value: "84", delta: "-6 vs Aug 2026", up: true },
      { label: "Avg. Claim Value", value: "$1,240", delta: "-$80 vs last month", up: true },
    ],
    activities: [
      { actor: "Benefits Bot", action: "processed claim", target: "EMP-0821 — $2,100 Medical", time: "30m ago" },
      { actor: "Wellness Team", action: "published challenge", target: "Step Challenge — Sep 2026", time: "2h ago" },
      { actor: "Admin", action: "enrolled employee", target: "Amara Diallo — Dental Plan", time: "4h ago" },
      { actor: "Insurer", action: "renewed policy", target: "Group Health — Sep 2026", time: "2d ago" },
    ],
    tableLabel: "Active Programs",
    rowCols: ["Program", "Category", "Enrolled", "Utilization", "Renews"],
    rows: [
      { Program: "Group Medical", Category: "Insurance", Enrolled: "1,024", Utilization: "81%", Renews: "Jan 2027" },
      { Program: "Dental Plan", Category: "Insurance", Enrolled: "986", Utilization: "64%", Renews: "Jan 2027" },
      { Program: "Step Challenge", Category: "Wellness", Enrolled: "412", Utilization: "78%", Renews: "Oct 2026" },
      { Program: "EAP Counseling", Category: "Mental Health", Enrolled: "1,248", Utilization: "22%", Renews: "Mar 2027" },
    ],
  },
  learning: {
    description: "Learning management, course catalog, certifications, and training compliance.",
    kpis: [
      { label: "Active Courses", value: "48", delta: "+6 this quarter", up: true },
      { label: "Completions (MTD)", value: "312", delta: "+44 vs Aug", up: true },
      { label: "Compliance Rate", value: "88%", delta: "-2% — 3 mandatory overdue", up: false },
      { label: "Avg. Score", value: "82.4%", delta: "+1.2% vs Q2", up: true },
    ],
    activities: [
      { actor: "Leo Tanaka", action: "completed course", target: "IFRS 17 Accounting Fundamentals", time: "1h ago" },
      { actor: "L&D Team", action: "published course", target: "ERP Power User — Module 4", time: "3h ago" },
      { actor: "System", action: "sent reminder", target: "24 staff — Mandatory Safety Training", time: "6h ago" },
      { actor: "Priya Nair", action: "earned certificate", target: "Certified Sales Professional", time: "1d ago" },
    ],
    tableLabel: "Recent Completions",
    rowCols: ["Employee", "Course", "Score", "Completed", "Certificate"],
    rows: [
      { Employee: "Leo Tanaka", Course: "IFRS 17 Fundamentals", Score: "94%", Completed: "Sep 05, 2026", Certificate: "Yes" },
      { Employee: "Priya Nair", Course: "Certified Sales Pro", Score: "88%", Completed: "Sep 04, 2026", Certificate: "Yes" },
      { Employee: "Omar Khalid", Course: "HR Business Partner", Score: "91%", Completed: "Sep 03, 2026", Certificate: "Yes" },
      { Employee: "Amara Diallo", Course: "System Architecture 301", Score: "97%", Completed: "Sep 02, 2026", Certificate: "Yes" },
    ],
  },
  shopping: {
    description: "Purchase requisitions, vendor catalog, order approvals, and spend analytics.",
    kpis: [
      { label: "Open POs", value: "61", delta: "+8 this week", up: true },
      { label: "Spend (MTD)", value: "$842K", delta: "+6% vs Aug", up: false },
      { label: "Pending Approvals", value: "14", delta: "Avg. 1.4d wait time", up: false },
      { label: "Vendor Count", value: "184", delta: "+3 new this month", up: true },
    ],
    activities: [
      { actor: "Ops Team", action: "submitted requisition", target: "PR-2026-0312 — Office Supplies", time: "20m ago" },
      { actor: "Helen Wu", action: "approved PO", target: "PO-4430 — $24,000 Apex Ltd", time: "1h ago" },
      { actor: "Vendor Bot", action: "received quote for", target: "PR-0311 — IT Equipment", time: "3h ago" },
      { actor: "Procurement", action: "awarded contract to", target: "DataCenter Co. — 12-month SLA", time: "1d ago" },
    ],
    tableLabel: "Pending Approvals",
    rowCols: ["PR Ref", "Description", "Vendor", "Amount", "Submitted"],
    rows: [
      { "PR Ref": "PR-0312", Description: "Office Supplies Q4", Vendor: "Staples Pro", Amount: "$3,400", Submitted: "Sep 05, 2026" },
      { "PR Ref": "PR-0311", Description: "IT Equipment — 8x Laptops", Vendor: "TechSource", Amount: "$18,400", Submitted: "Sep 04, 2026" },
      { "PR Ref": "PR-0310", Description: "Raw Material Restock", Vendor: "Apex Ltd", Amount: "$42,000", Submitted: "Sep 03, 2026" },
      { "PR Ref": "PR-0309", Description: "Maintenance Spare Parts", Vendor: "IndusParts Co.", Amount: "$8,200", Submitted: "Sep 02, 2026" },
    ],
  },
};

function statusColor(s: string) {
  if (["Active", "Healthy", "Yes", "In Progress", "Critical"].includes(s)) return "text-cyan-400";
  if (["Warning", "Low", "Probation", "Scheduled"].includes(s)) return "text-amber-400";
  if (["Inactive", "Draft"].includes(s)) return "text-slate-500";
  return "text-slate-300";
}

function ModulePage({ mod }: { mod: NavModule }) {
  const data = MODULE_DATA[mod.id];
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full text-slate-600 text-sm">
        <div className="text-center">
          <div className={`w-12 h-12 rounded-lg ${mod.color} flex items-center justify-center text-white mx-auto mb-3`}>{mod.icon}</div>
          <p className="font-medium text-slate-400 mb-1">{mod.label}</p>
          <p className="text-slate-600">This module is being configured.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto px-6 pt-6 pb-8">
      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        <div className={`w-10 h-10 rounded-lg ${mod.color} flex items-center justify-center text-white shrink-0 mt-0.5`}>
          <span className="scale-125">{mod.icon}</span>
        </div>
        <div>
          <h1 className="text-base font-semibold text-slate-200">{mod.label}</h1>
          <p className="text-xs text-slate-500 mt-0.5">{data.description}</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {data.kpis.map(k => (
          <div key={k.label} className="bg-[#111827] border border-slate-800 rounded p-4">
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">{k.label}</p>
            <p className="text-xl font-semibold text-slate-200 font-mono mb-1">{k.value}</p>
            <p className={`text-xs font-mono ${k.up ? "text-emerald-500" : "text-rose-500"}`}>
              {k.up ? "↑" : "↓"} {k.delta}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-4">
        {/* Activity feed */}
        <div className="col-span-2 bg-[#111827] border border-slate-800 rounded p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Recent Activity</p>
          <div className="space-y-3">
            {data.activities.map((a, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className={`w-6 h-6 rounded-full ${mod.color} flex items-center justify-center text-white text-[9px] font-bold shrink-0 mt-0.5`}>
                  {a.actor.split(" ").map(w => w[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <span className="text-slate-300 font-medium">{a.actor}</span> {a.action}{" "}
                    <span className="text-slate-300">{a.target}</span>
                  </p>
                  <p className="text-[10px] text-slate-600 font-mono mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="col-span-3 bg-[#111827] border border-slate-800 rounded overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-800">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{data.tableLabel}</p>
          </div>
          <table data-testid={`module-page-table-${mod.id}`} className="w-full border-collapse">
            <thead className="bg-slate-900/60">
              <tr>
                {data.rowCols.map(c => (
                  <th key={c} className="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase tracking-widest">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {data.rows.map((row, i) => (
                <tr key={i} className="hover:bg-slate-800/20 transition-colors">
                  {data.rowCols.map(c => (
                    <td key={c} className={`px-4 py-2.5 text-xs whitespace-nowrap ${statusColor(row[c])} ${c === data.rowCols[0] ? "font-medium text-slate-200" : ""}`}>
                      {row[c]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Add Module Modal ───────────────────────────────────────────────────────

function AddModuleModal({ onClose, onAdd }: { onClose: () => void; onAdd: (m: NavModule) => void }) {
  const [label, setLabel] = useState("");
  const [iconKey, setIconKey] = useState("custom");
  const [colorIdx, setColorIdx] = useState(0);

  const valid = label.trim().length > 0;

  const handleAdd = () => {
    if (!valid) return;
    const color = COLOR_OPTIONS[colorIdx];
    onAdd({
      id: `custom_${Date.now()}`,
      label: label.trim(),
      icon: icons[iconKey] ?? icons.custom,
      color: color.bg,
      accent: color.text,
      custom: true,
    });
    onClose();
  };

  return (
    <div data-testid="add-module-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative bg-[#111827] border border-slate-700 rounded w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-700">
          <h3 className="text-sm font-semibold text-slate-200">Add ERP Module</h3>
          <button data-testid="add-module-modal-close-btn" onClick={onClose} className="text-slate-500 hover:text-slate-300 text-lg leading-none">×</button>
        </div>
        <div className="px-5 py-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 tracking-wide uppercase">Module Name</label>
            <input data-testid="add-module-modal-name-input" value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Project Management"
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600/40 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2 tracking-wide uppercase">Icon</label>
            <div className="grid grid-cols-6 gap-1.5">
              {ICON_OPTIONS.map(k => (
                <button data-testid={`add-module-modal-icon-${k}`} key={k} onClick={() => setIconKey(k)}
                  className={`flex items-center justify-center h-9 rounded border transition-colors ${iconKey === k ? "border-cyan-600 bg-cyan-950/40 text-cyan-300" : "border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300"}`}>
                  {icons[k]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2 tracking-wide uppercase">Color</label>
            <div className="grid grid-cols-6 gap-1.5">
              {COLOR_OPTIONS.map((c, i) => (
                <button data-testid={`add-module-modal-color-${i}`} key={c.label} onClick={() => setColorIdx(i)}
                  className={`h-7 rounded border-2 transition-all ${c.bg} ${colorIdx === i ? "border-white scale-110" : "border-transparent"}`}
                  title={c.label} />
              ))}
            </div>
          </div>

          {/* Preview */}
          {label && (
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-900 rounded border border-slate-700">
              <div className={`w-6 h-6 rounded ${COLOR_OPTIONS[colorIdx].bg} flex items-center justify-center text-white`}>
                {icons[iconKey]}
              </div>
              <span className={`text-sm font-medium ${COLOR_OPTIONS[colorIdx].text}`}>{label}</span>
              <span className="text-xs text-slate-600 ml-auto font-mono">preview</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-slate-700">
          <button data-testid="add-module-modal-cancel-btn" onClick={onClose} className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors">Cancel</button>
          <button data-testid="add-module-modal-submit-btn" onClick={handleAdd} disabled={!valid}
            className="px-4 py-1.5 text-xs font-semibold rounded transition-colors bg-cyan-500 hover:bg-cyan-400 text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed">
            Add Module
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Sidebar ────────────────────────────────────────────────────────────────

interface SidebarGroupProps {
  label?: string;
  modules: NavModule[];
  active: string;
  onSelect: (id: string) => void;
  collapsed: boolean;
}

function SidebarGroup({ label, modules, active, onSelect, collapsed }: SidebarGroupProps) {
  return (
    <div className="mb-1">
      {label && !collapsed && (
        <p className="px-3 py-1 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">{label}</p>
      )}
      {label && collapsed && <div className="mx-3 my-1 h-px bg-slate-800" />}
      {modules.map(m => {
        const isActive = active === m.id;
        return (
          <button data-testid={`sidebar-nav-item-${m.id}`} key={m.id} onClick={() => onSelect(m.id)}
            title={collapsed ? m.label : undefined}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded mx-0 transition-colors text-left group relative ${
              isActive ? `bg-slate-800 ${m.accent}` : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
            }`}>
            <span className={`shrink-0 ${isActive ? "" : "opacity-70 group-hover:opacity-100"}`}>
              <span className={`flex items-center justify-center w-6 h-6 rounded ${isActive ? m.color : ""} ${isActive ? "text-white" : ""} transition-colors`}>
                {m.icon}
              </span>
            </span>
            {!collapsed && <span className="text-xs font-medium truncate">{m.label}</span>}
            {!collapsed && m.custom && (
              <span className="ml-auto text-[9px] font-mono text-slate-600 border border-slate-700 px-1 rounded">custom</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ── App root ───────────────────────────────────────────────────────────────

export default function App() {
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [customModules, setCustomModules] = useState<NavModule[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const allModules = [...PRESET_MODULES, ...CORE_MODULES, ...OPS_MODULES, ...customModules, ...SYSTEM_MODULES];
  const activeModule = allModules.find(m => m.id === active) ?? allModules[0];

  return (
    <div className="h-full flex bg-[#0a0e17] overflow-hidden">
      {/* Sidebar */}
      <aside data-testid="sidebar-nav" className={`flex flex-col border-r border-slate-800 bg-[#0d1421] transition-all duration-200 shrink-0 ${collapsed ? "w-14" : "w-52"}`}>
        {/* Logo */}
        <div className={`flex items-center border-b border-slate-800 h-12 px-3 ${collapsed ? "justify-center" : "gap-2.5"}`}>
          <div className="w-7 h-7 rounded-md bg-cyan-500 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          {!collapsed && <span className="text-sm font-bold text-slate-200 tracking-wide">NexusERP</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-1.5 space-y-0.5">
          <SidebarGroup modules={PRESET_MODULES} active={active} onSelect={setActive} collapsed={collapsed} />
          <SidebarGroup label="Core" modules={CORE_MODULES} active={active} onSelect={setActive} collapsed={collapsed} />
          <SidebarGroup label="Operations" modules={OPS_MODULES} active={active} onSelect={setActive} collapsed={collapsed} />

          {customModules.length > 0 && (
            <SidebarGroup label="Custom" modules={customModules} active={active} onSelect={setActive} collapsed={collapsed} />
          )}

          <SidebarGroup label="System" modules={SYSTEM_MODULES} active={active} onSelect={setActive} collapsed={collapsed} />
        </nav>

        {/* Add module + collapse */}
        <div className="border-t border-slate-800 p-1.5 space-y-0.5">
          <button data-testid="sidebar-add-module-btn" onClick={() => setShowAddModal(true)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-slate-500 hover:text-cyan-400 hover:bg-cyan-950/30 transition-colors ${collapsed ? "justify-center" : ""}`}
            title={collapsed ? "Add Module" : undefined}>
            <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" className="w-4 h-4 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            {!collapsed && <span className="text-xs font-medium">Add Module</span>}
          </button>

          <button data-testid="sidebar-collapse-btn" onClick={() => setCollapsed(c => !c)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-slate-600 hover:text-slate-400 hover:bg-slate-800/40 transition-colors ${collapsed ? "justify-center" : ""}`}>
            <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" className={`w-4 h-4 shrink-0 transition-transform ${collapsed ? "rotate-180" : ""}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            {!collapsed && <span className="text-xs font-medium">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-12 border-b border-slate-800 bg-[#0d1421] flex items-center px-5 justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded ${activeModule.color} flex items-center justify-center text-white shrink-0`}>
              <span className="scale-90">{activeModule.icon}</span>
            </div>
            <span className="text-sm font-semibold text-slate-300">{activeModule.label}</span>
            <span className="text-slate-700 text-xs">/</span>
            <span className="text-xs font-mono text-slate-600">api/v1/{active}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
              <span className="text-xs font-mono text-slate-600">UP</span>
            </div>
            <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-hidden">
          {active === "config" ? (
            <ConfigPage />
          ) : (
            <ModulePage mod={activeModule} />
          )}
        </main>
      </div>

      {showAddModal && (
        <AddModuleModal
          onClose={() => setShowAddModal(false)}
          onAdd={m => setCustomModules(prev => [...prev, m])}
        />
      )}
    </div>
  );
}
