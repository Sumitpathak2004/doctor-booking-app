import { router } from 'expo-router';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { app } from '../services/firebase';

export default function AddDoctorScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');
  const [timing, setTiming] = useState('');
  const [fees, setFees] = useState('');
  const [profileImage, setProfileImage] = useState('');

  const handleAddDoctor = async () => {
    if (
      !name ||
      !email ||
      !password ||
      !specialization ||
      !experience ||
      !clinicName ||
      !clinicAddress ||
      !timing ||
      !fees
    ) {
      Alert.alert('Missing Fields', 'Please fill all required fields');
      return;
    }

    try {
      const functions = getFunctions(app);
      const createDoctorByAdmin = httpsCallable(functions, 'createDoctorByAdmin');

      const result: any = await createDoctorByAdmin({
        name,
        email,
        password,
        specialization,
        experience,
        clinicName,
        clinicAddress,
        timing,
        fees,
        profileImage,
      });

      console.log('Doctor created:', result.data);

      Alert.alert(
        'Doctor Added Successfully',
        `Doctor login ready hai.\n\nEmail: ${email}\nPassword: ${password}`
      );

      setName('');
      setEmail('');
      setPassword('');
      setSpecialization('');
      setExperience('');
      setClinicName('');
      setClinicAddress('');
      setTiming('');
      setFees('');
      setProfileImage('');

      router.back();
    } catch (error: any) {
      console.log('ADD DOCTOR ERROR:', error);
      Alert.alert('Error', error.message || 'Failed to add doctor');
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#f8fbff' }}
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
    >
      <Text style={{ fontSize: 30, fontWeight: '800', marginBottom: 8 }}>
        Add Doctor
      </Text>

      <Text style={{ color: '#64748b', marginBottom: 24 }}>
        Create doctor account from admin panel
      </Text>

      {[
        { placeholder: 'Doctor Name', value: name, setter: setName },
        { placeholder: 'Doctor Email', value: email, setter: setEmail },
        { placeholder: 'Password', value: password, setter: setPassword },
        {
          placeholder: 'Specialization',
          value: specialization,
          setter: setSpecialization,
        },
        { placeholder: 'Experience (e.g. 8 Years)', value: experience, setter: setExperience },
        { placeholder: 'Hospital / Clinic Name', value: clinicName, setter: setClinicName },
        { placeholder: 'Hospital / Clinic Address', value: clinicAddress, setter: setClinicAddress },
        { placeholder: 'Timing', value: timing, setter: setTiming },
        { placeholder: 'Fees', value: fees, setter: setFees },
        {
          placeholder: 'Profile Image URL (optional)',
          value: profileImage,
          setter: setProfileImage,
        },
      ].map((field, index) => (
        <TextInput
          key={index}
          placeholder={field.placeholder}
          value={field.value}
          onChangeText={field.setter}
          autoCapitalize="none"
          secureTextEntry={field.placeholder === 'Password'}
          style={{
            backgroundColor: 'white',
            padding: 15,
            borderRadius: 14,
            marginBottom: 14,
            borderWidth: 1,
            borderColor: '#dbeafe',
          }}
        />
      ))}

      <TouchableOpacity
        onPress={handleAddDoctor}
        style={{
          backgroundColor: '#7c3aed',
          padding: 18,
          borderRadius: 16,
          alignItems: 'center',
          marginTop: 10,
        }}
      >
        <Text style={{ color: 'white', fontWeight: '800', fontSize: 16 }}>
          Add Doctor
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}