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
    iframe.style.width = "1200px"; // Aumentado para 1200px
    iframe.style.height = "1600px"; // Altura aumentada
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
        }
        body {
          white-space: normal !important;
          word-break: normal !important;
        }
        table {
          width: 100% !important;
          table-layout: auto !important;
        }
        th, td {
          word-break: normal !important;
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
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(iframeDoc.body, {
        scale: 3,
        backgroundColor: "#ffffff",
        logging: false,
        useCORS: true,
        ignoreElements: (element) => element.tagName === 'BUTTON'
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      const margin = 10;
      const contentWidth = pdfWidth - margin * 2;
      const contentHeight = (canvas.height * contentWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", margin, margin, contentWidth, contentHeight);
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