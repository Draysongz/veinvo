export type Currency = "NGN" | "GHS" | "KES" | "USD";

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface NewInvoice {
  clientId: string;
  issueDate: string; // ISO date
  dueDate: string; // ISO date
  currency: Currency;
  items: InvoiceItem[];
  notes?: string;
  status?: "draft" | "sent" | "paid" | "overdue";
  total?: number;
}

export interface Invoice extends NewInvoice {
  id: string;
  created_at: string;
}
