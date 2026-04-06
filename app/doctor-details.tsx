import { router, useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function DoctorDetailsScreen() {
  const { doctorId, name, specialization, experience, clinic, image } =
    useLocalSearchParams();

  console.log('DOCTOR DETAILS PARAMS:', {
    doctorId,
    name,
    specialization,
    experience,
    clinic,
    image,
  });

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8fbff' }}>
      <View style={{ padding: 20, alignItems: 'center' }}>
        <Image
          source={{
            uri:
              String(image) ||
              'https://cdn-icons-png.flaticon.com/512/387/387561.png',
          }}
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            marginBottom: 16,
            backgroundColor: '#e2e8f0',
          }}
        />

        <Text style={{ fontSize: 28, fontWeight: '800', textAlign: 'center' }}>
          {name}
        </Text>

        <Text style={{ color: '#2563eb', fontSize: 18, marginTop: 8 }}>
          {specialization}
        </Text>

        <Text style={{ color: '#64748b', marginTop: 6 }}>
          {experience} Experience
        </Text>

        <Text style={{ color: '#64748b', marginTop: 6, textAlign: 'center' }}>
          {clinic}
        </Text>
      </View>

      <View
        style={{
          backgroundColor: 'white',
          margin: 20,
          padding: 20,
          borderRadius: 20,
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 12 }}>
          About Doctor
        </Text>

        <Text style={{ color: '#475569', lineHeight: 24 }}>
          {name} is a highly experienced {specialization} with excellent patient
          care and professional consultation. They are available for online and
          clinic appointments.
        </Text>

        <Text
          style={{
            fontSize: 18,
            fontWeight: '700',
            marginTop: 20,
            marginBottom: 10,
          }}
        >
          Available Timing
        </Text>

        <Text style={{ color: '#475569' }}>Monday - Saturday</Text>
        <Text style={{ color: '#475569', marginTop: 4 }}>10:00 AM - 6:00 PM</Text>

        <TouchableOpacity
          onPress={() => {
            console.log('BOOKING ROUTE doctorId:', doctorId);

            router.push({
              pathname: '/book-appointment',
              params: {
                doctorId: String(doctorId),
                doctorName: String(name),
                specialization: String(specialization),
              },
            });
          }}
          style={{
            backgroundColor: '#2563eb',
            padding: 16,
            borderRadius: 14,
            alignItems: 'center',
            marginTop: 24,
          }}
        >
          <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>
            Book Appointment
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}