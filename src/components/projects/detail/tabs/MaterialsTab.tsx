
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

interface MaterialsTabProps {
  materials: any[];
  getStatusColor: (status: string) => string;
  onAddMaterialClick: () => void;
}

const MaterialsTab: React.FC<MaterialsTabProps> = ({ materials, getStatusColor, onAddMaterialClick }) => {
  return (
    <Card className="card-shadow">
      <CardHeader className="flex-row justify-between items-center">
        <CardTitle>Materials</CardTitle>
        <Button size="sm" className="gap-1" onClick={onAddMaterialClick}>
          <Plus className="h-4 w-4" />
          <span>Add Material</span>
        </Button>
      </CardHeader>
      <CardContent>
        {materials && materials.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.map((material: any, index: number) => (
                <TableRow key={index} className="hover-scale">
                  <TableCell>{material.name}</TableCell>
                  <TableCell>{material.quantity}</TableCell>
                  <TableCell>{material.cost}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(material.status)}>
                      {material.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-muted-foreground text-center py-4">No materials added yet</p>
        )}
      </CardContent>
    </Card>
  );
};

export default MaterialsTab;
