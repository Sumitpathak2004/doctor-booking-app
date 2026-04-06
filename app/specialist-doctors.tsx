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

export default function SpecialistDoctorsScreen() {
  const { specialization } = useLocalSearchParams();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    try {
      const data = await getDoctorsBySpecialization(String(specialization));
      console.log('FILTERED DOCTORS:', data);
      setDoctors(data);
    } catch (error) {
      console.log('Error fetching filtered doctors:', error);
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
        <Text style={{ marginTop: 12, color: '#64748b' }}>
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
        Available doctors in this department
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
            No doctor found in this specialization.
          </Text>
        </View>
      ) : (
        <FlatList
          data={doctors}
          keyExtractor={(item, index) => item.doctorId || String(index)}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                router.push({
                  pathname: '/book-appointment',
                  params: {
                    doctorId: item.doctorId || '',
                    doctorName: item.name || '',
                    specialization: item.specialization || '',
                    clinicName: item.clinicName || '',
                    timing: item.timing || '',
                    profileImage: item.profileImage || '',
                  },
                });
              }}
              style={{
                backgroundColor: 'white',
                borderRadius: 20,
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
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  marginRight: 16,
                  backgroundColor: '#e2e8f0',
                }}
              />

              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: '800' }}>
                  {item.name || 'Doctor'}
                </Text>

                <Text style={{ color: '#2563eb', marginTop: 6, fontWeight: '600' }}>
                  {item.specialization || 'Specialist'}
                </Text>

                <Text style={{ color: '#64748b', marginTop: 6 }}>
                  {item.clinicName || 'Hospital'}
                </Text>

                <Text style={{ color: '#0f766e', marginTop: 6 }}>
                  {item.timing || 'Available'}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}