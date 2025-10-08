# Doctor Dashboard - Quick Reference Card

## 🚀 Quick Start
```bash
npm run dev
http://localhost:5173/doctor?id=1
```

## 📋 Status Legend
| Icon | Status | Color | Meaning |
|------|--------|-------|---------|
| 🟡 | Waiting | Yellow | Patient in queue |
| 🔵 | In Progress | Blue | Currently consulting |
| 🟢 | Completed | Green | Consultation done |
| 🔴 | No Show | Red | Patient didn't arrive |

## ⌨️ Key Actions
| Action | Button | Result |
|--------|--------|--------|
| Start | `Start Consultation` | Waiting → In Progress |
| Complete | `Complete Consultation` | In Progress → Completed |
| No Show | `Mark No Show` | Waiting → No Show |
| Navigate | `← Previous` / `Next →` | Change patient |
| Refresh | `Refresh Queue` | Update data |

## 📊 Dashboard Sections
```
┌──────────────────────────────────┐
│ 1. Header (Doctor Info)         │
├──────────────────────────────────┤
│ 2. Date Selector & Refresh      │
├──────────────────────────────────┤
│ 3. Statistics (4 Cards)          │
├──────────────────────────────────┤
│ 4. Current Patient (Main)        │
│ 5. Queue List (Sidebar)          │
└──────────────────────────────────┘
```

## 🎯 Workflow
1. **View** today's queue
2. **Select** first waiting patient
3. **Start** consultation
4. **Complete** consultation
5. **Repeat** for next patient

## 📱 URLs
| Route | Purpose |
|-------|---------|
| `/` | Landing page |
| `/register` | Hospital registration |
| `/doctor?id=X` | Doctor dashboard |

## 🗄️ Database Tables
```
patients  → Patient info
queue     → Appointments & status
doctors   → Doctor info
```

## 🔧 Key Functions
```javascript
// Get queue
queueService.getQueueByDoctorAndDate(id, date)

// Update status
queueService.updateQueueStatus(id, status)

// Get stats
queueService.getQueueStats(id, date)
```

## 🎨 Component Files
```
src/
├── components/
│   └── DoctorDashboard.jsx    ← Main component
├── pages/
│   └── DoctorPage.jsx         ← Page wrapper
└── lib/
    └── database.js            ← API services
```

## 📈 Status Values
```javascript
'waiting'      // Initial state
'in-progress'  // During consultation
'completed'    // Finished
'no-show'      // Didn't arrive
```

## 🔄 Auto-Refresh
- Interval: **30 seconds**
- Can be changed in `DoctorDashboard.jsx` line 23

## 🎨 UI Components Used
```javascript
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
```

## 📦 Dependencies
```json
{
  "@supabase/supabase-js": "^2.74.0",
  "lucide-react": "^0.545.0",
  "react-router-dom": "^7.9.3"
}
```

## 🐛 Troubleshooting
| Issue | Solution |
|-------|----------|
| Queue empty | Check date & sample data |
| Can't load | Verify Supabase connection |
| Status won't update | Check RLS policies |
| Doctor not found | Use fallback mock data |

## 📊 Sample Data
Run `sample-data.sql` to create:
- 10 patients
- 10 queue entries
- Mixed statuses

## 🎯 Testing Checklist
- [ ] Load dashboard
- [ ] View patients
- [ ] Navigate queue
- [ ] Start consultation
- [ ] Complete consultation
- [ ] Mark no-show
- [ ] Change dates
- [ ] Manual refresh

## 🔐 Security Notes
```sql
-- Enable RLS
ALTER TABLE queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Doctors view own queue"
ON queue FOR SELECT
USING (doctor_id = auth.uid());
```

## 📖 Documentation Files
```
DOCTOR_DASHBOARD.md      ← Full documentation
SETUP_GUIDE.md           ← Installation guide
IMPLEMENTATION_SUMMARY.md ← What was built
VISUAL_LAYOUT.md         ← UI/UX design
sample-data.sql          ← Test data
```

## 💡 Pro Tips
1. Use `Ctrl+R` to refresh browser
2. Open DevTools (F12) for debugging
3. Check Console for errors
4. Use Network tab to see API calls
5. Test on mobile with DevTools device mode

## 🎨 Color Palette
```css
Primary:    #0369a1  /* Sky Blue */
Background: #fafbfc  /* Light Gray */
Success:    #10b981  /* Green */
Warning:    #f59e0b  /* Yellow */
Error:      #ef4444  /* Red */
```

## 🎯 Performance
- Auto-refresh: 30s
- Max queue display: 600px height
- Scrollable list: Yes
- Lazy loading: No (small datasets)

## 🚀 Production Checklist
- [ ] Environment variables set
- [ ] Database tables created
- [ ] RLS policies enabled
- [ ] Authentication added
- [ ] Error tracking enabled
- [ ] Analytics configured
- [ ] Build tested
- [ ] Domain configured

## 📞 Support
- Check browser console
- Review error messages
- Verify database connection
- Test with sample data
- Check documentation files

---

## 🎓 Quick Command Reference

### Start Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Run Linter
```bash
npm run lint
```

## 🔗 Quick Links
- [React Docs](https://react.dev)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)

---

**Keep this card handy for quick reference! 📌**
