import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { createAppointment } from '../services/appointmentService';
import { auth } from '../services/firebase';

export default function BookAppointmentScreen() {
  const {
    doctorId,
    doctorName,
    specialization,
    clinicName,
    timing,
    profileImage,
  } = useLocalSearchParams();

  const [patientName, setPatientName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [problem, setProblem] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBookAppointment = async () => {
    if (!patientName || !date || !time || !problem) {
      Alert.alert('Missing Fields', 'Please fill all appointment details.');
      return;
    }

    try {
      setLoading(true);

      const user = auth.currentUser;

      if (!user) {
        Alert.alert('Error', 'Please login first.');
        return;
      }

      if (!doctorId || !doctorName || !specialization) {
        Alert.alert('Error', 'Doctor details missing. Please select doctor again.');
        return;
      }

      const appointmentPayload = {
        patientId: user.uid,
        patientName,
        patientEmail: user.email || '',
        doctorId: String(doctorId),
        doctorName: String(doctorName),
        specialization: String(specialization),
        clinicName: String(clinicName || ''),
        timing: String(timing || ''),
        date,
        time,
        problem,
        status: 'pending' as const,
      };

      console.log('APPOINTMENT PAYLOAD:', appointmentPayload);

      await createAppointment(appointmentPayload);

      Alert.alert('Success', 'Appointment request sent successfully!');
      router.replace('/appointment-confirmation');
    } catch (error: any) {
      console.log('Booking Error:', error);
      Alert.alert(
        'Error',
        error?.message || 'Something went wrong while booking appointment.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8fbff', padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: '800', marginBottom: 6 }}>
        Book Appointment
      </Text>

      <Text style={{ color: '#64748b', marginBottom: 20 }}>
        Fill your details and confirm appointment
      </Text>

      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 22,
          padding: 18,
          marginBottom: 20,
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 3,
          alignItems: 'center',
        }}
      >
        <Image
          source={{
            uri:
              profileImage && String(profileImage).trim() !== ''
                ? String(profileImage)
                : 'https://cdn-icons-png.flaticon.com/512/387/387561.png',
          }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            marginBottom: 14,
            backgroundColor: '#e2e8f0',
          }}
        />

        <Text style={{ fontSize: 22, fontWeight: '800', textAlign: 'center' }}>
          {doctorName || 'Doctor'}
        </Text>

        <Text style={{ color: '#2563eb', marginTop: 8, fontWeight: '700' }}>
          {specialization || 'Specialist'}
        </Text>

        <Text style={{ color: '#64748b', marginTop: 8, textAlign: 'center' }}>
          {clinicName || 'Hospital'}
        </Text>

        <Text style={{ color: '#0f766e', marginTop: 8, fontWeight: '600' }}>
          {timing || 'Available'}
        </Text>
      </View>

      <View
        style={{
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 20,
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 8 }}>
          Patient Name
        </Text>
        <TextInput
          placeholder="Enter patient full name"
          value={patientName}
          onChangeText={setPatientName}
          style={{
            borderWidth: 1,
            borderColor: '#cbd5e1',
            borderRadius: 12,
            padding: 14,
            marginBottom: 16,
          }}
        />

        <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 8 }}>
          Appointment Date
        </Text>
        <TextInput
          placeholder="e.g. 10 April 2026"
          value={date}
          onChangeText={setDate}
          style={{
            borderWidth: 1,
            borderColor: '#cbd5e1',
            borderRadius: 12,
            padding: 14,
            marginBottom: 16,
          }}
        />

        <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 8 }}>
          Appointment Time
        </Text>
        <TextInput
          placeholder="e.g. 11:30 AM"
          value={time}
          onChangeText={setTime}
          style={{
            borderWidth: 1,
            borderColor: '#cbd5e1',
            borderRadius: 12,
            padding: 14,
            marginBottom: 16,
          }}
        />

        <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 8 }}>
          Problem / Symptoms
        </Text>
        <TextInput
          placeholder="Describe your problem"
          value={problem}
          onChangeText={setProblem}
          multiline
          numberOfLines={4}
          style={{
            borderWidth: 1,
            borderColor: '#cbd5e1',
            borderRadius: 12,
            padding: 14,
            marginBottom: 24,
            textAlignVertical: 'top',
            minHeight: 110,
          }}
        />

        <TouchableOpacity
          onPress={handleBookAppointment}
          disabled={loading}
          style={{
            backgroundColor: '#2563eb',
            padding: 16,
            borderRadius: 14,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>
            {loading ? 'Booking...' : 'Confirm Booking'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}