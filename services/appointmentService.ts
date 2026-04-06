import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where
} from 'firebase/firestore';
import { db } from './firebase';

const appointmentsRef = collection(db, 'appointments');

export const createAppointment = async (appointmentData: any) => {
  console.log('Saving appointment to Firestore:', appointmentData);

  const docRef = await addDoc(appointmentsRef, {
    ...appointmentData,
    createdAt: serverTimestamp(),
  });

  console.log('Appointment saved with ID:', docRef.id);
  return docRef.id;
};

export const getAppointmentsByDoctor = async (doctorId: string) => {
  const q = query(
    appointmentsRef,
    where('doctorId', '==', doctorId)
  );

  const snapshot = await getDocs(q);

  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  console.log('Doctor appointments fetched:', data);
  return data;
};

export const getAppointmentsByPatient = async (patientId: string) => {
  const q = query(
    appointmentsRef,
    where('patientId', '==', patientId)
  );

  const snapshot = await getDocs(q);

  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  console.log('Patient appointments fetched:', data);
  return data;
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