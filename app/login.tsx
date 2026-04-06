import { router } from 'expo-router';
import {
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth, db } from '../services/firebase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please enter email and password');
      return;
    }

    try {
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password
      );

      const user = userCredential.user;

      await user.reload();

      if (!user.emailVerified) {
        Alert.alert(
          'Email Not Verified',
          'Please verify your email before logging in.',
          [
            {
              text: 'Resend Verification',
              onPress: async () => {
                try {
                  await sendEmailVerification(user);
                  Alert.alert(
                    'Verification Sent',
                    'Verification email has been sent to your inbox.'
                  );
                } catch (error: any) {
                  Alert.alert(
                    'Error',
                    error?.message || 'Could not send verification email.'
                  );
                }
              },
            },
            {
              text: 'OK',
              style: 'cancel',
            },
          ]
        );

        await signOut(auth);
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (!userDoc.exists()) {
        Alert.alert('Error', 'User profile not found');
        await signOut(auth);
        return;
      }

      const userData = userDoc.data();

      Alert.alert('Login Success', `Welcome ${userData.name}`);

      if (userData.role === 'doctor') {
        router.replace('/doctor-dashboard');
      } else {
        router.replace('/home');
      }
    } catch (error: any) {
      let message = 'Login failed. Please try again.';

      if (error?.code === 'auth/invalid-credential') {
        message = 'Invalid email or password.';
      } else if (error?.code === 'auth/user-not-found') {
        message = 'No account found with this email.';
      } else if (error?.code === 'auth/wrong-password') {
        message = 'Incorrect password.';
      } else if (error?.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      }

      Alert.alert('Login Failed', message);
    } finally {
      setLoading(false);
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
        Welcome Back
      </Text>

      <Text style={{ color: '#64748b', marginBottom: 24 }}>
        Login to continue to your OPD account
      </Text>

      <TextInput
        placeholder="Registered Email"
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
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>
            Login
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('/signup')}
        style={{ marginTop: 18, alignItems: 'center' }}
      >
        <Text style={{ color: '#2563eb', fontWeight: '600' }}>
          Don’t have an account? Signup
        </Text>
      </TouchableOpacity>
    </View>
  );
}