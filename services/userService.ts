import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';

const usersRef = collection(db, 'users');

export const getAllPatients = async () => {
  const q = query(usersRef, where('role', '==', 'patient'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
};