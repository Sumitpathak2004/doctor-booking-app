import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function RoleSelectScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#f8fbff',
        padding: 24,
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontSize: 32, fontWeight: '800', marginBottom: 10 }}>
        Hospital OPD
      </Text>

      <Text style={{ color: '#64748b', marginBottom: 30 }}>
        Select your role to continue
      </Text>

      {/* Patient */}
      <TouchableOpacity
        onPress={() => router.push('/login?role=patient')}
        style={{
          backgroundColor: '#2563eb',
          padding: 18,
          borderRadius: 16,
          marginBottom: 16,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontSize: 18, fontWeight: '700' }}>
          Patient
        </Text>
      </TouchableOpacity>

      {/* Doctor */}
      <TouchableOpacity
        onPress={() => router.push('/login?role=doctor')}
        style={{
          backgroundColor: '#0f766e',
          padding: 18,
          borderRadius: 16,
          marginBottom: 16,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontSize: 18, fontWeight: '700' }}>
          Doctor
        </Text>
      </TouchableOpacity>

      {/* Admin */}
      <TouchableOpacity
        onPress={() => router.push('/login?role=admin')}
        style={{
          backgroundColor: '#7c3aed',
          padding: 18,
          borderRadius: 16,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontSize: 18, fontWeight: '700' }}>
          Admin
        </Text>
      </TouchableOpacity>
    </View>
  );
}