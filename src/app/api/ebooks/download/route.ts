import { NextRequest, NextResponse } from "next/server";

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

export async function POST(req: NextRequest) {
  const { ebookId, name, email } = await req.json();

  if (!ebookId || !name?.trim() || !email?.trim()) {
    return NextResponse.json({ error: "Name, email, and ebook ID are required." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  // Fetch ebook from Firestore REST API
  const ebookRes = await fetch(`${BASE_URL}/ebooks/${ebookId}`);
  if (!ebookRes.ok) {
    return NextResponse.json({ error: "Ebook not found." }, { status: 404 });
  }
  const ebookDoc = await ebookRes.json();
  const fields = ebookDoc.fields ?? {};

  if (fields.status?.stringValue !== "published") {
    return NextResponse.json({ error: "Ebook not available." }, { status: 404 });
  }

  const fileUrl = fields.fileUrl?.stringValue;
  const ebookTitle = fields.title?.stringValue ?? "";

  if (!fileUrl) {
    return NextResponse.json({ error: "File not available." }, { status: 404 });
  }

  // Log the download
  await fetch(`${BASE_URL}/ebook_downloads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fields: {
        ebookId: { stringValue: ebookId },
        ebookTitle: { stringValue: ebookTitle },
        name: { stringValue: name.trim() },
        email: { stringValue: email.trim().toLowerCase() },
        downloadedAt: { timestampValue: new Date().toISOString() },
      },
    }),
  });

  return NextResponse.json({ url: fileUrl });
}
