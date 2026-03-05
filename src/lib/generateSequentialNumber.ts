import { supabase } from "@/integrations/supabase/client";

/**
 * Generates a sequential number like PREFIX-YYYY-1001, PREFIX-YYYY-1002, etc.
 * Queries the database to find the highest existing number for the current year.
 */
export const generateSequentialNumber = async (
  table: "invoices" | "proposals",
  prefix: "INV" | "PROP",
  column: "invoice_number" | "proposal_number"
): Promise<string> => {
  const year = new Date().getFullYear();
  const pattern = `${prefix}-${year}-%`;

  const { data, error } = await supabase
    .from(table)
    .select(column)
    .ilike(column, pattern)
    .order(column, { ascending: false })
    .limit(1);

  let nextNum = 1001;

  if (!error && data && data.length > 0) {
    const lastNumber = (data[0] as Record<string, string>)[column];
    const parts = lastNumber.split("-");
    const lastSeq = parseInt(parts[2], 10);
    if (!isNaN(lastSeq)) {
      nextNum = lastSeq + 1;
    }
  }

  return `${prefix}-${year}-${nextNum}`;
};
