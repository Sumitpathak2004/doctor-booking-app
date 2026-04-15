import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import { getDoctorById, updateDoctorProfile } from '../services/doctorService';

export default function EditDoctorScreen() {
  const { doctorId } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');
  const [timing, setTiming] = useState('');
  const [fees, setFees] = useState('');
  const [about, setAbout] = useState('');

  const fetchDoctor = async () => {
    try {
      const doctor = await getDoctorById(String(doctorId));

      if (!doctor) {
        Alert.alert('Error', 'Doctor not found');
        router.back();
        return;
      }

      setName(doctor.name || '');
      setSpecialization(doctor.specialization || '');
      setExperience(doctor.experience || '');
      setClinicName(doctor.clinicName || '');
      setClinicAddress(doctor.clinicAddress || '');
      setTiming(doctor.timing || '');
      setFees(doctor.fees || '');
      setAbout(doctor.about || '');
    } catch (error) {
      Alert.alert('Error', 'Could not load doctor details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDoctor = async () => {
    if (!doctorId) return;

    try {
      setSaving(true);

      await updateDoctorProfile(String(doctorId), {
        name,
        specialization,
        experience,
        clinicName,
        clinicAddress,
        timing,
        fees,
        about,
      });

      Alert.alert('Success', 'Doctor updated successfully');
      router.replace('/admin-dashboard');
    } catch (error) {
      Alert.alert('Error', 'Could not update doctor');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchDoctor();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 100 }} size="large" color="#7c3aed" />;
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8fbff', padding: 20 }}>
      <Text style={{ fontSize: 30, fontWeight: '800', marginBottom: 8 }}>
        Edit Doctor
      </Text>

      <Text style={{ color: '#64748b', marginBottom: 24 }}>
        Update doctor profile details
      </Text>

      {[
        ['Doctor Name', name, setName],
        ['Specialization', specialization, setSpecialization],
        ['Experience', experience, setExperience],
        ['Hospital Name', clinicName, setClinicName],
        ['Hospital Address', clinicAddress, setClinicAddress],
        ['Available Timing', timing, setTiming],
        ['Consultation Fees', fees, setFees],
        ['About Doctor', about, setAbout],
      ].map(([placeholder, value, setter], index) => (
        <TextInput
          key={index}
          placeholder={placeholder as string}
          value={value as string}
          onChangeText={setter as (text: string) => void}
          style={{
            backgroundColor: 'white',
            padding: 15,
            borderRadius: 14,
            marginBottom: 14,
            borderWidth: 1,
            borderColor: '#dbeafe',
          }}
          multiline={placeholder === 'About Doctor'}
        />
      ))}

      <TouchableOpacity
        onPress={handleUpdateDoctor}
        disabled={saving}
        style={{
          backgroundColor: saving ? '#c4b5fd' : '#7c3aed',
          padding: 16,
          borderRadius: 14,
          alignItems: 'center',
          marginTop: 10,
          marginBottom: 30,
        }}
      >
        <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>
          {saving ? 'Updating...' : 'Update Doctor'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}