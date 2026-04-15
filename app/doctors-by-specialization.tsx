import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { getDoctorsBySpecialization } from '../services/doctorService';

export default function DoctorsBySpecializationScreen() {
  const { specialization } = useLocalSearchParams();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    try {
      if (!specialization) return;

      const data = await getDoctorsBySpecialization(String(specialization));
      setDoctors(data);
    } catch (error) {
      console.log('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
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
          Loading doctors...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fbff', padding: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: '800', marginBottom: 6 }}>
        {specialization}
      </Text>

      <Text style={{ color: '#64748b', marginBottom: 20 }}>
        Available doctors in this category
      </Text>

      {doctors.length === 0 ? (
        <View
          style={{
            backgroundColor: 'white',
            padding: 24,
            borderRadius: 18,
            alignItems: 'center',
            marginTop: 30,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>
            No Doctors Available
          </Text>
          <Text style={{ color: '#64748b', textAlign: 'center' }}>
            No doctor is added yet in this specialization.
          </Text>
        </View>
      ) : (
        <FlatList
          data={doctors}
          keyExtractor={(item) => item.doctorId}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/book-appointment',
                  params: {
                    doctorId: item.doctorId,
                    doctorName: item.name,
                    specialization: item.specialization,
                  },
                })
              }
              style={{
                backgroundColor: 'white',
                borderRadius: 18,
                padding: 16,
                marginBottom: 16,
                shadowColor: '#000',
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 3,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Image
                source={{
                  uri:
                    item.profileImage ||
                    'https://cdn-icons-png.flaticon.com/512/387/387561.png',
                }}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 36,
                  marginRight: 14,
                  backgroundColor: '#e2e8f0',
                }}
              />

              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: '700' }}>
                  {item.name}
                </Text>

                <Text style={{ color: '#2563eb', marginTop: 4 }}>
                  {item.specialization}
                </Text>

                <Text style={{ color: '#64748b', marginTop: 4 }}>
                  {item.experience}
                </Text>

                <Text style={{ color: '#64748b', marginTop: 4 }}>
                  {item.clinicName}
                </Text>

                <Text style={{ color: '#16a34a', marginTop: 6, fontWeight: '700' }}>
                  {item.fees || '₹500'}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}