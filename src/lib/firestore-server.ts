const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

type FirestoreFields = Record<string, { stringValue?: string; integerValue?: string; booleanValue?: boolean; timestampValue?: string }>;

function str(fields: FirestoreFields, key: string): string {
  return fields[key]?.stringValue ?? "";
}

export interface PostServerMeta {
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string;
  category: string;
}

export async function getPostMetaBySlug(slug: string): Promise<PostServerMeta | null> {
  try {
    const res = await fetch(`${BASE_URL}:runQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: "posts" }],
          where: {
            compositeFilter: {
              op: "AND",
              filters: [
                { fieldFilter: { field: { fieldPath: "slug" }, op: "EQUAL", value: { stringValue: slug } } },
                { fieldFilter: { field: { fieldPath: "status" }, op: "EQUAL", value: { stringValue: "published" } } },
              ],
            },
          },
          limit: 1,
        },
      }),
      next: { revalidate: 300 },
    } as RequestInit);

    const data = await res.json();
    const doc = data[0]?.document;
    if (!doc) return null;

    const f: FirestoreFields = doc.fields ?? {};
    return { slug: str(f, "slug"), title: str(f, "title"), excerpt: str(f, "excerpt"), coverImageUrl: str(f, "coverImageUrl"), category: str(f, "category") };
  } catch {
    return null;
  }
}

export async function getLatestPublishedPost(): Promise<PostServerMeta | null> {
  try {
    const res = await fetch(`${BASE_URL}:runQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: "posts" }],
          where: {
            fieldFilter: { field: { fieldPath: "status" }, op: "EQUAL", value: { stringValue: "published" } },
          },
          orderBy: [{ field: { fieldPath: "publishedAt" }, direction: "DESCENDING" }],
          limit: 1,
        },
      }),
      next: { revalidate: 300 },
    } as RequestInit);

    const data = await res.json();
    const doc = data[0]?.document;
    if (!doc) return null;

    const f: FirestoreFields = doc.fields ?? {};
    return { slug: str(f, "slug"), title: str(f, "title"), excerpt: str(f, "excerpt"), coverImageUrl: str(f, "coverImageUrl"), category: str(f, "category") };
  } catch {
    return null;
  }
}
