import {  } from "../db/db.js";
import { type Invoice, type NewInvoice } from "../types/index.js";

async function listInvoices(): Promise<Invoice[]> {
  const { data, error } = await 
    .from("invoices")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Invoice[];
}

async function getInvoiceById(id: string): Promise<Invoice | null> {
  const { data, error } = await 
    .from("invoices")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as Invoice) ?? null;
}

async function createInvoice(payload: NewInvoice): Promise<Invoice> {
  const { data, error } = await 
    .from("invoices")
    .insert(payload)
    .select("*")
    .single();
  if (error) throw error;
  return data as Invoice;
}

export const invoicesService = {
  listInvoices,
  getInvoiceById,
  createInvoice,
};
