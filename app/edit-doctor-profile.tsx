import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { auth, db } from '../services/firebase';

export default function EditDoctorProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');
  const [timing, setTiming] = useState('');
  const [profileImage, setProfileImage] = useState(
    'https://cdn-icons-png.flaticon.com/512/387/387561.png'
  );

  const fetchDoctorProfile = async () => {
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        Alert.alert('Error', 'Doctor not logged in');
        router.replace('/login');
        return;
      }

      const doctorRef = doc(db, 'doctors', currentUser.uid);
      const doctorSnap = await getDoc(doctorRef);

      if (!doctorSnap.exists()) {
        Alert.alert('Error', 'Doctor profile not found');
        router.back();
        return;
      }

      const data = doctorSnap.data();

      setName(data.name || '');
      setSpecialization(data.specialization || '');
      setExperience(data.experience || '');
      setClinicName(data.clinicName || '');
      setClinicAddress(data.clinicAddress || '');
      setTiming(data.timing || '');
      setProfileImage(
        data.profileImage ||
          'https://cdn-icons-png.flaticon.com/512/387/387561.png'
      );
    } catch (error) {
      console.log('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load doctor profile');
    } finally {
      setLoading(false);
    }
  };

  const pickImageFromGallery = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Gallery permission is needed');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleUpdateProfile = async () => {
    if (
      !name ||
      !specialization ||
      !experience ||
      !clinicName ||
      !clinicAddress ||
      !timing
    ) {
      Alert.alert('Missing Fields', 'Please fill all doctor details');
      return;
    }

    try {
      setSaving(true);

      const currentUser = auth.currentUser;

      if (!currentUser) {
        Alert.alert('Error', 'Doctor not logged in');
        return;
      }

      await updateDoc(doc(db, 'doctors', currentUser.uid), {
        name,
        specialization,
        experience,
        clinicName,
        clinicAddress,
        timing,
        profileImage,
      });

      await updateDoc(doc(db, 'users', currentUser.uid), {
        name,
      });

      Alert.alert('Success', 'Doctor profile updated successfully');
      router.back();
    } catch (error: any) {
      Alert.alert('Update Failed', error.message);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8fbff' }}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 30, fontWeight: '800', marginBottom: 24 }}>
          Edit Doctor Profile
        </Text>

        <View style={{ backgroundColor: 'white', borderRadius: 22, padding: 20 }}>
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <Image
              source={{ uri: profileImage }}
              style={{ width: 120, height: 120, borderRadius: 60, marginBottom: 14 }}
            />

            <TouchableOpacity
              onPress={pickImageFromGallery}
              style={{
                backgroundColor: '#0f766e',
                paddingVertical: 12,
                paddingHorizontal: 18,
                borderRadius: 12,
              }}
            >
              <Text style={{ color: 'white', fontWeight: '700' }}>
                Choose Photo from Gallery
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder="Doctor Name"
            value={name}
            onChangeText={setName}
            style={inputStyle}
          />
          <TextInput
            placeholder="Specialization"
            value={specialization}
            onChangeText={setSpecialization}
            style={inputStyle}
          />
          <TextInput
            placeholder="Experience"
            value={experience}
            onChangeText={setExperience}
            style={inputStyle}
          />
          <TextInput
            placeholder="Hospital / Clinic Name"
            value={clinicName}
            onChangeText={setClinicName}
            style={inputStyle}
          />
          <TextInput
            placeholder="Clinic / Hospital Address"
            value={clinicAddress}
            onChangeText={setClinicAddress}
            style={inputStyle}
          />
          <TextInput
            placeholder="Available Timing"
            value={timing}
            onChangeText={setTiming}
            style={inputStyle}
          />

          <TouchableOpacity
            onPress={handleUpdateProfile}
            disabled={saving}
            style={{
              backgroundColor: saving ? '#93c5fd' : '#2563eb',
              padding: 16,
              borderRadius: 14,
              alignItems: 'center',
              marginTop: 10,
            }}
          >
            <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>
              {saving ? 'Updating...' : 'Update Profile'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const inputStyle = {
  backgroundColor: '#f8fbff',
  padding: 15,
  borderRadius: 14,
  marginBottom: 14,
  borderWidth: 1,
  borderColor: '#dbeafe',
};