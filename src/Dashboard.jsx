import React, { useState, useEffect } from 'react';

export default function Dashboard({ userEmail, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notificationPermission, setNotificationPermission] = useState(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );

  // Habits state
  const [habitsData, setHabitsData] = useState({
    hydration: [
      { id: 1, name: 'Glass of water', time: '8:00 AM', completed: true },
      { id: 2, name: 'Glass of water', time: '12:00 PM', completed: true },
      { id: 3, name: 'Glass of water', time: '3:00 PM', completed: false },
    ],
    health: [
      { id: 4, name: 'Morning vitamins', time: '9:00 AM', completed: true },
      { id: 5, name: '30-min workout', time: '5:00 PM', completed: false },
      { id: 6, name: '10,000 steps', time: 'All Day', completed: true },
    ],
    mindfulness: [
      { id: 7, name: '10-min meditation', time: '8:30 PM', completed: true }
    ]
  });

  // Reminders state
  const [reminders, setReminders] = useState([
    { id: 1, title: 'Take Morning Vitamins', time: '9:00 AM', type: 'Medication', active: true },
    { id: 2, title: 'Hydration Check-in', time: '12:00 PM', type: 'Hydration', active: true },
    { id: 3, title: '30-min Evening Workout', time: '5:00 PM', type: 'Fitness', active: false },
    { id: 4, title: 'Bedtime Mindfulness', time: '9:30 PM', type: 'Sleep', active: true },
  ]);

  const [newReminder, setNewReminder] = useState({ 
    title: '', 
    hour: '12', 
    minute: '00', 
    ampm: 'PM', 
    type: 'Medication' 
  });

  // Input states for habits
  const [newInputs, setNewInputs] = useState({
    hydration: { name: '', hour: '08', minute: '00', ampm: 'AM' },
    health: { name: '', hour: '09', minute: '00', ampm: 'AM' },
    mindfulness: { name: '', hour: '08', minute: '30', ampm: 'PM' }
  });

  // Substance Tracker state
  const [substances, setSubstances] = useState([
    { id: 1, name: 'Caffeine (Coffee)', amount: '2 cups', time: '9:30 AM', limit: '4 cups' },
    { id: 2, name: 'Pre-workout Supplement', amount: '1 scoop', time: '4:30 PM', limit: '1 scoop' },
  ]);
  const [newSubstanceName, setNewSubstanceName] = useState('');
  const [newSubstanceAmount, setNewSubstanceAmount] = useState('');
  const [newSubstanceLimit, setNewSubstanceLimit] = useState('');

  // Cigarettes & CO Exposure state
  const [cigarettesToday, setCigarettesToday] = useState(4);
  const cigaretteGoal = 3;
  const [weeklyCigarettes, setWeeklyCigarettes] = useState([
    { day: 'Mon', count: 5 },
    { day: 'Tue', count: 4 },
    { day: 'Wed', count: 4 },
    { day: 'Thu', count: 3 },
    { day: 'Fri', count: 6 },
    { day: 'Sat', count: 7 },
    { day: 'Sun', count: 4 },
  ]);

  // Nutrition & Water state
  const [waterIntake, setWaterIntake] = useState(1.8);
  const waterGoal = 2.5;
  const [meals, setMeals] = useState([
    { id: 1, name: 'Morning Oatmeal', time: '7:30 AM', calories: 310, macros: 'P: 12g · C: 52g · F: 7g' },
    { id: 2, name: 'Grilled Chicken Salad', time: '12:15 PM', calories: 480, macros: 'P: 38g · C: 22g · F: 18g' },
  ]);
  const [showManualAdd, setShowManualAdd] = useState(false);
  const [manualMealName, setManualMealName] = useState('');
  const [manualCalories, setManualCalories] = useState('');

  // Exercise state
  const [workouts, setWorkouts] = useState([
    { id: 1, name: 'Morning Run', duration: 28, calories: 310, type: 'Cardio', completed: true, details: '4.2 km' },
    { id: 2, name: 'Push-ups', duration: 12, calories: 80, type: 'Strength', completed: true, details: '4 × 20' },
    { id: 3, name: 'Evening Walk', duration: 20, calories: 110, type: 'Cardio', completed: false, details: '2.1 km' },
    { id: 4, name: 'Yoga', duration: 15, calories: 60, type: 'Flexibility', completed: false, details: 'Flow session' },
  ]);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [newWorkoutName, setNewWorkoutName] = useState('');
  const [newWorkoutDuration, setNewWorkoutDuration] = useState('');
  const [newWorkoutCalories, setNewWorkoutCalories] = useState('');
  const [newWorkoutType, setNewWorkoutType] = useState('Cardio');
  const [newWorkoutDetails, setNewWorkoutDetails] = useState('');

  // Mood & Stress State
  const [selectedMood, setSelectedMood] = useState('Good');
  const [moodScore, setMoodScore] = useState(75);
  const [stressLevel, setStressLevel] = useState(38);
  const [journalNote, setJournalNote] = useState('');
  const [hasLoggedMoodToday, setHasLoggedMoodToday] = useState(false);

  // Check LocalStorage on mount for daily mood log
  useEffect(() => {
    const lastLogDate = localStorage.getItem('lastMoodLogDate');
    const today = new Date().toDateString();
    if (lastLogDate === today) {
      setHasLoggedMoodToday(true);
    }
  }, []);

  const handleSaveMood = (e) => {
    e.preventDefault();
    const today = new Date().toDateString();
    
    const moodEntry = {
      date: today,
      mood: selectedMood,
      score: moodScore,
      stress: stressLevel,
      note: journalNote
    };

    let history = JSON.parse(localStorage.getItem('moodHistory') || '[]');
    history.push(moodEntry);
    localStorage.setItem('moodHistory', JSON.stringify(history));
    localStorage.setItem('lastMoodLogDate', today);
    setHasLoggedMoodToday(true);

    alert('Mood & Stress recorded successfully for today! Your 7-day trend has been updated.');
  };

  // Total calories calculated from logged meals
  const totalCalories = meals.reduce((acc, m) => acc + Number(m.calories), 0);
  const calorieGoal = 2200;

  // Exercise totals
  const totalActiveMinutes = workouts.filter(w => w.completed).reduce((acc, w) => acc + Number(w.duration), 0);
  const totalCaloriesOut = workouts.filter(w => w.completed).reduce((acc, w) => acc + Number(w.calories), 0);
  const activeMinutesGoal = 60;

  // Request browser notification permission
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notifications.');
      return;
    }
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    if (permission === 'granted') {
      new Notification('Habitly Notifications Enabled! 🎉', {
        body: 'You will now receive alerts for your medications, workouts, and habits.',
      });
    }
  };

  // Background ticker for notifications
  useEffect(() => {
    if (notificationPermission !== 'granted') return;

    const interval = setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const currentTimeString = `${formattedHours}:${formattedMinutes} ${ampm}`;

      reminders.forEach(reminder => {
        if (reminder.active && reminder.time === currentTimeString) {
          new Notification(`Reminder: ${reminder.title}`, {
            body: `Time for your scheduled ${reminder.type.toLowerCase()} activity!`,
            icon: '/logo.jpg'
          });
        }
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [reminders, notificationPermission]);

  const toggleHabit = (category, id) => {
    setHabitsData(prev => ({
      ...prev,
      [category]: prev[category].map(h => h.id === id ? { ...h, completed: !h.completed } : h)
    }));
  };

  const deleteHabit = (category, id) => {
    setHabitsData(prev => ({
      ...prev,
      [category]: prev[category].filter(h => h.id !== id)
    }));
  };

  const addHabit = (category, e) => {
    e.preventDefault();
    const habitName = newInputs[category].name.trim();
    if (!habitName) return;

    const { hour, minute, ampm } = newInputs[category];
    const habitTime = `${hour}:${minute} ${ampm}`;

    setHabitsData(prev => ({
      ...prev,
      [category]: [...prev[category], { id: Date.now(), name: habitName, time: habitTime, completed: false }]
    }));

    setNewInputs(prev => ({ 
      ...prev, 
      [category]: { name: '', hour: '08', minute: '00', ampm: 'AM' } 
    }));
  };

  const toggleReminder = (id) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const addReminder = (e) => {
    e.preventDefault();
    if (!newReminder.title.trim()) return;

    const reminderTime = `${newReminder.hour}:${newReminder.minute} ${newReminder.ampm}`;
    setReminders(prev => [
      ...prev, 
      { id: Date.now(), title: newReminder.title.trim(), time: reminderTime, type: newReminder.type, active: true }
    ]);
    setNewReminder({ title: '', hour: '12', minute: '00', ampm: 'PM', type: 'Medication' });
  };

  const deleteReminder = (id) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const handleAddSubstance = (e) => {
    e.preventDefault();
    if (!newSubstanceName.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setSubstances(prev => [
      ...prev,
      {
        id: Date.now(),
        name: newSubstanceName.trim(),
        amount: newSubstanceAmount.trim() || '1 serving',
        time: timeStr,
        limit: newSubstanceLimit.trim() || 'As needed'
      }
    ]);
    setNewSubstanceName('');
    setNewSubstanceAmount('');
    setNewSubstanceLimit('');
  };

  const deleteSubstance = (id) => {
    setSubstances(prev => prev.filter(s => s.id !== id));
  };

  const handleAddWater = (amount) => {
    setWaterIntake(prev => Math.max(0, Number((prev + amount).toFixed(1))));
  };

  const handleSimulateScan = () => {
    const scannedMeals = [
      { name: 'Avocado Toast with Egg', calories: 350, macros: 'P: 14g · C: 28g · F: 16g' },
      { name: 'Salmon with Quinoa', calories: 560, macros: 'P: 42g · C: 45g · F: 20g' },
      { name: 'Greek Yogurt & Berries', calories: 220, macros: 'P: 18g · C: 24g · F: 4g' },
    ];
    const randomMeal = scannedMeals[Math.floor(Math.random() * scannedMeals.length)];
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMeals(prev => [...prev, { id: Date.now(), name: randomMeal.name, time: timeStr, calories: randomMeal.calories, macros: randomMeal.macros }]);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualMealName.trim() || !manualCalories) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMeals(prev => [...prev, { id: Date.now(), name: manualMealName.trim(), time: timeStr, calories: Number(manualCalories), macros: 'P: 15g · C: 30g · F: 10g' }]);
    setManualMealName('');
    setManualCalories('');
    setShowManualAdd(false);
  };

  const toggleWorkoutCompletion = (id) => {
    setWorkouts(prev => prev.map(w => w.id === id ? { ...w, completed: !w.completed } : w));
  };

  const handleAddWorkout = (e) => {
    e.preventDefault();
    if (!newWorkoutName.trim() || !newWorkoutDuration || !newWorkoutCalories) return;

    setWorkouts(prev => [
      ...prev,
      {
        id: Date.now(),
        name: newWorkoutName.trim(),
        duration: Number(newWorkoutDuration),
        calories: Number(newWorkoutCalories),
        type: newWorkoutType,
        completed: true,
        details: newWorkoutDetails.trim() || 'Custom Session'
      }
    ]);

    setNewWorkoutName('');
    setNewWorkoutDuration('');
    setNewWorkoutCalories('');
    setNewWorkoutDetails('');
    setShowWorkoutModal(false);
  };

  // Calculate totals and progress
  const allCategories = Object.keys(habitsData);
  const totalHabits = allCategories.reduce((acc, cat) => acc + habitsData[cat].length, 0);
  const completedHabits = allCategories.reduce((acc, cat) => acc + habitsData[cat].filter(h => h.completed).length, 0);
  const habitsProgress = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

  // CO Exposure calculated from cigarettes today
  const calculatedCO = Math.round(cigarettesToday * 2.25);
  const coExposureStatus = calculatedCO <= 5 ? 'Safe' : calculatedCO <= 11 ? 'Moderate' : 'High';
  const coExposureBadgeColor = 
    calculatedCO <= 5 ? 'bg-emerald-100 text-emerald-800' : 
    calculatedCO <= 11 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col justify-between p-6 sticky top-0 h-screen shadow-xs">
        <div>
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 mb-10">
            <div className="w-10 h-10 rounded-2xl overflow-hidden bg-teal-50 p-1 border border-teal-100 flex items-center justify-center shadow-sm">
              <img src="/logo.jpg" alt="Habitly Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">Habitly</span>
              <span className="text-xs text-teal-600 block font-medium">Health Intelligence</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>📊</span> Dashboard
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === 'insights'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>🤖</span> AI Insights
            </button>
            <button
              onClick={() => setActiveTab('habits')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === 'habits'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>✅</span> Habits
            </button>
            <button
              onClick={() => setActiveTab('nutrition')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === 'nutrition'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>🥗</span> Nutrition & Scanner
            </button>
            <button
              onClick={() => setActiveTab('exercise')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === 'exercise'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>🏃‍♂️</span> Exercise Planner
            </button>
            <button
              onClick={() => setActiveTab('substances')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === 'substances'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>🧪</span> Substance Tracker
            </button>
            <button
              onClick={() => setActiveTab('mood')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === 'mood'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>🧠</span> Mood & Stress
            </button>
            <button
              onClick={() => setActiveTab('reminders')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === 'reminders'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>🔔</span> Reminders
            </button>
          </nav>
        </div>

        {/* User Profile & Log out */}
        <div className="pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center text-sm shadow-xs">
              {userEmail ? userEmail[0].toUpperCase() : 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-800 truncate">{userEmail || 'User'}</p>
              <p className="text-[10px] text-slate-400">Active Account</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-red-600 bg-slate-100 hover:bg-red-50 rounded-xl transition-all text-left flex items-center gap-2"
          >
            <span>🚪</span> Log out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <span className="font-extrabold text-lg text-slate-900">Habitly</span>
          <div className="flex gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${activeTab === 'dashboard' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${activeTab === 'insights' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              Insights
            </button>
            <button
              onClick={() => setActiveTab('habits')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${activeTab === 'habits' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              Habits
            </button>
            <button
              onClick={() => setActiveTab('nutrition')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${activeTab === 'nutrition' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              Nutrition
            </button>
            <button
              onClick={() => setActiveTab('exercise')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${activeTab === 'exercise' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              Exercise
            </button>
            <button
              onClick={() => setActiveTab('substances')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${activeTab === 'substances' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              Substances
            </button>
            <button
              onClick={() => setActiveTab('mood')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${activeTab === 'mood' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              Mood
            </button>
            <button
              onClick={() => setActiveTab('reminders')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${activeTab === 'reminders' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              Reminders
            </button>
          </div>
        </header>

        {/* TAB 1: DASHBOARD VIEW */}
        {activeTab === 'dashboard' && (
          <div className="p-4 sm:p-8 max-w-6xl w-full mx-auto space-y-8">
            
            {!hasLoggedMoodToday && (
              <div className="bg-white border border-teal-200 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-slate-900">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-teal-500 rounded-full animate-ping shrink-0"></div>
                  <div>
                    <h3 className="text-base font-bold tracking-tight">How are you feeling today?</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Complete your daily mood check-in to record your graph and emotional well-being trend.</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('mood')}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm whitespace-nowrap"
                >
                  Record Mood Now &rarr;
                </button>
              </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <p className="text-xs font-medium text-slate-400 mb-1">Thursday, July 30 · 2026</p>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Good morning, <span className="text-teal-600">{userEmail ? userEmail.split('@')[0] : 'Alex'}</span>
                </h1>
                <p className="text-sm text-slate-500 mt-1">Your health intelligence report is ready.</p>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-3xl p-4 px-6 flex items-center gap-5 shadow-xs">
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="28" cy="28" r="22" stroke="currentColor" strokeWidth="5" className="text-slate-100 fill-none" />
                    <circle cx="28" cy="28" r="22" stroke="currentColor" strokeWidth="5" className="text-teal-600 fill-none" strokeDasharray="138" strokeDashoffset="35" strokeLinecap="round" />
                  </svg>
                  <span className="absolute text-sm font-bold text-slate-800">74</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider block font-medium">Health Score</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-lg font-bold text-teal-600">Good</span>
                    <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">↑ +3 from yesterday</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
                <div className="flex justify-between items-center mb-4">
                  <span className="p-2.5 rounded-2xl bg-teal-50 text-teal-600 text-lg">🏃‍♂️</span>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">{totalActiveMinutes} min</span>
                </div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{totalActiveMinutes} <span className="text-sm text-slate-400 font-medium">Active Min</span></h3>
                <p className="text-xs text-slate-500 mt-1">Goal: {activeMinutesGoal} min</p>
                <div className="w-full bg-slate-100 h-2 rounded-full mt-5 overflow-hidden">
                  <div className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all" style={{ width: `${Math.min(100, (totalActiveMinutes / activeMinutesGoal) * 100)}%` }}></div>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
                <div className="flex justify-between items-center mb-4">
                  <span className="p-2.5 rounded-2xl bg-cyan-50 text-cyan-600 text-lg">💧</span>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    {Math.round((waterIntake / waterGoal) * 100)}%
                  </span>
                </div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{waterIntake}L</h3>
                <p className="text-xs text-slate-500 mt-1">Water Intake · Goal: {waterGoal}L</p>
                <div className="w-full bg-slate-100 h-2 rounded-full mt-5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-teal-500 h-full rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min(100, (waterIntake / waterGoal) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
                <div className="flex justify-between items-center mb-4">
                  <span className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 text-lg">💤</span>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">79%</span>
                </div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">79</h3>
                <p className="text-xs text-slate-500 mt-1">Sleep Score · Goal: 100</p>
                <div className="w-full bg-slate-100 h-2 rounded-full mt-5 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full w-[79%]"></div>
                </div>
              </div>
            </div>

            <div className="bg-teal-50/50 border border-teal-100 rounded-3xl p-6 shadow-xs flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-600 text-xl">✨</div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 tracking-wide">AI Alert · High Priority</h4>
                <p className="text-xs text-slate-600 mt-1">You slept only 5.9 hours on Thursday. Today's activity has already dropped 28% below your weekly average.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB: AI INSIGHTS VIEW */}
        {activeTab === 'insights' && (
          <div className="p-4 sm:p-8 max-w-4xl w-full mx-auto space-y-6">
            <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-xs">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">AI Health Insights</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Pattern analysis across all your health data</p>
            </div>

            <div className="bg-white border border-teal-200 p-5 rounded-3xl shadow-xs flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                ✨
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">AI analysed 14 days of data</h3>
                <p className="text-xs text-slate-500 mt-0.5">5 patterns identified &middot; Last updated: Today, 8:14 AM</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 text-lg">💤</span>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">Sleep–Activity Correlation Detected</h3>
                </div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-red-100 text-red-700 uppercase tracking-wider">high</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Your activity levels drop 34% on days following less than 6.5 hours of sleep. Prioritizing sleep on weeknights could significantly improve your weekday performance.
              </p>
              <div className="bg-teal-50/60 border border-teal-100 p-3.5 rounded-2xl text-xs font-semibold text-teal-800 flex items-center gap-2">
                <span>&rarr;</span> Suggested action: Set a 10:30 PM bedtime reminder
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 rounded-2xl bg-amber-50 text-amber-600 text-lg">🚬</span>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">Smoking Peaks on High-Stress Days</h3>
                </div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800 uppercase tracking-wider">medium</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                CO levels in your tracking correlate with low mood scores. Your cigarette count is 47% higher on days rated 'low' or 'bad' mood — a classic stress-smoking pattern.
              </p>
              <div className="bg-teal-50/60 border border-teal-100 p-3.5 rounded-2xl text-xs font-semibold text-teal-800 flex items-center gap-2">
                <span>&rarr;</span> Suggested action: Try a 2-minute breathing exercise instead
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 rounded-2xl bg-cyan-50 text-cyan-600 text-lg">💧</span>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">Hydration Affects Mood</h3>
                </div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 uppercase tracking-wider">low</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Days where you reach your 2.5L water goal show an average 18% higher self-reported mood score compared to days under 1.5L.
              </p>
              <div className="bg-teal-50/60 border border-teal-100 p-3.5 rounded-2xl text-xs font-semibold text-teal-800 flex items-center gap-2">
                <span>&rarr;</span> Suggested action: Keep your water bottle at your desk
              </div>
            </div>
          </div>
        )}

        {/* TAB: HABITS VIEW */}
        {activeTab === 'habits' && (
          <div className="p-4 sm:p-8 max-w-4xl w-full mx-auto space-y-6">
            <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-xs flex justify-between items-center">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Habit Tracker</h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">Build consistency with daily routines</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-teal-600">{habitsProgress}%</span>
                <span className="text-xs text-slate-400 block font-medium">Completed today</span>
              </div>
            </div>

            {Object.keys(habitsData).map(category => (
              <div key={category} className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-xs space-y-4">
                <div className="flex justify-between items-center capitalize">
                  <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    {category === 'hydration' ? '💧' : category === 'health' ? '💊' : '🧘'} {category}
                  </h3>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    {habitsData[category].filter(h => h.completed).length} / {habitsData[category].length} done
                  </span>
                </div>

                <div className="space-y-2.5">
                  {habitsData[category].map(habit => (
                    <div key={habit.id} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={habit.completed}
                          onChange={() => toggleHabit(category, habit.id)}
                          className="w-5 h-5 accent-teal-600 rounded-md cursor-pointer"
                        />
                        <span className={`text-sm font-medium ${habit.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {habit.name}
                        </span>
                        <span className="text-xs text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                          {habit.time}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteHabit(category, habit.id)}
                        className="text-xs text-slate-400 hover:text-red-600 p-1"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>

                <form onSubmit={(e) => addHabit(category, e)} className="pt-2 flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder={`Add new ${category} habit...`}
                    value={newInputs[category].name}
                    onChange={(e) => setNewInputs(prev => ({
                      ...prev,
                      [category]: { ...prev[category], name: e.target.value }
                    }))}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-teal-600"
                  />
                  <div className="flex gap-2">
                    <select
                      value={newInputs[category].hour}
                      onChange={(e) => setNewInputs(prev => ({
                        ...prev,
                        [category]: { ...prev[category], hour: e.target.value }
                      }))}
                      className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    >
                      {['01','02','03','04','05','06','07','08','09','10','11','12'].map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                    <select
                      value={newInputs[category].ampm}
                      onChange={(e) => setNewInputs(prev => ({
                        ...prev,
                        [category]: { ...prev[category], ampm: e.target.value }
                      }))}
                      className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                    >
                      Add
                    </button>
                  </div>
                </form>
              </div>
            ))}
          </div>
        )}

        {/* TAB: NUTRITION & SCANNER VIEW */}
        {activeTab === 'nutrition' && (
          <div className="p-4 sm:p-8 max-w-4xl w-full mx-auto space-y-6">
            <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-xs flex justify-between items-center">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Nutrition & Scanner</h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">Track calories, macros, and AI meal scans</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-teal-600">{totalCalories}</span>
                <span className="text-xs text-slate-400 block font-medium">/ {calorieGoal} kcal</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleSimulateScan}
                className="p-6 bg-gradient-to-br from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-3xl shadow-md transition-all text-left flex items-center justify-between"
              >
                <div>
                  <span className="text-2xl block mb-2">📸</span>
                  <h3 className="text-base font-bold">Simulate AI Meal Scan</h3>
                  <p className="text-xs text-teal-100 mt-1">Instant photo analysis for calories & macros</p>
                </div>
                <span className="text-xl font-bold">&rarr;</span>
              </button>

              <button
                onClick={() => setShowManualAdd(!showManualAdd)}
                className="p-6 bg-white border border-slate-200 hover:border-teal-300 rounded-3xl shadow-xs transition-all text-left flex items-center justify-between"
              >
                <div>
                  <span className="text-2xl block mb-2">✏️</span>
                  <h3 className="text-base font-bold text-slate-900">Add Meal Manually</h3>
                  <p className="text-xs text-slate-500 mt-1">Enter name and calorie count directly</p>
                </div>
                <span className="text-xl font-bold text-slate-400">&rarr;</span>
              </button>
            </div>

            {showManualAdd && (
              <form onSubmit={handleManualSubmit} className="bg-white border border-slate-200 p-6 rounded-3xl shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Manual Meal Entry</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Meal name (e.g., Turkey Sandwich)"
                    value={manualMealName}
                    onChange={(e) => setManualMealName(e.target.value)}
                    className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                  <input
                    type="number"
                    placeholder="Calories (e.g., 400)"
                    value={manualCalories}
                    onChange={(e) => setManualCalories(e.target.value)}
                    className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl"
                >
                  Save Meal
                </button>
              </form>
            )}

            <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Logged Meals Today</h3>
              <div className="space-y-3">
                {meals.map(meal => (
                  <div key={meal.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{meal.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{meal.time} · {meal.macros}</p>
                    </div>
                    <span className="text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
                      {meal.calories} kcal
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-slate-900">Water Intake Tracker</h3>
                <span className="text-xs font-semibold text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full">{waterIntake}L / {waterGoal}L</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleAddWater(0.25)}
                  className="px-4 py-2.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-xs font-bold rounded-xl transition-all"
                >
                  + 250ml Glass
                </button>
                <button
                  onClick={() => handleAddWater(0.5)}
                  className="px-4 py-2.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-xs font-bold rounded-xl transition-all"
                >
                  + 500ml Bottle
                </button>
                <button
                  onClick={() => setWaterIntake(0)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-all"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: EXERCISE PLANNER VIEW */}
        {activeTab === 'exercise' && (
          <div className="p-4 sm:p-8 max-w-4xl w-full mx-auto space-y-6">
            <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-xs flex justify-between items-center">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Exercise Planner</h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">Workouts, active minutes, and calorie burn</p>
              </div>
              <button
                onClick={() => setShowWorkoutModal(true)}
                className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                + Add Workout
              </button>
            </div>

            {showWorkoutModal && (
              <form onSubmit={handleAddWorkout} className="bg-white border border-slate-200 p-6 rounded-3xl shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Add Custom Workout</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Workout Name (e.g., Cycling)"
                    value={newWorkoutName}
                    onChange={(e) => setNewWorkoutName(e.target.value)}
                    className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                  <select
                    value={newWorkoutType}
                    onChange={(e) => setNewWorkoutType(e.target.value)}
                    className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="Cardio">Cardio</option>
                    <option value="Strength">Strength</option>
                    <option value="Flexibility">Flexibility</option>
                    <option value="HIIT">HIIT</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Duration (minutes)"
                    value={newWorkoutDuration}
                    onChange={(e) => setNewWorkoutDuration(e.target.value)}
                    className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                  <input
                    type="number"
                    placeholder="Estimated Calories Burned"
                    value={newWorkoutCalories}
                    onChange={(e) => setNewWorkoutCalories(e.target.value)}
                    className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Details (e.g., 5 km route)"
                  value={newWorkoutDetails}
                  onChange={(e) => setNewWorkoutDetails(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
                <div className="flex gap-2">
                  <button type="submit" className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl">Save Workout</button>
                  <button type="button" onClick={() => setShowWorkoutModal(false)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl">Cancel</button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-xs">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active Minutes</span>
                <h3 className="text-3xl font-black text-slate-900 mt-1">{totalActiveMinutes} <span className="text-sm font-medium text-slate-400">/ {activeMinutesGoal} min</span></h3>
                <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
                  <div className="bg-teal-600 h-full rounded-full" style={{ width: `${Math.min(100, (totalActiveMinutes / activeMinutesGoal) * 100)}%` }}></div>
                </div>
              </div>
              <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-xs">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Calories Burned</span>
                <h3 className="text-3xl font-black text-teal-600 mt-1">{totalCaloriesOut} <span className="text-sm font-medium text-slate-400">kcal</span></h3>
                <p className="text-xs text-slate-500 mt-1">From completed exercise sessions</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Today's Scheduled Workouts</h3>
              <div className="space-y-3">
                {workouts.map(workout => (
                  <div key={workout.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={workout.completed}
                        onChange={() => toggleWorkoutCompletion(workout.id)}
                        className="w-5 h-5 accent-teal-600 rounded-md cursor-pointer"
                      />
                      <div>
                        <h4 className={`text-sm font-bold ${workout.completed ? 'text-slate-800' : 'text-slate-500'}`}>{workout.name}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{workout.duration} mins · {workout.type} · {workout.details}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
                      {workout.calories} kcal
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: SUBSTANCE TRACKER & CO EXPOSURE */}
        {activeTab === 'substances' && (
          <div className="p-4 sm:p-8 max-w-4xl w-full mx-auto space-y-6">
            <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-xs">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Substance & CO Tracker</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Monitor daily intake limits and carbon monoxide exposure</p>
            </div>

            <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Cigarettes Today</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Goal: Stay under {cigaretteGoal} per day</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCigarettesToday(prev => Math.max(0, prev - 1))}
                    className="w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-700 flex items-center justify-center transition-all"
                  >
                    -
                  </button>
                  <span className="text-2xl font-black text-slate-900 w-8 text-center">{cigarettesToday}</span>
                  <button
                    onClick={() => setCigarettesToday(prev => prev + 1)}
                    className="w-9 h-9 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold flex items-center justify-center transition-all shadow-xs"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Est. CO Exposure</span>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-3xl font-black text-slate-900">{calculatedCO} <span className="text-sm font-medium text-slate-400">ppm</span></span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${coExposureBadgeColor}`}>{coExposureStatus}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Calculated based on today's smoking frequency.</p>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">7-Day Weekly Average</span>
                  <div className="flex items-end gap-2 h-16 mt-3">
                    {weeklyCigarettes.map((item, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full bg-teal-500/20 rounded-t-md relative flex items-end justify-center" style={{ height: `${(item.count / 8) * 100}%` }}>
                          <div className="w-full bg-teal-600 rounded-t-md" style={{ height: item.day === 'Thu' ? '100%' : '70%' }}></div>
                        </div>
                        <span className="text-[10px] font-medium text-slate-500">{item.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Other Tracked Substances (Caffeine, Supplements)</h3>
              <div className="space-y-3">
                {substances.map(sub => (
                  <div key={sub.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{sub.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{sub.amount} · Logged at {sub.time} · Limit: {sub.limit}</p>
                    </div>
                    <button onClick={() => deleteSubstance(sub.id)} className="text-xs text-slate-400 hover:text-red-600 p-1">🗑️</button>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddSubstance} className="pt-2 flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Substance name (e.g., Green Tea)"
                  value={newSubstanceName}
                  onChange={(e) => setNewSubstanceName(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
                <input
                  type="text"
                  placeholder="Amount (e.g., 1 cup)"
                  value={newSubstanceAmount}
                  onChange={(e) => setNewSubstanceAmount(e.target.value)}
                  className="w-full sm:w-32 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
                <button type="submit" className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl">Add</button>
              </form>
            </div>
          </div>
        )}

        {/* TAB: MOOD & STRESS */}
        {activeTab === 'mood' && (
          <div className="p-4 sm:p-8 max-w-4xl w-full mx-auto space-y-6">
            <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-xs">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Mood & Stress Journal</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Record your daily emotional well-being and stress levels</p>
            </div>

            <form onSubmit={handleSaveMood} className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-xs space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-3">Select Today's Mood</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {['Great', 'Good', 'Neutral', 'Low', 'Bad'].map(m => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => {
                        setSelectedMood(m);
                        setMoodScore(m === 'Great' ? 95 : m === 'Good' ? 75 : m === 'Neutral' ? 50 : m === 'Low' ? 30 : 15);
                      }}
                      className={`p-4 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-2 ${
                        selectedMood === m ? 'bg-teal-600 text-white border-teal-600 shadow-md' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-xl">{m === 'Great' ? '😁' : m === 'Good' ? '😊' : m === 'Neutral' ? '😐' : m === 'Low' ? '😔' : '😫'}</span>
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Stress Level ({stressLevel}/100)</label>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${stressLevel < 40 ? 'bg-emerald-50 text-emerald-700' : stressLevel < 70 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
                    {stressLevel < 40 ? 'Low Stress' : stressLevel < 70 ? 'Moderate Stress' : 'High Stress'}
                  </span>
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
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Journal Notes (Optional)</label>
                <textarea
                  rows="3"
                  placeholder="How did your day go? Any specific triggers or highlights..."
                  value={journalNote}
                  onChange={(e) => setJournalNote(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-teal-600"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-2xl transition-all shadow-md shadow-teal-600/20"
              >
                Save Daily Check-In
              </button>
            </form>
          </div>
        )}

        {/* TAB: REMINDERS & NOTIFICATIONS */}
        {activeTab === 'reminders' && (
          <div className="p-4 sm:p-8 max-w-4xl w-full mx-auto space-y-6">
            <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Reminders & Alerts</h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">Manage desktop notifications for medications, workouts, and habits</p>
              </div>
              <button
                onClick={requestNotificationPermission}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                  notificationPermission === 'granted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-teal-600 hover:bg-teal-700 text-white'
                }`}
              >
                {notificationPermission === 'granted' ? '🔔 Notifications Active' : 'Enable Notifications'}
              </button>
            </div>

            <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Active Reminders List</h3>
              <div className="space-y-3">
                {reminders.map(rem => (
                  <div key={rem.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={rem.active}
                        onChange={() => toggleReminder(rem.id)}
                        className="w-5 h-5 accent-teal-600 rounded-md cursor-pointer"
                      />
                      <div>
                        <h4 className={`text-sm font-bold ${rem.active ? 'text-slate-800' : 'text-slate-400 line-through'}`}>{rem.title}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{rem.time} · Type: {rem.type}</p>
                      </div>
                    </div>
                    <button onClick={() => deleteReminder(rem.id)} className="text-xs text-slate-400 hover:text-red-600 p-1">🗑️</button>
                  </div>
                ))}
              </div>

              <form onSubmit={addReminder} className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Create New Reminder</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Reminder Title (e.g., Take medication)"
                    value={newReminder.title}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
                    className="sm:col-span-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                  <select
                    value={newReminder.type}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, type: e.target.value }))}
                    className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="Medication">Medication</option>
                    <option value="Hydration">Hydration</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Sleep">Sleep</option>
                  </select>
                </div>
                <div className="flex gap-2 items-center">
                  <select
                    value={newReminder.hour}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, hour: e.target.value }))}
                    className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    {['01','02','03','04','05','06','07','08','09','10','11','12'].map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                  <select
                    value={newReminder.minute}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, minute: e.target.value }))}
                    className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    {['00','15','30','45'].map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <select
                    value={newReminder.ampm}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, ampm: e.target.value }))}
                    className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                  <button type="submit" className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl">Add Reminder</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}