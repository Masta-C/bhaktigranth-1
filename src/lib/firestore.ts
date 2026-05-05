import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Post, Vlog, QnAItem, Ebook, EbookDownload } from "@/types";

// ── Helpers ────────────────────────────────────────────────────────────────

function toDate(val: unknown): Date {
  if (val instanceof Timestamp) return val.toDate();
  if (val instanceof Date) return val;
  return new Date();
}

// ── Posts ──────────────────────────────────────────────────────────────────

export async function getPublishedPosts(): Promise<Post[]> {
  const q = query(
    collection(db, "posts"),
    where("status", "==", "published"),
    orderBy("publishedAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      title: data.title ?? "",
      slug: data.slug ?? "",
      excerpt: data.excerpt ?? "",
      content: data.content ?? "",
      coverImageUrl: data.coverImageUrl ?? "",
      category: data.category ?? "",
      status: data.status,
      createdAt: toDate(data.createdAt),
      publishedAt: data.publishedAt ? toDate(data.publishedAt) : null,
    } as Post;
  });
}

export async function getAllPosts(): Promise<Post[]> {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      title: data.title ?? "",
      slug: data.slug ?? "",
      excerpt: data.excerpt ?? "",
      content: data.content ?? "",
      coverImageUrl: data.coverImageUrl ?? "",
      category: data.category ?? "",
      status: data.status,
      createdAt: toDate(data.createdAt),
      publishedAt: data.publishedAt ? toDate(data.publishedAt) : null,
    } as Post;
  });
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const q = query(collection(db, "posts"), where("slug", "==", slug));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  const data = d.data();
  return {
    id: d.id,
    title: data.title ?? "",
    slug: data.slug ?? "",
    excerpt: data.excerpt ?? "",
    content: data.content ?? "",
    coverImageUrl: data.coverImageUrl ?? "",
    category: data.category ?? "",
    status: data.status,
    createdAt: toDate(data.createdAt),
    publishedAt: data.publishedAt ? toDate(data.publishedAt) : null,
  } as Post;
}

export async function getPostById(id: string): Promise<Post | null> {
  const snap = await getDoc(doc(db, "posts", id));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: snap.id,
    title: data.title ?? "",
    slug: data.slug ?? "",
    excerpt: data.excerpt ?? "",
    content: data.content ?? "",
    coverImageUrl: data.coverImageUrl ?? "",
    category: data.category ?? "",
    status: data.status,
    createdAt: toDate(data.createdAt),
    publishedAt: data.publishedAt ? toDate(data.publishedAt) : null,
  } as Post;
}

export async function createPost(
  data: Omit<Post, "id" | "createdAt" | "publishedAt">
): Promise<string> {
  const ref = await addDoc(collection(db, "posts"), {
    ...data,
    createdAt: serverTimestamp(),
    publishedAt: data.status === "published" ? serverTimestamp() : null,
  });
  return ref.id;
}

export async function updatePost(
  id: string,
  data: Partial<Omit<Post, "id" | "createdAt">>
): Promise<void> {
  const updates: Record<string, unknown> = { ...data };
  if (data.status === "published") {
    const existing = await getPostById(id);
    if (existing && !existing.publishedAt) {
      updates.publishedAt = serverTimestamp();
    }
  }
  await updateDoc(doc(db, "posts", id), updates);
}

export async function deletePost(id: string): Promise<void> {
  await deleteDoc(doc(db, "posts", id));
}

// ── Vlogs ──────────────────────────────────────────────────────────────────

export async function getPublishedVlogs(): Promise<Vlog[]> {
  const q = query(
    collection(db, "vlogs"),
    where("status", "==", "published"),
    orderBy("publishedAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      title: data.title ?? "",
      youtubeUrl: data.youtubeUrl ?? "",
      description: data.description ?? "",
      status: data.status,
      createdAt: toDate(data.createdAt),
      publishedAt: data.publishedAt ? toDate(data.publishedAt) : null,
    } as Vlog;
  });
}

export async function getAllVlogs(): Promise<Vlog[]> {
  const q = query(collection(db, "vlogs"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      title: data.title ?? "",
      youtubeUrl: data.youtubeUrl ?? "",
      description: data.description ?? "",
      status: data.status,
      createdAt: toDate(data.createdAt),
      publishedAt: data.publishedAt ? toDate(data.publishedAt) : null,
    } as Vlog;
  });
}

export async function createVlog(
  data: Omit<Vlog, "id" | "createdAt" | "publishedAt">
): Promise<string> {
  const ref = await addDoc(collection(db, "vlogs"), {
    ...data,
    createdAt: serverTimestamp(),
    publishedAt: data.status === "published" ? serverTimestamp() : null,
  });
  return ref.id;
}

export async function updateVlog(
  id: string,
  data: Partial<Omit<Vlog, "id" | "createdAt">>
): Promise<void> {
  await updateDoc(doc(db, "vlogs", id), data);
}

export async function deleteVlog(id: string): Promise<void> {
  await deleteDoc(doc(db, "vlogs", id));
}

// ── Q&A ────────────────────────────────────────────────────────────────────

export async function getPublishedQnA(): Promise<QnAItem[]> {
  const q = query(
    collection(db, "qna"),
    where("status", "==", "published"),
    orderBy("answeredAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      question: data.question ?? "",
      submittedBy: data.submittedBy ?? "",
      answer: data.answer ?? null,
      status: data.status,
      createdAt: toDate(data.createdAt),
      answeredAt: data.answeredAt ? toDate(data.answeredAt) : null,
    } as QnAItem;
  });
}

export async function getPendingQnA(): Promise<QnAItem[]> {
  const q = query(
    collection(db, "qna"),
    where("status", "==", "pending"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      question: data.question ?? "",
      submittedBy: data.submittedBy ?? "",
      answer: data.answer ?? null,
      status: data.status,
      createdAt: toDate(data.createdAt),
      answeredAt: data.answeredAt ? toDate(data.answeredAt) : null,
    } as QnAItem;
  });
}

export async function submitQuestion(
  question: string,
  submittedBy: string
): Promise<string> {
  const ref = await addDoc(collection(db, "qna"), {
    question,
    submittedBy,
    answer: null,
    status: "pending",
    createdAt: serverTimestamp(),
    answeredAt: null,
  });
  return ref.id;
}

export async function answerAndPublishQnA(
  id: string,
  answer: string
): Promise<void> {
  await updateDoc(doc(db, "qna", id), {
    answer,
    status: "published",
    answeredAt: serverTimestamp(),
  });
}

export async function deleteQnA(id: string): Promise<void> {
  await deleteDoc(doc(db, "qna", id));
}

// ── Ebooks ─────────────────────────────────────────────────────────────────

function ebookFromDoc(d: { id: string; data: () => Record<string, unknown> }): Ebook {
  const data = d.data();
  return {
    id: d.id,
    title: data.title as string ?? "",
    description: data.description as string ?? "",
    coverImageUrl: data.coverImageUrl as string ?? "",
    fileUrl: data.fileUrl as string ?? "",
    category: data.category as string ?? "",
    status: data.status as "draft" | "published",
    createdAt: toDate(data.createdAt),
    publishedAt: data.publishedAt ? toDate(data.publishedAt) : null,
  };
}

export async function getPublishedEbooks(): Promise<Ebook[]> {
  const q = query(
    collection(db, "ebooks"),
    where("status", "==", "published"),
    orderBy("publishedAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(ebookFromDoc);
}

export async function getAllEbooks(): Promise<Ebook[]> {
  const q = query(collection(db, "ebooks"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(ebookFromDoc);
}

export async function getEbookById(id: string): Promise<Ebook | null> {
  const snap = await getDoc(doc(db, "ebooks", id));
  if (!snap.exists()) return null;
  return ebookFromDoc({ id: snap.id, data: snap.data });
}

export async function createEbook(
  data: Omit<Ebook, "id" | "createdAt" | "publishedAt">
): Promise<string> {
  const ref = await addDoc(collection(db, "ebooks"), {
    ...data,
    createdAt: serverTimestamp(),
    publishedAt: data.status === "published" ? serverTimestamp() : null,
  });
  return ref.id;
}

export async function updateEbook(
  id: string,
  data: Partial<Omit<Ebook, "id" | "createdAt">>
): Promise<void> {
  const updates: Record<string, unknown> = { ...data };
  if (data.status === "published") {
    const existing = await getEbookById(id);
    if (existing && !existing.publishedAt) {
      updates.publishedAt = serverTimestamp();
    }
  }
  await updateDoc(doc(db, "ebooks", id), updates);
}

export async function deleteEbook(id: string): Promise<void> {
  await deleteDoc(doc(db, "ebooks", id));
}

export async function getAllDownloads(): Promise<EbookDownload[]> {
  const q = query(collection(db, "ebook_downloads"), orderBy("downloadedAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      ebookId: data.ebookId ?? "",
      ebookTitle: data.ebookTitle ?? "",
      name: data.name ?? "",
      email: data.email ?? "",
      downloadedAt: toDate(data.downloadedAt),
    } as EbookDownload;
  });
}
