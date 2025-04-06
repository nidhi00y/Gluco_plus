export interface UserProfile {
  id: string;
  user_type: 'newly_diagnosed' | 'experienced';
  diagnosis_date: string | null;
  treatment_plan: string | null;
  created_at: string;
  updated_at: string;
}

export interface BloodSugarReading {
  id: string;
  user_id: string;
  blood_sugar_level: number;
  reading_type: 'before_meal' | 'after_meal' | 'bedtime' | 'fasting';
  insulin_type?: 'rapid' | 'long';
  insulin_name?: string;
  insulin_dose?: number;
  reading_time: string;
  notes: string | null;
  created_at: string;
}

export interface MedicineLog {
  id: string;
  user_id: string;
  medicine_name: string;
  dosage: string;
  taken_at: string;
  notes: string | null;
  created_at: string;
}

export interface FoodDiaryEntry {
  id: string;
  user_id: string;
  food_name: string;
  carbohydrates: number | null;
  calories: number | null;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  consumed_at: string;
  notes: string | null;
  created_at: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  location: string;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
}