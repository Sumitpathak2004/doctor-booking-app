import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      <Stack.Screen name="signup" options={{ title: 'Signup' }} />
      <Stack.Screen name="home" options={{ title: 'Home' }} />
      <Stack.Screen name="doctor-list" options={{ title: 'Doctors' }} />
      <Stack.Screen name="doctor-details" options={{ title: 'Doctor Details' }} />
      <Stack.Screen name="book-appointment" options={{ title: 'Book Appointment' }} />
      <Stack.Screen name="appointment-confirmation" options={{ title: 'Confirmation' }} />
      <Stack.Screen name="appointment-history" options={{ title: 'Appointment History' }} />
      <Stack.Screen name="doctor-dashboard" options={{ title: 'Doctor Dashboard' }} />
      <Stack.Screen name="appointment-requests" options={{ title: 'Appointment Requests' }} />
    </Stack>
  );
}