import { router, useLocalSearchParams } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function AppointmentConfirmationScreen() {
  const {
    doctorName,
    specialization,
    patientName,
    patientPhone,
    date,
    time,
  } = useLocalSearchParams();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#f8fbff',
        padding: 20,
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          backgroundColor: 'white',
          padding: 24,
          borderRadius: 22,
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <Text
          style={{
            fontSize: 30,
            fontWeight: '800',
            textAlign: 'center',
            color: '#16a34a',
            marginBottom: 10,
          }}
        >
          Booking Confirmed 🎉
        </Text>

        <Text
          style={{
            textAlign: 'center',
            color: '#64748b',
            marginBottom: 24,
          }}
        >
          Your appointment request has been submitted successfully
        </Text>

        <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>
          Appointment Details
        </Text>

        <Text style={{ color: '#334155', marginBottom: 8 }}>
          <Text style={{ fontWeight: '700' }}>Doctor:</Text> {doctorName}
        </Text>

        <Text style={{ color: '#334155', marginBottom: 8 }}>
          <Text style={{ fontWeight: '700' }}>Specialization:</Text> {specialization}
        </Text>

        <Text style={{ color: '#334155', marginBottom: 8 }}>
          <Text style={{ fontWeight: '700' }}>Patient:</Text> {patientName}
        </Text>

        <Text style={{ color: '#334155', marginBottom: 8 }}>
          <Text style={{ fontWeight: '700' }}>Phone:</Text> {patientPhone}
        </Text>

        <Text style={{ color: '#334155', marginBottom: 8 }}>
          <Text style={{ fontWeight: '700' }}>Date:</Text> {date}
        </Text>

        <Text style={{ color: '#334155', marginBottom: 8 }}>
          <Text style={{ fontWeight: '700' }}>Time:</Text> {time}
        </Text>

        <Text style={{ color: '#f59e0b', marginTop: 8, fontWeight: '700' }}>
          Status: Pending Approval
        </Text>

        <TouchableOpacity
          onPress={() => router.replace('/home')}
          style={{
            backgroundColor: '#2563eb',
            padding: 16,
            borderRadius: 14,
            alignItems: 'center',
            marginTop: 24,
          }}
        >
          <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>
            Go to Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/appointment-history')}
          style={{
            backgroundColor: '#0ea5e9',
            padding: 16,
            borderRadius: 14,
            alignItems: 'center',
            marginTop: 14,
          }}
        >
          <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>
            View Appointment History
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}