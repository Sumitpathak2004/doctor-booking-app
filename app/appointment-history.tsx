import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
} from 'react-native';
import { getAppointmentsByPatient } from '../services/appointmentService';
import { auth } from '../services/firebase';

export default function AppointmentHistoryScreen() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const data = await getAppointmentsByPatient(user.uid);
      setAppointments(data);
    } catch (error) {
      console.log('Error fetching patient appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  if (loading) {
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

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fbff', padding: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: '800', marginBottom: 6 }}>
        Appointment History
      </Text>

      <Text style={{ color: '#64748b', marginBottom: 20 }}>
        Your booked appointments
      </Text>

      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 18,
              padding: 16,
              marginBottom: 16,
              shadowColor: '#000',
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '700' }}>
              {item.doctorName}
            </Text>

            <Text style={{ color: '#64748b', marginTop: 6 }}>
              {item.specialization}
            </Text>

            <Text style={{ color: '#2563eb', marginTop: 8 }}>
              Date: {item.date}
            </Text>

            <Text style={{ color: '#2563eb', marginTop: 4 }}>
              Time: {item.time}
            </Text>

            <Text
              style={{
                marginTop: 10,
                fontWeight: '700',
                color:
                  item.status === 'accepted'
                    ? 'green'
                    : item.status === 'rejected'
                    ? 'red'
                    : '#f59e0b',
              }}
            >
              Status: {item.status?.toUpperCase()}
            </Text>
          </View>
        )}
      />
    </View>
  );
}