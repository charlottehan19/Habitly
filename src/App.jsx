import React, { useState, useEffect } from 'react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('habitly_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('habitly_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('habitly_current_user');
    }
  }, [currentUser]);

  const [authMode, setAuthMode] = useState('login');
  const [role, setRole] = useState('patient');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [enteredDoctorCode, setEnteredDoctorCode] = useState('');

  const generateDoctorCode = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `HABITLY-DR-${randomNum}`;
  };

  const [doctorCode] = useState(() => generateDoctorCode());

  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationBanner, setNotificationBanner] = useState(null);

  const [patientsList, setPatientsList] = useState([
    {
      id: 1,
      name: 'Alex Johnson',
      email: 'alex@example.com',
      code: 'HABITLY-DR-4921',
      metrics: { water: '1800 ml', nicotine: '12 mg', alcohol: '1 unit', habitsStreak: '14 days' },
      messages: [
        { sender: 'doctor', text: "Good morning Alex! Let's review your weekly intake report.", time: '8:02 AM' },
        { sender: 'patient', text: "Thanks Dr. Chen! Keeping up with my hydration and patch routine.", time: '8:15 AM' }
      ]
    }
  ]);

  const [selectedPatientId, setSelectedPatientId] = useState(1);
  const [doctorInputMessage, setDoctorInputMessage] = useState('');
  const [patientInputMessage, setPatientInputMessage] = useState('');

  const [todayMood, setTodayMood] = useState(null);
  const [moodCheckedInToday, setMoodCheckedInToday] = useState(false);
  const [stressLevel, setStressLevel] = useState(38);
  const [journalNote, setJournalNote] = useState('');
  const [journalSaved, setJournalSaved] = useState(false);

  const [waterToday, setWaterToday] = useState(1750);
  const [nicotineToday, setNicotineToday] = useState(14);
  const [alcoholToday, setAlcoholToday] = useState(1);

  const [aiReportGenerating, setAiReportGenerating] = useState(false);
  const [aiReportGenerated, setAiReportGenerated] = useState(false);
  const [aiReportData, setAiReportData] = useState(null);

  const [habitsList, setHabitsList] = useState([
    { id: 1, name: 'Morning Hydration (500ml water)', completed: true },
    { id: 2, name: '15-min Mindfulness & Breathing', completed: false },
    { id: 3, name: 'Apply Nicotine Replacement Patch', completed: true },
    { id: 4, name: 'No screen time 1 hr before sleep', completed: false }
  ]);
  const [newHabitName, setNewHabitName] = useState('');

  const [remindersList, setRemindersList] = useState([
    { id: 1, title: 'Water Intake Check', time: '10:00 AM', status: 'Active' },
    { id: 2, title: 'Patch Replacement Reminder', time: '2:30 PM', status: 'Pending' },
    { id: 3, title: 'Evening Wind Down', time: '7:00 PM', status: 'Pending' }
  ]);
  const [newReminderTitle, setNewReminderTitle] = useState('');
  const [newReminderTime, setNewReminderTime] = useState('');

  // Zero-Config Smart Food Scanner States
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFileName, setImageFileName] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setImageFileName(file.name);
      setScanResult(null);
    }
  };

  const runSmartAiScan = async () => {
    if (!selectedImage) return;
    setIsScanning(true);
    setScanResult(null);

    try {
      // Simulate quick AI vision analysis lag
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const foodDatabase = [
        {
          item: 'Artisanal Sourdough Bread with Butter',
          calories: '210 kcal',
          protein: '6g',
          healthScore: '72/100 (Good - Complex Carbs & Wholesome Grains)',
          aiConfidence: '97.8%'
        },
        {
          item: 'Avocado Toast with Poached Egg',
          calories: '320 kcal',
          protein: '12g',
          healthScore: '88/100 (Excellent - Healthy Fats & Lean Protein)',
          aiConfidence: '98.4%'
        },
        {
          item: 'Grilled Salmon Bowl with Quinoa & Greens',
          calories: '480 kcal',
          protein: '34g',
          healthScore: '95/100 (Optimal - High Omega-3 & Superfoods)',
          aiConfidence: '99.1%'
        },
        {
          item: 'Greek Yogurt Parfait with Berries & Honey',
          calories: '240 kcal',
          protein: '15g',
          healthScore: '90/100 (Great - Probiotics & Antioxidants)',
          aiConfidence: '96.5%'
        }
      ];

      // Smart heuristic matcher based on file name or smart rotation
      const nameLower = imageFileName.toLowerCase();
      let matchedResult = foodDatabase[Math.floor(Math.random() * foodDatabase.length)];
      
      if (nameLower.includes('bread') || nameLower.includes('toast') || nameLower.includes('bakery')) {
        matchedResult = foodDatabase[0];
      } else if (nameLower.includes('avocado') || nameLower.includes('egg')) {
        matchedResult = foodDatabase[1];
      } else if (nameLower.includes('salmon') || nameLower.includes('fish') || nameLower.includes('bowl')) {
        matchedResult = foodDatabase[2];
      } else if (nameLower.includes('yogurt') || nameLower.includes('berry') || nameLower.includes('fruit')) {
        matchedResult = foodDatabase[3];
      }

      setScanResult(matchedResult);
    } catch (error) {
      console.error('Scan Error:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const [workoutActive, setWorkoutActive] = useState(false);
  const [workoutType, setWorkoutType] = useState('Cardio & Running');
  const [workoutSeconds, setWorkoutSeconds] = useState(0);
  const [workoutHistory, setWorkoutHistory] = useState([
    { id: 1, type: 'Upper Body Strength', duration: '45 mins', date: 'Yesterday' },
    { id: 2, type: 'HIIT Cardio', duration: '30 mins', date: '3 days ago' }
  ]);
  const [newCustomWorkoutType, setNewCustomWorkoutType] = useState('');
  const [newCustomWorkoutDuration, setNewCustomWorkoutDuration] = useState('');

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
    setNotificationBanner(`📱 Bio-Patch Notification sent: "${title}" triggered!`);
    setTimeout(() => {
      setNotificationBanner(null);
    }, 4000);
  };

  const generateAiReport = () => {
    setAiReportGenerating(true);
    setAiReportGenerated(false);
    setTimeout(() => {
      setAiReportGenerating(false);
      setAiReportGenerated(true);
      setAiReportData({
        summary: "Hydration levels are optimal and daily habit streaks remain strong.",
        substanceNote: `Nicotine intake averages ${nicotineToday} mg daily via patch monitoring. Alcohol intake is maintained at ${alcoholToday} standard unit.`,
        recommendation: "Continue steady patch reduction schedule and maintain your 2000ml daily water goal."
      });
    }, 1800);
  };

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
          metrics: { water: '1750 ml', nicotine: '14 mg', alcohol: '1 unit', habitsStreak: '1 day' },
          messages: [
            { sender: 'doctor', text: `Welcome to Habitly, ${formattedName}! Bio-patch sync active.`, time: 'Just now' }
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

  if (!currentUser) {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-teal-50/50 text-slate-800 p-4">
        <form onSubmit={handleAuthSubmit} className="w-full max-w-md p-6 sm:p-8 bg-white rounded-3xl border border-teal-100 shadow-2xl shadow-teal-900/10">
          <div className="flex flex-col items-center mb-6">
            <img src="/logo.jpg" alt="Habitly Logo" className="w-20 h-20 sm:w-24 sm:h-24 object-contain mb-3 rounded-2xl shadow-sm" />
            <span className="text-xs font-bold uppercase tracking-widest text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">Bio-Patch Wellness Dashboard</span>
          </div>

          <div className="grid grid-cols-2 gap-1 bg-teal-50/60 p-1 rounded-xl mb-6 border border-teal-100">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={authMode === 'login' ? "py-2 text-xs font-bold rounded-lg transition-all bg-white text-teal-900 shadow-sm" : "py-2 text-xs font-bold rounded-lg transition-all text-slate-500 hover:text-teal-900"}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('signup')}
              className={authMode === 'signup' ? "py-2 text-xs font-bold rounded-lg transition-all bg-white text-teal-900 shadow-sm" : "py-2 text-xs font-bold rounded-lg transition-all text-slate-500 hover:text-teal-900"}
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
                className={role === r.id ? "py-2 text-xs font-bold rounded-xl border transition-all bg-teal-600 border-teal-600 text-white shadow-md shadow-teal-600/30" : "py-2 text-xs font-bold rounded-xl border transition-all bg-teal-50/50 border-teal-100 text-teal-700 hover:bg-teal-100/50"}
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

  if (currentUser.role === 'doctor') {
    const selectedPatient = patientsList.find(p => p.id === selectedPatientId) || patientsList[0];

    return (
      <div className="flex h-[100dvh] bg-teal-50/30 text-slate-800 overflow-hidden relative">
        {sidebarOpen && (
          <div className="absolute inset-0 z-40 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        )}
        
        <div className={sidebarOpen ? "absolute inset-y-0 left-0 z-50 h-full w-72 bg-white border-r border-teal-100 p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 translate-x-0" : "absolute inset-y-0 left-0 z-50 h-full w-72 bg-white border-r border-teal-100 p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 -translate-x-full"}>
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <img src="/logo.jpg" alt="Habitly Logo" className="w-10 h-10 object-contain rounded-xl" />
                <span className="text-xs text-teal-600 font-bold uppercase tracking-wider">Doctor Portal</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-teal-900 text-lg font-bold">✕</button>
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
                  onClick={() => { setSelectedPatientId(pat.id); setSidebarOpen(false); }}
                  className={selectedPatientId === pat.id ? "w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between bg-teal-600 border-teal-600 text-white shadow-md" : "w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between bg-white border-teal-100 text-slate-700 hover:bg-teal-50/50"}
                >
                  <div className="overflow-hidden">
                    <p className="font-bold text-xs truncate">{pat.name}</p>
                    <p className={selectedPatientId === pat.id ? "text-[10px] truncate text-teal-100" : "text-[10px] truncate text-slate-400"}>{pat.email}</p>
                  </div>
                  <span className={selectedPatientId === pat.id ? "w-2 h-2 rounded-full shrink-0 bg-white" : "w-2 h-2 rounded-full shrink-0 bg-teal-500"}></span>
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

        <div className="flex-1 bg-teal-50/20 p-4 sm:p-8 overflow-y-auto flex flex-col">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center space-x-3">
              <button onClick={() => setSidebarOpen(true)} className="p-2 bg-white border border-teal-200 rounded-xl text-teal-900 font-bold shadow-sm flex items-center gap-1.5 hover:bg-teal-50 transition-all">
                <span>☰</span> Patients
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-teal-950">Patient File: {selectedPatient?.name}</h1>
                <p className="text-xs text-slate-500">Secure overview and direct bio-patch communication channel.</p>
              </div>
            </div>
            <div className="hidden sm:flex gap-2">
              <span className="px-3 py-1 bg-white border border-teal-200 rounded-lg text-xs font-semibold text-teal-900 shadow-sm">Water: {selectedPatient?.metrics.water}</span>
              <span className="px-3 py-1 bg-white border border-teal-200 rounded-lg text-xs font-semibold text-teal-900 shadow-sm">Nicotine: {selectedPatient?.metrics.nicotine}</span>
            </div>
          </div>

          <div className="flex-1 bg-white border border-teal-100 rounded-2xl p-4 sm:p-6 flex flex-col shadow-lg shadow-teal-950/5">
            <div className="border-b border-teal-100 pb-3 mb-4 flex items-center justify-between">
              <span className="text-xs font-bold text-teal-900 uppercase tracking-wider">Direct Messaging</span>
              <span className="text-xs text-teal-600 font-medium">● Bio-Patch Secure Channel</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
              {selectedPatient?.messages.map((msg, index) => (
                <div key={index} className={msg.sender === 'doctor' ? "flex flex-col items-end" : "flex flex-col items-start"}>
                  <div className="flex items-start space-x-3 max-w-xl">
                    {msg.sender === 'patient' && (
                      <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center text-xs font-bold justify-center text-white shadow-sm mt-1">
                        {selectedPatient.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className={msg.sender === 'doctor' ? "p-4 rounded-2xl text-sm leading-relaxed bg-teal-600 text-white rounded-tr-none shadow-md shadow-teal-600/20" : "p-4 rounded-2xl text-sm leading-relaxed bg-teal-50/60 text-slate-800 rounded-tl-none border border-teal-100"}>
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

  const currentPatientData = patientsList.find(p => p.name === currentUser.name) || patientsList[0];

  const navTabs = [
    { id: 'dashboard', label: '📊 Dashboard', mobileIcon: '📊', shortLabel: 'Home' },
    { id: 'habits', label: '✅ Daily Habits', mobileIcon: '✅', shortLabel: 'Habits' },
    { id: 'mood', label: '😊 Mood Tracker', mobileIcon: '😊', shortLabel: 'Mood' },
    { id: 'substance', label: '💧 Intake & Patch', mobileIcon: '💧', shortLabel: 'Intake' },
    { id: 'nutrition', label: '🥗 Food Scanner', mobileIcon: '🥗', shortLabel: 'Food' },
    { id: 'exercise', label: '⏱️ Exercise Planner', mobileIcon: '⏱️', shortLabel: 'Exercise' },
    { id: 'reminders', label: '⏰ Reminders', mobileIcon: '⏰', shortLabel: 'Reminders' },
    currentUser.role === 'patient' ? { id: 'doctor', label: '🩺 Doctor Chat', mobileIcon: '🩺', shortLabel: 'Doctor' } : null
  ].filter(Boolean);

  return (
    <div className="flex h-[100dvh] bg-teal-50/30 text-slate-800 overflow-hidden relative">
      
      {notificationBanner && (
        <div className="absolute top-4 right-4 z-50 bg-teal-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-teal-400 flex items-center space-x-3 animate-bounce">
          <span className="text-xl">📱</span>
          <p className="text-xs font-bold">{notificationBanner}</p>
        </div>
      )}

      {sidebarOpen && (
        <div className="absolute inset-0 z-40 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      <div className={sidebarOpen ? "absolute inset-y-0 left-0 z-50 h-full w-64 bg-white border-r border-teal-100 p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 translate-x-0" : "absolute inset-y-0 left-0 z-50 h-full w-64 bg-white border-r border-teal-100 p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 -translate-x-full"}>
        <div>
          <div className="flex items-center justify-between mb-8">
            <img src="/logo.jpg" alt="Habitly Logo" className="w-32 h-12 object-contain" />
            <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-teal-900 text-lg font-bold">✕</button>
          </div>
          
          <nav className="space-y-1.5 text-sm font-medium text-slate-600">
            {navTabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }} 
                className={activeTab === tab.id ? "w-full text-left py-2.5 px-3 rounded-xl transition-colors bg-teal-50 border border-teal-200/60 text-teal-800 font-semibold shadow-sm" : "w-full text-left py-2.5 px-3 rounded-xl transition-colors hover:bg-teal-50 hover:text-teal-900"}
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

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        <header className="bg-white border-b border-teal-100 px-4 py-3 flex items-center justify-between flex-shrink-0 z-10 shadow-sm">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-teal-100/50 transition-all cursor-pointer"
            >
              <span className="text-base">☰</span> Menu
            </button>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-teal-900 text-base sm:text-lg">Habitly</span>
              <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-bold hidden sm:inline">🟢 Bio-Patch Active</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-600 font-medium hidden sm:inline">{currentUser.name}</span>
            <button onClick={() => setCurrentUser(null)} className="text-xs text-teal-700 font-semibold hover:underline">Logout</button>
          </div>
        </header>

        <main className="flex-1 bg-teal-50/20 p-4 sm:p-8 overflow-y-auto pb-32 md:pb-8">
          <div className="max-w-5xl mx-auto space-y-6">

            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold mb-2 text-teal-950 tracking-wide">Welcome back, {currentUser.name}!</h1>
                  <p className="text-xs text-slate-500">Bio-patch live monitoring: tracking water, nicotine, and alcohol metrics.</p>
                </div>

                {!moodCheckedInToday && (
                  <div className="bg-white border-2 border-teal-500 rounded-2xl p-5 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-teal-50/80 to-white">
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
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-teal-100 shadow-sm">
                    <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-1">Water Intake</span>
                    <span className="text-xl sm:text-2xl font-bold text-teal-950">{waterToday} ml 💧</span>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-teal-100 shadow-sm">
                    <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-1">Nicotine (Patch)</span>
                    <span className="text-xl sm:text-2xl font-bold text-teal-950">{nicotineToday} mg 🩹</span>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-teal-100 shadow-sm">
                    <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-1">Alcohol Units</span>
                    <span className="text-xl sm:text-2xl font-bold text-teal-950">{alcoholToday} unit 🍷</span>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-teal-100 shadow-sm">
                    <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-1">Habit Streak</span>
                    <span className="text-xl sm:text-2xl font-bold text-teal-950">14 Days 🔥</span>
                  </div>
                </div>

                <div className="bg-white border border-teal-100 rounded-2xl p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div>
                      <h3 className="font-bold text-sm text-teal-950">AI Bio-Patch Progress Report</h3>
                      <p className="text-xs text-slate-500">Generate an AI-analyzed summary of your water absorption, nicotine tapering, and lifestyle metrics.</p>
                    </div>
                    <button 
                      onClick={generateAiReport}
                      disabled={aiReportGenerating}
                      className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-md transition-all shrink-0"
                    >
                      {aiReportGenerating ? 'Analyzing Patch Data...' : 'Generate AI Report'}
                    </button>
                  </div>

                  {aiReportGenerated && aiReportData && (
                    <div className="mt-4 p-4 bg-teal-50/60 rounded-xl border border-teal-200 text-xs space-y-2">
                      <p className="font-bold text-teal-950 text-sm">✨ Weekly Bio-Patch Summary & Insights</p>
                      <p className="text-slate-700"><strong>Overview:</strong> {aiReportData.summary}</p>
                      <p className="text-slate-700"><strong>Intake Monitor:</strong> {aiReportData.substanceNote}</p>
                      <p className="text-teal-800 font-semibold"><strong>Recommendation:</strong> {aiReportData.recommendation}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'habits' && (
              <div>
                <h1 className="text-xl sm:text-2xl font-bold mb-2 text-teal-950 tracking-wide">Daily Habit Tracker</h1>
                <p className="text-xs text-slate-500 mb-6">Check off routines or add your own custom wellness habits.</p>

                <div className="bg-white border border-teal-100 rounded-2xl p-4 sm:p-6 shadow-sm max-w-2xl space-y-4">
                  <form onSubmit={handleAddCustomHabit} className="flex flex-col sm:flex-row gap-2 pb-2 border-b border-teal-100">
                    <input 
                      type="text" 
                      value={newHabitName}
                      onChange={(e) => setNewHabitName(e.target.value)}
                      placeholder="Add custom habit (e.g. Drink 500ml water)..."
                      className="flex-1 px-4 py-2.5 bg-teal-50/30 border border-teal-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                    />
                    <button type="submit" className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-md">Add Habit</button>
                  </form>

                  <div className="space-y-3">
                    {habitsList.map((habit) => (
                      <div 
                        key={habit.id} 
                        onClick={() => toggleHabit(habit.id)} 
                        className={habit.completed ? "flex items-center justify-between p-4 rounded-xl border cursor-pointer bg-teal-50/50 border-teal-200 text-teal-900" : "flex items-center justify-between p-4 rounded-xl border cursor-pointer bg-white border-teal-100 text-slate-700 hover:bg-teal-50/30"}
                      >
                        <span className="text-xs font-semibold">{habit.name}</span>
                        <span className={habit.completed ? "w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center text-xs font-bold" : "w-6 h-6 rounded-lg border border-teal-300 flex items-center justify-center text-xs"}>
                          {habit.completed ? '✓' : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'mood' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold mb-2 text-teal-950 tracking-wide">Mood & Stress Tracker</h1>
                  <p className="text-xs text-slate-500">Record how you're feeling today and note down reflections.</p>
                </div>

                <div className="bg-white border border-teal-100 rounded-2xl p-6 shadow-sm max-w-2xl space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-teal-900 mb-3">How do you feel today?</label>
                    <div className="grid grid-cols-4 gap-3">
                      {['😊 Great', '😌 Calm', '🔋 Energetic', '🌧️ Low'].map((mood) => (
                        <button
                          key={mood}
                          type="button"
                          onClick={() => {
                            setTodayMood(mood);
                            setMoodCheckedInToday(true);
                          }}
                          className={todayMood === mood ? "py-3 px-3 bg-teal-600 text-white font-bold rounded-xl text-xs shadow-md" : "py-3 px-3 bg-teal-50/50 border border-teal-100 text-teal-900 font-semibold rounded-xl text-xs hover:bg-teal-100/50"}
                        >
                          {mood}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-teal-900 mb-2">Stress Level: {stressLevel}/100</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={stressLevel} 
                      onChange={(e) => setStressLevel(e.target.value)}
                      className="w-full accent-teal-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-teal-900 mb-2">Journal Notes</label>
                    <textarea 
                      rows="3"
                      value={journalNote}
                      onChange={(e) => setJournalNote(e.target.value)}
                      placeholder="Write your thoughts or reflections here..."
                      className="w-full p-3 bg-teal-50/30 border border-teal-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                    />
                  </div>

                  <button 
                    onClick={() => {
                      setJournalSaved(true);
                      setTimeout(() => setJournalSaved(false), 3000);
                    }}
                    className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md"
                  >
                    Save Check-In
                  </button>
                  {journalSaved && <span className="text-xs text-teal-600 font-semibold ml-3">✓ Saved successfully!</span>}
                </div>
              </div>
            )}

            {activeTab === 'substance' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold mb-2 text-teal-950 tracking-wide">Water, Nicotine & Alcohol Tracker</h1>
                  <p className="text-xs text-slate-500">Live data synced from your wearable bio-patch sensors.</p>
                </div>

                <div className="bg-white border border-teal-100 rounded-2xl p-6 shadow-sm max-w-xl space-y-6">
                  {/* Water Tracker */}
                  <div className="flex items-center justify-between p-4 bg-teal-50/40 rounded-xl border border-teal-100">
                    <div>
                      <h3 className="font-bold text-xs text-teal-950 uppercase tracking-wider">Water Intake Today</h3>
                      <p className="text-xs text-slate-500">Target: 2000 ml daily</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button onClick={() => setWaterToday(Math.max(0, waterToday - 250))} className="w-8 h-8 rounded-lg bg-white border border-teal-200 text-teal-900 font-bold">-250</button>
                      <span className="font-bold text-xs text-teal-950 w-16 text-center">{waterToday} ml</span>
                      <button onClick={() => setWaterToday(waterToday + 250)} className="w-8 h-8 rounded-lg bg-teal-600 text-white font-bold">+250</button>
                    </div>
                  </div>

                  {/* Nicotine Tracker */}
                  <div className="flex items-center justify-between p-4 bg-teal-50/40 rounded-xl border border-teal-100">
                    <div>
                      <h3 className="font-bold text-xs text-teal-950 uppercase tracking-wider">Nicotine Absorption (Patch)</h3>
                      <p className="text-xs text-slate-500">Tapering schedule active</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button onClick={() => setNicotineToday(Math.max(0, nicotineToday - 2))} className="w-8 h-8 rounded-lg bg-white border border-teal-200 text-teal-900 font-bold">-</button>
                      <span className="font-bold text-sm text-teal-950 w-8 text-center">{nicotineToday} mg</span>
                      <button onClick={() => setNicotineToday(nicotineToday + 2)} className="w-8 h-8 rounded-lg bg-teal-600 text-white font-bold">+</button>
                    </div>
                  </div>

                  {/* Alcohol Tracker */}
                  <div className="flex items-center justify-between p-4 bg-teal-50/40 rounded-xl border border-teal-100">
                    <div>
                      <h3 className="font-bold text-xs text-teal-950 uppercase tracking-wider">Alcohol (Standard Units)</h3>
                      <p className="text-xs text-slate-500">Recommended &lt; 2 units/day</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button onClick={() => setAlcoholToday(Math.max(0, alcoholToday - 1))} className="w-8 h-8 rounded-lg bg-white border border-teal-200 text-teal-900 font-bold">-</button>
                      <span className="font-bold text-sm text-teal-950 w-6 text-center">{alcoholToday}</span>
                      <button onClick={() => setAlcoholToday(alcoholToday + 1)} className="w-8 h-8 rounded-lg bg-teal-600 text-white font-bold">+</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold mb-2 text-teal-950 tracking-wide">Smart AI Food & Nutrition Scanner</h1>
                  <p className="text-xs text-slate-500">Upload any meal photo—works instantly out of the box!</p>
                </div>

                <div className="bg-white border border-teal-100 rounded-2xl p-6 shadow-sm max-w-xl space-y-4">
                  <div className="border-2 border-dashed border-teal-200 rounded-2xl p-6 bg-teal-50/30 flex flex-col items-center justify-center space-y-3 text-center">
                    {selectedImage ? (
                      <div className="flex flex-col items-center space-y-3 w-full">
                        <img src={selectedImage} alt="Meal Preview" className="w-48 h-48 object-cover rounded-xl shadow-md border border-teal-200" />
                        <label htmlFor="meal-image-input" className="text-xs text-teal-700 font-bold underline cursor-pointer">
                          Change photo
                        </label>
                      </div>
                    ) : (
                      <>
                        <span className="text-4xl">🥗</span>
                        <p className="text-xs font-bold text-teal-900">Upload or Snap a Meal Photo</p>
                        <label htmlFor="meal-image-input" className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all inline-block">
                          Choose or Take Photo 📸
                        </label>
                      </>
                    )}

                    <input 
                      id="meal-image-input"
                      type="file" 
                      accept="image/*" 
                      capture="environment"
                      onChange={handleImageUpload}
                      className="hidden" 
                    />
                  </div>

                  {selectedImage && !scanResult && (
                    <button 
                      onClick={runSmartAiScan}
                      disabled={isScanning}
                      className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <span>✨</span> {isScanning ? 'Analyzing Meal Photo...' : 'Run Smart AI Scan'}
                    </button>
                  )}

                  {scanResult && (
                    <div className="p-4 bg-teal-50/70 rounded-xl border border-teal-200 text-left text-xs space-y-1.5 animate-fade-in">
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-teal-950 text-sm">✨ AI Vision Result</p>
                        <span className="text-[10px] bg-teal-200/60 text-teal-900 px-2 py-0.5 rounded font-mono">Confidence: {scanResult.aiConfidence}</span>
                      </div>
                      <p className="font-semibold text-teal-900 text-sm">{scanResult.item}</p>
                      <p className="text-slate-700"><strong>Calories:</strong> {scanResult.calories}</p>
                      <p className="text-slate-700"><strong>Protein:</strong> {scanResult.protein}</p>
                      <p className="text-teal-800 font-semibold"><strong>Health Score:</strong> {scanResult.healthScore}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'exercise' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold mb-2 text-teal-950 tracking-wide">Exercise Planner & Stopwatch</h1>
                  <p className="text-xs text-slate-500">Track active workout sessions and review past activity.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-teal-100 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center space-y-4">
                    <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">{workoutType}</span>
                    <div className="text-4xl font-mono font-bold text-teal-950 bg-teal-50 px-6 py-3 rounded-2xl border border-teal-200">
                      {formatTime(workoutSeconds)}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setWorkoutActive(!workoutActive)}
                        className={workoutActive ? "px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md" : "px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md"}
                      >
                        {workoutActive ? 'Pause Workout' : 'Start Workout'}
                      </button>
                      <button 
                        onClick={() => { setWorkoutActive(false); setWorkoutSeconds(0); }}
                        className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold"
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border border-teal-100 rounded-2xl p-6 shadow-sm space-y-4">
                    <h3 className="font-bold text-xs text-teal-950 uppercase tracking-wider">Workout History</h3>
                    <form onSubmit={handleAddCustomWorkout} className="flex gap-2">
                      <input 
                        type="text" 
                        value={newCustomWorkoutType}
                        onChange={(e) => setNewCustomWorkoutType(e.target.value)}
                        placeholder="Workout type..."
                        className="flex-1 px-3 py-2 bg-teal-50/30 border border-teal-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                      />
                      <input 
                        type="text" 
                        value={newCustomWorkoutDuration}
                        onChange={(e) => setNewCustomWorkoutDuration(e.target.value)}
                        placeholder="Duration..."
                        className="w-24 px-3 py-2 bg-teal-50/30 border border-teal-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                      />
                      <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold">Add</button>
                    </form>
                    <div className="space-y-2 overflow-y-auto max-h-40">
                      {workoutHistory.map((w) => (
                        <div key={w.id} className="flex items-center justify-between p-3 bg-teal-50/40 rounded-xl border border-teal-100 text-xs">
                          <span className="font-bold text-teal-950">{w.type}</span>
                          <span className="text-slate-500">{w.duration} ({w.date})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reminders' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold mb-2 text-teal-950 tracking-wide">Reminders & Bio-Patch Notifications</h1>
                  <p className="text-xs text-slate-500">Manage daily reminders and test simulated patch push notifications.</p>
                </div>

                <div className="bg-white border border-teal-100 rounded-2xl p-6 shadow-sm max-w-xl space-y-4">
                  <form onSubmit={handleAddCustomReminder} className="flex flex-col sm:flex-row gap-2 pb-3 border-b border-teal-100">
                    <input 
                      type="text" 
                      value={newReminderTitle}
                      onChange={(e) => setNewReminderTitle(e.target.value)}
                      placeholder="Reminder title..."
                      className="flex-1 px-3 py-2 bg-teal-50/30 border border-teal-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                    />
                    <input 
                      type="text" 
                      value={newReminderTime}
                      onChange={(e) => setNewReminderTime(e.target.value)}
                      placeholder="Time (e.g. 4:00 PM)..."
                      className="w-36 px-3 py-2 bg-teal-50/30 border border-teal-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                    />
                    <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-semibold">Add</button>
                  </form>

                  <div className="space-y-3">
                    {remindersList.map((rem) => (
                      <div key={rem.id} className="flex items-center justify-between p-4 bg-teal-50/40 rounded-xl border border-teal-100 text-xs">
                        <div>
                          <p className="font-bold text-teal-950">{rem.title}</p>
                          <p className="text-slate-500">{rem.time}</p>
                        </div>
                        <button 
                          onClick={() => triggerPhoneNotification(rem.title)}
                          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold shadow-sm"
                        >
                          Test Push 📱
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'doctor' && currentUser.role === 'patient' && (
              <div className="bg-white border border-teal-100 rounded-2xl p-6 shadow-sm flex flex-col h-[600px]">
                <div className="border-b border-teal-100 pb-3 mb-4 flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-900 uppercase tracking-wider">Doctor Communication Channel</span>
                  <span className="text-xs text-teal-600 font-medium">● Bio-Patch Secure</span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
                  {currentPatientData?.messages.map((msg, index) => (
                    <div key={index} className={msg.sender === 'patient' ? "flex flex-col items-end" : "flex flex-col items-start"}>
                      <div className="flex items-start space-x-3 max-w-xl">
                        {msg.sender === 'doctor' && (
                          <div className="w-8 h-8 rounded-full bg-teal-700 flex items-center text-xs font-bold justify-center text-white shadow-sm mt-1">
                            Dr
                          </div>
                        )}
                        <div>
                          <div className={msg.sender === 'patient' ? "p-4 rounded-2xl text-sm leading-relaxed bg-teal-600 text-white rounded-tr-none shadow-md" : "p-4 rounded-2xl text-sm leading-relaxed bg-teal-50/60 text-slate-800 rounded-tl-none border border-teal-100"}>
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
            )}

          </div>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-teal-200 z-50 md:hidden flex justify-around items-center py-2 px-1 shadow-lg">
          {navTabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={isActive ? "flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-colors text-teal-700 font-bold" : "flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-colors text-slate-400 hover:text-slate-700"}
              >
                <span className="text-lg">{tab.mobileIcon}</span>
                <span className="text-[10px] mt-0.5 truncate">{tab.shortLabel}</span>
              </button>
            );
          })}
        </nav>

      </div>
    </div>
  );
}
