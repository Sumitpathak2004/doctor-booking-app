import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import type { Appointment } from '../types/index';
import { db } from './firebase';

const appointmentsRef = collection(db, 'appointments');

export const createAppointment = async (appointmentData: Appointment) => {
  const docRef = await addDoc(appointmentsRef, {
    ...appointmentData,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
};

export const getAppointmentsByDoctor = async (doctorId: string) => {
  const q = query(appointmentsRef, where('doctorId', '==', doctorId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
};

export const getAppointmentsByPatient = async (patientId: string) => {
  const q = query(appointmentsRef, where('patientId', '==', patientId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
};

export const getAllAppointments = async () => {
  const q = query(appointmentsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
};

export const updateAppointmentStatus = async (
  appointmentId: string,
  status: 'accepted' | 'rejected'
) => {
  const appointmentDoc = doc(db, 'appointments', appointmentId);

  await updateDoc(appointmentDoc, {
    status,
  });
};