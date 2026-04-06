import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export const loginUser = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const getUserRole = async (uid: string) => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) return null;

  return userSnap.data().role;
};

export const createBasicUser = async (
  name: string,
  email: string,
  password: string,
  role: 'patient' | 'doctor'
) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, 'users', userCredential.user.uid), {
    userId: userCredential.user.uid,
    name,
    email,
    role,
  });

  return userCredential;
};