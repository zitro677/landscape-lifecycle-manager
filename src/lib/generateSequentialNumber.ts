import { supabase } from "@/integrations/supabase/client";

/**
 * Generates a sequential number like PREFIX-YYYY-1001, PREFIX-YYYY-1002, etc.
 */
export const generateSequentialNumber = async (
  table: "invoices" | "proposals",
  prefix: "INV" | "PROP",
  column: "invoice_number" | "proposal_number"
): Promise<string> => {
  const year = new Date().getFullYear();
  const pattern = `${prefix}-${year}-%`;

  let nextNum = 1001;

  if (table === "invoices") {
    const { data } = await supabase
      .from("invoices")
      .select("invoice_number")
      .ilike("invoice_number", pattern)
      .order("invoice_number", { ascending: false })
      .limit(1);

    if (data && data.length > 0) {
      const lastSeq = parseInt(data[0].invoice_number.split("-")[2], 10);
      if (!isNaN(lastSeq)) nextNum = lastSeq + 1;
    }
  } else {
    const { data } = await supabase
      .from("proposals")
      .select("proposal_number")
      .ilike("proposal_number", pattern)
      .order("proposal_number", { ascending: false })
      .limit(1);

    if (data && data.length > 0) {
      const lastSeq = parseInt(data[0].proposal_number.split("-")[2], 10);
      if (!isNaN(lastSeq)) nextNum = lastSeq + 1;
    }
  }

  return `${prefix}-${year}-${nextNum}`;
};
