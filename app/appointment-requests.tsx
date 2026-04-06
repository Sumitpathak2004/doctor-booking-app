import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  getAppointmentsByDoctor,
  updateAppointmentStatus,
} from '../services/appointmentService';
import { auth } from '../services/firebase';

export default function AppointmentRequestsScreen() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.log('No logged-in doctor user found');
        setLoading(false);
        return;
      }

      console.log('DOCTOR UID:', user.uid);

      const data = await getAppointmentsByDoctor(user.uid);
      console.log('DOCTOR APPOINTMENTS:', data);

      setAppointments(data);
    } catch (error) {
      console.log('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (
    appointmentId: string,
    status: 'accepted' | 'rejected'
  ) => {
    try {
      await updateAppointmentStatus(appointmentId, status);
      Alert.alert('Success', `Appointment ${status} successfully.`);
      fetchAppointments();
    } catch (error) {
      console.log('Status Update Error:', error);
      Alert.alert('Error', 'Could not update appointment status.');
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
          Loading appointments...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fbff', padding: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: '800', marginBottom: 6 }}>
        Appointment Requests
      </Text>
      <Text style={{ color: '#64748b', marginBottom: 20 }}>
        Manage your incoming patient bookings
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
            No Appointments Yet
          </Text>
          <Text style={{ color: '#64748b', textAlign: 'center' }}>
            Appointment requests from patients will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item, index) => item.id || String(index)}
          showsVerticalScrollIndicator={false}
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
                {item.patientName}
              </Text>

              <Text style={{ color: '#64748b', marginTop: 6 }}>
                {item.patientEmail}
              </Text>

              <Text style={{ color: '#2563eb', marginTop: 8 }}>
                Date: {item.date}
              </Text>

              <Text style={{ color: '#2563eb', marginTop: 4 }}>
                Time: {item.time}
              </Text>

              {item.problem ? (
                <Text style={{ color: '#64748b', marginTop: 8 }}>
                  Problem: {item.problem}
                </Text>
              ) : null}

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
                Status: {String(item.status || 'pending').toUpperCase()}
              </Text>

              {item.status === 'pending' && (
                <View style={{ flexDirection: 'row', marginTop: 16, gap: 12 }}>
                  <TouchableOpacity
                    onPress={() => handleUpdateStatus(item.id, 'accepted')}
                    style={{
                      flex: 1,
                      backgroundColor: '#16a34a',
                      padding: 14,
                      borderRadius: 12,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: 'white', fontWeight: '700' }}>
                      Accept
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleUpdateStatus(item.id, 'rejected')}
                    style={{
                      flex: 1,
                      backgroundColor: '#dc2626',
                      padding: 14,
                      borderRadius: 12,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: 'white', fontWeight: '700' }}>
                      Reject
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}