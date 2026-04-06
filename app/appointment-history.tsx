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
      if (!user) {
        setLoading(false);
        return;
      }

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
        <Text style={{ marginTop: 12, color: '#64748b' }}>
          Loading appointment history...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fbff', padding: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: '800', marginBottom: 6 }}>
        Appointment History
      </Text>

      <Text style={{ color: '#64748b', marginBottom: 20 }}>
        View your booked appointments
      </Text>

      {appointments.length === 0 ? (
        <View
          style={{
            backgroundColor: 'white',
            padding: 24,
            borderRadius: 18,
            alignItems: 'center',
            marginTop: 30,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>
            No Appointments Found
          </Text>
          <Text style={{ color: '#64748b', textAlign: 'center' }}>
            Your booked appointments will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item, index) => item.id || String(index)}
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
              <Text style={{ fontSize: 18, fontWeight: '800' }}>
                {item.doctorName}
              </Text>

              <Text style={{ color: '#2563eb', marginTop: 6, fontWeight: '600' }}>
                {item.specialization}
              </Text>

              <Text style={{ color: '#64748b', marginTop: 8 }}>
                Hospital: {item.clinicName || 'Hospital'}
              </Text>

              <Text style={{ color: '#0f766e', marginTop: 8 }}>
                Date: {item.date}
              </Text>

              <Text style={{ color: '#0f766e', marginTop: 4 }}>
                Time: {item.time}
              </Text>

              {item.problem ? (
                <Text style={{ color: '#64748b', marginTop: 8 }}>
                  Problem: {item.problem}
                </Text>
              ) : null}

              <Text
                style={{
                  marginTop: 12,
                  fontWeight: '800',
                  color:
                    item.status === 'accepted'
                      ? 'green'
                      : item.status === 'rejected'
                      ? 'red'
                      : '#f59e0b',
                }}
              >
                Status: {String(item.status || 'pending').toUpperCase()}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}