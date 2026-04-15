import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../services/firebase';

export default function DoctorDashboardScreen() {
  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/login');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fbff', padding: 24 }}>
      <Text style={{ fontSize: 30, fontWeight: '800', marginBottom: 10 }}>
        Doctor Dashboard
      </Text>

      <Text style={{ color: '#64748b', marginBottom: 28 }}>
        Manage patient appointment requests
      </Text>

      <TouchableOpacity
        onPress={() => router.push('/appointment-requests')}
        style={{
          backgroundColor: '#2563eb',
          padding: 18,
          borderRadius: 16,
          marginBottom: 16,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>
          View Appointment Requests
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleLogout}
        style={{
          backgroundColor: '#dc2626',
          padding: 18,
          borderRadius: 16,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
}