import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getDoctorById } from '../services/doctorService';
import type { Doctor } from '../types/index';

export default function DoctorDetailsScreen() {
  const { doctorId } = useLocalSearchParams();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDoctor = async () => {
    try {
      const data = await getDoctorById(String(doctorId));
      setDoctor(data);
    } catch (error) {
      console.log('Error fetching doctor details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctor();
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
          Loading doctor details...
        </Text>
      </View>
    );
  }

  if (!doctor) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f8fbff',
          padding: 20,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 8 }}>
          Doctor Not Found
        </Text>
        <Text style={{ color: '#64748b', textAlign: 'center' }}>
          This doctor profile is not available right now.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8fbff' }}>
      <View style={{ padding: 20 }}>
        <View
          style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 22,
            shadowColor: '#000',
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <Image
              source={{ uri: doctor.profileImage }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                marginBottom: 14,
                backgroundColor: '#e2e8f0',
              }}
            />

            <Text style={{ fontSize: 24, fontWeight: '800' }}>
              {doctor.name}
            </Text>

            <Text style={{ color: '#2563eb', marginTop: 6, fontSize: 16 }}>
              {doctor.specialization}
            </Text>
          </View>

          <InfoRow label="Experience" value={doctor.experience} />
          <InfoRow label="Hospital" value={doctor.clinicName} />
          <InfoRow label="Address" value={doctor.clinicAddress} />
          <InfoRow label="Timing" value={doctor.timing} />
          <InfoRow label="Fees" value={doctor.fees || '₹500'} />
          <InfoRow label="About" value={doctor.about || 'Experienced specialist'} />

          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/book-appointment',
                params: {
                  doctorId: doctor.doctorId,
                  doctorName: doctor.name,
                  specialization: doctor.specialization,
                },
              })
            }
            style={{
              backgroundColor: '#2563eb',
              padding: 16,
              borderRadius: 16,
              alignItems: 'center',
              marginTop: 24,
            }}
          >
            <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>
              Book Appointment
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ fontSize: 14, fontWeight: '700', color: '#0f172a' }}>
        {label}
      </Text>
      <Text style={{ color: '#64748b', marginTop: 4 }}>{value}</Text>
    </View>
  );
}