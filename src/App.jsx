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

  // Patch Connection States
  const [patchStatus, setPatchStatus] = useState('disconnected');
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [patchBattery, setPatchBattery] = useState(null);
  const [sensorHeartRate, setSensorHeartRate] = useState(72);

  const generateDoctorCode = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `HABITLY-DR-${randomNum}`;
  };

  const [doctorCode, setDoctorCode] = useState(() => {
    const saved = localStorage.getItem('habitly_doctor_code');
    if (saved) return saved;
    const newCode = generateDoctorCode();
    localStorage.setItem('habitly_doctor_code', newCode);
    return newCode;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationBanner, setNotificationBanner] = useState(null);

  // Wellness & Mood States
  const [todayMood, setTodayMood] = useState(null);
  const [moodCheckedInToday, setMoodCheckedInToday] = useState(false);
  const [stressLevel, setStressLevel] = useState(30);
  const [journalNote, setJournalNote] = useState('');
  const [journalSaved, setJournalSaved] = useState(false);

  // Substance & Intake States
  const [waterToday, setWaterToday] = useState(1200);
  const [nicotineToday, setNicotineToday] = useState(8);
  const [alcoholToday, setAlcoholToday] = useState(0);

  // AI Report States
  const [aiReportGenerating, setAiReportGenerating] = useState(false);
  const [aiReportGenerated, setAiReportGenerated] = useState(false);
  const [aiReportData, setAiReportData] = useState(null);

  // Habits & Reminders States
  const [habitsList, setHabitsList] = useState([
    { id: 1, name: 'Morning Bio-Patch Check', completed: true },
    { id: 2, name: 'Hydration Goal (2L)', completed: false },
    { id: 3, name: '15-minute Walk / Exercise', completed: false },
    { id: 4, name: 'Evening Mindfulness Reflection', completed: false }
  ]);
  const [newHabitName, setNewHabitName] = useState('');

  const [remindersList, setRemindersList] = useState([
    { id: 1, title: 'Drink Water', time: '10:00 AM', active: true },
    { id: 2, title: 'Check Nicotine Levels', time: '02:00 PM', active: true },
    { id: 3, title: 'Evening Stretch', time: '08:00 PM', active: false }
  ]);
  const [newReminderTitle, setNewReminderTitle] = useState('');
  const [newReminderTime, setNewReminderTime] = useState('');

  // Food Scanner States
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFileName, setImageFileName] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  // Exercise Planner States
  const [workoutActive, setWorkoutActive] = useState(false);
  const [workoutType, setWorkoutType] = useState('Running');
  const [workoutSeconds, setWorkoutSeconds] = useState(0);
  const [workoutHistory, setWorkoutHistory] = useState([
    { id: 1, type: 'Cardio / Jogging', duration: '25 mins', date: 'Yesterday', calories: 240 },
    { id: 2, type: 'Yoga & Stretching', duration: '15 mins', date: '2 days ago', calories: 90 }
  ]);
  const [newCustomWorkoutType, setNewCustomWorkoutType] = useState('');
  const [newCustomWorkoutDuration, setNewCustomWorkoutDuration] = useState('');

  // Doctor & Patient Messaging States
  const [patientsList, setPatientsList] = useState([
    {
      id: 1,
      name: 'Alex Johnson',
      email: 'alex@example.com',
      metrics: { water: '1,200 ml', nicotine: '8 mg', stress: 'Low' },
      messages: [
        { sender: 'doctor', text: 'Hello Alex, how is your patch adhesion holding up?', time: 'Yesterday 09:30 AM' },
        { sender: 'patient', text: 'Going great! Levels feel steady.', time: 'Yesterday 10:15 AM' }
      ]
    }
  ]);
  const [selectedPatientId, setSelectedPatientId] = useState(1);
  const [doctorInputMessage, setDoctorInputMessage] = useState('');
  const [patientInputMessage, setPatientInputMessage] = useState('');

  // Timer Effect for Workouts
  useEffect(() => {
    let interval = null;
    if (workoutActive) {
      interval = setInterval(() => {
        setWorkoutSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [workoutActive]);

  // Bluetooth & Simulation Handlers
  const handleConnectPatch = async () => {
    setPatchStatus('scanning');
    try {
      if (navigator.bluetooth) {
        const device = await navigator.bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: ['battery_service']
        });
        setConnectedDevice(device.name || 'Habitly Bio-Patch');
        setPatchStatus('connected');
        setPatchBattery(Math.floor(65 + Math.random() * 35));
        setNotificationBanner(`🔗 Successfully connected to ${device.name || 'Bio-Patch'}!`);
        setTimeout(() => setNotificationBanner(null), 4000);
        return;
      }
    } catch (err) {
      console.log('Bluetooth unavailable or cancelled, using simulation mode:', err);
    }

    setTimeout(() => {
      setConnectedDevice('Habitly Bio-Patch v2.4');
      setPatchStatus('connected');
      setPatchBattery(88);
      setNotificationBanner('🔗 Simulated Bio-Patch Connected Successfully!');
      setTimeout(() => setNotificationBanner(null), 4000);
    }, 2000);
  };

  const handleDisconnectPatch = () => {
    setPatchStatus('disconnected');
    setConnectedDevice(null);
    setPatchBattery(null);
    setNotificationBanner('🔌 Bio-Patch Disconnected.');
    setTimeout(() => setNotificationBanner(null), 4000);
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) return;
    const newUser = { name, email, role };
    setCurrentUser(newUser);
    setNotificationBanner(`Welcome back, ${name}!`);
    setTimeout(() => setNotificationBanner(null), 3000);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  const currentPatientData = patientsList.find(p => p.name === currentUser?.name) || patientsList[0];

  const navTabs = [
    { id: 'dashboard', label: '📊 Dashboard', mobileIcon: '📊', shortLabel: 'Home' },
    { id: 'habits', label: '✅ Daily Habits', mobileIcon: '✅', shortLabel: 'Habits' },
    { id: 'mood', label: '😊 Mood Tracker', mobileIcon: '😊', shortLabel: 'Mood' },
    { id: 'substance', label: '💧 Intake & Patch', mobileIcon: '💧', shortLabel: 'Intake' },
    { id: 'nutrition', label: '🥗 Food Scanner', mobileIcon: '🥗', shortLabel: 'Food' },
    { id: 'exercise', label: '⏱️ Exercise Planner', mobileIcon: '⏱️', shortLabel: 'Exercise' },
    { id: 'reminders', label: '⏰ Reminders', mobileIcon: '⏰', shortLabel: 'Reminders' },
    { id: 'patch', label: '🩹 Patch Connection', mobileIcon: '🩹', shortLabel: 'Patch' },
    currentUser?.role === 'patient' ? { id: 'doctor', label: '🩺 Doctor Chat', mobileIcon: '🩺', shortLabel: 'Doctor' } : null
  ].filter(Boolean);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-teal-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 shadow-xl max-w-md w-full border border-teal-100">
          <div className="text-center mb-6">
            <span className="text-4xl">🌱</span>
            <h1 className="text-2xl font-bold text-teal-950 mt-2">Habitly Portal</h1>
            <p className="text-xs text-slate-500 mt-1">Smart Biometric Tracking & Wellness Assistant</p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-teal-800">Select Account Type</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'patient', label: 'Patient' },
                  { id: 'doctor', label: 'Doctor' },
                  { id: 'personal', label: 'Personal' }
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      role === r.id
                        ? 'bg-teal-600 border-teal-600 text-white shadow-md'
                        : 'bg-white border-teal-200 text-teal-800 hover:bg-teal-50'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
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

            <div>
              <label className="block text-xs font-semibold mb-1 text-teal-900">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full px-4 py-2.5 bg-teal-50/30 border border-teal-200 rounded-xl focus:outline-none focus:border-teal-600 text-slate-800 text-sm"
              />
            </div>

            {role === 'patient' && (
              <div>
                <label className="block text-xs font-semibold mb-1 text-teal-900">Doctor Verification Code (Optional)</label>
                <input
                  type="text"
                  value={enteredDoctorCode}
                  onChange={(e) => setEnteredDoctorCode(e.target.value)}
                  placeholder="HABITLY-DR-XXXX"
                  className="w-full px-4 py-2.5 bg-teal-50/30 border border-teal-200 rounded-xl focus:outline-none focus:border-teal-600 text-slate-800 text-sm font-mono"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition-all mt-2"
            >
              Sign In / Register
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-teal-50/30 text-slate-800 overflow-hidden relative">
      {notificationBanner && (
        <div className="absolute top-4 right-4 z-50 bg-teal-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-teal-400 flex items-center space-x-3 animate-bounce">
          <span className="text-xl">📢</span>
          <p className="text-xs font-bold">{notificationBanner}</p>
        </div>
      )}

      {/* Sidebar Navigation */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-teal-100 flex flex-col transition-transform duration-300 md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-teal-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🌱</span>
            <div>
              <h2 className="font-bold text-teal-950 text-sm">Habitly</h2>
              <span className="text-[10px] font-semibold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full capitalize">{currentUser.role} Portal</span>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-teal-900 font-bold">✕</button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
          {navTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-teal-900 hover:bg-teal-50'
              }`}
            >
              <span className="text-base">{tab.mobileIcon}</span>
              <span>{tab.label.replace(/^[^\s]+\s/, '')}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-teal-100">
          <div className="flex items-center justify-between mb-3 px-2">
            <div>
              <p className="text-xs font-bold text-teal-950">{currentUser.name}</p>
              <p className="text-[10px] text-slate-500 truncate max-w-[120px]">{currentUser.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-rose-200"
          >
            <span>🚪</span> Sign Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-teal-100 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-teal-900 text-lg">☰</button>
            <h1 className="text-sm sm:text-base font-bold text-teal-950 capitalize">
              {navTabs.find(t => t.id === activeTab)?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold bg-teal-50 border border-teal-200 text-teal-900 px-3 py-1.5 rounded-xl">
              {patchStatus === 'connected' ? '🟢 Bio-Patch Active' : '🔴 Bio-Patch Inactive'}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-teal-50/20">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-teal-600 to-teal-800 rounded-3xl p-6 text-white shadow-lg">
                <h2 className="text-xl font-bold mb-1">Welcome back, {currentUser.name}! 👋</h2>
                <p className="text-xs text-teal-100">Your bio-patch and daily habits are synced. Keep up the great progress!</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-teal-100 shadow-sm">
                  <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block mb-1">Water Intake</span>
                  <span className="text-2xl font-bold text-teal-950">{waterToday} ml</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-teal-100 shadow-sm">
                  <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block mb-1">Nicotine Absorption</span>
                  <span className="text-2xl font-bold text-teal-950">{nicotineToday} mg</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-teal-100 shadow-sm">
                  <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block mb-1">Stress Level</span>
                  <span className="text-2xl font-bold text-teal-950">{stressLevel}%</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'habits' && (
            <div className="space-y-6 max-w-xl">
              <h2 className="text-xl font-bold text-teal-950">Daily Habits</h2>
              <div className="bg-white border border-teal-100 rounded-2xl p-6 shadow-sm space-y-3">
                {habitsList.map(habit => (
                  <div key={habit.id} className="flex items-center justify-between p-3 bg-teal-50/30 rounded-xl border border-teal-100">
                    <span className="text-xs font-semibold text-teal-950">{habit.name}</span>
                    <button
                      onClick={() => setHabitsList(habitsList.map(h => h.id === habit.id ? { ...h, completed: !h.completed } : h))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold ${habit.completed ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700'}`}
                    >
                      {habit.completed ? 'Completed ✓' : 'Mark Done'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'mood' && (
            <div className="space-y-6 max-w-xl">
              <h2 className="text-xl font-bold text-teal-950">Mood Tracker</h2>
              <div className="bg-white border border-teal-100 rounded-2xl p-6 shadow-sm space-y-4">
                <p className="text-xs font-semibold text-slate-600">How are you feeling today?</p>
                <div className="flex gap-4">
                  {['😊 Great', '😐 Neutral', '😔 Low', '⚡ Energetic'].map(m => (
                    <button
                      key={m}
                      onClick={() => { setTodayMood(m); setMoodCheckedInToday(true); }}
                      className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${todayMood === m ? 'bg-teal-600 text-white border-teal-600' : 'bg-teal-50/40 text-teal-900 border-teal-200'}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'substance' && (
            <div className="space-y-6 max-w-xl">
              <h2 className="text-xl font-bold text-teal-950">Intake & Patch Logs</h2>
              <div className="bg-white border border-teal-100 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between p-4 bg-teal-50/40 rounded-xl border border-teal-100">
                  <div>
                    <h3 className="font-bold text-xs text-teal-950">Water Intake</h3>
                    <p className="text-lg font-bold text-teal-800">{waterToday} ml</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setWaterToday(Math.max(0, waterToday - 250))} className="px-3 py-1 bg-white border border-teal-200 text-teal-900 rounded-lg text-xs font-bold">-250ml</button>
                    <button onClick={() => setWaterToday(waterToday + 250)} className="px-3 py-1 bg-teal-600 text-white rounded-lg text-xs font-bold">+250ml</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'nutrition' && (
            <div className="space-y-6 max-w-xl">
              <h2 className="text-xl font-bold text-teal-950">Food Scanner</h2>
              <div className="bg-white border border-teal-100 rounded-2xl p-6 shadow-sm space-y-4">
                <p className="text-xs text-slate-500">Upload a meal image to analyze nutritional content using AI.</p>
                <input type="file" onChange={(e) => setImageFileName(e.target.files[0]?.name || '')} className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100" />
                {imageFileName && <p className="text-xs font-semibold text-teal-900">Selected: {imageFileName}</p>}
              </div>
            </div>
          )}

          {activeTab === 'exercise' && (
            <div className="space-y-6 max-w-xl">
              <h2 className="text-xl font-bold text-teal-950">Exercise Planner & Stopwatch</h2>
              <div className="bg-white border border-teal-100 rounded-2xl p-6 shadow-sm space-y-4 text-center">
                <span className="text-4xl font-mono font-bold text-teal-950 block">
                  {Math.floor(workoutSeconds / 60)}:{(workoutSeconds % 60).toString().padStart(2, '0')}
                </span>
                <div className="flex justify-center gap-3">
                  <button onClick={() => setWorkoutActive(!workoutActive)} className={`px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md ${workoutActive ? 'bg-rose-600' : 'bg-teal-600'}`}>
                    {workoutActive ? 'Pause Workout' : 'Start Workout'}
                  </button>
                  <button onClick={() => { setWorkoutActive(false); setWorkoutSeconds(0); }} className="px-6 py-2.5 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold">
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reminders' && (
            <div className="space-y-6 max-w-xl">
              <h2 className="text-xl font-bold text-teal-950">Reminders</h2>
              <div className="bg-white border border-teal-100 rounded-2xl p-6 shadow-sm space-y-3">
                {remindersList.map(rem => (
                  <div key={rem.id} className="flex items-center justify-between p-3 bg-teal-50/30 rounded-xl border border-teal-100">
                    <div>
                      <p className="text-xs font-bold text-teal-950">{rem.title}</p>
                      <p className="text-[10px] text-slate-500">{rem.time}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${rem.active ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-500'}`}>
                      {rem.active ? 'Active' : 'Paused'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bio-Patch Hardware Connection Tab */}
          {activeTab === 'patch' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold mb-2 text-teal-950 tracking-wide">Bio-Patch Hardware Connection</h1>
                <p className="text-xs text-slate-500">Pair your wearable bio-patch via Bluetooth to sync sensor metrics in real-time.</p>
              </div>

              <div className="bg-white border border-teal-100 rounded-2xl p-6 shadow-sm max-w-xl space-y-6">
                <div className="flex items-center justify-between p-4 bg-teal-50/50 rounded-xl border border-teal-100">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">🩹</span>
                    <div>
                      <h3 className="font-bold text-xs text-teal-950 uppercase tracking-wider">Device Status</h3>
                      <p className="text-xs font-semibold text-teal-700 capitalize">
                        {patchStatus === 'connected' ? `🟢 Connected (${connectedDevice})` : patchStatus === 'scanning' ? '🔄 Scanning for nearby devices...' : '🔴 Disconnected'}
                      </p>
                    </div>
                  </div>
                  
                  {patchStatus === 'connected' && (
                    <span className="text-xs font-mono font-bold bg-teal-200/60 text-teal-900 px-2.5 py-1 rounded-lg">
                      Battery: {patchBattery}%
                    </span>
                  )}
                </div>

                {patchStatus === 'connected' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-teal-50/30 rounded-xl border border-teal-100">
                      <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">Sensor Heart Rate</span>
                      <span className="text-xl font-bold text-teal-950">{sensorHeartRate} BPM ❤️</span>
                    </div>
                    <div className="p-4 bg-teal-50/30 rounded-xl border border-teal-100">
                      <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">Transdermal Flux</span>
                      <span className="text-xl font-bold text-teal-950">Normal ⚡</span>
                    </div>
                  </div>
                )}

                {patchStatus === 'disconnected' && (
                  <button 
                    onClick={handleConnectPatch}
                    className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>📶</span> Scan & Connect Bio-Patch
                  </button>
                )}

                {patchStatus === 'scanning' && (
                  <button 
                    disabled
                    className="w-full py-3 bg-teal-400 text-white rounded-xl text-xs font-bold shadow-md cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <span>⏳</span> Searching for Bluetooth Devices...
                  </button>
                )}

                {patchStatus === 'connected' && (
                  <button 
                    onClick={handleDisconnectPatch}
                    className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
                  >
                    Disconnect Patch
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'doctor' && currentUser?.role === 'patient' && (
            <div className="space-y-6 max-w-xl">
              <h2 className="text-xl font-bold text-teal-950">Doctor Chat & Portal</h2>
              <div className="bg-white border border-teal-100 rounded-2xl p-6 shadow-sm space-y-4">
                <p className="text-xs text-slate-500">Secure messaging channel linked with your attending physician.</p>
                <div className="p-4 bg-teal-50/30 rounded-xl border border-teal-100 space-y-3">
                  <p className="text-xs font-bold text-teal-950">Dr. Sarah Chen</p>
                  <p className="text-xs text-slate-600">"Remember to log your daily patch metrics before your next consultation."</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
