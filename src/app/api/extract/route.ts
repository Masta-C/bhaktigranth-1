import { NextRequest, NextResponse } from "next/server";
import { PDFParse, VerbosityLevel } from "pdf-parse";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf.mjs";

// Point pdfjs to its bundled worker file — available in node_modules at runtime
GlobalWorkerOptions.workerSrc =
  `file://${process.cwd()}/node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs`;

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const name = file.name.toLowerCase();

  try {
    if (name.endsWith(".pdf")) {
      const parser = new PDFParse({ data: buffer, verbosity: VerbosityLevel.ERRORS });
      const result = await parser.getText();

      const html = result.text
        .split(/\n{2,}/)
        .map((block: string) => block.replace(/\n/g, " ").trim())
        .filter((block: string) => block && !block.match(/^--\s*\d+\s*of\s*\d+\s*--$/))
        .map((block: string) => `<p>${block}</p>`)
        .join("");

      return NextResponse.json({ content: html });
    }

    if (name.endsWith(".docx") || name.endsWith(".doc")) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const mammoth = require("mammoth");
      const result = await mammoth.convertToHtml({ buffer });
      return NextResponse.json({ content: result.value });
    }

    return NextResponse.json(
      { error: "Unsupported file type. Please upload a .pdf, .doc, or .docx file." },
      { status: 400 }
    );
  } catch (err) {
    console.error("File extraction error:", err);
    return NextResponse.json(
      { error: "Failed to extract content. The file may be corrupted or password-protected." },
      { status: 500 }
    );
  }
}
