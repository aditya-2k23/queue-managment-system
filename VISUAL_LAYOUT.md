# Doctor Dashboard - Visual Layout

## 🎨 Dashboard Layout Preview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         QueueCare Doctor Dashboard                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Doctor Dashboard                                                            │
│  👤 Dr. Sarah Johnson    📋 Cardiologist    ⚠️ Room 201                     │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│  📅  [2025-10-07]                                      [Refresh Queue]      │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┬─────────────────┬─────────────────┬─────────────────────┐
│  Total Patients │    Waiting      │   In Progress   │     Completed       │
│       10        │       6         │        1        │         2           │
│      👥         │      ⏰         │       📊        │        ✅           │
└─────────────────┴─────────────────┴─────────────────┴─────────────────────┘

┌─────────────────────────────────────────────────┬─────────────────────────┐
│                                                  │                         │
│  Current Patient               [◄] 3/10 [►]     │  Today's Queue          │
│                                                  │  6 waiting • 2 completed│
│  ┌─────────────────────────────────────────┐   │                         │
│  │                                          │   │  ┌───────────────────┐ │
│  │  Robert Johnson         Token #3        │   │  │ #1  ✅ Completed   │ │
│  │  🔵 In Progress                          │   │  │ John Doe          │ │
│  │                                          │   │  │ ⏰ 09:00          │ │
│  │  📞 9876543212      ✉️ robert.j@...     │   │  └───────────────────┘ │
│  │  ⏰ 09:30           📊 3 of 10           │   │                         │
│  │                                          │   │  ┌───────────────────┐ │
│  │  📝 Notes: Regular checkup               │   │  │ #2  ✅ Completed   │ │
│  │                                          │   │  │ Jane Smith        │ │
│  └─────────────────────────────────────────┘   │  │ ⏰ 09:15          │ │
│                                                  │  └───────────────────┘ │
│  ┌──────────────────┬──────────────────────┐   │                         │
│  │  ✅ Complete     │   ❌ Mark No Show    │   │  ┌───────────────────┐ │
│  │  Consultation    │                      │   │  │ #3  🔵 In Progress │ │
│  └──────────────────┴──────────────────────┘   │  │ Robert Johnson    │ │
│                                                  │  │ ⏰ 09:30 ← Current│ │
└─────────────────────────────────────────────────┤  └───────────────────┘ │
                                                   │                         │
                                                   │  ┌───────────────────┐ │
                                                   │  │ #4  🔴 No Show    │ │
                                                   │  │ Emily Davis       │ │
                                                   │  │ ⏰ 09:45          │ │
                                                   │  └───────────────────┘ │
                                                   │                         │
                                                   │  ┌───────────────────┐ │
                                                   │  │ #5  🟡 Waiting    │ │
                                                   │  │ Michael Brown     │ │
                                                   │  │ ⏰ 10:00          │ │
                                                   │  └───────────────────┘ │
                                                   │                         │
                                                   │  ┌───────────────────┐ │
                                                   │  │ #6  🟡 Waiting    │ │
                                                   │  │ Sarah Wilson      │ │
                                                   │  │ ⏰ 10:15          │ │
                                                   │  └───────────────────┘ │
                                                   │                         │
                                                   │        ... more         │
                                                   │      (scrollable)       │
                                                   └─────────────────────────┘
```

## 📊 Status Flow Diagram

```
┌─────────┐                    ┌──────────────┐                    ┌───────────┐
│ WAITING │ ──"Start"──────────▶│ IN-PROGRESS  │──"Complete"───────▶│ COMPLETED │
│   🟡    │  Consultation       │     🔵       │  Consultation      │    🟢    │
└─────────┘                    └──────────────┘                    └───────────┘
     │                                                                     
     │                                                                     
     └──"Mark No Show"──────────────────────────────────────────────────▶┌──────────┐
                                                                          │ NO-SHOW  │
                                                                          │   🔴     │
                                                                          └──────────┘
```

## 🎯 Interactive Elements

### Navigation Controls
```
┌──────────────────────────────────┐
│  [◄ Previous]  3 / 10  [Next ►] │
└──────────────────────────────────┘
       ↑           ↑         ↑
       │           │         │
  Disabled    Position   Navigate
  if first   indicator   to next
```

### Patient Card States

#### Waiting State:
```
┌─────────────────────────────────┐
│ Robert Johnson      Token #3    │
│ 🟡 Waiting                       │
│ 📞 9876543212  ✉️ robert.j@...  │
│ ⏰ 09:30       📊 3 of 10        │
│                                  │
│ [📊 Start Consultation]          │
│ [❌ Mark No Show]                │
└─────────────────────────────────┘
```

#### In-Progress State:
```
┌─────────────────────────────────┐
│ Robert Johnson      Token #3    │
│ 🔵 In Progress                   │
│ 📞 9876543212  ✉️ robert.j@...  │
│ ⏰ 09:30       📊 3 of 10        │
│                                  │
│ [✅ Complete Consultation]       │
└─────────────────────────────────┘
```

#### Completed State:
```
┌─────────────────────────────────┐
│ Robert Johnson      Token #3    │
│ ✅ Completed                     │
│ 📞 9876543212  ✉️ robert.j@...  │
│ ⏰ 09:30       📊 3 of 10        │
│                                  │
│ This consultation has been       │
│ completed                        │
└─────────────────────────────────┘
```

## 📱 Mobile Layout

```
┌────────────────────┐
│  Doctor Dashboard  │
│  Dr. Sarah Johnson │
├────────────────────┤
│ 📅 [2025-10-07]    │
│     [Refresh]      │
├────────────────────┤
│  Total: 10         │
│  Waiting: 6        │
│  In Progress: 1    │
│  Completed: 2      │
├────────────────────┤
│ Current Patient    │
│ [◄]  3/10  [►]    │
├────────────────────┤
│ Robert Johnson  #3 │
│ 🔵 In Progress     │
│ 📞 9876543212      │
│ ⏰ 09:30           │
├────────────────────┤
│ [✅ Complete]      │
├────────────────────┤
│ Today's Queue      │
│ ┌────────────────┐ │
│ │ #1 ✅ John Doe │ │
│ └────────────────┘ │
│ ┌────────────────┐ │
│ │ #2 ✅ Jane S.  │ │
│ └────────────────┘ │
│ ┌────────────────┐ │
│ │ #3 🔵 Robert J.│ │
│ └────────────────┘ │
│      ... more      │
└────────────────────┘
```

## 🎨 Color Scheme

### Status Colors:
- **Waiting**: `bg-yellow-100 text-yellow-800` 🟡
- **In Progress**: `bg-blue-500 text-white` 🔵
- **Completed**: `bg-green-500 text-white` 🟢
- **No Show**: `bg-red-500 text-white` 🔴

### UI Colors:
- **Primary**: `#0369a1` (Sky Blue)
- **Background**: `#fafbfc` (Light Gray)
- **Card**: `#ffffff` (White)
- **Border**: `#e2e8f0` (Light Border)
- **Text**: `#1e293b` (Dark Slate)

### Button States:
```
Default:     [  Button  ]  → bg-primary
Hover:       [  Button  ]  → bg-primary/90
Disabled:    [  Button  ]  → opacity-50
Destructive: [  Button  ]  → bg-red-600
```

## 🖱️ Interactive Behaviors

### 1. Queue List Hover:
```
Normal:   │ #3 Robert Johnson  │
          │ ⏰ 09:30           │

Hover:    │ #3 Robert Johnson  │  ← Border changes to primary
          │ ⏰ 09:30           │  ← Slight background tint

Active:   │ #3 Robert Johnson  │  ← Blue border
(current) │ ⏰ 09:30           │  ← Blue background tint
```

### 2. Button Click Flow:
```
1. [Start Consultation]
        ↓
2. Status changes: Waiting → In-Progress
        ↓
3. Button text changes to: [Complete Consultation]
        ↓
4. [Complete Consultation]
        ↓
5. Status changes: In-Progress → Completed
        ↓
6. Auto-advance to next waiting patient
```

### 3. Date Change:
```
1. User selects new date
        ↓
2. Show loading spinner
        ↓
3. Fetch queue for new date
        ↓
4. Update all displays
        ↓
5. Reset to first patient
```

## 📊 Statistics Animation

```
When status changes:

Total: 10  →  Total: 10     (unchanged)
Waiting: 6 →  Waiting: 5    (decreased by 1)
In Progress: 1 → In Progress: 0  (decreased by 1)
Completed: 2 → Completed: 3  (increased by 1)

↓ Animated counter transition ↓

Visual: Numbers "count up/down" with 300ms transition
```

## 🎭 Empty States

### No Patients:
```
┌─────────────────────────────────┐
│                                  │
│           👥                     │
│     No patients in queue         │
│                                  │
│  Check back later or select a   │
│      different date              │
│                                  │
└─────────────────────────────────┘
```

### Loading:
```
┌─────────────────────────────────┐
│                                  │
│            ⚡                    │
│       (spinning animation)       │
│                                  │
│      Loading queue...            │
│                                  │
└─────────────────────────────────┘
```

## 🎯 User Journey Map

```
1. LOGIN ──────────────────────────────────────────────┐
   │                                                     │
2. VIEW DASHBOARD ────────────────────────────────────┤
   │ • See today's queue                                │
   │ • View statistics                                  │
   │                                                     │
3. REVIEW PATIENT ────────────────────────────────────┤
   │ • Check patient details                            │
   │ • Review notes                                     │
   │                                                     │
4. START CONSULTATION ────────────────────────────────┤
   │ • Click "Start Consultation"                       │
   │ • Status → In Progress                             │
   │                                                     │
5. CONSULT ───────────────────────────────────────────┤
   │ • Examine patient                                  │
   │ • Discuss symptoms                                 │
   │ • Provide treatment                                │
   │                                                     │
6. COMPLETE ──────────────────────────────────────────┤
   │ • Click "Complete Consultation"                    │
   │ • Status → Completed                               │
   │ • Auto-advance to next                             │
   │                                                     │
7. REPEAT ────────────────────────────────────────────┤
   │ Go to step 3 for next patient                      │
   │                                                     │
8. END OF DAY ────────────────────────────────────────┘
   • Review completed consultations
   • Check no-shows
   • Close dashboard
```

## 📐 Responsive Breakpoints

### Desktop (≥1024px):
```
[ Stats Row (4 cards) ]
[ Current Patient (2/3) | Queue List (1/3) ]
```

### Tablet (768px - 1023px):
```
[ Stats Row (2x2 grid) ]
[ Current Patient (full width) ]
[ Queue List (full width) ]
```

### Mobile (<768px):
```
[ Stats (stacked) ]
[ Current Patient ]
[ Queue List ]
```

## 🎨 Typography

```
Heading 1: 3xl font-bold      (Doctor Dashboard)
Heading 2: 2xl font-bold      (Card titles)
Heading 3: xl font-semibold   (Patient names)
Body: base font-normal        (General text)
Caption: sm text-muted        (Timestamps, hints)
Label: sm font-medium         (Form labels)
```

## 🔔 Notification Areas (Future)

```
┌─────────────────────────────────────────┐
│ 🔔 New patient joined the queue         │
│    Token #11 - James Wilson             │
│    [View] [Dismiss]                     │
└─────────────────────────────────────────┘
```

---

This visual guide helps developers and designers understand the layout, interactions, and user flow of the Doctor Dashboard!
