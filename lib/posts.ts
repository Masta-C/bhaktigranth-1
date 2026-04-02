import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  Firestore,
} from 'firebase/firestore';
import { db } from './firebase';
import { BlogPost } from './types';

const postsCollection = db ? collection(db, 'posts') : null;

function getPostsCollection() {
  if (!db || !postsCollection) {
    throw new Error('Firebase is not initialized. Make sure you are on client side with env config.');
  }
  return postsCollection;
}

export async function fetchPublishedPosts(): Promise<BlogPost[]> {
  const postsCollectionRef = getPostsCollection();
  const q = query(postsCollectionRef, where('published', '==', true), orderBy('publishedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as BlogPost));
}

export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  const postsCollectionRef = getPostsCollection();
  const q = query(postsCollectionRef, where('slug', '==', slug), where('published', '==', true));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const docSnap = snapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() } as BlogPost;
}

export async function createPost(postData: Omit<BlogPost, 'id'>): Promise<string> {
  const postsCollectionRef = getPostsCollection();
  const docRef = await addDoc(postsCollectionRef, postData);
  return docRef.id;
}

export async function updatePost(postId: string, postData: Partial<BlogPost>): Promise<void> {
  const postsCollectionRef = getPostsCollection();
  const docRef = doc(postsCollectionRef, postId);
  await updateDoc(docRef, postData);
}

export async function deletePost(postId: string): Promise<void> {
  const postsCollectionRef = getPostsCollection();
  const docRef = doc(postsCollectionRef, postId);
  await deleteDoc(docRef);
}
