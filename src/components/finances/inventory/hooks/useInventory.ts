
import { useState } from "react";
import { toast } from "sonner";

const mockInventory = [
  {
    id: "inv-001",
    name: "Heavy Duty Drill",
    category: "tools",
    unit_cost: 299.99,
    quantity: 2,
    life_span: 5,
    depreciation_rate: 20,
    status: "active",
  },
  {
    id: "inv-002",
    name: "Industrial Printer",
    category: "machinery",
    unit_cost: 1499.99,
    quantity: 1,
    life_span: 8,
    depreciation_rate: 12.5,
    status: "active",
  },
];

export const useInventory = () => {
  const [inventory, setInventory] = useState(mockInventory);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleAddItem = (data: any) => {
    const newItem = {
      ...data,
      id: `inv-${String(inventory.length + 1).padStart(3, "0")}`,
    };
    setInventory([...inventory, newItem]);
    toast.success("Item added successfully");
  };

  const handleEditItem = (data: any) => {
    setInventory(
      inventory.map((item) =>
        item.id === selectedItem.id ? { ...item, ...data } : item
      )
    );
    setSelectedItem(null);
    toast.success("Item updated successfully");
  };

  const handleDeleteItem = (id: string) => {
    setInventory(inventory.filter((item) => item.id !== id));
    toast.success("Item deleted successfully");
  };

  // Add handlers to each inventory item
  const inventoryWithHandlers = inventory.map((item) => ({
    ...item,
    onEdit: (item: any) => {
      setSelectedItem(item);
      setIsDialogOpen(true);
    },
    onDelete: handleDeleteItem,
  }));

  return {
    inventory: inventoryWithHandlers,
    isDialogOpen,
    setIsDialogOpen,
    selectedItem,
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
  };
};
