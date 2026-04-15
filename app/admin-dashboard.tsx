import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { getAllAppointments } from '../services/appointmentService';
import {
  deleteDoctorProfile,
  getAllDoctors,
  toggleDoctorAvailability,
} from '../services/doctorService';
import { auth } from '../services/firebase';
import { getAllPatients } from '../services/userService';

export default function AdminDashboardScreen() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const doctorsData = await getAllDoctors();
      const appointmentsData = await getAllAppointments();
      const patientsData = await getAllPatients();

      setDoctors(doctorsData);
      setAppointments(appointmentsData);
      setPatients(patientsData);
    } catch (error) {
      console.log('Admin dashboard error:', error);
      Alert.alert('Error', 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDoctor = (doctorId: string) => {
    Alert.alert(
      'Delete Doctor',
      'Are you sure you want to delete this doctor?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoctorProfile(doctorId);
              fetchAllData();
            } catch (error) {
              Alert.alert('Error', 'Could not delete doctor');
            }
          },
        },
      ]
    );
  };

  const handleToggleAvailability = async (
    doctorId: string,
    currentStatus: boolean
  ) => {
    try {
      await toggleDoctorAvailability(doctorId, currentStatus);
      fetchAllData();
    } catch (error) {
      Alert.alert('Error', 'Could not update doctor availability');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/role-select');
  };

  useEffect(() => {
    fetchAllData();
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
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={{ marginTop: 10, color: '#64748b' }}>
          Loading admin panel...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8fbff', padding: 20 }}>
      <Text style={{ fontSize: 30, fontWeight: '800', marginBottom: 6 }}>
        Admin Dashboard
      </Text>

      <Text style={{ color: '#64748b', marginBottom: 20 }}>
        Manage hospital OPD system
      </Text>

      {/* Stats */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        {[
          { label: 'Doctors', value: doctors.length },
          { label: 'Patients', value: patients.length },
          { label: 'Bookings', value: appointments.length },
        ].map((item, index) => (
          <View
            key={index}
            style={{
              backgroundColor: 'white',
              padding: 18,
              borderRadius: 18,
              width: '31%',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Text style={{ fontSize: 22, fontWeight: '800', color: '#2563eb' }}>
              {item.value}
            </Text>
            <Text style={{ color: '#64748b', marginTop: 4 }}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* Add Doctor */}
      <TouchableOpacity
        onPress={() => router.push('/add-doctor')}
        style={{
          backgroundColor: '#7c3aed',
          padding: 16,
          borderRadius: 14,
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>
          + Add New Doctor
        </Text>
      </TouchableOpacity>

      {/* Doctors */}
      <Text style={{ fontSize: 22, fontWeight: '800', marginBottom: 14 }}>
        Doctors
      </Text>

      {doctors.map((item) => (
        <View
          key={item.doctorId}
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
          <View style={{ flexDirection: 'row', marginBottom: 12 }}>
            <Image
              source={{ uri: item.profileImage }}
              style={{
                width: 70,
                height: 70,
                borderRadius: 35,
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
                {item.clinicName}
              </Text>
              <Text style={{ color: '#64748b', marginTop: 2 }}>
                {item.timing}
              </Text>
              <Text
                style={{
                  marginTop: 6,
                  fontWeight: '700',
                  color: item.available ? '#16a34a' : '#dc2626',
                }}
              >
                {item.available ? 'Available' : 'Unavailable'}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/edit-doctor',
                  params: { doctorId: item.doctorId },
                })
              }
              style={{
                backgroundColor: '#2563eb',
                padding: 12,
                borderRadius: 12,
                flex: 1,
                marginRight: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', fontWeight: '700' }}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                handleToggleAvailability(item.doctorId, item.available)
              }
              style={{
                backgroundColor: item.available ? '#f59e0b' : '#16a34a',
                padding: 12,
                borderRadius: 12,
                flex: 1,
                marginRight: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', fontWeight: '700' }}>
                {item.available ? 'Disable' : 'Enable'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleDeleteDoctor(item.doctorId)}
              style={{
                backgroundColor: '#dc2626',
                padding: 12,
                borderRadius: 12,
                flex: 1,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', fontWeight: '700' }}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Appointments */}
      <Text style={{ fontSize: 22, fontWeight: '800', marginTop: 20, marginBottom: 14 }}>
        All Bookings
      </Text>

      {appointments.length === 0 ? (
        <Text style={{ color: '#64748b', marginBottom: 20 }}>
          No bookings yet.
        </Text>
      ) : (
        appointments.map((item) => (
          <View
            key={item.id}
            style={{
              backgroundColor: 'white',
              borderRadius: 18,
              padding: 16,
              marginBottom: 14,
            }}
          >
            <Text style={{ fontSize: 17, fontWeight: '700' }}>
              {item.patientName}
            </Text>
            <Text style={{ color: '#64748b', marginTop: 4 }}>
              Doctor: {item.doctorName}
            </Text>
            <Text style={{ color: '#64748b', marginTop: 2 }}>
              {item.specialization}
            </Text>
            <Text style={{ color: '#64748b', marginTop: 2 }}>
              {item.date} • {item.time}
            </Text>
            <Text
              style={{
                marginTop: 8,
                fontWeight: '700',
                color:
                  item.status === 'accepted'
                    ? '#16a34a'
                    : item.status === 'rejected'
                    ? '#dc2626'
                    : '#f59e0b',
              }}
            >
              {item.status?.toUpperCase()}
            </Text>
          </View>
        ))
      )}

      {/* Patients */}
      <Text style={{ fontSize: 22, fontWeight: '800', marginTop: 20, marginBottom: 14 }}>
        All Patients
      </Text>

      {patients.length === 0 ? (
        <Text style={{ color: '#64748b', marginBottom: 20 }}>
          No patients registered yet.
        </Text>
      ) : (
        patients.map((item) => (
          <View
            key={item.id}
            style={{
              backgroundColor: 'white',
              borderRadius: 18,
              padding: 16,
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 17, fontWeight: '700' }}>{item.name}</Text>
            <Text style={{ color: '#64748b', marginTop: 4 }}>{item.email}</Text>
          </View>
        ))
      )}

      <TouchableOpacity
        onPress={handleLogout}
        style={{
          backgroundColor: '#111827',
          padding: 16,
          borderRadius: 14,
          alignItems: 'center',
          marginTop: 24,
          marginBottom: 40,
        }}
      >
        <Text style={{ color: 'white', fontWeight: '700' }}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}