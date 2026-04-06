import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';

const doctorsRef = collection(db, 'doctors');

export const getAllDoctors = async () => {
  const snapshot = await getDocs(doctorsRef);

  return snapshot.docs.map((doc) => ({
    doctorId: doc.id,
    ...doc.data(),
  }));
};

export const getDoctorsBySpecialization = async (specialization: string) => {
  const q = query(doctorsRef, where('specialization', '==', specialization));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    doctorId: doc.id,
    ...doc.data(),
  }));
};