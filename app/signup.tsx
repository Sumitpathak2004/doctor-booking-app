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
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { auth, db } from '../services/firebase';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Missing Fields', 'Please fill name, email and password');
      return;
    }

    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name.trim(),
      });

      // Optional but recommended
      await sendEmailVerification(user);

      await setDoc(doc(db, 'users', user.uid), {
        userId: user.uid,
        name: name.trim(),
        email: email.trim(),
        role: 'patient',
        emailVerified: false,
        createdAt: new Date().toISOString(),
      });

      await signOut(auth);

      Alert.alert(
        'Verify Your Email',
        'Patient account created. Verification link has been sent to your email. Please verify and then login.'
      );

      router.replace('/login');
    } catch (error: any) {
      let msg = error?.message || 'Signup failed';

      if (error?.code === 'auth/email-already-in-use') {
        msg = 'This email is already registered. Please login instead.';
      } else if (error?.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      } else if (error?.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      } else if (error?.code === 'auth/network-request-failed') {
        msg = 'Network issue. Check internet and try again.';
      }

      Alert.alert('Signup Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f8fbff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{ fontSize: 30, fontWeight: '800', marginBottom: 6 }}>
          Create Patient Account
        </Text>

        <Text style={{ color: '#64748b', marginBottom: 24 }}>
          Register to book hospital appointments
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
          placeholder="Email Address"
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
            marginBottom: 20,
            borderWidth: 1,
            borderColor: '#dbeafe',
          }}
        />

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

        <TouchableOpacity
          onPress={() => router.push('/login')}
          style={{ alignItems: 'center' }}
        >
          <Text style={{ color: '#2563eb', fontWeight: '600' }}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}