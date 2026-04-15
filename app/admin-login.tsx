import { router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../services/firebase';

export default function AdminLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAdminLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter email and password');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();

        if (userData.role !== 'admin') {
          Alert.alert('Access Denied', 'This is not an admin account.');
          return;
        }

        Alert.alert('Login Success', `Welcome ${userData.name}`);
        router.replace('/admin-dashboard');
      } else {
        Alert.alert('Error', 'Admin profile not found');
      }
    } catch (error: any) {
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
        Admin Login
      </Text>

      <Text style={{ color: '#64748b', marginBottom: 24 }}>
        Login to manage doctors and appointments
      </Text>

      <TextInput
        placeholder="Admin Email"
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
        placeholder="Password"
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
        onPress={handleAdminLogin}
        style={{
          backgroundColor: '#7c3aed',
          padding: 16,
          borderRadius: 14,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>
          Admin Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}