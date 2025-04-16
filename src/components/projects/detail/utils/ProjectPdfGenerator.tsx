
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { format } from "date-fns";
import { generatePdfHeader } from "./pdf/headerGenerator";
import { generateProjectDetails } from "./pdf/projectDetailsGenerator";
import { generateBudgetAndHours } from "./pdf/budgetHoursGenerator";
import { generateDescription } from "./pdf/descriptionGenerator";
import { generateTeamMembers } from "./pdf/teamMembersGenerator";
import { generateTasks } from "./pdf/tasksGenerator";
import { generateMaterials } from "./pdf/materialsGenerator";
import { generateNotes } from "./pdf/notesGenerator";
import { addFooter } from "./pdf/footerGenerator";
import { PdfContext } from "./pdf/pdfContext";

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
      
      // Initialize PDF document
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20;
      
      // Create context object to share across generators
      const context: PdfContext = {
        doc,
        pageWidth,
        margin,
        contentWidth: pageWidth - (margin * 2),
        yPosition: 20,
        project,
        extraData,
        teamMembers
      };
      
      // Generate PDF sections
      generatePdfHeader(context);
      generateProjectDetails(context);
      generateBudgetAndHours(context);
      generateDescription(context);
      generateTeamMembers(context);
      generateTasks(context);
      generateMaterials(context);
      generateNotes(context);
      
      // Add footer to all pages
      addFooter(context);
      
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
