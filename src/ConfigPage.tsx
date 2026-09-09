import { useState, useCallback, useEffect } from "react";

// ── Types ──────────────────────────────────────────────────────────────────

interface CfgModule {
  id: number; code: string; name: string; description: string;
  is_active: boolean; created_at: string; created_by: number;
  updated_at: string; updated_by: number; deleted_at: string | null;
}
interface CfgType {
  id: number; code: string; name: string; description: string;
  module_code: string; is_active: boolean; created_at: string;
  created_by: number; updated_at: string; updated_by: number; deleted_at: string | null;
}
interface CfgValue {
  id: number; code: string; value: string; description: string;
  type_code: string; display_order: number; is_active: boolean;
  created_at: string; created_by: number; updated_at: string;
  updated_by: number; deleted_at: string | null;
}
interface CfgDependency {
  id: number; parent_value_code: string; child_value_code: string;
  dependency_type: string; is_active: boolean; created_at: string;
  created_by: number; updated_at: string; updated_by: number; deleted_at: string | null;
}

// ── Mock data ──────────────────────────────────────────────────────────────

const MOCK_MODULES: CfgModule[] = [
  { id: 1, code: "HR", name: "Human Resources", description: "Employee lifecycle, payroll, and org management", is_active: true, created_at: "2026-01-10T08:00:00Z", created_by: 1, updated_at: "2026-03-15T12:00:00Z", updated_by: 2, deleted_at: null },
  { id: 2, code: "FIN", name: "Finance", description: "Accounting, GL entries, budgets, and reporting", is_active: true, created_at: "2026-01-10T08:00:00Z", created_by: 1, updated_at: "2026-04-01T09:30:00Z", updated_by: 1, deleted_at: null },
  { id: 3, code: "INV", name: "Inventory", description: "Stock tracking, warehouse ops, and reorder rules", is_active: true, created_at: "2026-01-12T10:00:00Z", created_by: 1, updated_at: "2026-05-20T14:00:00Z", updated_by: 3, deleted_at: null },
  { id: 4, code: "SCM", name: "Supply Chain", description: "Procurement, vendor relations, and lead times", is_active: false, created_at: "2026-02-01T08:00:00Z", created_by: 2, updated_at: "2026-06-11T11:45:00Z", updated_by: 2, deleted_at: null },
  { id: 5, code: "CRM", name: "Customer Relations", description: "Sales pipeline, accounts, and support tickets", is_active: true, created_at: "2026-02-15T09:00:00Z", created_by: 1, updated_at: "2026-07-01T16:00:00Z", updated_by: 4, deleted_at: null },
  { id: 6, code: "MFG", name: "Manufacturing", description: "Production orders, BOM, and shop floor control", is_active: true, created_at: "2026-03-01T08:00:00Z", created_by: 3, updated_at: "2026-08-10T10:00:00Z", updated_by: 3, deleted_at: null },
];

const MOCK_TYPES: CfgType[] = [
  { id: 1, code: "EMP_STATUS", name: "Employee Status", description: "Employment lifecycle states", module_code: "HR", is_active: true, created_at: "2026-01-10T08:00:00Z", created_by: 1, updated_at: "2026-03-01T10:00:00Z", updated_by: 1, deleted_at: null },
  { id: 2, code: "LEAVE_TYPE", name: "Leave Type", description: "Categories of employee leave", module_code: "HR", is_active: true, created_at: "2026-01-10T08:00:00Z", created_by: 1, updated_at: "2026-03-01T10:00:00Z", updated_by: 1, deleted_at: null },
  { id: 3, code: "PAY_GRADE", name: "Pay Grade", description: "Compensation band classifications", module_code: "HR", is_active: true, created_at: "2026-01-10T08:00:00Z", created_by: 1, updated_at: "2026-03-01T10:00:00Z", updated_by: 1, deleted_at: null },
  { id: 4, code: "ACCT_TYPE", name: "Account Type", description: "GL account classifications", module_code: "FIN", is_active: true, created_at: "2026-01-11T08:00:00Z", created_by: 1, updated_at: "2026-04-10T12:00:00Z", updated_by: 2, deleted_at: null },
  { id: 5, code: "COST_CTR", name: "Cost Center", description: "Departmental cost attribution", module_code: "FIN", is_active: true, created_at: "2026-01-11T08:00:00Z", created_by: 1, updated_at: "2026-04-10T12:00:00Z", updated_by: 2, deleted_at: null },
  { id: 6, code: "ITEM_CAT", name: "Item Category", description: "Inventory item classifications", module_code: "INV", is_active: true, created_at: "2026-01-12T09:00:00Z", created_by: 2, updated_at: "2026-05-05T09:00:00Z", updated_by: 2, deleted_at: null },
  { id: 7, code: "ITEM_UOM", name: "Unit of Measure", description: "Measurement units for stock items", module_code: "INV", is_active: true, created_at: "2026-01-12T09:00:00Z", created_by: 2, updated_at: "2026-05-05T09:00:00Z", updated_by: 2, deleted_at: null },
  { id: 8, code: "VENDOR_TIER", name: "Vendor Tier", description: "Supplier qualification tiers", module_code: "SCM", is_active: false, created_at: "2026-02-01T10:00:00Z", created_by: 1, updated_at: "2026-06-20T14:00:00Z", updated_by: 3, deleted_at: null },
  { id: 9, code: "TICKET_PRIO", name: "Ticket Priority", description: "Support ticket urgency levels", module_code: "CRM", is_active: true, created_at: "2026-02-15T09:00:00Z", created_by: 1, updated_at: "2026-07-15T11:00:00Z", updated_by: 1, deleted_at: null },
  { id: 10, code: "DEAL_STAGE", name: "Deal Stage", description: "CRM pipeline stage progression", module_code: "CRM", is_active: true, created_at: "2026-02-15T09:00:00Z", created_by: 1, updated_at: "2026-07-15T11:00:00Z", updated_by: 1, deleted_at: null },
  { id: 11, code: "PROD_STATUS", name: "Production Status", description: "Manufacturing order lifecycle", module_code: "MFG", is_active: true, created_at: "2026-03-01T08:00:00Z", created_by: 3, updated_at: "2026-08-01T13:00:00Z", updated_by: 3, deleted_at: null },
  { id: 12, code: "WC_TYPE", name: "Work Center Type", description: "Shop floor resource classifications", module_code: "MFG", is_active: true, created_at: "2026-03-01T08:00:00Z", created_by: 3, updated_at: "2026-08-01T13:00:00Z", updated_by: 3, deleted_at: null },
];

const MOCK_VALUES: CfgValue[] = [
  { id: 1, code: "ACTIVE", value: "Active", description: "Currently employed", type_code: "EMP_STATUS", display_order: 1, is_active: true, created_at: "2026-01-10T08:00:00Z", created_by: 1, updated_at: "2026-01-10T08:00:00Z", updated_by: 1, deleted_at: null },
  { id: 2, code: "INACTIVE", value: "Inactive", description: "Employment has ended", type_code: "EMP_STATUS", display_order: 2, is_active: true, created_at: "2026-01-10T08:00:00Z", created_by: 1, updated_at: "2026-01-10T08:00:00Z", updated_by: 1, deleted_at: null },
  { id: 3, code: "ON_LEAVE", value: "On Leave", description: "On approved leave", type_code: "EMP_STATUS", display_order: 3, is_active: true, created_at: "2026-01-10T08:00:00Z", created_by: 1, updated_at: "2026-03-01T10:00:00Z", updated_by: 2, deleted_at: null },
  { id: 4, code: "PROBATION", value: "Probation", description: "In probationary period", type_code: "EMP_STATUS", display_order: 4, is_active: true, created_at: "2026-01-10T08:00:00Z", created_by: 1, updated_at: "2026-01-10T08:00:00Z", updated_by: 1, deleted_at: null },
  { id: 5, code: "ANNUAL", value: "Annual Leave", description: "Paid vacation leave", type_code: "LEAVE_TYPE", display_order: 1, is_active: true, created_at: "2026-01-10T08:00:00Z", created_by: 1, updated_at: "2026-01-10T08:00:00Z", updated_by: 1, deleted_at: null },
  { id: 6, code: "SICK", value: "Sick Leave", description: "Medical absence", type_code: "LEAVE_TYPE", display_order: 2, is_active: true, created_at: "2026-01-10T08:00:00Z", created_by: 1, updated_at: "2026-01-10T08:00:00Z", updated_by: 1, deleted_at: null },
  { id: 7, code: "MATERNITY", value: "Maternity Leave", description: "Parental leave (primary caregiver)", type_code: "LEAVE_TYPE", display_order: 3, is_active: true, created_at: "2026-01-10T08:00:00Z", created_by: 1, updated_at: "2026-01-10T08:00:00Z", updated_by: 1, deleted_at: null },
  { id: 8, code: "GRADE_A", value: "Grade A", description: "Senior individual contributor", type_code: "PAY_GRADE", display_order: 1, is_active: true, created_at: "2026-01-10T08:00:00Z", created_by: 1, updated_at: "2026-01-10T08:00:00Z", updated_by: 1, deleted_at: null },
  { id: 9, code: "GRADE_B", value: "Grade B", description: "Mid-level individual contributor", type_code: "PAY_GRADE", display_order: 2, is_active: true, created_at: "2026-01-10T08:00:00Z", created_by: 1, updated_at: "2026-01-10T08:00:00Z", updated_by: 1, deleted_at: null },
  { id: 10, code: "ASSET", value: "Asset", description: "Balance sheet asset account", type_code: "ACCT_TYPE", display_order: 1, is_active: true, created_at: "2026-01-11T08:00:00Z", created_by: 1, updated_at: "2026-01-11T08:00:00Z", updated_by: 1, deleted_at: null },
  { id: 11, code: "LIABILITY", value: "Liability", description: "Balance sheet liability", type_code: "ACCT_TYPE", display_order: 2, is_active: true, created_at: "2026-01-11T08:00:00Z", created_by: 1, updated_at: "2026-01-11T08:00:00Z", updated_by: 1, deleted_at: null },
  { id: 12, code: "EQUITY", value: "Equity", description: "Shareholder equity", type_code: "ACCT_TYPE", display_order: 3, is_active: true, created_at: "2026-01-11T08:00:00Z", created_by: 1, updated_at: "2026-01-11T08:00:00Z", updated_by: 1, deleted_at: null },
  { id: 13, code: "RAW_MAT", value: "Raw Material", description: "Unprocessed input materials", type_code: "ITEM_CAT", display_order: 1, is_active: true, created_at: "2026-01-12T09:00:00Z", created_by: 2, updated_at: "2026-01-12T09:00:00Z", updated_by: 2, deleted_at: null },
  { id: 14, code: "FINISHED", value: "Finished Goods", description: "Ready-to-ship products", type_code: "ITEM_CAT", display_order: 2, is_active: true, created_at: "2026-01-12T09:00:00Z", created_by: 2, updated_at: "2026-01-12T09:00:00Z", updated_by: 2, deleted_at: null },
  { id: 15, code: "P1", value: "Critical", description: "Immediate resolution required", type_code: "TICKET_PRIO", display_order: 1, is_active: true, created_at: "2026-02-15T09:00:00Z", created_by: 1, updated_at: "2026-02-15T09:00:00Z", updated_by: 1, deleted_at: null },
  { id: 16, code: "P2", value: "High", description: "Same-day resolution", type_code: "TICKET_PRIO", display_order: 2, is_active: true, created_at: "2026-02-15T09:00:00Z", created_by: 1, updated_at: "2026-02-15T09:00:00Z", updated_by: 1, deleted_at: null },
  { id: 17, code: "P3", value: "Normal", description: "Standard SLA applies", type_code: "TICKET_PRIO", display_order: 3, is_active: true, created_at: "2026-02-15T09:00:00Z", created_by: 1, updated_at: "2026-02-15T09:00:00Z", updated_by: 1, deleted_at: null },
  { id: 18, code: "DRAFT_ORD", value: "Draft", description: "Order not yet released", type_code: "PROD_STATUS", display_order: 1, is_active: true, created_at: "2026-03-01T08:00:00Z", created_by: 3, updated_at: "2026-03-01T08:00:00Z", updated_by: 3, deleted_at: null },
  { id: 19, code: "IN_PROG", value: "In Progress", description: "Production underway", type_code: "PROD_STATUS", display_order: 2, is_active: true, created_at: "2026-03-01T08:00:00Z", created_by: 3, updated_at: "2026-03-01T08:00:00Z", updated_by: 3, deleted_at: null },
  { id: 20, code: "COMPLETED", value: "Completed", description: "Production finished", type_code: "PROD_STATUS", display_order: 3, is_active: true, created_at: "2026-03-01T08:00:00Z", created_by: 3, updated_at: "2026-03-01T08:00:00Z", updated_by: 3, deleted_at: null },
];

const MOCK_DEPENDENCIES: CfgDependency[] = [
  { id: 1, parent_value_code: "ACTIVE", child_value_code: "ON_LEAVE", dependency_type: "REQUIRES", is_active: true, created_at: "2026-01-15T08:00:00Z", created_by: 1, updated_at: "2026-01-15T08:00:00Z", updated_by: 1, deleted_at: null },
  { id: 2, parent_value_code: "ACTIVE", child_value_code: "INACTIVE", dependency_type: "EXCLUDES", is_active: true, created_at: "2026-01-15T08:00:00Z", created_by: 1, updated_at: "2026-01-15T08:00:00Z", updated_by: 1, deleted_at: null },
  { id: 3, parent_value_code: "PROBATION", child_value_code: "ACTIVE", dependency_type: "REQUIRES", is_active: true, created_at: "2026-01-15T08:00:00Z", created_by: 1, updated_at: "2026-01-15T08:00:00Z", updated_by: 1, deleted_at: null },
  { id: 4, parent_value_code: "P1", child_value_code: "P2", dependency_type: "SUPERSEDES", is_active: true, created_at: "2026-02-20T09:00:00Z", created_by: 1, updated_at: "2026-02-20T09:00:00Z", updated_by: 1, deleted_at: null },
  { id: 5, parent_value_code: "DRAFT_ORD", child_value_code: "IN_PROG", dependency_type: "REQUIRES", is_active: true, created_at: "2026-03-05T10:00:00Z", created_by: 3, updated_at: "2026-05-01T11:00:00Z", updated_by: 3, deleted_at: null },
  { id: 6, parent_value_code: "FINISHED", child_value_code: "RAW_MAT", dependency_type: "DERIVED_FROM", is_active: true, created_at: "2026-03-10T09:00:00Z", created_by: 2, updated_at: "2026-03-10T09:00:00Z", updated_by: 2, deleted_at: null },
];

// ── Shared primitives ──────────────────────────────────────────────────────

function ts(d: string) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" });
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span data-testid={active ? "status-badge-active" : "status-badge-inactive"} className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono font-medium tracking-wide ${
      active ? "bg-cyan-950 text-cyan-400 border border-cyan-800" : "bg-slate-800 text-slate-500 border border-slate-700"
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-cyan-400" : "bg-slate-600"}`} />
      {active ? "ACTIVE" : "INACTIVE"}
    </span>
  );
}

function CodeTag({ value }: { value: string }) {
  return (
    <span data-testid="code-tag" className="font-mono text-xs text-cyan-300 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-900/60">{value}</span>
  );
}

function Th({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return <th className={`px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest whitespace-nowrap ${className}`}>{children}</th>;
}
function Td({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-2.5 text-sm text-slate-300 whitespace-nowrap ${className}`}>{children}</td>;
}

function ActionMenu({ onEdit, onDelete, rowId }: { onEdit: () => void; onDelete: () => void; rowId?: string | number }) {
  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <button data-testid={rowId !== undefined ? `action-row-edit-btn-${rowId}` : "action-edit-btn"} onClick={onEdit} className="px-2 py-1 text-xs text-slate-400 hover:text-cyan-400 hover:bg-cyan-950/40 rounded transition-colors">Edit</button>
      <button data-testid={rowId !== undefined ? `action-row-delete-btn-${rowId}` : "action-delete-btn"} onClick={onDelete} className="px-2 py-1 text-xs text-slate-400 hover:text-red-400 hover:bg-red-950/40 rounded transition-colors">Delete</button>
    </div>
  );
}

function Pagination({ page, total, perPage, onChange }: { page: number; total: number; perPage: number; onChange: (p: number) => void }) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center gap-2 text-xs text-slate-500">
      <button data-testid="pagination-prev-btn" disabled={page === 1} onClick={() => onChange(page - 1)} className="px-2 py-1 rounded border border-slate-700 hover:border-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">‹</button>
      <span className="font-mono">{page} / {totalPages}</span>
      <button data-testid="pagination-next-btn" disabled={page === totalPages} onClick={() => onChange(page + 1)} className="px-2 py-1 rounded border border-slate-700 hover:border-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">›</button>
      <span className="ml-1 text-slate-600">{total} records</span>
    </div>
  );
}

// ── Modal ──────────────────────────────────────────────────────────────────

function Modal({ title, onClose, onSave, children, saveLabel = "Save", danger = false, testId }: {
  title: string; onClose: () => void; onSave: () => void;
  children: React.ReactNode; saveLabel?: string; danger?: boolean; testId?: string;
}) {
  return (
    <div data-testid={testId ?? "modal-root"} className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative bg-[#111827] border border-slate-700 rounded w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-700">
          <h3 className="text-sm font-semibold text-slate-200 tracking-wide">{title}</h3>
          <button data-testid="modal-close-btn" onClick={onClose} className="text-slate-500 hover:text-slate-300 text-lg leading-none">×</button>
        </div>
        <div className="px-5 py-4 space-y-3">{children}</div>
        <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-slate-700">
          <button data-testid="modal-cancel-btn" onClick={onClose} className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors">Cancel</button>
          <button data-testid="modal-save-btn" onClick={onSave} className={`px-4 py-1.5 text-xs font-semibold rounded transition-colors ${danger ? "bg-red-600 hover:bg-red-500 text-white" : "bg-cyan-500 hover:bg-cyan-400 text-slate-900"}`}>{saveLabel}</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1 tracking-wide uppercase">{label}</label>
      {children}
    </div>
  );
}
function FInput({ value, onChange, placeholder, mono, disabled, testId }: { value: string; onChange: (v: string) => void; placeholder?: string; mono?: boolean; disabled?: boolean; testId?: string }) {
  return (
    <input data-testid={testId} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} disabled={disabled}
      className={`w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600/40 transition-colors disabled:opacity-50 ${mono ? "font-mono" : ""}`}
    />
  );
}
function FSelect({ value, onChange, options, testId }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; testId?: string }) {
  return (
    <select data-testid={testId} value={value} onChange={e => onChange(e.target.value)}
      className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600/40 transition-colors">
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}
function Toggle({ value, onChange, label, testId }: { value: boolean; onChange: (v: boolean) => void; label: string; testId?: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div data-testid={testId} onClick={() => onChange(!value)} className={`relative w-9 h-5 rounded-full transition-colors ${value ? "bg-cyan-500" : "bg-slate-700"}`}>
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? "translate-x-4" : ""}`} />
      </div>
      <span className="text-sm text-slate-400">{label}</span>
    </label>
  );
}
function SearchBar({ value, onChange, placeholder, testId }: { value: string; onChange: (v: string) => void; placeholder: string; testId?: string }) {
  return (
    <input data-testid={testId} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-slate-300 placeholder-slate-600 w-56 focus:outline-none focus:border-cyan-600 transition-colors" />
  );
}
function AddBtn({ onClick, label, testId }: { onClick: () => void; label: string; testId?: string }) {
  return (
    <button data-testid={testId} onClick={onClick} className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-900 text-xs font-semibold px-3 py-1.5 rounded transition-colors">
      <span className="text-base leading-none">+</span> {label}
    </button>
  );
}

// ── Toast ──────────────────────────────────────────────────────────────────

interface Toast { id: number; message: string; type: "success" | "info"; }

function ToastStack({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div data-testid={`toast-${t.id}`} key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded border shadow-xl text-xs font-medium pointer-events-auto transition-all
            ${t.type === "success" ? "bg-emerald-950 border-emerald-700 text-emerald-300" : "bg-slate-800 border-slate-600 text-slate-300"}`}>
          {t.type === "success"
            ? <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
            : <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>
          }
          {t.message}
          <button data-testid="toast-dismiss-btn" onClick={() => onDismiss(t.id)} className="ml-2 opacity-60 hover:opacity-100 transition-opacity text-base leading-none">×</button>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = Date.now();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);
  const dismiss = useCallback((id: number) => setToasts(p => p.filter(t => t.id !== id)), []);
  return { toasts, push, dismiss };
}

// ── Wizard navigation bar ──────────────────────────────────────────────────

function WizardNav({ onBack, onSaveDraft, draftLabel }: {
  onBack?: () => void;
  onSaveDraft: () => void;
  draftLabel: string;
}) {
  return (
    <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-800">
      <button
        data-testid="wizard-nav-back-btn"
        onClick={onBack}
        disabled={!onBack}
        className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 disabled:opacity-0 disabled:pointer-events-none transition-colors group"
      >
        <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
        Back
      </button>
      <button
        data-testid="wizard-nav-save-draft-btn"
        onClick={onSaveDraft}
        className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-300 border border-slate-700 hover:border-slate-500 px-3 py-1.5 rounded transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        {draftLabel}
      </button>
    </div>
  );
}

// ── Breadcrumb + Step bar ──────────────────────────────────────────────────

type Crumb = { label: string; sublabel?: string; onClick?: () => void };

function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav data-testid="breadcrumb-nav" className="flex items-center gap-1.5 text-xs mb-5">
      {crumbs.map((c, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-slate-700">›</span>}
          {i < crumbs.length - 1 && c.onClick ? (
            <button data-testid={`breadcrumb-btn-${i}`} onClick={c.onClick} className="text-slate-500 hover:text-cyan-400 transition-colors flex items-center gap-1">
              {c.label}{c.sublabel && <span className="font-mono text-cyan-700">{c.sublabel}</span>}
            </button>
          ) : (
            <span className="text-slate-300 font-medium flex items-center gap-1">
              {c.label}{c.sublabel && <span className="font-mono text-cyan-400">{c.sublabel}</span>}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

const STEPS = ["Module", "Type", "Values", "Dependencies"];

function StepBar({ active }: { active: number }) {
  return (
    <div data-testid="step-bar" className="flex items-center gap-0 mb-6">
      {STEPS.map((s, i) => {
        const done = i < active;
        const current = i === active;
        return (
          <div key={s} className="flex items-center">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-colors ${current ? "bg-cyan-950 text-cyan-300 border border-cyan-800" : done ? "text-slate-400" : "text-slate-700"}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${done ? "bg-cyan-500 text-slate-900" : current ? "bg-cyan-800 text-cyan-300 border border-cyan-600" : "bg-slate-800 text-slate-600 border border-slate-700"}`}>
                {done ? (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : i + 1}
              </span>
              <span className={i > active ? "opacity-30" : ""}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`w-8 h-px mx-1 ${i < active ? "bg-cyan-800" : "bg-slate-800"}`} />}
          </div>
        );
      })}
    </div>
  );
}

function Panel({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h2 className="text-sm font-semibold text-slate-200">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ── Step 1: Modules ────────────────────────────────────────────────────────

const emptyModule = (): Partial<CfgModule> => ({ code: "", name: "", description: "", is_active: true });

function ModulesStep({ modules, setModules, onSelect, onSaveDraft }: {
  modules: CfgModule[]; setModules: React.Dispatch<React.SetStateAction<CfgModule[]>>;
  onSelect: (m: CfgModule) => void; onSaveDraft: () => void;
}) {
  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null);
  const [selected, setSelected] = useState<CfgModule | null>(null);
  const [form, setForm] = useState<Partial<CfgModule>>(emptyModule());
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PER = 6;

  const filtered = modules.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.code.toLowerCase().includes(search.toLowerCase()));
  const paged = filtered.slice((page - 1) * PER, page * PER);

  const openAdd = () => { setForm(emptyModule()); setModal("add"); };
  const openEdit = (m: CfgModule, e: React.MouseEvent) => { e.stopPropagation(); setSelected(m); setForm({ ...m }); setModal("edit"); };
  const openDelete = (m: CfgModule, e: React.MouseEvent) => { e.stopPropagation(); setSelected(m); setModal("delete"); };
  const setField = useCallback(<K extends keyof CfgModule>(k: K, v: CfgModule[K]) => setForm(f => ({ ...f, [k]: v })), []);

  const save = () => {
    const now = new Date().toISOString();
    if (modal === "add") setModules(p => [...p, { ...form, id: Date.now(), created_at: now, created_by: 1, updated_at: now, updated_by: 1, deleted_at: null } as CfgModule]);
    else if (modal === "edit" && selected) setModules(p => p.map(m => m.id === selected.id ? { ...m, ...form, updated_at: now } as CfgModule : m));
    setModal(null);
  };
  const del = () => { if (selected) setModules(p => p.filter(m => m.id !== selected.id)); setModal(null); };

  return (
    <div>
      <WizardNav onSaveDraft={onSaveDraft} draftLabel="Save as Draft" />
      <StepBar active={0} />
      <Panel title="Select a Module" subtitle="Choose the module to configure — Types and Values are scoped within the module you select." action={<AddBtn onClick={openAdd} label="New Module" testId="modules-step-add-btn" />} />
      <div className="mb-4"><SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search modules…" testId="modules-step-search" /></div>
      <div className="border border-slate-800 rounded overflow-hidden">
        <table data-testid="modules-step-table" className="w-full border-collapse">
          <thead className="bg-slate-900/80 border-b border-slate-800"><tr><Th>ID</Th><Th>Code</Th><Th>Name</Th><Th>Description</Th><Th>Status</Th><Th>Updated</Th><Th></Th></tr></thead>
          <tbody className="divide-y divide-slate-800/60">
            {paged.length === 0 && <tr><td colSpan={7} className="text-center py-10 text-slate-600 text-sm">No modules found.</td></tr>}
            {paged.map(m => (
              <tr data-testid={`module-row-${m.id}`} key={m.id} onClick={() => onSelect(m)} className="group hover:bg-cyan-950/20 cursor-pointer transition-colors border-l-2 border-transparent hover:border-cyan-600">
                <Td className="font-mono text-slate-500 text-xs">{m.id}</Td>
                <Td><CodeTag value={m.code} /></Td>
                <Td className="font-medium text-slate-200">{m.name}</Td>
                <Td className="text-slate-500 max-w-xs truncate">{m.description}</Td>
                <Td><StatusBadge active={m.is_active} /></Td>
                <Td className="font-mono text-xs text-slate-500">{ts(m.updated_at)}</Td>
                <Td>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button data-testid={`module-row-edit-btn-${m.id}`} onClick={e => openEdit(m, e)} className="px-2 py-1 text-xs text-slate-400 hover:text-cyan-400 hover:bg-cyan-950/40 rounded transition-colors">Edit</button>
                    <button data-testid={`module-row-delete-btn-${m.id}`} onClick={e => openDelete(m, e)} className="px-2 py-1 text-xs text-slate-400 hover:text-red-400 hover:bg-red-950/40 rounded transition-colors">Delete</button>
                    <span className="text-xs text-cyan-600 font-medium">Open →</span>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-3"><Pagination page={page} total={filtered.length} perPage={PER} onChange={setPage} /></div>
      {(modal === "add" || modal === "edit") && (
        <Modal title={modal === "add" ? "New Module" : `Edit — ${selected?.code}`} onClose={() => setModal(null)} onSave={save} saveLabel={modal === "add" ? "Create" : "Update"} testId="modules-modal">
          <Field label="Code"><FInput value={form.code ?? ""} onChange={v => setField("code", v.toUpperCase())} placeholder="HR" mono testId="modules-modal-code-input" /></Field>
          <Field label="Name"><FInput value={form.name ?? ""} onChange={v => setField("name", v)} placeholder="Human Resources" testId="modules-modal-name-input" /></Field>
          <Field label="Description"><FInput value={form.description ?? ""} onChange={v => setField("description", v)} placeholder="Brief description" testId="modules-modal-description-input" /></Field>
          <Toggle value={form.is_active ?? true} onChange={v => setField("is_active", v)} label="Active" testId="modules-modal-active-toggle" />
        </Modal>
      )}
      {modal === "delete" && selected && (
        <Modal title="Delete Module" onClose={() => setModal(null)} onSave={del} saveLabel="Delete" danger testId="modules-delete-modal">
          <p className="text-sm text-slate-400">Delete <span className="text-slate-200 font-medium">{selected.name}</span> (<CodeTag value={selected.code} />)? All associated types and values will lose their reference.</p>
        </Modal>
      )}
    </div>
  );
}

// ── Step 2: Types ──────────────────────────────────────────────────────────

const emptyType = (moduleCode: string): Partial<CfgType> => ({ code: "", name: "", description: "", module_code: moduleCode, is_active: true });

function TypesStep({ module, types, setTypes, onSelect, onBack, onSaveDraft }: {
  module: CfgModule; types: CfgType[]; setTypes: React.Dispatch<React.SetStateAction<CfgType[]>>;
  onSelect: (t: CfgType) => void; onBack: () => void; onSaveDraft: () => void;
}) {
  const filtered_all = types.filter(t => t.module_code === module.code);
  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null);
  const [selected, setSelected] = useState<CfgType | null>(null);
  const [form, setForm] = useState<Partial<CfgType>>(emptyType(module.code));
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PER = 6;

  const filtered = filtered_all.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.code.toLowerCase().includes(search.toLowerCase()));
  const paged = filtered.slice((page - 1) * PER, page * PER);

  const openAdd = () => { setForm(emptyType(module.code)); setModal("add"); };
  const openEdit = (t: CfgType, e: React.MouseEvent) => { e.stopPropagation(); setSelected(t); setForm({ ...t }); setModal("edit"); };
  const openDelete = (t: CfgType, e: React.MouseEvent) => { e.stopPropagation(); setSelected(t); setModal("delete"); };
  const setField = useCallback(<K extends keyof CfgType>(k: K, v: CfgType[K]) => setForm(f => ({ ...f, [k]: v })), []);

  const save = () => {
    const now = new Date().toISOString();
    if (modal === "add") setTypes(p => [...p, { ...form, id: Date.now(), created_at: now, created_by: 1, updated_at: now, updated_by: 1, deleted_at: null } as CfgType]);
    else if (modal === "edit" && selected) setTypes(p => p.map(t => t.id === selected.id ? { ...t, ...form, updated_at: now } as CfgType : t));
    setModal(null);
  };
  const del = () => { if (selected) setTypes(p => p.filter(t => t.id !== selected.id)); setModal(null); };

  return (
    <div>
      <WizardNav onBack={onBack} onSaveDraft={onSaveDraft} draftLabel="Save as Draft" />
      <StepBar active={1} />
      <Breadcrumb crumbs={[{ label: "Modules", onClick: onBack }, { label: "Types in", sublabel: module.code }]} />
      <Panel title={`Types — ${module.name}`} subtitle={`${filtered_all.length} type${filtered_all.length !== 1 ? "s" : ""} configured. Select one to manage its values.`} action={<AddBtn onClick={openAdd} label="New Type" testId="types-step-add-btn" />} />
      <div className="mb-4"><SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search types…" testId="types-step-search" /></div>
      <div className="border border-slate-800 rounded overflow-hidden">
        <table data-testid="types-step-table" className="w-full border-collapse">
          <thead className="bg-slate-900/80 border-b border-slate-800"><tr><Th>ID</Th><Th>Code</Th><Th>Name</Th><Th>Description</Th><Th>Status</Th><Th>Updated</Th><Th></Th></tr></thead>
          <tbody className="divide-y divide-slate-800/60">
            {paged.length === 0 && <tr><td colSpan={7} className="text-center py-10 text-slate-600 text-sm">No types found for this module.</td></tr>}
            {paged.map(t => (
              <tr data-testid={`type-row-${t.id}`} key={t.id} onClick={() => onSelect(t)} className="group hover:bg-cyan-950/20 cursor-pointer transition-colors border-l-2 border-transparent hover:border-cyan-600">
                <Td className="font-mono text-slate-500 text-xs">{t.id}</Td>
                <Td><CodeTag value={t.code} /></Td>
                <Td className="font-medium text-slate-200">{t.name}</Td>
                <Td className="text-slate-500 max-w-xs truncate">{t.description}</Td>
                <Td><StatusBadge active={t.is_active} /></Td>
                <Td className="font-mono text-xs text-slate-500">{ts(t.updated_at)}</Td>
                <Td>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button data-testid={`type-row-edit-btn-${t.id}`} onClick={e => openEdit(t, e)} className="px-2 py-1 text-xs text-slate-400 hover:text-cyan-400 hover:bg-cyan-950/40 rounded transition-colors">Edit</button>
                    <button data-testid={`type-row-delete-btn-${t.id}`} onClick={e => openDelete(t, e)} className="px-2 py-1 text-xs text-slate-400 hover:text-red-400 hover:bg-red-950/40 rounded transition-colors">Delete</button>
                    <span className="text-xs text-cyan-600 font-medium">Open →</span>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-3"><Pagination page={page} total={filtered.length} perPage={PER} onChange={setPage} /></div>
      {(modal === "add" || modal === "edit") && (
        <Modal title={modal === "add" ? "New Type" : `Edit — ${selected?.code}`} onClose={() => setModal(null)} onSave={save} saveLabel={modal === "add" ? "Create" : "Update"} testId="types-modal">
          <Field label="Code"><FInput value={form.code ?? ""} onChange={v => setField("code", v.toUpperCase())} placeholder="EMP_STATUS" mono testId="types-modal-code-input" /></Field>
          <Field label="Name"><FInput value={form.name ?? ""} onChange={v => setField("name", v)} placeholder="Employee Status" testId="types-modal-name-input" /></Field>
          <Field label="Module"><FInput value={module.code} onChange={() => {}} mono disabled testId="types-modal-module-input" /></Field>
          <Field label="Description"><FInput value={form.description ?? ""} onChange={v => setField("description", v)} placeholder="Brief description" testId="types-modal-description-input" /></Field>
          <Toggle value={form.is_active ?? true} onChange={v => setField("is_active", v)} label="Active" testId="types-modal-active-toggle" />
        </Modal>
      )}
      {modal === "delete" && selected && (
        <Modal title="Delete Type" onClose={() => setModal(null)} onSave={del} saveLabel="Delete" danger testId="types-delete-modal">
          <p className="text-sm text-slate-400">Delete type <span className="text-slate-200 font-medium">{selected.name}</span> (<CodeTag value={selected.code} />)?</p>
        </Modal>
      )}
    </div>
  );
}

// ── Step 3: Values ─────────────────────────────────────────────────────────

const emptyValue = (typeCode: string): Partial<CfgValue> => ({ code: "", value: "", description: "", type_code: typeCode, display_order: 1, is_active: true });

function ValuesStep({ module, type, values, setValues, onSelectValue, onBack, onBackToModules, onSaveDraft }: {
  module: CfgModule; type: CfgType; values: CfgValue[];
  setValues: React.Dispatch<React.SetStateAction<CfgValue[]>>;
  onSelectValue: (v: CfgValue) => void; onBack: () => void; onBackToModules: () => void; onSaveDraft: () => void;
}) {
  const filtered_all = values.filter(v => v.type_code === type.code);
  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null);
  const [selected, setSelected] = useState<CfgValue | null>(null);
  const [form, setForm] = useState<Partial<CfgValue>>(emptyValue(type.code));
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PER = 7;

  const filtered = filtered_all.filter(v => v.value.toLowerCase().includes(search.toLowerCase()) || v.code.toLowerCase().includes(search.toLowerCase()));
  const paged = filtered.slice((page - 1) * PER, page * PER);

  const openAdd = () => { setForm(emptyValue(type.code)); setModal("add"); };
  const openEdit = (v: CfgValue, e: React.MouseEvent) => { e.stopPropagation(); setSelected(v); setForm({ ...v }); setModal("edit"); };
  const openDelete = (v: CfgValue, e: React.MouseEvent) => { e.stopPropagation(); setSelected(v); setModal("delete"); };
  const setField = useCallback(<K extends keyof CfgValue>(k: K, v: CfgValue[K]) => setForm(f => ({ ...f, [k]: v })), []);

  const save = () => {
    const now = new Date().toISOString();
    if (modal === "add") setValues(p => [...p, { ...form, id: Date.now(), created_at: now, created_by: 1, updated_at: now, updated_by: 1, deleted_at: null } as CfgValue]);
    else if (modal === "edit" && selected) setValues(p => p.map(v => v.id === selected.id ? { ...v, ...form, updated_at: now } as CfgValue : v));
    setModal(null);
  };
  const del = () => { if (selected) setValues(p => p.filter(v => v.id !== selected.id)); setModal(null); };

  return (
    <div>
      <WizardNav onBack={onBack} onSaveDraft={onSaveDraft} draftLabel="Save as Draft" />
      <StepBar active={2} />
      <Breadcrumb crumbs={[
        { label: "Modules", onClick: onBackToModules },
        { label: "Types in", sublabel: module.code, onClick: onBack },
        { label: "Values for", sublabel: type.code },
      ]} />
      <Panel title={`Values — ${type.name}`} subtitle={`${filtered_all.length} value${filtered_all.length !== 1 ? "s" : ""} defined. Click a value to manage its dependencies.`} action={<AddBtn onClick={openAdd} label="New Value" testId="values-step-add-btn" />} />
      <div className="mb-4"><SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search values…" testId="values-step-search" /></div>
      <div className="border border-slate-800 rounded overflow-hidden">
        <table data-testid="values-step-table" className="w-full border-collapse">
          <thead className="bg-slate-900/80 border-b border-slate-800"><tr><Th>ID</Th><Th>Code</Th><Th>Value</Th><Th>Order</Th><Th>Description</Th><Th>Status</Th><Th>Updated</Th><Th></Th></tr></thead>
          <tbody className="divide-y divide-slate-800/60">
            {paged.length === 0 && <tr><td colSpan={8} className="text-center py-10 text-slate-600 text-sm">No values found for this type.</td></tr>}
            {paged.map(v => (
              <tr data-testid={`value-row-${v.id}`} key={v.id} onClick={() => onSelectValue(v)} className="group hover:bg-cyan-950/20 cursor-pointer transition-colors border-l-2 border-transparent hover:border-cyan-600">
                <Td className="font-mono text-slate-500 text-xs">{v.id}</Td>
                <Td><CodeTag value={v.code} /></Td>
                <Td className="font-medium text-slate-200">{v.value}</Td>
                <Td className="font-mono text-xs text-slate-400">{v.display_order}</Td>
                <Td className="text-slate-500 max-w-xs truncate">{v.description}</Td>
                <Td><StatusBadge active={v.is_active} /></Td>
                <Td className="font-mono text-xs text-slate-500">{ts(v.updated_at)}</Td>
                <Td>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button data-testid={`value-row-edit-btn-${v.id}`} onClick={e => openEdit(v, e)} className="px-2 py-1 text-xs text-slate-400 hover:text-cyan-400 hover:bg-cyan-950/40 rounded transition-colors">Edit</button>
                    <button data-testid={`value-row-delete-btn-${v.id}`} onClick={e => openDelete(v, e)} className="px-2 py-1 text-xs text-slate-400 hover:text-red-400 hover:bg-red-950/40 rounded transition-colors">Delete</button>
                    <span className="text-xs text-cyan-600 font-medium">Deps →</span>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-3"><Pagination page={page} total={filtered.length} perPage={PER} onChange={setPage} /></div>
      {(modal === "add" || modal === "edit") && (
        <Modal title={modal === "add" ? "New Value" : `Edit — ${selected?.code}`} onClose={() => setModal(null)} onSave={save} saveLabel={modal === "add" ? "Create" : "Update"} testId="values-modal">
          <Field label="Code"><FInput value={form.code ?? ""} onChange={v => setField("code", v.toUpperCase())} placeholder="ACTIVE" mono testId="values-modal-code-input" /></Field>
          <Field label="Display Value"><FInput value={form.value ?? ""} onChange={v => setField("value", v)} placeholder="Active" testId="values-modal-value-input" /></Field>
          <Field label="Display Order"><FInput value={String(form.display_order ?? 1)} onChange={v => setField("display_order", parseInt(v) || 1)} placeholder="1" mono testId="values-modal-order-input" /></Field>
          <Field label="Description"><FInput value={form.description ?? ""} onChange={v => setField("description", v)} placeholder="Brief description" testId="values-modal-description-input" /></Field>
          <Toggle value={form.is_active ?? true} onChange={v => setField("is_active", v)} label="Active" testId="values-modal-active-toggle" />
        </Modal>
      )}
      {modal === "delete" && selected && (
        <Modal title="Delete Value" onClose={() => setModal(null)} onSave={del} saveLabel="Delete" danger testId="values-delete-modal">
          <p className="text-sm text-slate-400">Delete value <span className="text-slate-200 font-medium">{selected.value}</span> (<CodeTag value={selected.code} />)?</p>
        </Modal>
      )}
    </div>
  );
}

// ── Step 4: Dependencies ───────────────────────────────────────────────────

const DEP_TYPES = ["REQUIRES", "EXCLUDES", "SUPERSEDES", "DERIVED_FROM"];
const emptyDep = (parentCode: string): Partial<CfgDependency> => ({ parent_value_code: parentCode, child_value_code: "", dependency_type: "REQUIRES", is_active: true });

function DepTypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    REQUIRES: "text-amber-400 bg-amber-950/50 border-amber-800",
    EXCLUDES: "text-red-400 bg-red-950/50 border-red-800",
    SUPERSEDES: "text-violet-400 bg-violet-950/50 border-violet-800",
    DERIVED_FROM: "text-emerald-400 bg-emerald-950/50 border-emerald-800",
  };
  return <span className={`inline-flex font-mono text-xs px-2 py-0.5 rounded border ${colors[type] ?? "text-slate-400 bg-slate-800 border-slate-700"}`}>{type}</span>;
}

function DepsStep({ module, type, value, deps, setDeps, allValues, onBack, onBackToTypes, onBackToModules, onSaveDraft }: {
  module: CfgModule; type: CfgType; value: CfgValue;
  deps: CfgDependency[]; setDeps: React.Dispatch<React.SetStateAction<CfgDependency[]>>;
  allValues: CfgValue[]; onBack: () => void; onBackToTypes: () => void; onBackToModules: () => void; onSaveDraft: () => void;
}) {
  const filtered_all = deps.filter(d => d.parent_value_code === value.code || d.child_value_code === value.code);
  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null);
  const [selected, setSelected] = useState<CfgDependency | null>(null);
  const [form, setForm] = useState<Partial<CfgDependency>>(emptyDep(value.code));
  const [filterType, setFilterType] = useState("ALL");
  const [page, setPage] = useState(1);
  const PER = 6;

  const filtered = filtered_all.filter(d => filterType === "ALL" || d.dependency_type === filterType);
  const paged = filtered.slice((page - 1) * PER, page * PER);

  const openAdd = () => { setForm(emptyDep(value.code)); setModal("add"); };
  const openEdit = (d: CfgDependency) => { setSelected(d); setForm({ ...d }); setModal("edit"); };
  const openDelete = (d: CfgDependency) => { setSelected(d); setModal("delete"); };
  const setField = useCallback(<K extends keyof CfgDependency>(k: K, v: CfgDependency[K]) => setForm(f => ({ ...f, [k]: v })), []);

  const save = () => {
    const now = new Date().toISOString();
    if (modal === "add") setDeps(p => [...p, { ...form, id: Date.now(), created_at: now, created_by: 1, updated_at: now, updated_by: 1, deleted_at: null } as CfgDependency]);
    else if (modal === "edit" && selected) setDeps(p => p.map(d => d.id === selected.id ? { ...d, ...form, updated_at: now } as CfgDependency : d));
    setModal(null);
  };
  const del = () => { if (selected) setDeps(p => p.filter(d => d.id !== selected.id)); setModal(null); };

  const valueOptions = [{ value: "", label: "— Select Value —" }, ...allValues.map(v => ({ value: v.code, label: `${v.code} — ${v.value}` }))];
  const depTypeOptions = DEP_TYPES.map(t => ({ value: t, label: t }));

  return (
    <div>
      <WizardNav onBack={onBack} onSaveDraft={onSaveDraft} draftLabel="Save as Draft" />
      <StepBar active={3} />
      <Breadcrumb crumbs={[
        { label: "Modules", onClick: onBackToModules },
        { label: "Types in", sublabel: module.code, onClick: onBackToTypes },
        { label: "Values for", sublabel: type.code, onClick: onBack },
        { label: "Dependencies of", sublabel: value.code },
      ]} />
      <Panel title={`Dependencies — ${value.value}`} subtitle={`${filtered_all.length} rule${filtered_all.length !== 1 ? "s" : ""} total. Showing where ${value.code} is parent or child.`} action={<AddBtn onClick={openAdd} label="New Dependency" testId="deps-step-add-btn" />} />
      <div className="mb-4 flex items-center gap-2">
        <select data-testid="deps-filter-type-select" value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1); }}
          className="bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-slate-300 focus:outline-none focus:border-cyan-600 transition-colors">
          <option value="ALL">All Types</option>
          {DEP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        {DEP_TYPES.map(t => {
          const count = filtered_all.filter(d => d.dependency_type === t).length;
          return count > 0 ? (
            <button data-testid={`deps-filter-chip-${t}`} key={t} onClick={() => setFilterType(t === filterType ? "ALL" : t)}
              className={`text-xs font-mono px-2 py-0.5 rounded border transition-colors ${t === filterType ? "bg-cyan-950 border-cyan-700 text-cyan-300" : "border-slate-700 text-slate-500 hover:border-slate-500"}`}>
              {t} <span className="text-slate-600">{count}</span>
            </button>
          ) : null;
        })}
      </div>
      <div className="border border-slate-800 rounded overflow-hidden">
        <table data-testid="deps-step-table" className="w-full border-collapse">
          <thead className="bg-slate-900/80 border-b border-slate-800"><tr><Th>ID</Th><Th>Parent</Th><Th>Relation</Th><Th>Child</Th><Th>Direction</Th><Th>Status</Th><Th>Created</Th><Th></Th></tr></thead>
          <tbody className="divide-y divide-slate-800/60">
            {paged.length === 0 && <tr><td colSpan={8} className="text-center py-10 text-slate-600 text-sm">No dependencies for this value.</td></tr>}
            {paged.map(d => {
              const isParent = d.parent_value_code === value.code;
              return (
                <tr data-testid={`dep-row-${d.id}`} key={d.id} className="group hover:bg-slate-800/30 transition-colors">
                  <Td className="font-mono text-slate-500 text-xs">{d.id}</Td>
                  <Td><CodeTag value={d.parent_value_code} /></Td>
                  <Td><DepTypeBadge type={d.dependency_type} /></Td>
                  <Td><CodeTag value={d.child_value_code} /></Td>
                  <Td>
                    <span className={`text-xs font-mono px-2 py-0.5 rounded border ${isParent ? "text-cyan-400 border-cyan-800 bg-cyan-950/30" : "text-slate-400 border-slate-700 bg-slate-800/30"}`}>
                      {isParent ? "OUTBOUND" : "INBOUND"}
                    </span>
                  </Td>
                  <Td><StatusBadge active={d.is_active} /></Td>
                  <Td className="font-mono text-xs text-slate-500">{ts(d.created_at)}</Td>
                  <Td><ActionMenu onEdit={() => openEdit(d)} onDelete={() => openDelete(d)} rowId={d.id} /></Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-3"><Pagination page={page} total={filtered.length} perPage={PER} onChange={setPage} /></div>
      {(modal === "add" || modal === "edit") && (
        <Modal title={modal === "add" ? "New Dependency" : `Edit Dependency #${selected?.id}`} onClose={() => setModal(null)} onSave={save} saveLabel={modal === "add" ? "Create" : "Update"} testId="deps-modal">
          <Field label="Parent Value"><FSelect value={form.parent_value_code ?? ""} onChange={v => setField("parent_value_code", v)} options={valueOptions} testId="deps-modal-parent-select" /></Field>
          <Field label="Dependency Type"><FSelect value={form.dependency_type ?? "REQUIRES"} onChange={v => setField("dependency_type", v)} options={depTypeOptions} testId="deps-modal-type-select" /></Field>
          <Field label="Child Value"><FSelect value={form.child_value_code ?? ""} onChange={v => setField("child_value_code", v)} options={valueOptions} testId="deps-modal-child-select" /></Field>
          <Toggle value={form.is_active ?? true} onChange={v => setField("is_active", v)} label="Active" testId="deps-modal-active-toggle" />
        </Modal>
      )}
      {modal === "delete" && selected && (
        <Modal title="Delete Dependency" onClose={() => setModal(null)} onSave={del} saveLabel="Delete" danger testId="deps-delete-modal">
          <p className="text-sm text-slate-400">Delete dependency between <CodeTag value={selected.parent_value_code} /> and <CodeTag value={selected.child_value_code} />?</p>
        </Modal>
      )}
    </div>
  );
}

// ── Config page root ───────────────────────────────────────────────────────

type WizardStep = "modules" | "types" | "values" | "deps";

const DRAFT_KEY = "nexuserp_cfg_draft";

interface DraftState {
  step: WizardStep;
  moduleId: number | null;
  typeId: number | null;
  valueId: number | null;
  savedAt: string;
}

export default function ConfigPage() {
  const [step, setStep] = useState<WizardStep>("modules");
  const [activeModule, setActiveModule] = useState<CfgModule | null>(null);
  const [activeType, setActiveType] = useState<CfgType | null>(null);
  const [activeValue, setActiveValue] = useState<CfgValue | null>(null);

  const [modules, setModules] = useState(MOCK_MODULES);
  const [types, setTypes] = useState(MOCK_TYPES);
  const [values, setValues] = useState(MOCK_VALUES);
  const [deps, setDeps] = useState(MOCK_DEPENDENCIES);

  const { toasts, push: pushToast, dismiss } = useToast();

  // Restore draft on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft: DraftState = JSON.parse(raw);
      const mod = MOCK_MODULES.find(m => m.id === draft.moduleId) ?? null;
      const typ = MOCK_TYPES.find(t => t.id === draft.typeId) ?? null;
      const val = MOCK_VALUES.find(v => v.id === draft.valueId) ?? null;
      setActiveModule(mod);
      setActiveType(typ);
      setActiveValue(val);
      setStep(draft.step);
      const when = new Date(draft.savedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      pushToast(`Draft restored from ${when}`, "info");
    } catch {
      // ignore corrupt draft
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveDraft = useCallback(() => {
    const draft: DraftState = {
      step,
      moduleId: activeModule?.id ?? null,
      typeId: activeType?.id ?? null,
      valueId: activeValue?.id ?? null,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    const stepLabels: Record<WizardStep, string> = { modules: "Modules", types: "Types", values: "Values", deps: "Dependencies" };
    pushToast(`Draft saved — ${stepLabels[step]}${activeModule ? ` › ${activeModule.code}` : ""}${activeType ? ` › ${activeType.code}` : ""}`, "success");
  }, [step, activeModule, activeType, activeValue, pushToast]);

  const goModules = () => { setStep("modules"); setActiveModule(null); setActiveType(null); setActiveValue(null); };
  const goTypes = () => { setStep("types"); setActiveType(null); setActiveValue(null); };
  const goValues = () => { setStep("values"); setActiveValue(null); };

  return (
    <div className="h-full overflow-auto px-6 pt-6 pb-8">
      {step === "modules" && (
        <ModulesStep modules={modules} setModules={setModules}
          onSelect={m => { setActiveModule(m); setStep("types"); }}
          onSaveDraft={saveDraft} />
      )}
      {step === "types" && activeModule && (
        <TypesStep module={activeModule} types={types} setTypes={setTypes}
          onSelect={t => { setActiveType(t); setStep("values"); }}
          onBack={goModules} onSaveDraft={saveDraft} />
      )}
      {step === "values" && activeModule && activeType && (
        <ValuesStep module={activeModule} type={activeType} values={values} setValues={setValues}
          onSelectValue={v => { setActiveValue(v); setStep("deps"); }}
          onBack={goTypes} onBackToModules={goModules} onSaveDraft={saveDraft} />
      )}
      {step === "deps" && activeModule && activeType && activeValue && (
        <DepsStep module={activeModule} type={activeType} value={activeValue}
          deps={deps} setDeps={setDeps} allValues={values}
          onBack={goValues} onBackToTypes={goTypes} onBackToModules={goModules} onSaveDraft={saveDraft} />
      )}
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
