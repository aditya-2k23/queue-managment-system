-- Sample Data for Testing Doctor Dashboard
-- Run this in your Supabase SQL Editor to populate test data

-- 1. Insert sample patients
INSERT INTO patients (name, phone, email, date_of_birth, gender, address)
VALUES 
  ('John Doe', '9876543210', 'john.doe@email.com', '1985-03-15', 'male', '123 Main St, Mumbai'),
  ('Jane Smith', '9876543211', 'jane.smith@email.com', '1990-07-22', 'female', '456 Park Ave, Delhi'),
  ('Robert Johnson', '9876543212', 'robert.j@email.com', '1978-11-30', 'male', '789 Oak Rd, Bangalore'),
  ('Emily Davis', '9876543213', 'emily.davis@email.com', '1995-05-18', 'female', '321 Elm St, Chennai'),
  ('Michael Brown', '9876543214', 'michael.b@email.com', '1982-09-25', 'male', '654 Pine Ave, Pune'),
  ('Sarah Wilson', '9876543215', 'sarah.w@email.com', '1988-01-12', 'female', '987 Maple Dr, Hyderabad'),
  ('David Lee', '9876543216', 'david.lee@email.com', '1992-04-08', 'male', '147 Cedar Ln, Kolkata'),
  ('Lisa Anderson', '9876543217', 'lisa.a@email.com', '1987-12-03', 'female', '258 Birch St, Ahmedabad'),
  ('James Taylor', '9876543218', 'james.t@email.com', '1980-06-20', 'male', '369 Spruce Ave, Jaipur'),
  ('Maria Garcia', '9876543219', 'maria.g@email.com', '1993-08-14', 'female', '741 Willow Rd, Lucknow')
ON CONFLICT (phone) DO NOTHING;

-- 2. Insert sample queue entries for today
-- Note: Replace 'YOUR_DOCTOR_ID' with actual doctor ID from your database
-- Replace 'YOUR_HOSPITAL_ID' with actual hospital ID
DO $$
DECLARE
    doctor_id_var uuid;
    patient_ids uuid[];
    today_date date := CURRENT_DATE;
BEGIN
    -- Get the first doctor ID (or create a test doctor)
    SELECT id INTO doctor_id_var FROM doctors LIMIT 1;
    
    -- If no doctor exists, you need to create one first
    IF doctor_id_var IS NULL THEN
        RAISE NOTICE 'No doctor found. Please create a doctor first.';
    ELSE
        -- Get patient IDs
        SELECT ARRAY_AGG(id) INTO patient_ids FROM patients LIMIT 10;
        
        -- Insert queue entries
        INSERT INTO queue (doctor_id, patient_id, appointment_date, appointment_time, token_number, status, notes)
        VALUES 
          (doctor_id_var, patient_ids[1], today_date, '09:00:00', 1, 'waiting', 'First consultation'),
          (doctor_id_var, patient_ids[2], today_date, '09:15:00', 2, 'waiting', 'Follow-up visit'),
          (doctor_id_var, patient_ids[3], today_date, '09:30:00', 3, 'waiting', 'Regular checkup'),
          (doctor_id_var, patient_ids[4], today_date, '09:45:00', 4, 'waiting', 'Blood pressure monitoring'),
          (doctor_id_var, patient_ids[5], today_date, '10:00:00', 5, 'waiting', 'Chest pain complaint'),
          (doctor_id_var, patient_ids[6], today_date, '10:15:00', 6, 'waiting', 'Routine examination'),
          (doctor_id_var, patient_ids[7], today_date, '10:30:00', 7, 'waiting', 'Heart health checkup'),
          (doctor_id_var, patient_ids[8], today_date, '10:45:00', 8, 'waiting', 'ECG report review'),
          (doctor_id_var, patient_ids[9], today_date, '11:00:00', 9, 'waiting', 'Prescription renewal'),
          (doctor_id_var, patient_ids[10], today_date, '11:15:00', 10, 'waiting', 'Second opinion')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- 3. View the created queue
SELECT 
  q.token_number,
  p.name as patient_name,
  q.appointment_time,
  q.status,
  q.notes
FROM queue q
JOIN patients p ON q.patient_id = p.id
WHERE q.appointment_date = CURRENT_DATE
ORDER BY q.token_number;

-- 4. Sample data for different statuses (for testing different views)
-- Run this after the above to create varied statuses
DO $$
DECLARE
    queue_ids uuid[];
BEGIN
    -- Get queue IDs for today
    SELECT ARRAY_AGG(id) INTO queue_ids 
    FROM queue 
    WHERE appointment_date = CURRENT_DATE
    LIMIT 10;
    
    IF array_length(queue_ids, 1) >= 5 THEN
        -- Set different statuses
        UPDATE queue SET status = 'completed' WHERE id = queue_ids[1];
        UPDATE queue SET status = 'completed' WHERE id = queue_ids[2];
        UPDATE queue SET status = 'in-progress' WHERE id = queue_ids[3];
        UPDATE queue SET status = 'no-show' WHERE id = queue_ids[4];
        -- Rest remain 'waiting'
    END IF;
END $$;

-- 5. Create a test doctor if none exists
-- Uncomment and modify this if you need to create a test doctor
/*
INSERT INTO doctors (hospital_id, department_id, name, specialization, available_days, consultation_time, room_number, max_patients_per_day)
VALUES (
  'YOUR_HOSPITAL_ID',  -- Replace with actual hospital ID
  'YOUR_DEPARTMENT_ID', -- Replace with actual department ID
  'Dr. Sarah Johnson',
  'Cardiologist',
  ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  15,
  '201',
  30
)
RETURNING id;
*/

-- 6. Verify the setup
SELECT 
  d.name as doctor_name,
  d.specialization,
  COUNT(q.id) as total_patients,
  SUM(CASE WHEN q.status = 'waiting' THEN 1 ELSE 0 END) as waiting,
  SUM(CASE WHEN q.status = 'in-progress' THEN 1 ELSE 0 END) as in_progress,
  SUM(CASE WHEN q.status = 'completed' THEN 1 ELSE 0 END) as completed,
  SUM(CASE WHEN q.status = 'no-show' THEN 1 ELSE 0 END) as no_show
FROM doctors d
LEFT JOIN queue q ON d.id = q.doctor_id AND q.appointment_date = CURRENT_DATE
GROUP BY d.id, d.name, d.specialization;
