
import { Database } from "@/integrations/supabase/types";

export type Proposal = Database["public"]["Tables"]["proposals"]["Row"] & {
  client_name?: string;
  clients?: {
    name?: string;
    email?: string;
    address?: string;
  };
  items?: ProposalItem[];
};

// Updated to match exactly what the database accepts
export type ProposalStatus = "Draft" | "Sent" | "Approved" | "Rejected";

export type ProposalFormData = {
  client: string;
  email: string;
  address: string;
  proposalDate: string;
  expirationDate: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
  }[];
  scope: string;
  timeline: string;
  notes: string;
};

export type ProposalItem = {
  id: string;
  proposal_id: string;
  type: 'scope' | 'timeline' | 'item' | 'note';
  description: string;
  quantity?: number;
  unit_price?: number;
  created_at?: string;
  updated_at?: string;
};

