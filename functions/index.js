const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.createDoctorByAdmin = functions.https.onCall(async (data, context) => {
  try {
    const {
      name,
      email,
      password,
      specialization,
      experience,
      clinicName,
      clinicAddress,
      timing,
      fees,
      profileImage,
    } = data;

    if (
      !name ||
      !email ||
      !password ||
      !specialization ||
      !experience ||
      !clinicName ||
      !clinicAddress ||
      !timing ||
      !fees
    ) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Missing required fields'
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if already exists
    try {
      await admin.auth().getUserByEmail(cleanEmail);
      throw new functions.https.HttpsError(
        'already-exists',
        'Doctor email already exists'
      );
    } catch (err) {
      if (err.code !== 'auth/user-not-found') {
        throw err;
      }
    }

    // 1) Create Firebase Auth user
    const userRecord = await admin.auth().createUser({
      email: cleanEmail,
      password,
      displayName: name,
      emailVerified: true,
    });

    const uid = userRecord.uid;
    const doctorId = `doctor_${Date.now()}`;

    // 2) users collection
    await admin.firestore().collection('users').doc(uid).set({
      userId: uid,
      name,
      email: cleanEmail,
      role: 'doctor',
      createdAt: new Date().toISOString(),
    });

    // 3) doctors collection
    await admin.firestore().collection('doctors').doc(doctorId).set({
      doctorId,
      uid,
      name,
      email: cleanEmail,
      password,
      specialization,
      experience,
      clinicName,
      clinicAddress,
      timing,
      fees,
      profileImage:
        profileImage || 'https://randomuser.me/api/portraits/men/32.jpg',
      emailVerified: true,
      available: true,
      role: 'doctor',
      about: `${specialization} specialist at ${clinicName}.`,
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      message: 'Doctor created successfully',
      uid,
      doctorId,
    };
  } catch (error) {
    console.error('CREATE DOCTOR ERROR:', error);

    throw new functions.https.HttpsError(
      'internal',
      error.message || 'Failed to create doctor'
    );
  }
});