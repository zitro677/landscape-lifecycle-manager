import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { useCreateInvoice } from "./useInvoices";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  client_id: z.string().optional(),
  client: z.string().min(2, {
    message: "Client name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  invoiceDate: z.string(),
  dueDate: z.string(),
  items: z.array(
    z.object({
      description: z.string().min(1, { message: "Description is required" }),
      quantity: z.coerce
        .number()
        .min(1, { message: "Quantity must be at least 1" }),
      unitPrice: z.coerce
        .number()
        .min(0.01, { message: "Price must be greater than 0" }),
    })
  ),
  notes: z.string().optional(),
});

const InvoiceForm: React.FC = () => {
  const navigate = useNavigate();
  const today = format(new Date(), "yyyy-MM-dd");
  const defaultDueDate = format(
    new Date(new Date().setDate(new Date().getDate() + 30)),
    "yyyy-MM-dd"
  );
  const createInvoice = useCreateInvoice();
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchClients = async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("id, name");

      if (error) {
        console.error("Error fetching clients:", error);
        toast.error("Error loading clients");
        return;
      }

      setClients(data || []);
    };

    fetchClients();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_id: "",
      client: "",
      email: "",
      address: "",
      invoiceDate: today,
      dueDate: defaultDueDate,
      items: [
        {
          description: "",
          quantity: 1,
          unitPrice: 0,
        },
      ],
      notes: "",
    },
  });

  const items = form.watch("items");
  
  const subtotal = items.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0),
    0
  );
  const taxRate = 0.07; // 7% tax
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const handleClientChange = async (clientId: string) => {
    form.setValue("client_id", clientId);
    
    if (clientId) {
      const { data, error } = await supabase
        .from("clients")
        .select("name, email, address")
        .eq("id", clientId)
        .single();

      if (error) {
        console.error("Error fetching client details:", error);
        return;
      }

      if (data) {
        form.setValue("client", data.name);
        form.setValue("email", data.email || "");
        form.setValue("address", data.address || "");
      }
    }
  };

  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `INV-${year}-${randomPart}`;
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    try {
      const totalAmount = values.items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
      );
      
      const invoiceData = {
        user_id: (await supabase.auth.getUser()).data.user?.id,
        client_id: values.client_id || null,
        project_id: null,
        proposal_id: null,
        invoice_number: generateInvoiceNumber(),
        issue_date: values.invoiceDate,
        due_date: values.dueDate,
        amount: totalAmount,
        tax_rate: taxRate,
        notes: values.notes,
        status: "Pending",
      };
      
      const invoiceItems = values.items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unitPrice,
      }));
      
      await createInvoice.mutateAsync({
        invoice: invoiceData,
        items: invoiceItems,
      });
      
      navigate("/invoices");
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Failed to create invoice");
    } finally {
      setIsLoading(false);
    }
  }

  const addItem = () => {
    form.setValue("items", [
      ...form.getValues("items"),
      { description: "", quantity: 1, unitPrice: 0 },
    ]);
  };

  const removeItem = (index: number) => {
    const currentItems = form.getValues("items");
    if (currentItems.length > 1) {
      form.setValue(
        "items",
        currentItems.filter((_, i) => i !== index)
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex justify-between items-center">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/invoices")}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Invoices
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Reset
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Invoice"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Client Information</h3>
                
                <div className="mb-4">
                  <FormLabel>Select Client</FormLabel>
                  <Select onValueChange={handleClientChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="client"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter client name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="client@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter client address"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Invoice Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-medium">Invoice #</span>
                    <span className="font-mono">INV-2023-001</span>
                  </div>
                  <FormField
                    control={form.control}
                    name="invoiceDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invoice Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormItem>
                    <FormLabel>Payment Terms</FormLabel>
                    <Select defaultValue="net30">
                      <SelectTrigger>
                        <SelectValue placeholder="Select terms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="net15">Net 15</SelectItem>
                        <SelectItem value="net30">Net 30</SelectItem>
                        <SelectItem value="net60">Net 60</SelectItem>
                        <SelectItem value="dueOnReceipt">
                          Due on Receipt
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (7%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-lg">${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Items</h3>
                <Button
                  type="button"
                  onClick={addItem}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Item
                </Button>
              </div>

              <div className="space-y-4">
                {items.map((_, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-4 items-start"
                  >
                    <div className="col-span-12 md:col-span-6">
                      <FormField
                        control={form.control}
                        name={`items.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Item description"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-5 md:col-span-2">
                      <FormField
                        control={form.control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                step="1"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-5 md:col-span-3">
                      <FormField
                        control={form.control}
                        name={`items.${index}.unitPrice`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unit Price ($)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1 flex items-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(index)}
                        disabled={items.length <= 1}
                        className="h-10 w-10 mt-2"
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Additional Notes</h3>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Add any additional notes or payment instructions..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </motion.div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate("/invoices")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Invoice"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default InvoiceForm;
