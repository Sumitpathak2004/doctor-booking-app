import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { Alert, ImageBackground, StatusBar, Text, TouchableOpacity } from 'react-native';
import { auth } from '../services/firebase';

export default function HomeScreen() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Logged Out', 'You have been logged out successfully.');
      router.replace('/login');
    } catch (error) {
      console.log('Logout Error:', error);
      Alert.alert('Error', 'Could not log out.');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/bg.jpg')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['rgba(15,23,42,0.75)', 'rgba(37,99,235,0.55)', 'rgba(248,251,255,0.92)']}
        style={{ flex: 1, padding: 20, justifyContent: 'center' }}
      >
        <Text
          style={{
            fontSize: 34,
            fontWeight: '900',
            color: 'white',
            marginBottom: 8,
          }}
        >
          Patient Dashboard
        </Text>

        <Text
          style={{
            color: 'rgba(255,255,255,0.92)',
            fontSize: 16,
            marginBottom: 28,
            lineHeight: 24,
          }}
        >
          Find trusted doctors, book appointments and manage your health journey.
        </Text>

        <BlurView
          intensity={28}
          tint="light"
          style={{
            borderRadius: 24,
            padding: 18,
            overflow: 'hidden',
            marginBottom: 18,
            backgroundColor: 'rgba(255,255,255,0.18)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.22)',
          }}
        >
          <TouchableOpacity
            onPress={() => router.push('/doctor-list')}
            style={{
              backgroundColor: '#2563eb',
              padding: 18,
              borderRadius: 18,
              alignItems: 'center',
              shadowColor: '#2563eb',
              shadowOpacity: 0.25,
              shadowRadius: 10,
              elevation: 6,
            }}
          >
            <Text style={{ color: 'white', fontWeight: '800', fontSize: 17 }}>
              Find Doctors
            </Text>
          </TouchableOpacity>
        </BlurView>

        <BlurView
          intensity={28}
          tint="light"
          style={{
            borderRadius: 24,
            padding: 18,
            overflow: 'hidden',
            marginBottom: 18,
            backgroundColor: 'rgba(255,255,255,0.18)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.22)',
          }}
        >
          <TouchableOpacity
            onPress={() => router.push('/appointment-history')}
            style={{
              backgroundColor: '#0f766e',
              padding: 18,
              borderRadius: 18,
              alignItems: 'center',
              shadowColor: '#0f766e',
              shadowOpacity: 0.25,
              shadowRadius: 10,
              elevation: 6,
            }}
          >
            <Text style={{ color: 'white', fontWeight: '800', fontSize: 17 }}>
              Appointment History
            </Text>
          </TouchableOpacity>
        </BlurView>

        <BlurView
          intensity={28}
          tint="light"
          style={{
            borderRadius: 24,
            padding: 18,
            overflow: 'hidden',
            backgroundColor: 'rgba(255,255,255,0.18)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.22)',
          }}
        >
          <TouchableOpacity
            onPress={handleLogout}
            style={{
              backgroundColor: '#dc2626',
              padding: 18,
              borderRadius: 18,
              alignItems: 'center',
              shadowColor: '#dc2626',
              shadowOpacity: 0.25,
              shadowRadius: 10,
              elevation: 6,
            }}
          >
            <Text style={{ color: 'white', fontWeight: '800', fontSize: 17 }}>
              Logout
            </Text>
          </TouchableOpacity>
        </BlurView>
      </LinearGradient>
    </ImageBackground>
  );
}