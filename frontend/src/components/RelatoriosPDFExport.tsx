"use client";
import { ReactNode, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Printer } from "lucide-react";

export function RelatoriosPDFExport({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleExportPdf = async () => {
    if (!containerRef.current) return;

    // Criar iframe para isolamento total
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.left = "-9999px";
    iframe.style.width = "800px";
    iframe.style.height = "1200px";
    document.body.appendChild(iframe);

    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) return;

      // Clonar o conteúdo original
      const clone = containerRef.current.cloneNode(true) as HTMLElement;
      
      // Adicionar estilos de reset
      const styleReset = document.createElement("style");
      styleReset.innerHTML = `
        * {
          color: #222 !important;
          background: #fff !important;
          border-color: #ccc !important;
          white-space: normal !important;
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
        }
        
        table, td, th {
          white-space: normal !important;
          word-break: break-word !important;
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
        }
      `;
      
      // Adicionar estilos globais do Tailwind
      const tailwindStyles = Array.from(document.head.querySelectorAll('style[data-type="tailwind"]'))
        .map(style => style.outerHTML)
        .join("");
      
      iframeDoc.head.innerHTML = `
        <meta charset="utf-8">
        <title>PDF Export</title>
        ${tailwindStyles}
        <style>${styleReset.innerHTML}</style>
      `;
      
      iframeDoc.body.appendChild(clone);
      
      // Aguardar carregamento de recursos
      await new Promise(resolve => setTimeout(resolve, 300));

      const canvas = await html2canvas(iframeDoc.body, {
        scale: 2,
        backgroundColor: "#ffffff",
        logging: false,
        useCORS: true
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("relatorio.pdf");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
    } finally {
      document.body.removeChild(iframe);
    }
  };

  return (
    <>
      <button
        onClick={handleExportPdf}
        className="p-2 hover:bg-gray-100 rounded-lg mb-4"
        title="Exportar PDF"
      >
        <Printer className="w-5 h-5 text-gray-600" />
      </button>
      <div ref={containerRef}>{children}</div>
    </>
  );
}