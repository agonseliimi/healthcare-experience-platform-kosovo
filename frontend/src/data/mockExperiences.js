/**
 * mockExperiences.js
 *
 * Static mock data used during the MVP prototype phase.
 * Each entry represents one anonymous patient journey submitted to the platform.
 *
 * IMPORTANT: No personal identifiers are stored here.
 * Fields are generalised on purpose (city, symptom category, institution type).
 *
 * FUTURE: This file will be replaced by real API calls to the backend.
 * Example future API call:
 *   GET /api/experiences?city=Pristina&type=public&maxCost=50
 *
 * FUTURE: Backend stores data in PostgreSQL.
 * FUTURE: Verification status will be set by an admin review or ML pipeline.
 */

export const mockExperiences = [
  {
    id: 1,
    category: 'Cardiology',
    symptomSummary: 'Chest discomfort, shortness of breath during light activity',
    institutionType: 'public',
    institutionName: 'University Clinical Centre of Kosovo',
    city: 'Pristina',
    steps: [
      'Visit to GP for referral',
      'Referral issued for cardiology department',
      'ECG and blood tests at UCCK',
      'Echocardiogram scheduled',
      'Follow-up consultation with cardiologist',
    ],
    testsPerformed: ['ECG', 'Full blood panel', 'Echocardiogram'],
    approximateCost: '0 EUR (public)',
    waitingTime: '3 weeks for specialist appointment',
    resultTime: '2–5 days for lab results',
    verificationStatus: 'document-supported',
    submittedAt: '2026-05-14',
    anonymous: true,
  },
  {
    id: 2,
    category: 'Dermatology',
    symptomSummary: 'Persistent skin rash on forearms, mild itching',
    institutionType: 'private',
    institutionName: 'Medicus Clinic',
    city: 'Pristina',
    steps: [
      'Direct appointment at private clinic (no referral needed)',
      'Visual examination by dermatologist',
      'Patch test ordered',
      'Prescription cream provided',
    ],
    testsPerformed: ['Visual dermatology exam', 'Patch allergy test'],
    approximateCost: '40–60 EUR',
    waitingTime: '2 days for appointment',
    resultTime: 'Same day',
    verificationStatus: 'self-reported',
    submittedAt: '2026-04-28',
    anonymous: true,
  },
  {
    id: 3,
    category: 'Orthopaedics',
    symptomSummary: 'Knee pain after sports injury, swelling',
    institutionType: 'public',
    institutionName: 'Regional Hospital Prizren',
    city: 'Prizren',
    steps: [
      'Emergency visit to regional hospital',
      'X-ray of knee joint',
      'Referred to orthopaedic specialist',
      'MRI recommended but waiting time was long',
      'Physiotherapy started while waiting for MRI',
    ],
    testsPerformed: ['X-ray', 'MRI (after 6-week wait)'],
    approximateCost: '0 EUR for X-ray (public); ~80 EUR MRI at private lab',
    waitingTime: '6 weeks for MRI at public hospital; 3 days at private lab',
    resultTime: '1 week for MRI report',
    verificationStatus: 'high-confidence',
    submittedAt: '2026-03-10',
    anonymous: true,
  },
  {
    id: 4,
    category: 'General Practice',
    symptomSummary: 'Persistent fatigue, dizziness, low energy for 2 months',
    institutionType: 'public',
    institutionName: 'Health Centre Ferizaj',
    city: 'Ferizaj',
    steps: [
      'Visit to family doctor / GP',
      'Blood tests ordered (thyroid, iron, vitamin D)',
      'Iron deficiency anaemia diagnosed',
      'Oral iron supplementation prescribed',
      'Follow-up after 6 weeks',
    ],
    testsPerformed: ['Thyroid panel (TSH, T3, T4)', 'CBC', 'Ferritin', 'Vitamin D'],
    approximateCost: '0–5 EUR (public blood tests)',
    waitingTime: '1 day for appointment',
    resultTime: '3–4 days for blood results',
    verificationStatus: 'self-reported',
    submittedAt: '2026-05-30',
    anonymous: true,
  },
  {
    id: 5,
    category: 'Ophthalmology',
    symptomSummary: 'Blurred vision, eye strain when reading',
    institutionType: 'private',
    institutionName: 'Vizion+ Eye Clinic',
    city: 'Pristina',
    steps: [
      'Walk-in appointment at private eye clinic',
      'Full eye examination',
      'Prescription for corrective glasses issued',
    ],
    testsPerformed: ['Visual acuity test', 'Refraction test', 'Fundus examination'],
    approximateCost: '25–35 EUR for consultation',
    waitingTime: 'Same day / next day',
    resultTime: 'Immediate',
    verificationStatus: 'self-reported',
    submittedAt: '2026-06-01',
    anonymous: true,
  },
  {
    id: 6,
    category: 'Gynaecology',
    symptomSummary: 'Routine annual check-up, Pap smear',
    institutionType: 'public',
    institutionName: 'University Clinical Centre of Kosovo',
    city: 'Pristina',
    steps: [
      'GP referral to gynaecology department',
      'Routine gynaecological exam',
      'Pap smear taken',
      'Results sent by post after 3 weeks',
    ],
    testsPerformed: ['Pap smear', 'Pelvic ultrasound'],
    approximateCost: '0 EUR (public)',
    waitingTime: '4–6 weeks for routine appointment',
    resultTime: '3 weeks for Pap result',
    verificationStatus: 'document-supported',
    submittedAt: '2026-02-18',
    anonymous: true,
  },
]

/**
 * Verification level definitions used in the UI and filter logic.
 * Each level reflects how the submitted experience was validated.
 *
 * FUTURE: The verification process will be partially automated using
 * document analysis (ML-based) and an admin review workflow.
 */
export const verificationLevels = {
  'self-reported': {
    label: 'Self-Reported',
    description: 'Submitted by a user without supporting documentation. Not verified externally.',
    color: '#F59E0B',
  },
  'document-supported': {
    label: 'Document-Supported',
    description: 'User uploaded a supporting document (e.g. lab result). Document not shown publicly.',
    color: '#3B82F6',
  },
  'high-confidence': {
    label: 'High-Confidence',
    description: 'Multiple data points corroborated or reviewed by platform administrators.',
    color: '#10B981',
  },
}

/**
 * Kosovo cities available for filtering.
 * FUTURE: Pulled dynamically from the backend.
 */
export const kosovoCities = [
  'Pristina',
  'Prizren',
  'Ferizaj',
  'Peja',
  'Gjilan',
  'Mitrovica',
  'Gjakova',
  'Vushtrri',
  'Suhareka',
  'Rahovec',
]

/**
 * Medical category options for the submit form and filters.
 * FUTURE: Backed by a normalised taxonomy table in the database.
 */
export const medicalCategories = [
  'Cardiology',
  'Dermatology',
  'Orthopaedics',
  'General Practice',
  'Ophthalmology',
  'Gynaecology',
  'Neurology',
  'Gastroenterology',
  'Pulmonology',
  'Endocrinology',
  'Urology',
  'Paediatrics',
  'Psychiatry / Mental Health',
  'Dentistry',
  'Other',
]
