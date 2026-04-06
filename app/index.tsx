import { router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { auth, db } from '../services/firebase';

export default function IndexScreen() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace('/login');
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (userDoc.exists()) {
          const userData = userDoc.data();

          if (userData.role === 'doctor') {
            router.replace('/doctor-dashboard');
          } else {
            router.replace('/home');
          }
        } else {
          router.replace('/login');
        }
      } catch (error) {
        router.replace('/login');
      }
    });

    return unsubscribe;
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fbff',
      }}
    >
      <ActivityIndicator size="large" color="#2563eb" />
    </View>
  );
}