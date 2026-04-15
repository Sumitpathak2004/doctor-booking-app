import { router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useState } from 'react';
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth, db } from '../services/firebase';

export default function DoctorLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleDoctorLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter email and password');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (!userDoc.exists()) {
        Alert.alert('Access Denied', 'Doctor profile not found in users collection');
        return;
      }

      const userData = userDoc.data();

      if (userData.role !== 'doctor') {
        Alert.alert('Access Denied', 'This account is not a doctor account');
        return;
      }

      Alert.alert('Login Success', `Welcome Dr. ${userData.name}`);
      router.replace('/doctor-dashboard');
    } catch (error: any) {
      console.log('DOCTOR LOGIN ERROR:', error);
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#f8fbff',
        padding: 20,
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontSize: 30, fontWeight: '800', marginBottom: 8 }}>
        Doctor Login
      </Text>

      <Text style={{ color: '#64748b', marginBottom: 24 }}>
        Login to manage appointments
      </Text>

      <TextInput
        placeholder="Doctor Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{
          backgroundColor: 'white',
          padding: 14,
          borderRadius: 12,
          marginBottom: 14,
          borderWidth: 1,
          borderColor: '#dbeafe',
        }}
      />

      <TextInput
        placeholder="Doctor Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          backgroundColor: 'white',
          padding: 14,
          borderRadius: 12,
          marginBottom: 22,
          borderWidth: 1,
          borderColor: '#dbeafe',
        }}
      />

      <TouchableOpacity
        onPress={handleDoctorLogin}
        style={{
          backgroundColor: '#2563eb',
          padding: 16,
          borderRadius: 14,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>
          Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}