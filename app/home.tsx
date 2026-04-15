import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
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
          borderRadius: 24,
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowRadius: 10,
          elevation: 4,
        }}
      >
        <Text style={{ fontSize: 30, fontWeight: '800', marginBottom: 8 }}>
          Welcome to OPD
        </Text>

        <Text style={{ color: '#64748b', fontSize: 16, marginBottom: 26 }}>
          Book appointments with specialist doctors easily and securely.
        </Text>

        <TouchableOpacity
          onPress={() => router.push('/specializations')}
          style={{
            backgroundColor: '#2563eb',
            padding: 16,
            borderRadius: 16,
            alignItems: 'center',
            marginBottom: 14,
          }}
        >
          <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>
            Book Appointment
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/appointment-history')}
          style={{
            backgroundColor: '#0f766e',
            padding: 16,
            borderRadius: 16,
            alignItems: 'center',
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