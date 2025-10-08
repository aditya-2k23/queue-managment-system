# Doctor Dashboard Documentation

## Overview
The Doctor Dashboard is a comprehensive queue management interface that allows doctors to view, manage, and interact with their daily patient queue in real-time.

## Features

### 1. **Real-Time Queue Management**
- View all patients scheduled for the day
- See current queue status (waiting, in-progress, completed, no-show)
- Automatic refresh every 30 seconds
- Manual refresh option

### 2. **Patient Navigation**
- **Previous/Next Patient Buttons**: Navigate through the queue easily
- **Current Patient Indicator**: Shows which patient is being viewed (e.g., "3 / 12")
- **Click-to-Select**: Click any patient in the queue list to jump to them

### 3. **Patient Information Display**
The dashboard shows comprehensive patient details:
- **Patient Name** and **Token Number**
- **Contact Information** (Phone, Email)
- **Appointment Time**
- **Queue Position**
- **Status** (with color-coded badges)
- **Notes** (if any)

### 4. **Status Management**
Doctors can update patient status through intuitive action buttons:

#### For Waiting Patients:
- **Start Consultation**: Changes status to "in-progress"
- **Mark No Show**: Records patient absence

#### For In-Progress Patients:
- **Complete Consultation**: Marks consultation as complete and moves to next patient

### 5. **Statistics Dashboard**
Real-time statistics showing:
- **Total Patients**: Total scheduled for the day
- **Waiting**: Number of patients waiting
- **In Progress**: Currently being consulted
- **Completed**: Finished consultations

### 6. **Date Selector**
- View queue for different dates
- Default: Current date
- Automatic queue refresh when date changes

## Usage

### Accessing the Dashboard
Navigate to: `/doctor?id={doctorId}`

Example: `http://localhost:5173/doctor?id=1`

### Navigation Controls

#### Top Navigation:
```
[< Previous]  [3 / 12]  [Next >]
```
- Use arrows to move between patients
- Number shows current position / total patients

#### Status Indicators:
- 🟡 **Waiting** - Patient is in queue
- 🔵 **In Progress** - Currently being consulted
- 🟢 **Completed** - Consultation finished
- 🔴 **No Show** - Patient didn't arrive

### Workflow

1. **Start of Day**
   - Open dashboard
   - Review total patients scheduled
   - Check first patient in queue

2. **During Consultations**
   - Click "Start Consultation" for waiting patient
   - Status changes to "In Progress"
   - After consultation, click "Complete Consultation"
   - System automatically moves to next waiting patient

3. **Handling No-Shows**
   - If patient doesn't arrive, click "Mark No Show"
   - System moves to next patient automatically

4. **Review Queue**
   - Use the right sidebar to see all patients
   - Click any patient card to jump to them
   - Current patient is highlighted

## Component Structure

```
DoctorPage.jsx
  └── DoctorDashboard.jsx
      ├── Stats Cards (4x)
      ├── Current Patient Card
      │   ├── Patient Info
      │   ├── Navigation Controls
      │   └── Action Buttons
      └── Queue List Card
          └── Patient Cards
```

## Database Integration

### Tables Used:
1. **doctors** - Doctor information
2. **queue** - Queue entries with appointments
3. **patients** - Patient information

### Key Functions:
```javascript
// Get queue for specific doctor and date
queueService.getQueueByDoctorAndDate(doctorId, date)

// Update patient status
queueService.updateQueueStatus(queueId, status)

// Get statistics
queueService.getQueueStats(doctorId, date)
```

## Customization

### Adjusting Auto-Refresh
In `DoctorDashboard.jsx`, line 23:
```javascript
const interval = setInterval(fetchQueueData, 30000); // 30 seconds
```
Change `30000` to desired milliseconds.

### Styling Status Badges
Status colors can be customized in the `getStatusBadge` function (lines 103-127):
```javascript
case "waiting":
  return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
```

## Props

### DoctorDashboard
```typescript
{
  doctorId: string,          // Unique doctor identifier
  doctorData: {
    id: string,
    name: string,
    specialization: string,
    room_number: string,
    consultation_time: number,
    max_patients_per_day: number
  }
}
```

## State Management

### Main State Variables:
- `queue` - Array of all queue entries
- `currentPatientIndex` - Index of currently viewed patient
- `isLoading` - Loading state
- `stats` - Queue statistics object
- `selectedDate` - Currently selected date

## Error Handling

The dashboard includes comprehensive error handling:
- Network failures
- Missing data
- Invalid doctor IDs
- Empty queues

Fallback mock data is provided for demo purposes.

## Responsive Design

The dashboard is fully responsive:
- **Desktop**: 3-column layout with stats, current patient, and queue list
- **Tablet**: 2-column layout with stacked components
- **Mobile**: Single column with scrollable queue list

## Keyboard Shortcuts (Future Enhancement)

Potential keyboard shortcuts to add:
- `←` Previous Patient
- `→` Next Patient
- `Space` Start/Complete Consultation
- `N` Mark No Show

## Performance Considerations

1. **Auto-refresh**: Limited to 30 seconds to prevent excessive API calls
2. **Queue List**: Scrollable with max-height to prevent performance issues with large queues
3. **Optimistic Updates**: Status changes reflected immediately before API confirmation

## Testing

### Test Scenarios:
1. View dashboard with empty queue
2. Navigate between patients
3. Change patient status
4. Handle no-shows
5. Switch dates
6. Refresh queue data

### Mock Data:
If the API is unavailable, the dashboard will use mock doctor data to allow testing the UI.

## Future Enhancements

### Planned Features:
1. **Search/Filter**: Search patients by name or token
2. **Notes**: Add consultation notes
3. **Patient History**: View previous visits
4. **Notifications**: Sound/visual alerts for new patients
5. **Analytics**: Daily/weekly performance metrics
6. **Print**: Print queue list
7. **Export**: Export queue data to CSV
8. **Voice Commands**: Hands-free status updates
9. **Video Call Integration**: Remote consultations
10. **Prescription Module**: Digital prescription generation

## Troubleshooting

### Queue Not Loading
- Check network connection
- Verify doctor ID in URL
- Check browser console for errors
- Ensure Supabase connection is configured

### Status Not Updating
- Check API connection
- Verify queue entry ID
- Check user permissions

### Date Selector Issues
- Ensure date format is YYYY-MM-DD
- Check timezone settings

## API Reference

### Get Queue by Doctor and Date
```javascript
const result = await queueService.getQueueByDoctorAndDate(doctorId, date);
// Returns: { success: boolean, data: Array<QueueEntry> }
```

### Update Queue Status
```javascript
const result = await queueService.updateQueueStatus(queueId, status);
// status: 'waiting' | 'in-progress' | 'completed' | 'no-show'
```

## Support

For issues or feature requests, please contact the development team or create an issue in the repository.

---

**Version**: 1.0.0  
**Last Updated**: October 7, 2025  
**Author**: QueueCare Development Team
