import { router, useLocalSearchParams } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { auth, db } from '../services/firebase';

export default function LoginScreen() {
  const { role } = useLocalSearchParams();

  // 🔥 FIX: default patient + lowercase
  const selectedRole = role ? String(role).toLowerCase() : 'patient';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const getTitle = () => {
    if (selectedRole === 'doctor') return 'Doctor Login';
    if (selectedRole === 'admin') return 'Admin Login';
    return 'Patient Login';
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter email and password');
      return;
    }

    try {
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const user = userCredential.user;
      const userRef = doc(db, 'users', user.uid);

      let userDoc = await getDoc(userRef);

      // 🔥 Auto create user if not exists
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          name: selectedRole === 'admin' ? 'Admin' : 'User',
          email: user.email,
          role: selectedRole,
          createdAt: new Date().toISOString(),
        });

        userDoc = await getDoc(userRef);
      }

      const userData = userDoc.data();

      // 🔒 Role check
      if (userData?.role !== selectedRole) {
        Alert.alert(
          'Access Denied',
          `This account is not registered as ${selectedRole}.`
        );
        return;
      }

      Alert.alert('Login Success', `Welcome ${userData.name}`);

      // 🚀 Navigation
      if (userData.role === 'doctor') {
        router.replace('/doctor-dashboard');
      } else if (userData.role === 'admin') {
        router.replace('/admin-dashboard');
      } else {
        router.replace('/home');
      }

    } catch (error: any) {
      let msg = error?.message || 'Login failed';

      if (error?.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password';
      } else if (error?.code === 'auth/user-not-found') {
        msg = 'User not found';
      } else if (error?.code === 'auth/wrong-password') {
        msg = 'Wrong password';
      } else if (error?.code === 'auth/network-request-failed') {
        msg = 'Network issue. Check internet and try again.';
      }

      Alert.alert('Login Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: '#f8fbff',
        justifyContent: 'center',
        padding: 20,
      }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={{ fontSize: 30, fontWeight: '800', marginBottom: 8 }}>
        {getTitle()}
      </Text>

      <Text style={{ color: '#64748b', marginBottom: 24 }}>
        Login to continue
      </Text>

      <TextInput
        placeholder="Email"
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
        onPress={handleLogin}
        disabled={loading}
        style={{
          backgroundColor: loading ? '#93c5fd' : '#2563eb',
          padding: 16,
          borderRadius: 14,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>
          {loading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>

      {/* ✅ Signup only for PATIENT */}
      {selectedRole === 'patient' && (
        <TouchableOpacity
          onPress={() => router.push('/signup')}
          style={{ marginTop: 18, alignItems: 'center' }}
        >
          <Text style={{ color: '#2563eb', fontWeight: '600' }}>
            Don’t have an account? Signup
          </Text>
        </TouchableOpacity>
      )}
    </KeyboardAvoidingView>
  );
}