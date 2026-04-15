import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { createAppointment } from '../services/appointmentService';
import { auth } from '../services/firebase';

export default function BookAppointmentScreen() {
  const { doctorId, doctorName, specialization } = useLocalSearchParams();

  const [patientName, setPatientName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBookAppointment = async () => {
    if (!patientName || !date || !time) {
      Alert.alert('Missing Fields', 'Please fill all fields.');
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
        Alert.alert('Error', 'Doctor details missing.');
        return;
      }

      const appointmentPayload = {
        patientId: user.uid,
        patientName,
        patientEmail: user.email || '',
        doctorId: String(doctorId),
        doctorName: String(doctorName),
        specialization: String(specialization),
        date,
        time,
        status: 'pending' as const,
      };

      await createAppointment(appointmentPayload);

      Alert.alert('Success', 'Appointment request sent successfully!');
      router.push('/appointment-confirmation');
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

      <Text style={{ color: '#64748b', marginBottom: 24 }}>
        With {doctorName} ({specialization})
      </Text>

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
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
          Patient Name
        </Text>
        <TextInput
          placeholder="Enter your name"
          value={patientName}
          onChangeText={setPatientName}
          style={inputStyle}
        />

        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
          Appointment Date
        </Text>
        <TextInput
          placeholder="e.g. 10 April 2026"
          value={date}
          onChangeText={setDate}
          style={inputStyle}
        />

        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
          Appointment Time
        </Text>
        <TextInput
          placeholder="e.g. 11:30 AM"
          value={time}
          onChangeText={setTime}
          style={[inputStyle, { marginBottom: 24 }]}
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

const inputStyle = {
  borderWidth: 1,
  borderColor: '#cbd5e1',
  borderRadius: 12,
  padding: 14,
  marginBottom: 16,
};