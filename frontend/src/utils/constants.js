// Shared option lists used by forms and filters.
// These mirror the seed data on the backend.

export const CITIES = [
  'Prishtina',
  'Prizren',
  'Peja',
  'Gjilan',
  'Ferizaj',
  'Gjakova',
  'Mitrovica',
]

export const CATEGORIES = [
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

export const INSTITUTION_TYPES = [
  { value: 'PUBLIC_HOSPITAL', label: 'Public Hospital' },
  { value: 'PRIVATE_CLINIC', label: 'Private Clinic' },
]

export const VERIFICATION_LEVELS = [
  { value: 'SELF_REPORTED', label: 'Self-Reported' },
  { value: 'DOCUMENT_SUPPORTED', label: 'Document-Supported' },
  { value: 'HIGH_CONFIDENCE', label: 'High-Confidence' },
]
