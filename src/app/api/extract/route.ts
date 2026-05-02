import { NextRequest, NextResponse } from "next/server";

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
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require("pdf-parse");
      const data = await pdfParse(buffer);
      const html = data.text
        .split(/\n{2,}/)
        .map((block: string) => block.trim())
        .filter(Boolean)
        .map((block: string) => `<p>${block.replace(/\n/g, " ")}</p>`)
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
