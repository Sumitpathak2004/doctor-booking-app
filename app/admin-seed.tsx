import { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { seedDoctorsToFirestore } from '../services/seedDoctors';

export default function AdminSeedScreen() {
  const [loading, setLoading] = useState(false);

  const handleSeedDoctors = async () => {
    try {
      setLoading(true);

      const result = await seedDoctorsToFirestore();

      if (result.success) {
        Alert.alert('Success', 'All demo doctors added to Firebase successfully!');
      } else {
        Alert.alert('Error', 'Failed to add doctors. Check console logs.');
      }
    } catch (error) {
      console.log('Seed Error:', error);
      Alert.alert('Error', 'Something went wrong while uploading doctors.');
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
      <Text
        style={{
          fontSize: 28,
          fontWeight: '800',
          marginBottom: 12,
          textAlign: 'center',
        }}
      >
        Admin Seed Panel
      </Text>

      <Text
        style={{
          color: '#64748b',
          textAlign: 'center',
          marginBottom: 30,
          fontSize: 16,
        }}
      >
        Tap the button below to upload all demo doctors into Firestore.
      </Text>

      <TouchableOpacity
        onPress={handleSeedDoctors}
        disabled={loading}
        style={{
          backgroundColor: loading ? '#93c5fd' : '#2563eb',
          paddingVertical: 16,
          paddingHorizontal: 28,
          borderRadius: 16,
          minWidth: 220,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>
          {loading ? 'Uploading Doctors...' : 'Upload Demo Doctors'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}