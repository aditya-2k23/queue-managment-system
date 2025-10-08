# Doctor Dashboard - Quick Setup Guide

## Prerequisites
- Node.js installed
- Supabase project configured
- Database tables created

## Required Database Tables

### 1. Patients Table
```sql
CREATE TABLE patients (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  phone text UNIQUE NOT NULL,
  email text,
  date_of_birth date,
  gender text,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### 2. Queue Table
```sql
CREATE TABLE queue (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  token_number integer NOT NULL,
  status text DEFAULT 'waiting' CHECK (status IN ('waiting', 'in-progress', 'completed', 'no-show')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(doctor_id, appointment_date, token_number)
);

-- Add indexes for better performance
CREATE INDEX idx_queue_doctor_date ON queue(doctor_id, appointment_date);
CREATE INDEX idx_queue_status ON queue(status);
```

## Installation Steps

### 1. Clone and Install Dependencies
```bash
cd queue-managment-system
npm install
```

### 2. Configure Environment Variables
Make sure your `.env` file has:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Create Database Tables
Run the SQL scripts in your Supabase SQL Editor:
1. Create the `patients` table
2. Create the `queue` table
3. Ensure `doctors` table exists

### 4. Add Sample Data (Optional)
Run the `sample-data.sql` file in Supabase SQL Editor to populate test data.

### 5. Start Development Server
```bash
npm run dev
```

### 6. Access the Dashboard
Navigate to: `http://localhost:5173/doctor?id=YOUR_DOCTOR_ID`

For testing with sample data: `http://localhost:5173/doctor?id=1`

## File Structure

```
src/
├── components/
│   ├── DoctorDashboard.jsx       ← Main dashboard component
│   └── ui/                        ← UI components
├── pages/
│   └── DoctorPage.jsx            ← Page wrapper
├── lib/
│   ├── database.js               ← Database services (updated)
│   └── supabase.js               ← Supabase client
└── App.jsx                       ← Added /doctor route
```

## Testing the Dashboard

### 1. With Sample Data
```bash
# Run sample-data.sql in Supabase
# Then access: http://localhost:5173/doctor?id=1
```

### 2. Manual Testing Checklist
- [ ] View today's queue
- [ ] Navigate between patients (Previous/Next)
- [ ] Click on patient in queue list
- [ ] Start consultation (waiting → in-progress)
- [ ] Complete consultation (in-progress → completed)
- [ ] Mark patient as no-show
- [ ] Change date and view different day's queue
- [ ] Refresh queue manually
- [ ] Check auto-refresh (wait 30 seconds)
- [ ] Verify statistics update correctly

## Common Issues & Solutions

### Issue: "No patients in queue"
**Solution**: 
- Check if sample data was inserted correctly
- Verify the doctor ID in URL matches database
- Check the selected date has appointments

### Issue: "Loading doctor dashboard..." stuck
**Solution**:
- Check browser console for errors
- Verify Supabase connection
- Check if `.env` file is configured correctly

### Issue: Status updates not working
**Solution**:
- Check network tab in browser dev tools
- Verify Supabase Row Level Security (RLS) policies
- Ensure queue table has proper permissions

### Issue: Doctor data not loading
**Solution**:
- The dashboard uses fallback mock data if API fails
- Check if doctor exists in database
- Verify doctor service in database.js

## Database Permissions (Supabase RLS)

### Enable Row Level Security
```sql
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue ENABLE ROW LEVEL SECURITY;
```

### Example Policies (Adjust based on your needs)

```sql
-- Allow doctors to read their own queue
CREATE POLICY "Doctors can view their queue"
ON queue FOR SELECT
TO authenticated
USING (doctor_id = auth.uid());

-- Allow doctors to update their queue
CREATE POLICY "Doctors can update their queue"
ON queue FOR UPDATE
TO authenticated
USING (doctor_id = auth.uid());

-- For testing: Allow all operations (NOT for production!)
CREATE POLICY "Allow all for testing"
ON queue FOR ALL
USING (true);

CREATE POLICY "Allow all for testing patients"
ON patients FOR ALL
USING (true);
```

## Production Deployment

### Environment Variables
Set these in your hosting platform:
```
VITE_SUPABASE_URL=your_production_url
VITE_SUPABASE_ANON_KEY=your_production_key
```

### Build for Production
```bash
npm run build
```

### Deploy
Deploy the `dist` folder to your hosting service (Vercel, Netlify, etc.)

## Next Steps

1. **Add Authentication**: Implement doctor login
2. **Add Authorization**: Ensure doctors only see their queue
3. **Add Notifications**: Push notifications for new patients
4. **Add Analytics**: Track consultation times, patient flow
5. **Add Export**: Export queue data to PDF/CSV
6. **Add Search**: Search patients by name/phone
7. **Add Filters**: Filter by status, time range

## Support

For issues or questions:
1. Check the browser console for errors
2. Review the `DOCTOR_DASHBOARD.md` documentation
3. Check the database structure matches requirements
4. Verify all dependencies are installed

## Features Overview

### Current Features
✅ Real-time queue display  
✅ Patient navigation (Previous/Next)  
✅ Status management (Waiting, In-Progress, Completed, No-Show)  
✅ Live statistics  
✅ Date selector  
✅ Auto-refresh (30 seconds)  
✅ Responsive design  
✅ Click-to-select patients  

### Coming Soon
🔜 Search & Filter  
🔜 Patient history  
🔜 Consultation notes  
🔜 Analytics dashboard  
🔜 Print queue list  
🔜 Export to CSV/PDF  

---

**Happy Queue Managing! 🏥👨‍⚕️**
