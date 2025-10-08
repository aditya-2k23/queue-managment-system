-- =====================================================
-- QUICK START SQL - Copy and paste this into Supabase SQL Editor
-- =====================================================

-- Step 1: Create All Tables
-- =====================================================

-- Hospitals Table
CREATE TABLE IF NOT EXISTS hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(10),
  registration_number VARCHAR(100) UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hospital Admins Table
CREATE TABLE IF NOT EXISTS hospital_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Departments Table
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Doctors Table
CREATE TABLE IF NOT EXISTS doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  specialization VARCHAR(255),
  available_days TEXT[],
  consultation_time INTEGER DEFAULT 15,
  room_number VARCHAR(50),
  max_patients_per_day INTEGER DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Patients Table
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255),
  date_of_birth DATE,
  gender VARCHAR(20),
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Queue Table
CREATE TABLE IF NOT EXISTS queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME,
  token_number INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'waiting',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(doctor_id, appointment_date, token_number)
);

-- Settings Table
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  queue_type VARCHAR(50) DEFAULT 'token',
  auto_assign BOOLEAN DEFAULT true,
  notify_via_sms BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Create Indexes
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_hospital_admins_hospital ON hospital_admins(hospital_id);
CREATE INDEX IF NOT EXISTS idx_hospital_admins_email ON hospital_admins(email);
CREATE INDEX IF NOT EXISTS idx_departments_hospital ON departments(hospital_id);
CREATE INDEX IF NOT EXISTS idx_doctors_hospital ON doctors(hospital_id);
CREATE INDEX IF NOT EXISTS idx_doctors_department ON doctors(department_id);
CREATE INDEX IF NOT EXISTS idx_queue_doctor ON queue(doctor_id);
CREATE INDEX IF NOT EXISTS idx_queue_patient ON queue(patient_id);
CREATE INDEX IF NOT EXISTS idx_queue_date ON queue(appointment_date);
CREATE INDEX IF NOT EXISTS idx_queue_status ON queue(status);
CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);

-- Step 3: Create Update Triggers
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_hospitals_updated_at ON hospitals;
CREATE TRIGGER update_hospitals_updated_at BEFORE UPDATE ON hospitals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_hospital_admins_updated_at ON hospital_admins;
CREATE TRIGGER update_hospital_admins_updated_at BEFORE UPDATE ON hospital_admins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_departments_updated_at ON departments;
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_doctors_updated_at ON doctors;
CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON doctors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_patients_updated_at ON patients;
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_queue_updated_at ON queue;
CREATE TRIGGER update_queue_updated_at BEFORE UPDATE ON queue
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 4: Enable RLS (Optional but Recommended)
-- =====================================================

ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospital_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create permissive policies (allow all for now - customize later)
DROP POLICY IF EXISTS "Enable all for hospitals" ON hospitals;
CREATE POLICY "Enable all for hospitals" ON hospitals FOR ALL USING (true);

DROP POLICY IF EXISTS "Enable all for hospital_admins" ON hospital_admins;
CREATE POLICY "Enable all for hospital_admins" ON hospital_admins FOR ALL USING (true);

DROP POLICY IF EXISTS "Enable all for departments" ON departments;
CREATE POLICY "Enable all for departments" ON departments FOR ALL USING (true);

DROP POLICY IF EXISTS "Enable all for doctors" ON doctors;
CREATE POLICY "Enable all for doctors" ON doctors FOR ALL USING (true);

DROP POLICY IF EXISTS "Enable all for patients" ON patients;
CREATE POLICY "Enable all for patients" ON patients FOR ALL USING (true);

DROP POLICY IF EXISTS "Enable all for queue" ON queue;
CREATE POLICY "Enable all for queue" ON queue FOR ALL USING (true);

DROP POLICY IF EXISTS "Enable all for settings" ON settings;
CREATE POLICY "Enable all for settings" ON settings FOR ALL USING (true);

-- Step 5: Insert Sample Data
-- =====================================================

-- Insert Sample Hospitals
INSERT INTO hospitals (name, email, phone, address, city, state, pincode, registration_number)
VALUES 
  ('Care Plus Hospital', 'admin@careplus.com', '1234567890', '123 Main Street', 'New York', 'NY', '10001', 'REG001'),
  ('City General Hospital', 'admin@citygeneral.com', '9876543210', '456 Oak Avenue', 'Los Angeles', 'CA', '90001', 'REG002'),
  ('Mercy Medical Center', 'admin@mercymedical.com', '5555555555', '789 Pine Road', 'Chicago', 'IL', '60601', 'REG003')
ON CONFLICT (email) DO NOTHING;

-- Insert Sample Admins (password is "admin123" in plain text - should be hashed in production!)
INSERT INTO hospital_admins (hospital_id, name, email, password_hash, role)
SELECT 
  h.id,
  'Admin ' || h.name,
  LOWER(REPLACE(h.name, ' ', '.')) || '@admin.com',
  'admin123',
  'admin'
FROM hospitals h
ON CONFLICT (email) DO NOTHING;

-- Insert Sample Departments
INSERT INTO departments (hospital_id, name, description)
SELECT 
  h.id,
  dept.name,
  dept.description
FROM hospitals h
CROSS JOIN (
  VALUES 
    ('Cardiology', 'Heart and cardiovascular care'),
    ('Orthopedics', 'Bone and joint treatment'),
    ('Pediatrics', 'Child healthcare'),
    ('General Medicine', 'General health consultations'),
    ('Emergency', 'Emergency medical care')
) AS dept(name, description)
ON CONFLICT DO NOTHING;

-- Insert Sample Doctors
INSERT INTO doctors (hospital_id, department_id, name, specialization, available_days, consultation_time, room_number, max_patients_per_day)
SELECT 
  d.hospital_id,
  d.id as department_id,
  doc.name,
  d.name as specialization,
  ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  15,
  doc.room_number,
  30
FROM departments d
CROSS JOIN (
  VALUES 
    ('Dr. Sarah Johnson', '201'),
    ('Dr. Michael Chen', '202')
) AS doc(name, room_number)
WHERE d.name IN ('Cardiology', 'Orthopedics')
ON CONFLICT DO NOTHING;

-- Insert Sample Patients
INSERT INTO patients (name, phone, email, date_of_birth, gender, address)
VALUES 
  ('Alice Smith', '5551234567', 'alice@email.com', '1985-03-15', 'Female', '100 First St, New York, NY'),
  ('Bob Williams', '5559876543', 'bob@email.com', '1978-07-22', 'Male', '200 Second Ave, Los Angeles, CA'),
  ('Carol Davis', '5555555555', 'carol@email.com', '1990-11-30', 'Female', '300 Third Blvd, Chicago, IL'),
  ('David Miller', '5554443333', 'david@email.com', '1982-05-10', 'Male', '400 Fourth St, New York, NY'),
  ('Emma Wilson', '5556667777', 'emma@email.com', '1995-09-25', 'Female', '500 Fifth Ave, Los Angeles, CA')
ON CONFLICT (phone) DO NOTHING;

-- Insert Sample Queue Entries (for today)
INSERT INTO queue (doctor_id, patient_id, appointment_date, appointment_time, token_number, status, notes)
SELECT 
  doc.id as doctor_id,
  pat.id as patient_id,
  CURRENT_DATE,
  q.time,
  q.token,
  q.status,
  q.notes
FROM doctors doc
CROSS JOIN (
  SELECT 
    id,
    ROW_NUMBER() OVER (ORDER BY id) as patient_num
  FROM patients
  LIMIT 5
) pat
CROSS JOIN (
  VALUES 
    ('09:00'::TIME, 1, 'completed', 'Regular checkup completed'),
    ('09:15'::TIME, 2, 'in-progress', 'Currently consulting'),
    ('09:30'::TIME, 3, 'waiting', 'Waiting in queue'),
    ('09:45'::TIME, 4, 'waiting', 'New patient'),
    ('10:00'::TIME, 5, 'waiting', 'Follow-up visit')
) AS q(time, token, status, notes)
WHERE pat.patient_num <= 5
ON CONFLICT (doctor_id, appointment_date, token_number) DO NOTHING;

-- Step 6: Verify Data
-- =====================================================

-- Check hospitals
SELECT 'Hospitals:' as table_name, COUNT(*) as count FROM hospitals
UNION ALL
SELECT 'Admins:', COUNT(*) FROM hospital_admins
UNION ALL
SELECT 'Departments:', COUNT(*) FROM departments
UNION ALL
SELECT 'Doctors:', COUNT(*) FROM doctors
UNION ALL
SELECT 'Patients:', COUNT(*) FROM patients
UNION ALL
SELECT 'Queue Entries:', COUNT(*) FROM queue;

-- Show sample admin login credentials
SELECT 
  h.name as hospital,
  a.email as admin_email,
  'admin123' as password,
  h.id as hospital_id
FROM hospital_admins a
JOIN hospitals h ON a.hospital_id = h.id
ORDER BY h.name;

-- Show sample doctor IDs for testing
SELECT 
  d.id as doctor_id,
  d.name as doctor_name,
  dept.name as department,
  h.name as hospital
FROM doctors d
JOIN departments dept ON d.department_id = dept.id
JOIN hospitals h ON d.hospital_id = h.id
ORDER BY h.name, d.name;

-- =====================================================
-- SETUP COMPLETE! 🎉
-- =====================================================
-- Next steps:
-- 1. Copy the admin email and hospital_id from results above
-- 2. Go to your app at http://localhost:5173/admin/login
-- 3. Login with email and password "admin123"
-- 4. Copy a doctor_id from results above
-- 5. Go to http://localhost:5173/doctor?id={doctor_id}
-- =====================================================
