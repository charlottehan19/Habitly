import React, { useState, useEffect } from 'react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [role, setRole] = useState('patient');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
 // Verification code states
  const [enteredDoctorCode, setEnteredDoctorCode] = useState('');

  const generateDoctorCode = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `HABITLY-DR-${randomNum}`;
  };

  const [doctorCode] = useState(() => generateDoctorCode());

  // Navigation tabs
  const [activeTab, setActiveTab] = useState('dashboard');

  // Push notification banner state
  const [notificationBanner, setNotificationBanner] = useState(null);

  // Shared Patient Database
  const [patientsList, setPatientsList] = useState([
    {
      id: 1,
      name: 'Alex Johnson',
      email: 'alex@example.com',
      code: 'HABITLY-DR-4921',
      metrics: { sleep: '7.2 hrs', hydration: '72%', stress: 'Moderate', habitsStreak: '14 days' },
      messages: [
        { sender: 'doctor', text: "Good morning Alex! Let's check your weekly health report.", time: '8:02 AM' },
        { sender: 'patient', text: "Thanks Dr. Chen! Working on my morning routine.", time: '8:15 AM' }
      ]
    }
  ]);

  const [selectedPatientId, setSelectedPatientId] = useState(1);
  const [doctorInputMessage, setDoctorInputMessage] = useState('');
  const [patientInputMessage, setPatientInputMessage] = useState('');

  // 1. Mood Tracker & Daily Check-In State
  const [todayMood, setTodayMood] = useState(null);
  const [moodCheckedInToday, setMoodCheckedInToday] = useState(false);
  const [stressLevel, setStressLevel] = useState(38);
  const [journalNote, setJournalNote] = useState('');
  const [journalSaved, setJournalSaved] = useState(false);

  // 2. Substance Tracker State
  const [cigarettesToday, setCigarettesToday] = useState(4);
  const [alcoholToday, setAlcoholToday] = useState(1);
  const [weeklyCigarettes, setWeeklyCigarettes] = useState([5, 4, 6, 3, 5, 7, 4]);
  const [weeklyAlcohol, setWeeklyAlcohol] = useState([1, 2, 2, 0, 2, 3, 1]);

  // 3. AI Report Generator State
  const [aiReportGenerating, setAiReportGenerating] = useState(false);
  const [aiReportGenerated, setAiReportGenerated] = useState(false);
  const [aiReportData, setAiReportData] = useState(null);

  // 4. Habits State
  const [habitsList, setHabitsList] = useState([
    { id: 1, name: 'Morning Hydration (500ml water)', completed: true },
    { id: 2, name: '15-min Mindfulness & Breathing', completed: false },
    { id: 3, name: 'Take Prescribed Vitamins', completed: true },
    { id: 4, name: 'No screen time 1 hr before sleep', completed: false }
  ]);
  const [newHabitName, setNewHabitName] = useState('');

  // 5. Reminders State
  const [remindersList, setRemindersList] = useState([
    { id: 1, title: 'Drink Water Check', time: '10:00 AM', status: 'Active' },
    { id: 2, title: 'Afternoon Posture & Stretch', time: '2:30 PM', status: 'Pending' },
    { id: 3, title: 'Evening Walk & Wind Down', time: '7:00 PM', status: 'Pending' }
  ]);
  const [newReminderTitle, setNewReminderTitle] = useState('');
  const [newReminderTime, setNewReminderTime] = useState('');

  // 6. Food Scanner & Nutrition State
  const [nutritionLogs, setNutritionLogs] = useState([
    { id: 1, meal: 'Avocado Toast & Eggs', calories: '420 kcal', protein: '18g', time: '8:30 AM' },
    { id: 2, meal: 'Grilled Chicken Salad', calories: '550 kcal', protein: '35g', time: '1:15 PM' }
  ]);
  const [newMealName, setNewMealName] = useState('');
  const [newMealCalories, setNewMealCalories] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  // 7. Exercise Planner State
  const [workoutActive, setWorkoutActive] = useState(false);
  const [workoutType, setWorkoutType] = useState('Cardio & Running');
  const [workoutSeconds, setWorkoutSeconds] = useState(0);
  const [workoutHistory, setWorkoutHistory] = useState([
    { id: 1, type: 'Upper Body Strength', duration: '45 mins', date: 'Yesterday' },
    { id: 2, type: 'HIIT Cardio', duration: '30 mins', date: '3 days ago' }
  ]);
  const [newCustomWorkoutType, setNewCustomWorkoutType] = useState('');
  const [newCustomWorkoutDuration, setNewCustomWorkoutDuration] = useState('');

  // Timer effect for workouts
  useEffect(() => {
    let interval = null;
    if (workoutActive) {
      interval = setInterval(() => {
        setWorkoutSeconds(sec => sec + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [workoutActive]);

  const formatTime = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const triggerPhoneNotification = (title) => {
    setNotificationBanner(`📱 Push Notification sent to phone: "${title}" reminder triggered!`);
    setTimeout(() => {
      setNotificationBanner(null);
    }, 4000);
  };

  // Generate AI Report function
  const generateAiReport = () => {
    setAiReportGenerating(true);
    setAiReportGenerated(false);
    setTimeout(() => {
      setAiReportGenerating(false);
      setAiReportGenerated(true);
      setAiReportData({
        summary: "Overall wellness is stable with consistent hydration and habit streaks.",
        substanceNote: `Current cigarette intake averages ${cigarettesToday} daily (moderate CO exposure ~9 ppm). Alcohol intake is within low-risk limits (1 standard drink/day).`,
        recommendation: "Focus on reducing evening cigarette intake by 1 unit this week and maintain your 14-day habit streak."
      });
    }, 1800);
  };

  // Handle Authentication
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    const formattedName = name.trim() || (role === 'doctor' ? 'Dr. Sarah Chen' : 'Patient User');
    
    if (authMode === 'signup') {
      const newUser = {
        name: formattedName,
        email,
        role,
        doctorCode: role === 'doctor' ? doctorCode : null,
        linkedCode: role === 'patient' ? enteredDoctorCode : null
      };
      setCurrentUser(newUser);

      if (role === 'patient') {
        const newPatientEntry = {
          id: Date.now(),
          name: formattedName,
          email,
          code: enteredDoctorCode || doctorCode,
          metrics: { sleep: '7.0 hrs', hydration: '60%', stress: 'Normal', habitsStreak: '1 day' },
          messages: [
            { sender: 'doctor', text: `Welcome to Habitly, ${formattedName}! Your account is now linked.`, time: 'Just now' }
          ]
        };
        setPatientsList(prev => [...prev, newPatientEntry]);
      }
    } else {
      setCurrentUser({
        name: role === 'doctor' ? 'Dr. Sarah Chen' : formattedName,
        email,
        role,
        doctorCode: role === 'doctor' ? doctorCode : null
      });
    }
  };

  const handleDoctorSend = (e) => {
    e.preventDefault();
    if (!doctorInputMessage.trim()) return;
    setPatientsList(patientsList.map(p => {
      if (p.id === selectedPatientId) {
        return {
          ...p,
          messages: [...p.messages, { sender: 'doctor', text: doctorInputMessage, time: 'Just now' }]
        };
      }
      return p;
    }));
    setDoctorInputMessage('');
  };

  const handlePatientSend = (e) => {
    e.preventDefault();
    if (!patientInputMessage.trim()) return;
    setPatientsList(patientsList.map(p => {
      if (p.name === currentUser.name || p.id === 1) {
        return {
          ...p,
          messages: [...p.messages, { sender: 'patient', text: patientInputMessage, time: 'Just now' }]
        };
      }
      return p;
    }));
    setPatientInputMessage('');
  };

  const toggleHabit = (id) => {
    setHabitsList(habitsList.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  const handleAddCustomHabit = (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    setHabitsList([...habitsList, { id: Date.now(), name: newHabitName, completed: false }]);
    setNewHabitName('');
  };

  const handleAddCustomReminder = (e) => {
    e.preventDefault();
    if (!newReminderTitle.trim() || !newReminderTime.trim()) return;
    setRemindersList([...remindersList, { id: Date.now(), title: newReminderTitle, time: newReminderTime, status: 'Pending' }]);
    setNewReminderTitle('');
    setNewReminderTime('');
  };

  const handleAddCustomWorkout = (e) => {
    e.preventDefault();
    if (!newCustomWorkoutType.trim() || !newCustomWorkoutDuration.trim()) return;
    setWorkoutHistory([{ id: Date.now(), type: newCustomWorkoutType, duration: newCustomWorkoutDuration, date: 'Just now' }, ...workoutHistory]);
    setNewCustomWorkoutType('');
    setNewCustomWorkoutDuration('');
  };

  const handleAddMeal = (e) => {
    e.preventDefault();
    if (!newMealName.trim()) return;
    setNutritionLogs([...nutritionLogs, { id: Date.now(), meal: newMealName, calories: newMealCalories ? `${newMealCalories} kcal` : '350 kcal', protein: '20g', time: 'Just now' }]);
    setNewMealName('');
    setNewMealCalories('');
  };

  const simulateFoodScan = () => {
    setIsScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult({ item: 'Grilled Salmon Bowl with Quinoa', calories: '480 kcal', protein: '32g', healthScore: '94/100 (Optimal)' });
    }, 2000);
  };

  // 1. AUTH SCREEN
  if (!currentUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-teal-50/50 text-slate-800">
        <form onSubmit={handleAuthSubmit} className="w-full max-w-md p-8 bg-white rounded-3xl border border-teal-100 shadow-2xl shadow-teal-900/10">
          <div className="flex flex-col items-center mb-6">
            <img src="/logo.jpg" alt="Habitly Logo" className="w-24 h-24 object-contain mb-3 rounded-2xl shadow-sm" />
          </div>

          <div className="grid grid-cols-2 gap-1 bg-teal-50/60 p-1 rounded-xl mb-6 border border-teal-100">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${authMode === 'login' ? 'bg-white text-teal-900 shadow-sm' : 'text-slate-500 hover:text-teal-900'}`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('signup')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${authMode === 'signup' ? 'bg-white text-teal-900 shadow-sm' : 'text-slate-500 hover:text-teal-900'}`}
            >
              Sign Up
            </button>
          </div>
          
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-teal-800">Select Account Type</label>
          <div className="grid grid-cols-3 gap-2 mb-5">
            {[
              { id: 'patient', label: 'Patient' },
              { id: 'doctor', label: 'Doctor' },
              { id: 'personal', label: 'Personal' }
            ].map((r) => (
              <button
                type="button"
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                  role === r.id 
                    ? 'bg-teal-600 border-teal-600 text-white shadow-md shadow-teal-600/30' 
                    : 'bg-teal-50/50 border-teal-100 text-teal-700 hover:bg-teal-100/50'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold mb-1 text-teal-900">Your Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder={role === 'doctor' ? 'Dr. Sarah Chen' : 'Alex Johnson'} 
              required
              className="w-full px-4 py-2.5 bg-teal-50/30 border border-teal-200 rounded-xl focus:outline-none focus:border-teal-600 text-slate-800 text-sm"
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold mb-1 text-teal-900">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com" 
              required
              className="w-full px-4 py-2.5 bg-teal-50/30 border border-teal-200 rounded-xl focus:outline-none focus:border-teal-600 text-slate-800 text-sm"
            />
          </div>

          <div className="mb-5">
            <label className="block text-xs font-semibold mb-1 text-teal-900">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              required
              className="w-full px-4 py-2.5 bg-teal-50/30 border border-teal-200 rounded-xl focus:outline-none focus:border-teal-600 text-slate-800 text-sm"
            />
          </div>

          {authMode === 'signup' && role === 'patient' && (
            <div className="mb-6 p-3 bg-teal-50/80 rounded-xl border border-teal-200">
              <label className="block text-xs font-bold text-teal-900 mb-1">Doctor Verification Code</label>
              <input 
                type="text" 
                value={enteredDoctorCode} 
                onChange={(e) => setEnteredDoctorCode(e.target.value)}
                placeholder="HABITLY-DR-4921" 
                className="w-full px-3 py-2 bg-white border border-teal-200 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:border-teal-600"
              />
            </div>
          )}

          {authMode === 'signup' && role === 'doctor' && (
            <div className="mb-6 p-3 bg-teal-50/80 rounded-xl border border-teal-200 text-center">
              <span className="text-xs font-bold text-teal-900 block">Your Generated Doctor Code:</span>
              <span className="text-sm font-mono font-bold text-teal-600 bg-white px-3 py-1 rounded-md border border-teal-200 inline-block mt-1">{doctorCode}</span>
            </div>
          )}

          <button 
            type="submit" 
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 font-semibold rounded-xl transition-all text-white shadow-lg shadow-teal-600/30 text-sm"
          >
            {authMode === 'login' ? `Log in as ${role}` : `Create ${role} Account`}
          </button>
        </form>
      </div>
    );
  }

  // 2. DOCTOR VIEW
  if (currentUser.role === 'doctor') {
    const selectedPatient = patientsList.find(p => p.id === selectedPatientId) || patientsList[0];

    return (
      <div className="flex h-screen bg-teal-50/30 text-slate-800 overflow-hidden">
        <div className="w-72 bg-white border-r border-teal-100 p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <img src="/logo.jpg" alt="Habitly Logo" className="w-12 h-12 object-contain rounded-xl" />
              <div>
                <span className="text-[10px] text-teal-600 font-bold uppercase tracking-wider">Doctor Portal</span>
              </div>
            </div>

            <div className="bg-teal-50 p-3 rounded-xl border border-teal-100 mb-6 text-xs">
              <span className="font-bold text-teal-900 block">Verification Code:</span>
              <span className="font-mono font-bold text-teal-700 select-all">{doctorCode}</span>
            </div>
            
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Linked Patients ({patientsList.length})</h3>
            <div className="space-y-2 overflow-y-auto max-h-[350px]">
              {patientsList.map((pat) => (
                <button
                  key={pat.id}
                  onClick={() => setSelectedPatientId(pat.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                    selectedPatientId === pat.id 
                      ? 'bg-teal-600 border-teal-600 text-white shadow-md' 
                      : 'bg-white border-teal-100 text-slate-700 hover:bg-teal-50/50'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="font-bold text-xs truncate">{pat.name}</p>
                    <p className={`text-[10px] truncate ${selectedPatientId === pat.id ? 'text-teal-100' : 'text-slate-400'}`}>{pat.email}</p>
                  </div>
                  <span className={`w-2 h-2 rounded-full shrink-0 ${selectedPatientId === pat.id ? 'bg-white' : 'bg-teal-500'}`}></span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-teal-100 flex items-center justify-between">
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-800 truncate">{currentUser.name}</p>
              <p className="text-[10px] text-teal-600 font-medium">Doctor Account</p>
            </div>
            <button onClick={() => setCurrentUser(null)} className="text-xs font-medium text-slate-400 hover:text-teal-700">Logout</button>
          </div>
        </div>

        <div className="flex-1 bg-teal-50/20 p-8 overflow-y-auto flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-teal-950">Patient File: {selectedPatient?.name}</h1>
              <p className="text-xs text-slate-500">Secure overview and direct communication channel.</p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-white border border-teal-200 rounded-lg text-xs font-semibold text-teal-900 shadow-sm">Sleep: {selectedPatient?.metrics.sleep}</span>
              <span className="px-3 py-1 bg-white border border-teal-200 rounded-lg text-xs font-semibold text-teal-900 shadow-sm">Hydration: {selectedPatient?.metrics.hydration}</span>
            </div>
          </div>

          <div className="flex-1 bg-white border border-teal-100 rounded-2xl p-6 flex flex-col shadow-lg shadow-teal-950/5">
            <div className="border-b border-teal-100 pb-3 mb-4 flex items-center justify-between">
              <span className="text-xs font-bold text-teal-900 uppercase tracking-wider">Direct Messaging</span>
              <span className="text-xs text-teal-600 font-medium">● Secure Channel</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
              {selectedPatient?.messages.map((msg, index) => (
                <div key={index} className={`flex flex-col ${msg.sender === 'doctor' ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-start space-x-3 max-w-xl">
                    {msg.sender === 'patient' && (
                      <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center text-xs font-bold justify-center text-white shadow-sm mt-1">
                        {selectedPatient.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                        msg.sender === 'doctor' 
                          ? 'bg-teal-600 text-white rounded-tr-none shadow-md shadow-teal-600/20' 
                          : 'bg-teal-50/60 text-slate-800 rounded-tl-none border border-teal-100'
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-[11px] text-slate-400 mt-1 block">{msg.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleDoctorSend} className="flex items-center space-x-2 pt-3 border-t border-teal-100">
              <input 
                type="text" 
                value={doctorInputMessage}
                onChange={(e) => setDoctorInputMessage(e.target.value)}
                placeholder={`Message ${selectedPatient?.name}...`}
                className="flex-1 px-4 py-3 bg-teal-50/30 border border-teal-200 rounded-xl focus:outline-none focus:border-teal-600 text-sm text-slate-800"
              />
              <button type="submit" className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold shadow-md">Send</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // 3. PATIENT OR PERSONAL VIEW
  const currentPatientData = patientsList.find(p => p.name === currentUser.name) || patientsList[0];

  return (
    <div className="flex h-screen bg-teal-50/30 text-slate-800 overflow-hidden relative">
      
      {/* Phone Notification Banner Toast */}
      {notificationBanner && (
        <div className="absolute top-4 right-4 z-50 bg-teal-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-teal-400 flex items-center space-x-3 animate-bounce">
          <span className="text-xl">📱</span>
          <p className="text-xs font-bold">{notificationBanner}</p>
        </div>
      )}

      {/* Sidebar Navigation */}
      <div className="w-64 bg-white border-r border-teal-100 p-6 flex flex-col justify-between shadow-sm">
        <div>
          <div className="flex items-center space-x-3 mb-8">
            <img src="/logo.jpg" alt="Habitly Logo" className="w-full h-14 object-contain" />
          </div>
          
          <nav className="space-y-1.5 text-sm font-medium text-slate-600">
            {[
              { id: 'dashboard', label: '📊 Dashboard' },
              { id: 'habits', label: '✅ Daily Habits' },
              { id: 'mood', label: '😊 Mood Tracker' },
              { id: 'substance', label: '🚬 Substance Tracker' },
              { id: 'nutrition', label: '🥗 Food & Nutrition' },
              { id: 'exercise', label: '⏱️ Exercise Planner' },
              { id: 'reminders', label: '⏰ Reminders & Notifs' },
              ...(currentUser.role === 'patient' ? [{ id: 'doctor', label: '🩺 Doctor Chat' }] : [])
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)} 
                className={`w-full text-left py-2.5 px-3 rounded-xl transition-colors ${activeTab === tab.id ? 'bg-teal-50 border border-teal-200/60 text-teal-800 font-semibold shadow-sm' : 'hover:bg-teal-50 hover:text-teal-900'}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-4 border-t border-teal-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center text-xs font-bold justify-center text-white shadow-sm">
              {currentUser.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-800 truncate">{currentUser.name}</p>
              <p className="text-[10px] text-teal-600 capitalize font-medium">{currentUser.role} Account</p>
            </div>
          </div>
          <button onClick={() => setCurrentUser(null)} className="text-xs font-medium text-slate-400 hover:text-teal-700">Logout</button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-teal-50/20 p-8 overflow-y-auto">
        
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 max-w-5xl">
            <div>
              <h1 className="text-2xl font-bold mb-2 text-teal-950 tracking-wide">Welcome back, {currentUser.name}!</h1>
              <p className="text-xs text-slate-500">Here is your daily wellness snapshot and activity summary.</p>
            </div>

            {/* Daily Mood Check-In Reminder Banner */}
            {!moodCheckedInToday && (
              <div className="bg-white border-2 border-teal-500 rounded-2xl p-5 shadow-md flex items-center justify-between bg-gradient-to-r from-teal-50/80 to-white">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl">🌿</span>
                  <div>
                    <h3 className="font-bold text-sm text-teal-950">Daily Check-In Reminder</h3>
                    <p className="text-xs text-teal-800">You haven't logged your mood today. Take 10 seconds to record how you feel!</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('mood')}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition-all shrink-0"
                >
                  Do Check-In Now →
                </button>
              </div>
            )}
            
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-teal-100 shadow-sm">
                <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-1">Today's Mood</span>
                <span className="text-xl font-bold text-teal-950">{todayMood || 'Pending ⚠️'}</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-teal-100 shadow-sm">
                <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-1">Hydration</span>
                <span className="text-2xl font-bold text-teal-950">72% 💧</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-teal-100 shadow-sm">
                <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-1">Sleep Average</span>
                <span className="text-2xl font-bold text-teal-950">7.2 hrs 🌙</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-teal-100 shadow-sm">
                <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-1">Habit Streak</span>
                <span className="text-2xl font-bold text-teal-950">14 Days 🔥</span>
              </div>
            </div>

            {/* AI Report Generator Quick Widget */}
            <div className="bg-white border border-teal-100 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-bold text-sm text-teal-950">AI Health Report & Tracker</h3>
                  <p className="text-xs text-slate-500">Generate an AI-analyzed progress report based on your recent habit, mood, and substance logs.</p>
                </div>
                <button 
                  onClick={generateAiReport}
                  disabled={aiReportGenerating}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-md transition-all shrink-0"
                >
                  {aiReportGenerating ? 'Analyzing Data...' : 'Generate AI Report'}
                </button>
              </div>

              {aiReportGenerated && aiReportData && (
                <div className="mt-4 p-4 bg-teal-50/60 rounded-xl border border-teal-200 text-xs space-y-2">
                  <p className="font-bold text-teal-950 text-sm">✨ Weekly AI Summary & Insights</p>
                  <p className="text-slate-700"><strong>Overview:</strong> {aiReportData.summary}</p>
                  <p className="text-slate-700"><strong>Substance Log:</strong> {aiReportData.substanceNote}</p>
                  <p className="text-teal-800 font-semibold"><strong>Recommendation:</strong> {aiReportData.recommendation}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* HABITS TAB */}
        {activeTab === 'habits' && (
          <div>
            <h1 className="text-2xl font-bold mb-2 text-teal-950 tracking-wide">Daily Habit Tracker</h1>
            <p className="text-xs text-slate-500 mb-6">Check off routines or add your own custom habit items.</p>

            <div className="bg-white border border-teal-100 rounded-2xl p-6 shadow-sm max-w-2xl space-y-4">
              <form onSubmit={handleAddCustomHabit} className="flex gap-2 pb-2 border-b border-teal-100">
                <input 
                  type="text" 
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="Add custom habit (e.g. Read 20 pages)..."
                  className="flex-1 px-4 py-2.5 bg-teal-50/30 border border-teal-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                />
                <button type="submit" className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-md">Add Habit</button>
              </form>

              <div className="space-y-3">
                {habitsList.map((habit) => (
                  <div key={habit.id} onClick={() => toggleHabit(habit.id)} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${habit.completed ? 'bg-teal-50/60 border-teal-200' : 'bg-white border-slate-100'}`}>
                    <span className={`text-sm font-medium ${habit.completed ? 'line-through text-teal-900/60' : 'text-slate-800'}`}>{habit.name}</span>
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${habit.completed ? 'bg-teal-600 text-white' : 'border border-slate-300 text-transparent'}`}>✓</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MOOD TRACKER TAB */}
        {activeTab === 'mood' && (
          <div className="max-w-4xl space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-1 text-teal-950 tracking-wide">Mood & Stress Tracking</h1>
              <p className="text-xs text-slate-500">Record how you feel daily, monitor your stress levels, and check your 7-day trend.</p>
            </div>

            <div className="bg-white border border-teal-100 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-sm text-teal-950 mb-4">How are you feeling today?</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                {[
                  { label: 'Great', emoji: '😁' },
                  { label: 'Good', emoji: '😊' },
                  { label: 'Okay', emoji: '😐' },
                  { label: 'Low', emoji: '😔' },
                  { label: 'Stressed', emoji: '😫' }
                ].map((m) => (
                  <button
                    key={m.label}
                    onClick={() => {
                      setTodayMood(`${m.emoji} ${m.label}`);
                      setMoodCheckedInToday(true);
                    }}
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      todayMood === `${m.emoji} ${m.label}`
                        ? 'bg-teal-600 border-teal-600 text-white shadow-md'
                        : 'bg-teal-50/30 border-teal-100 hover:bg-teal-50 text-slate-800'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{m.emoji}</span>
                    <span className="text-xs font-bold">{m.label}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-4 pt-4 border-t border-teal-100">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-teal-900">Stress Level Score ({stressLevel}%)</label>
                    <span className="text-xs font-semibold text-teal-600">{stressLevel < 40 ? 'Calm & Balanced' : stressLevel < 70 ? 'Moderate Stress' : 'High Stress'}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={stressLevel} 
                    onChange={(e) => setStressLevel(Number(e.target.value))}
                    className="w-full accent-teal-600 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-teal-900 mb-2">Daily Journal & Reflections</label>
                  <textarea 
                    rows="3" 
                    value={journalNote}
                    onChange={(e) => setJournalNote(e.target.value)}
                    placeholder="Write down your thoughts, highlights, or triggers today..."
                    className="w-full p-4 bg-teal-50/30 border border-teal-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                  />
                </div>

                <button 
                  onClick={() => setJournalSaved(true)}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
                >
                  {journalSaved ? '✓ Journal Saved!' : 'Save Reflection'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUBSTANCE TRACKER TAB */}
        {activeTab === 'substance' && (
          <div className="max-w-4xl space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-1 text-teal-950 tracking-wide">Substance Tracker & Reduction</h1>
              <p className="text-xs text-slate-500">Monitor daily intake, visualize weekly trends, and track your wellness goals.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-teal-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-900">🚬 Cigarettes Today</span>
                  <span className="text-2xl font-bold text-teal-950">{cigarettesToday}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setCigarettesToday(Math.max(0, cigarettesToday - 1))} className="flex-1 py-2 bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold rounded-xl text-xs border border-teal-200">- Decrease</button>
                  <button onClick={() => setCigarettesToday(cigarettesToday + 1)} className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs">+ Increase</button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-teal-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-900">🍷 Alcohol Units Today</span>
                  <span className="text-2xl font-bold text-teal-950">{alcoholToday}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setAlcoholToday(Math.max(0, alcoholToday - 1))} className="flex-1 py-2 bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold rounded-xl text-xs border border-teal-200">- Decrease</button>
                  <button onClick={() => setAlcoholToday(alcoholToday + 1)} className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs">+ Increase</button>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-teal-100 shadow-sm">
              <h3 className="font-bold text-sm text-teal-950 mb-3">7-Day Cigarette Intake Trend</h3>
              <div className="flex items-end space-x-3 h-32 pt-6">
                {weeklyCigarettes.map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold text-teal-900">{val}</span>
                    <div style={{ height: `${val * 12}px` }} className="w-full bg-teal-600 rounded-t-lg"></div>
                    <span className="text-[10px] text-slate-400">Day {idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* NUTRITION TAB */}
        {activeTab === 'nutrition' && (
          <div className="max-w-4xl space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-1 text-teal-950 tracking-wide">Food Scanner & Nutrition</h1>
              <p className="text-xs text-slate-500">Scan your meals with AI or log your dietary intake manually.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-teal-100 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm text-teal-950">AI Meal Scanner Simulator</h3>
                <button 
                  onClick={simulateFoodScan}
                  disabled={isScanning}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-md"
                >
                  {isScanning ? 'Scanning Meal...' : '📸 Scan Photo'}
                </button>
              </div>

              {scanResult && (
                <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-200 text-xs space-y-1">
                  <p className="font-bold text-teal-950 text-sm">✨ Scan Result: {scanResult.item}</p>
                  <p className="text-slate-700"><strong>Calories:</strong> {scanResult.calories} | <strong>Protein:</strong> {scanResult.protein}</p>
                  <p className="text-teal-800 font-semibold"><strong>Health Score:</strong> {scanResult.healthScore}</p>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl border border-teal-100 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-teal-950">Today's Meal Logs</h3>
              <form onSubmit={handleAddMeal} className="flex gap-2">
                <input 
                  type="text" 
                  value={newMealName}
                  onChange={(e) => setNewMealName(e.target.value)}
                  placeholder="Meal description (e.g. Salmon & Rice)..."
                  className="flex-1 px-4 py-2.5 bg-teal-50/30 border border-teal-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                />
                <input 
                  type="number" 
                  value={newMealCalories}
                  onChange={(e) => setNewMealCalories(e.target.value)}
                  placeholder="kcal"
                  className="w-24 px-4 py-2.5 bg-teal-50/30 border border-teal-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                />
                <button type="submit" className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold">Add</button>
              </form>

              <div className="space-y-2">
                {nutritionLogs.map((log) => (
                  <div key={log.id} className="flex justify-between items-center p-3 bg-teal-50/40 border border-teal-100 rounded-xl text-xs">
                    <div>
                      <span className="font-bold text-teal-950 block">{log.meal}</span>
                      <span className="text-[10px] text-slate-400">{log.time}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-teal-800 block">{log.calories}</span>
                      <span className="text-[10px] text-slate-500">Protein: {log.protein}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* EXERCISE PLANNER TAB */}
        {activeTab === 'exercise' && (
          <div className="max-w-4xl space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-1 text-teal-950 tracking-wide">Exercise Planner & Stopwatch</h1>
              <p className="text-xs text-slate-500">Track active workout sessions and log your fitness history.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-teal-100 shadow-sm text-center space-y-4">
              <h3 className="font-bold text-sm text-teal-950">Active Workout Session</h3>
              <div className="text-4xl font-mono font-bold text-teal-700">{formatTime(workoutSeconds)}</div>
              <p className="text-xs text-slate-500">Mode: {workoutType}</p>
              <div className="flex justify-center gap-3">
                <button 
                  onClick={() => setWorkoutActive(!workoutActive)} 
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md ${workoutActive ? 'bg-amber-600 hover:bg-amber-700' : 'bg-teal-600 hover:bg-teal-700'}`}
                >
                  {workoutActive ? 'Pause Workout' : 'Start Workout'}
                </button>
                <button 
                  onClick={() => { setWorkoutActive(false); setWorkoutSeconds(0); }} 
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-teal-100 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-teal-950">Workout History</h3>
              <form onSubmit={handleAddCustomWorkout} className="flex gap-2">
                <input 
                  type="text" 
                  value={newCustomWorkoutType}
                  onChange={(e) => setNewCustomWorkoutType(e.target.value)}
                  placeholder="Workout type (e.g. Evening Jog)..."
                  className="flex-1 px-4 py-2.5 bg-teal-50/30 border border-teal-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                />
                <input 
                  type="text" 
                  value={newCustomWorkoutDuration}
                  onChange={(e) => setNewCustomWorkoutDuration(e.target.value)}
                  placeholder="Duration (e.g. 30 mins)..."
                  className="w-36 px-4 py-2.5 bg-teal-50/30 border border-teal-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                />
                <button type="submit" className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold">Log</button>
              </form>

              <div className="space-y-2">
                {workoutHistory.map((w) => (
                  <div key={w.id} className="flex justify-between items-center p-3 bg-teal-50/40 border border-teal-100 rounded-xl text-xs">
                    <span className="font-bold text-teal-950">{w.type}</span>
                    <div className="text-right">
                      <span className="font-semibold text-teal-800">{w.duration}</span>
                      <span className="text-[10px] text-slate-400 block">{w.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* REMINDERS TAB */}
        {activeTab === 'reminders' && (
          <div className="max-w-4xl space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-1 text-teal-950 tracking-wide">Reminders & Push Notifications</h1>
              <p className="text-xs text-slate-500">Manage daily automated alerts and test push notifications to your phone.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-teal-100 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-teal-950">Add New Alarm / Reminder</h3>
              <form onSubmit={handleAddCustomReminder} className="flex gap-2">
                <input 
                  type="text" 
                  value={newReminderTitle}
                  onChange={(e) => setNewReminderTitle(e.target.value)}
                  placeholder="Reminder title (e.g. Take Medication)..."
                  className="flex-1 px-4 py-2.5 bg-teal-50/30 border border-teal-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                />
                <input 
                  type="text" 
                  value={newReminderTime}
                  onChange={(e) => setNewReminderTime(e.target.value)}
                  placeholder="Time (e.g. 4:00 PM)..."
                  className="w-36 px-4 py-2.5 bg-teal-50/30 border border-teal-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                />
                <button type="submit" className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold">Set</button>
              </form>

              <div className="space-y-3 pt-2">
                {remindersList.map((rem) => (
                  <div key={rem.id} className="flex justify-between items-center p-4 bg-teal-50/40 border border-teal-100 rounded-xl text-xs">
                    <div>
                      <span className="font-bold text-teal-950 text-sm block">{rem.title}</span>
                      <span className="text-slate-500">{rem.time} • Status: {rem.status}</span>
                    </div>
                    <button 
                      onClick={() => triggerPhoneNotification(rem.title)}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-sm"
                    >
                      Trigger Push Notification 📱
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DOCTOR CHAT TAB */}
        {activeTab === 'doctor' && currentUser.role === 'patient' && (
          <div className="max-w-4xl h-[calc(100vh-140px)] flex flex-col">
            <div className="mb-4">
              <h1 className="text-2xl font-bold mb-1 text-teal-950 tracking-wide">Doctor Direct Chat</h1>
              <p className="text-xs text-slate-500">Secure communication with your linked medical professional.</p>
            </div>

            <div className="flex-1 bg-white border border-teal-100 rounded-2xl p-6 flex flex-col shadow-sm">
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
                {currentPatientData?.messages.map((msg, index) => (
                  <div key={index} className={`flex flex-col ${msg.sender === 'patient' ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-start space-x-3 max-w-xl">
                      {msg.sender === 'doctor' && (
                        <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center text-xs font-bold justify-center text-white shadow-sm mt-1">
                          Dr
                        </div>
                      )}
                      <div>
                        <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                          msg.sender === 'patient' 
                            ? 'bg-teal-600 text-white rounded-tr-none shadow-md shadow-teal-600/20' 
                            : 'bg-teal-50/60 text-slate-800 rounded-tl-none border border-teal-100'
                        }`}>
                          {msg.text}
                        </div>
                        <span className="text-[11px] text-slate-400 mt-1 block">{msg.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handlePatientSend} className="flex items-center space-x-2 pt-3 border-t border-teal-100">
                <input 
                  type="text" 
                  value={patientInputMessage}
                  onChange={(e) => setPatientInputMessage(e.target.value)}
                  placeholder="Message your doctor..."
                  className="flex-1 px-4 py-3 bg-teal-50/30 border border-teal-200 rounded-xl focus:outline-none focus:border-teal-600 text-sm text-slate-800"
                />
                <button type="submit" className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold shadow-md">Send</button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}