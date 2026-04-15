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

export default function DoctorListScreen() {
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
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fbff', padding: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: '800', marginBottom: 6 }}>
        Available Doctors
      </Text>

      <Text style={{ color: '#64748b', marginBottom: 20 }}>
        {specialization}
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
            No doctors found in this specialization.
          </Text>
        </View>
      ) : (
        <FlatList
          data={doctors}
          keyExtractor={(item) => item.doctorId}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 18,
                padding: 16,
                marginBottom: 16,
                shadowColor: '#000',
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <Image
                  source={{ uri: item.profileImage }}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    marginRight: 14,
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
                    Fees: {item.fees}
                  </Text>
                </View>
              </View>

              <Text style={{ color: '#64748b', marginTop: 12 }}>
                {item.clinicName}
              </Text>
              <Text style={{ color: '#64748b', marginTop: 4 }}>
                {item.clinicAddress}
              </Text>
              <Text style={{ color: '#64748b', marginTop: 4 }}>
                Timing: {item.timing}
              </Text>

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
                  marginTop: 16,
                  backgroundColor: '#2563eb',
                  padding: 14,
                  borderRadius: 12,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: 'white', fontWeight: '700' }}>
                  Book Appointment
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}