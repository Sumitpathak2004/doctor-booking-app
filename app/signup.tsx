import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth, db } from '../services/firebase';
const SPECIALIZATIONS = [
  'General Physician',
  'Cardiologist',
  'Dermatologist',
  'Orthopedic',
  'Neurologist',
  'Pediatrician',
  'Gynecologist',
  'ENT Specialist',
  'Psychiatrist',
  'Dentist',
];

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [role, setRole] = useState<'patient' | 'doctor'>('patient');

  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');
  const [timing, setTiming] = useState('');
  const [profileImage, setProfileImage] = useState(
    'https://cdn-icons-png.flaticon.com/512/387/387561.png'
  );
  const [loading, setLoading] = useState(false);

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

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please fill name, email and password');
      return;
    }

    if (role === 'doctor') {
      if (
        !specialization.trim() ||
        !experience.trim() ||
        !clinicName.trim() ||
        !clinicAddress.trim() ||
        !timing.trim()
      ) {
        Alert.alert(
          'Missing Doctor Details',
          'Please fill all doctor profile details'
        );
        return;
      }
    }

    try {
      setLoading(true);

      console.log('========== SIGNUP START ==========');
      console.log('Creating user with email:', email.trim().toLowerCase());

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password
      );

      const user = userCredential.user;

      console.log('User created successfully');
      console.log('UID:', user.uid);
      console.log('Email:', user.email);
      console.log('Email Verified Initially:', user.emailVerified);

      await updateProfile(user, {
        displayName: name.trim(),
      });

      console.log('Profile updated successfully');

      console.log('Sending verification email...');
      await sendEmailVerification(user);
      console.log('Verification email function executed successfully');

      console.log('Saving user in Firestore...');
      await setDoc(doc(db, 'users', user.uid), {
        userId: user.uid,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        emailVerified: false,
        createdAt: new Date().toISOString(),
      });

      console.log('User Firestore profile saved');

      if (role === 'doctor') {
        console.log('Saving doctor profile...');
        await setDoc(doc(db, 'doctors', user.uid), {
          doctorId: user.uid,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          specialization: specialization.trim(),
          experience: experience.trim(),
          clinicName: clinicName.trim(),
          clinicAddress: clinicAddress.trim(),
          timing: timing.trim(),
          profileImage,
          createdAt: new Date().toISOString(),
        });
        console.log('Doctor profile saved');
      }

      console.log('Signing out after signup...');
      await signOut(auth);

      console.log('========== SIGNUP SUCCESS ==========');

      Alert.alert(
        'Account Created',
        'Verification email has been sent. Please check Inbox, Promotions or Spam folder.',
        [
          {
            text: 'Go to Login',
            onPress: () => router.replace('/login'),
          },
        ]
      );
    } catch (error: any) {
      console.log('========== SIGNUP ERROR ==========');
      console.log('Full Error Object:', error);
      console.log('Error Code:', error?.code);
      console.log('Error Message:', error?.message);

      let message = error?.message || 'Signup failed';

      if (error?.code === 'auth/email-already-in-use') {
        message = 'This email is already registered.';
      } else if (error?.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      } else if (error?.code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters.';
      }

      Alert.alert('Signup Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8fbff' }}>
      <View style={{ padding: 24 }}>
        <Text style={{ fontSize: 30, fontWeight: '800', marginBottom: 6 }}>
          Create Account
        </Text>

        <Text style={{ color: '#64748b', marginBottom: 24 }}>
          Join as patient or doctor
        </Text>

        <TextInput
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          style={{
            backgroundColor: 'white',
            padding: 15,
            borderRadius: 14,
            marginBottom: 14,
            borderWidth: 1,
            borderColor: '#dbeafe',
          }}
        />

        <TextInput
          placeholder="Registered Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={{
            backgroundColor: 'white',
            padding: 15,
            borderRadius: 14,
            marginBottom: 14,
            borderWidth: 1,
            borderColor: '#dbeafe',
          }}
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{
            backgroundColor: 'white',
            padding: 15,
            borderRadius: 14,
            marginBottom: 18,
            borderWidth: 1,
            borderColor: '#dbeafe',
          }}
        />

        <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>
          Select Role
        </Text>

        <View style={{ flexDirection: 'row', marginBottom: 24 }}>
          <TouchableOpacity
            onPress={() => setRole('patient')}
            style={{
              flex: 1,
              backgroundColor: role === 'patient' ? '#2563eb' : 'white',
              padding: 14,
              borderRadius: 12,
              alignItems: 'center',
              marginRight: 8,
              borderWidth: 1,
              borderColor: '#dbeafe',
            }}
          >
            <Text
              style={{
                color: role === 'patient' ? 'white' : '#1e293b',
                fontWeight: '700',
              }}
            >
              Patient
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setRole('doctor')}
            style={{
              flex: 1,
              backgroundColor: role === 'doctor' ? '#2563eb' : 'white',
              padding: 14,
              borderRadius: 12,
              alignItems: 'center',
              marginLeft: 8,
              borderWidth: 1,
              borderColor: '#dbeafe',
            }}
          >
            <Text
              style={{
                color: role === 'doctor' ? 'white' : '#1e293b',
                fontWeight: '700',
              }}
            >
              Doctor
            </Text>
          </TouchableOpacity>
        </View>

        {role === 'doctor' && (
          <View
            style={{
              backgroundColor: 'white',
              padding: 18,
              borderRadius: 18,
              marginBottom: 20,
              shadowColor: '#000',
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 16 }}>
              Doctor Professional Details
            </Text>

            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <Image
                source={{ uri: profileImage }}
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: 55,
                  marginBottom: 14,
                  backgroundColor: '#e2e8f0',
                }}
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
                  Choose Doctor Photo
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 10 }}>
               Select Specialization
            </Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 14 }}>
               {SPECIALIZATIONS.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => setSpecialization(item)}
              style={{
                backgroundColor: specialization === item ? '#2563eb' : '#eff6ff',
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderRadius: 20,
                marginRight: 8,
                marginBottom: 8,
                borderWidth: 1,
                borderColor: '#bfdbfe',
              }}
             >
             <Text
             style={{
              color: specialization === item ? 'white' : '#1e3a8a',
                 fontWeight: '600',
              }}
             >
           {item}
            </Text>
             </TouchableOpacity>
            ))}
          </View>

            <TextInput
              placeholder="Experience (e.g. 8 Years)"
              value={experience}
              onChangeText={setExperience}
              style={{
                backgroundColor: '#f8fbff',
                padding: 15,
                borderRadius: 14,
                marginBottom: 14,
                borderWidth: 1,
                borderColor: '#dbeafe',
              }}
            />

            <TextInput
              placeholder="Hospital / Clinic Name"
              value={clinicName}
              onChangeText={setClinicName}
              style={{
                backgroundColor: '#f8fbff',
                padding: 15,
                borderRadius: 14,
                marginBottom: 14,
                borderWidth: 1,
                borderColor: '#dbeafe',
              }}
            />

            <TextInput
              placeholder="Clinic / Hospital Address"
              value={clinicAddress}
              onChangeText={setClinicAddress}
              style={{
                backgroundColor: '#f8fbff',
                padding: 15,
                borderRadius: 14,
                marginBottom: 14,
                borderWidth: 1,
                borderColor: '#dbeafe',
              }}
            />

            <TextInput
              placeholder="Available Timing"
              value={timing}
              onChangeText={setTiming}
              style={{
                backgroundColor: '#f8fbff',
                padding: 15,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: '#dbeafe',
              }}
            />
          </View>
        )}

        <TouchableOpacity
          onPress={handleSignup}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#93c5fd' : '#2563eb',
            padding: 16,
            borderRadius: 14,
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}