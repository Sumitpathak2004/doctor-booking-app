import emailjs from '@emailjs/browser';

const EMAILJS_PUBLIC_KEY = 'FEw6MoUU9qqLIB-hM';
const EMAILJS_SERVICE_ID = 'service_rk8blfc';
const EMAILJS_TEMPLATE_REQUEST = 'template_c9aqkym';
const EMAILJS_TEMPLATE_STATUS = 'template_b45bx1n';

export const sendAppointmentRequestEmail = async (data: {
  patientEmail: string;
  patientName: string;
  bookingId: string;
  doctorName: string;
  department: string;
  hospital: string;
  date: string;
  time: string;
  status: string;
}) => {
  try {
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_REQUEST,
      {
        to_email: data.patientEmail,
        patient_name: data.patientName,
        booking_id: data.bookingId,
        doctor_name: data.doctorName,
        department: data.department,
        hospital: data.hospital,
        date: data.date,
        time: data.time,
        status: data.status,
      },
      {
        publicKey: EMAILJS_PUBLIC_KEY,
      }
    );

    console.log('Appointment request email sent:', response);
    return true;
  } catch (error) {
    console.log('Appointment request email failed:', error);
    return false;
  }
};

export const sendAppointmentStatusEmail = async (data: {
  patientEmail: string;
  patientName: string;
  bookingId: string;
  doctorName: string;
  department: string;
  hospital: string;
  date: string;
  time: string;
  status: string;
}) => {
  try {
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_STATUS,
      {
        to_email: data.patientEmail,
        patient_name: data.patientName,
        booking_id: data.bookingId,
        doctor_name: data.doctorName,
        department: data.department,
        hospital: data.hospital,
        date: data.date,
        time: data.time,
        status: data.status,
      },
      {
        publicKey: EMAILJS_PUBLIC_KEY,
      }
    );

    console.log('Appointment status email sent:', response);
    return true;
  } catch (error) {
    console.log('Appointment status email failed:', error);
    return false;
  }
};