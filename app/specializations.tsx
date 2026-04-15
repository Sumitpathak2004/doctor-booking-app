import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getAvailableSpecializations } from '../services/doctorService';

const ALL_SPECIALIZATIONS = [
  'Cardiologist',
  'Dermatologist',
  'Orthopedic',
  'Pediatrician',
  'Neurologist',
  'Gynecologist',
  'ENT Specialist',
  'Psychiatrist',
  'Dentist',
  
];

export default function SpecializationsScreen() {
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSpecializations = async () => {
    try {
      const firebaseSpecializations = await getAvailableSpecializations();

      const merged = [...new Set([...ALL_SPECIALIZATIONS, ...firebaseSpecializations])];

      setSpecializations(merged);
    } catch (error) {
      console.log('Error fetching specializations:', error);
      setSpecializations(ALL_SPECIALIZATIONS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecializations();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f8fbff',
        }}
      >
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ marginTop: 10, color: '#64748b' }}>
          Loading specializations...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fbff', padding: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: '800', marginBottom: 6 }}>
        Specializations
      </Text>

      <Text style={{ color: '#64748b', marginBottom: 20 }}>
        Choose a specialist category
      </Text>

      <FlatList
        data={specializations}
        keyExtractor={(item) => item}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/doctors-by-specialization',
                params: { specialization: item },
              })
            }
            style={{
              backgroundColor: 'white',
              padding: 18,
              borderRadius: 18,
              marginBottom: 14,
              shadowColor: '#000',
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#0f172a' }}>
              {item}
            </Text>
            <Text style={{ color: '#64748b', marginTop: 4 }}>
              View available doctors
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}