import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function AppointmentConfirmationScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#f8fbff',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <View
        style={{
          backgroundColor: 'white',
          padding: 28,
          borderRadius: 24,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <Text style={{ fontSize: 28, fontWeight: '800', marginBottom: 10 }}>
          Appointment Requested
        </Text>

        <Text
          style={{
            color: '#64748b',
            textAlign: 'center',
            fontSize: 16,
            marginBottom: 24,
          }}
        >
          Your appointment request has been sent successfully.  
          Doctor will accept or reject it soon.
        </Text>

        <TouchableOpacity
          onPress={() => router.replace('/home')}
          style={{
            backgroundColor: '#2563eb',
            padding: 16,
            borderRadius: 16,
            alignItems: 'center',
            width: '100%',
            marginBottom: 12,
          }}
        >
          <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>
            Back to Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/appointment-history')}
          style={{
            backgroundColor: '#0f766e',
            padding: 16,
            borderRadius: 16,
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>
            View My Appointments
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}