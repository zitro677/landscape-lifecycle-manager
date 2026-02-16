import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    if (!supabaseUrl || !supabaseKey) {
      return new Response(JSON.stringify({ error: "Server configuration error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages } = await req.json();
    const userId = user.id;

    // Fetch all user financial data in parallel
    const [invoicesRes, expensesRes, proposalsRes, projectsRes, clientsRes] = await Promise.all([
      supabase.from("invoices").select("*, invoice_items(*), clients(name, email)").eq("user_id", userId),
      supabase.from("expenses").select("*").eq("user_id", userId),
      supabase.from("proposals").select("*, proposal_items(*), clients(name, email)").eq("user_id", userId),
      supabase.from("projects").select("*").eq("user_id", userId),
      supabase.from("clients").select("*").eq("user_id", userId),
    ]);

    const invoices = invoicesRes.data || [];
    const expenses = expensesRes.data || [];
    const proposals = proposalsRes.data || [];
    const projects = projectsRes.data || [];
    const clients = clientsRes.data || [];

    // Build financial summary
    const paidInvoices = invoices.filter((i: any) => i.status?.toLowerCase() === "paid");
    const pendingInvoices = invoices.filter((i: any) => i.status?.toLowerCase() === "pending");
    const overdueInvoices = invoices.filter((i: any) => i.status?.toLowerCase() === "overdue");
    const totalRevenue = paidInvoices.reduce((s: number, i: any) => s + (parseFloat(i.amount) || 0), 0);
    const totalPending = pendingInvoices.reduce((s: number, i: any) => s + (parseFloat(i.amount) || 0), 0);
    const totalOverdue = overdueInvoices.reduce((s: number, i: any) => s + (parseFloat(i.amount) || 0), 0);
    const totalExpenses = expenses.reduce((s: number, e: any) => s + (parseFloat(e.amount) || 0), 0);

    // Group expenses by category
    const expensesByCategory: Record<string, number> = {};
    expenses.forEach((e: any) => {
      const cat = e.category || "Other";
      expensesByCategory[cat] = (expensesByCategory[cat] || 0) + (parseFloat(e.amount) || 0);
    });

    const dataContext = `
## USER FINANCIAL DATA (Real-time from database)

### Summary
- Total Revenue (Paid Invoices): $${totalRevenue.toFixed(2)}
- Pending Invoices Amount: $${totalPending.toFixed(2)} (${pendingInvoices.length} invoices)
- Overdue Invoices Amount: $${totalOverdue.toFixed(2)} (${overdueInvoices.length} invoices)
- Total Expenses: $${totalExpenses.toFixed(2)}
- Net Profit: $${(totalRevenue - totalExpenses).toFixed(2)}
- Profit Margin: ${totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue * 100).toFixed(1) : 0}%

### Invoices (${invoices.length} total)
${invoices.map((i: any) => `- #${i.invoice_number} | ${i.clients?.name || "No client"} | $${i.amount} | Status: ${i.status} | Date: ${i.issue_date} | Due: ${i.due_date || "N/A"} | Tax: $${i.tax_amount || 0} (${i.tax_rate || 0}%)`).join("\n")}

### Expenses by Category
${Object.entries(expensesByCategory).map(([cat, amt]) => `- ${cat}: $${(amt as number).toFixed(2)}`).join("\n")}

### Expenses Detail (${expenses.length} total)
${expenses.slice(0, 50).map((e: any) => `- ${e.date} | ${e.category} | $${e.amount} | ${e.vendor || "N/A"} | ${e.description || ""}`).join("\n")}

### Proposals (${proposals.length} total)
${proposals.map((p: any) => `- #${p.proposal_number} "${p.title}" | ${p.clients?.name || "No client"} | $${p.amount} | Status: ${p.status} | Sent: ${p.issue_date} | Valid until: ${p.valid_until || "N/A"}`).join("\n")}

### Projects (${projects.length} total)
${projects.map((p: any) => `- "${p.name}" | Status: ${p.status} | Budget: $${p.budget || 0} | Progress: ${p.progress || 0}% | Hours est: ${p.hours_estimated || 0} / actual: ${p.hours_actual || 0}`).join("\n")}

### Clients (${clients.length} total)
${clients.map((c: any) => `- ${c.name} | ${c.email || "No email"} | ${c.city || ""} ${c.state || ""}`).join("\n")}
`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are an expert accountant and financial advisor AI assistant. You ONLY analyze and provide advice based on the user's actual business data provided below. Never make up data.

Your capabilities:
1. **Tax Analysis**: Calculate estimated taxes, identify deductible expenses, suggest tax strategies based on actual income/expenses
2. **Discount Strategies**: Recommend discount strategies for proposals/invoices based on client history and project data
3. **Financial Estimates**: Project future revenue, expenses, and cash flow based on historical patterns
4. **Best Practices**: Recommend accounting best practices for invoicing, expense tracking, and financial management
5. **Profitability Analysis**: Analyze project profitability, margins, and cost efficiency
6. **Cash Flow**: Identify overdue payments, pending invoices, and cash flow risks
7. **Expense Optimization**: Identify areas to reduce costs based on expense categories

Rules:
- Always reference specific numbers from the data
- Use currency formatting ($X,XXX.XX)
- Be actionable and specific in recommendations
- If data is insufficient for a question, say so honestly
- Format responses with markdown for clarity
- When calculating taxes, use common US tax brackets unless user specifies otherwise
- Always show your calculations step by step

${dataContext}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in Settings." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("accountant-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
