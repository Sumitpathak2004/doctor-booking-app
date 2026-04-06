import { router } from 'expo-router';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const specializations = [
  { id: '1', name: 'Cardiologist', icon: '❤️' },
  { id: '2', name: 'Dermatologist', icon: '🧴' },
  { id: '3', name: 'Orthopedic', icon: '🦴' },
  { id: '4', name: 'Gynecologist', icon: '👩‍⚕️' },
  { id: '5', name: 'Neurologist', icon: '🧠' },
  { id: '6', name: 'Pediatrician', icon: '👶' },
  { id: '7', name: 'ENT Specialist', icon: '👂' },
  { id: '8', name: 'Ophthalmologist', icon: '👁️' },
  { id: '9', name: 'General Physician', icon: '🩺' },
  { id: '10', name: 'Dentist', icon: '🦷' },
];

export default function DoctorListScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#f8fbff', padding: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: '800', marginBottom: 6 }}>
        Choose Specialist
      </Text>

      <Text style={{ color: '#64748b', marginBottom: 20 }}>
        Select a department to view available doctors
      </Text>

      <FlatList
        data={specializations}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              router.push({
                pathname: '/specialist-doctors',
                params: { specialization: item.name },
              })
            }
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 18,
              marginBottom: 16,
              shadowColor: '#000',
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 3,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 30, marginRight: 16 }}>{item.icon}</Text>

            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: '800' }}>
                {item.name}
              </Text>

              <Text style={{ color: '#64748b', marginTop: 6 }}>
                View doctors in this department
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}