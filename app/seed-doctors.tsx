import { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { seedDoctorsToFirestore } from '../services/seedDoctors';

export default function SeedDoctorsScreen() {
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    try {
      setLoading(true);
      await seedDoctorsToFirestore();
      Alert.alert('Success', '10 doctors added to Firestore successfully.');
    } catch (error) {
      Alert.alert('Error', 'Could not add doctors.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#f8fbff',
      }}
    >
      <Text style={{ fontSize: 28, fontWeight: '800', marginBottom: 16 }}>
        Seed Demo Doctors
      </Text>

      <Text style={{ color: '#64748b', textAlign: 'center', marginBottom: 24 }}>
        Tap below once to add 10 doctors into Firestore.
      </Text>

      <TouchableOpacity
        onPress={handleSeed}
        disabled={loading}
        style={{
          backgroundColor: '#2563eb',
          paddingVertical: 16,
          paddingHorizontal: 24,
          borderRadius: 14,
        }}
      >
        <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>
          {loading ? 'Adding Doctors...' : 'Add Demo Doctors'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}