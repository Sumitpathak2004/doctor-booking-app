import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import type { Doctor } from '../types/index';
import { db } from './firebase';

const doctorsRef = collection(db, 'doctors');

export const getAllDoctors = async (): Promise<Doctor[]> => {
  const snapshot = await getDocs(doctorsRef);

  return snapshot.docs.map((docSnap) => ({
    doctorId: docSnap.id,
    ...docSnap.data(),
  })) as Doctor[];
};

export const getDoctorsBySpecialization = async (
  specialization: string
): Promise<Doctor[]> => {
  const q = query(
    doctorsRef,
    where('specialization', '==', specialization),
    where('available', '==', true)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => ({
    doctorId: docSnap.id,
    ...docSnap.data(),
  })) as Doctor[];
};

export const getDoctorById = async (
  doctorId: string
): Promise<Doctor | null> => {
  const doctorDoc = await getDoc(doc(db, 'doctors', doctorId));

  if (!doctorDoc.exists()) return null;

  return {
    doctorId: doctorDoc.id,
    ...doctorDoc.data(),
  } as Doctor;
};

export const getAvailableSpecializations = async (): Promise<string[]> => {
  const snapshot = await getDocs(doctorsRef);

  const specializations = snapshot.docs
    .map((docSnap) => docSnap.data().specialization)
    .filter(Boolean);

  return [...new Set(specializations)];
};

export const addDoctorProfile = async (doctorData: Doctor) => {
  await setDoc(doc(db, 'doctors', doctorData.doctorId), doctorData);
};

export const updateDoctorProfile = async (
  doctorId: string,
  updatedData: Partial<Doctor>
) => {
  await updateDoc(doc(db, 'doctors', doctorId), updatedData);
};

export const deleteDoctorProfile = async (doctorId: string) => {
  await deleteDoc(doc(db, 'doctors', doctorId));
};

export const toggleDoctorAvailability = async (
  doctorId: string,
  currentStatus: boolean
) => {
  await updateDoc(doc(db, 'doctors', doctorId), {
    available: !currentStatus,
  });
};