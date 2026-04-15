export type UserRole = 'patient' | 'doctor' | 'admin';

export interface Doctor {
  doctorId: string;
  name: string;
  email: string;
  specialization: string;
  experience: string;
  clinicName: string;
  clinicAddress: string;
  timing: string;
  profileImage: string;
  emailVerified?: boolean;
  available?: boolean;
  fees?: string;
  about?: string;
}

export interface Appointment {
  id?: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  specialization: string;
  date: string;
  time: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt?: any;
}

export interface PatientUser {
  userId: string;
  name: string;
  email: string;
  role: 'patient';
}

export interface AdminUser {
  userId: string;
  name: string;
  email: string;
  role: 'admin';
}