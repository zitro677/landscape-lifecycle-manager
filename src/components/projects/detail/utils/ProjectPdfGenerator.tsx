
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface ProjectPdfGeneratorProps {
  project: any;
  extraData: any;
  teamMembers: any[];
}

// Add type definition for jsPDF with autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: {
      finalY: number;
    };
  }
}

const ProjectPdfGenerator = ({ project, extraData, teamMembers }: ProjectPdfGeneratorProps) => {
  const generatePDF = () => {
    try {
      console.log("Generating PDF for project:", project);
      console.log("With extra data:", extraData);
      console.log("And team members:", teamMembers);
      
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      let yPosition = 20;

      // Add header with project name
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 0);
      doc.text(`PROJECT: ${project.name}`, pageWidth / 2, yPosition, { align: "center" });
      yPosition += 15;

      // Add project details section
      doc.setFillColor(240, 240, 240);
      doc.setDrawColor(200, 200, 200);
      doc.rect(margin, yPosition, contentWidth, 40, 'FD');
      
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      yPosition += 10;
      doc.text("Project Details:", margin + 5, yPosition);
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      
      yPosition += 7;
      doc.text(`ID: ${project.id}`, margin + 5, yPosition);
      doc.text(`Client: ${project.client || 'N/A'}`, margin + 80, yPosition);
      
      yPosition += 6;
      doc.text(`Status: ${project.status || 'N/A'}`, margin + 5, yPosition);
      doc.text(`Progress: ${project.progress || 0}%`, margin + 80, yPosition);
      
      yPosition += 6;
      doc.text(`Start Date: ${project.startDate ? format(new Date(project.startDate), 'MM/dd/yyyy') : 'N/A'}`, margin + 5, yPosition);
      doc.text(`Due Date: ${project.dueDate ? format(new Date(project.dueDate), 'MM/dd/yyyy') : 'N/A'}`, margin + 80, yPosition);
      
      yPosition += 15;

      // Add budget section
      doc.setFillColor(240, 240, 240);
      doc.setDrawColor(200, 200, 200);
      doc.rect(margin, yPosition, contentWidth / 2 - 5, 40, 'FD');
      doc.rect(margin + contentWidth / 2 + 5, yPosition, contentWidth / 2 - 5, 40, 'FD');
      
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      yPosition += 10;
      doc.text("Budget:", margin + 5, yPosition);
      doc.text("Hours:", margin + contentWidth / 2 + 10, yPosition);
      
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      
      yPosition += 7;
      doc.text(`Total Budget: $${project.budget || 0}`, margin + 5, yPosition);
      doc.text(`Estimated Hours: ${extraData?.estimatedHours || 0}`, margin + contentWidth / 2 + 10, yPosition);
      
      yPosition += 6;
      doc.text(`Budget Used: $${extraData?.totalCost || 0}`, margin + 5, yPosition);
      doc.text(`Hours Logged: ${extraData?.hoursLogged || 0}`, margin + contentWidth / 2 + 10, yPosition);
      
      yPosition += 20;

      // Add project description
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text("Description:", margin, yPosition);
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      yPosition += 7;
      
      const descriptionText = extraData?.description || project.description || "No description available.";
      const descriptionLines = doc.splitTextToSize(descriptionText, contentWidth);
      doc.text(descriptionLines, margin, yPosition);
      yPosition += descriptionLines.length * 5 + 10;

      // Add team members section
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text("Team Members:", margin, yPosition);
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      yPosition += 7;
      
      if (!teamMembers || teamMembers.length === 0) {
        doc.text("No team members assigned to this project.", margin, yPosition);
        yPosition += 10;
      } else {
        // Create a table for team members
        const teamMemberData = teamMembers.map((member: any) => [
          member.name || "",
          member.role || ""
        ]);
        
        doc.autoTable({
          head: [['Name', 'Role']],
          body: teamMemberData,
          startY: yPosition,
          margin: { left: margin },
          styles: { fontSize: 10 },
          headStyles: { fillColor: [80, 80, 80] },
        });
        
        yPosition = doc.lastAutoTable.finalY + 10;
      }

      // Check if we need a new page for tasks
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 20;
      }

      // Add tasks section
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text("Tasks:", margin, yPosition);
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      yPosition += 7;
      
      if (!extraData?.tasks || extraData.tasks.length === 0) {
        doc.text("No tasks added to this project.", margin, yPosition);
        yPosition += 10;
      } else {
        // Create a table for tasks
        const taskData = extraData.tasks.map((task: any) => [
          task.name || "",
          task.status || "",
          task.dueDate || "",
          task.assignee || ""
        ]);
        
        doc.autoTable({
          head: [['Task Name', 'Status', 'Due Date', 'Assignee']],
          body: taskData,
          startY: yPosition,
          margin: { left: margin },
          styles: { fontSize: 10 },
          headStyles: { fillColor: [80, 80, 80] },
        });
        
        yPosition = doc.lastAutoTable.finalY + 10;
      }

      // Check if we need a new page for materials
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 20;
      }

      // Add materials section
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text("Materials:", margin, yPosition);
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      yPosition += 7;
      
      if (!extraData?.materials || extraData.materials.length === 0) {
        doc.text("No materials added to this project.", margin, yPosition);
        yPosition += 10;
      } else {
        // Create a table for materials
        const materialData = extraData.materials.map((material: any) => [
          material.name || "",
          material.quantity || "",
          material.cost || "",
          material.status || ""
        ]);
        
        doc.autoTable({
          head: [['Material Name', 'Quantity', 'Cost', 'Status']],
          body: materialData,
          startY: yPosition,
          margin: { left: margin },
          styles: { fontSize: 10 },
          headStyles: { fillColor: [80, 80, 80] },
        });
        
        yPosition = doc.lastAutoTable.finalY + 10;
      }

      // Check if we need a new page for notes
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 20;
      }

      // Add notes section
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text("Notes:", margin, yPosition);
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      yPosition += 7;
      
      if (!extraData?.notes || extraData.notes.length === 0) {
        doc.text("No notes added to this project.", margin, yPosition);
      } else {
        // Create a table for notes
        const noteData = extraData.notes.map((note: any) => [
          note.date || "",
          note.author || "",
          note.content || ""
        ]);
        
        doc.autoTable({
          head: [['Date', 'Author', 'Content']],
          body: noteData,
          startY: yPosition,
          margin: { left: margin },
          styles: { fontSize: 10, cellWidth: 'auto' },
          columnStyles: { 2: { cellWidth: 100 } },
          headStyles: { fillColor: [80, 80, 80] },
        });
      }

      // Add footer with generation info
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(
          `Generated on ${format(new Date(), 'MMM dd, yyyy')} - Page ${i} of ${pageCount}`,
          pageWidth / 2,
          doc.internal.pageSize.height - 10,
          { align: "center" }
        );
      }

      // Save the PDF
      doc.save(`Project_${project.id}.pdf`);
      console.log("PDF generated successfully");
      return true;
    } catch (error) {
      console.error("Error generating PDF:", error);
      return false;
    }
  };

  return { generatePDF };
};

export default ProjectPdfGenerator;
