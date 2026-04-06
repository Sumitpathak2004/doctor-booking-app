export type Doctor = {
  doctorId: string;
  name: string;
  email: string;
  specialization: string;
  experience: string;
  clinicName: string;
  clinicAddress: string;
  timing: string;
  profileImage: string;
};

export type Appointment = {
  patientId: string;
  patientName: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  specialization: string;
  clinicName?: string;
  timing?: string;
  date: string;
  time: string;
  problem?: string;
  status: 'pending' | 'accepted' | 'rejected';
};