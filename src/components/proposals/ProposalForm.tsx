
import React from "react";
import { Form } from "@/components/ui/form";
import { ClientInfoSection } from "./form/ClientInfoSection";
import { ProposalDetailsSection } from "./form/ProposalDetailsSection";
import { SummarySection } from "./form/SummarySection";
import { ProjectScopeSection } from "./form/ProjectScopeSection";
import { TimelineSection } from "./form/TimelineSection";
import { ItemsSection } from "./form/ItemsSection";
import { NotesSection } from "./form/NotesSection";
import { ProposalFormActions } from "./form/ProposalFormActions";
import { useProposalForm } from "./form/useProposalForm";

const ProposalForm: React.FC = () => {
  const { 
    form, 
    items, 
    subtotal, 
    tax, 
    total, 
    addItem, 
    removeItem, 
    onSubmit,
    isPending
  } = useProposalForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <ProposalFormActions form={form} isPending={isPending} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Client Information */}
          <ClientInfoSection form={form} />

          {/* Proposal Details */}
          <ProposalDetailsSection form={form} />

          {/* Summary */}
          <SummarySection 
            subtotal={subtotal} 
            tax={tax} 
            total={total} 
          />
        </div>

        {/* Project Scope */}
        <ProjectScopeSection form={form} />

        {/* Timeline */}
        <TimelineSection form={form} />

        {/* Line Items */}
        <ItemsSection 
          form={form} 
          items={items} 
          addItem={addItem} 
          removeItem={removeItem} 
        />

        {/* Terms & Notes */}
        <NotesSection form={form} />

        <ProposalFormActions form={form} isPending={isPending} />
      </form>
    </Form>
  );
};

export default ProposalForm;
