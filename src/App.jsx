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

  // Core Trio: Water, Nicotine, Alcohol
  const [waterToday, setWaterToday] = useState(1750); // in ml
  const [nicotineToday, setNicotineToday] = useState(14); // in mg
  const [alcoholToday, setAlcoholToday] = useState(1); // standard units

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

  // Real Gemini AI Vision Scanner States
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setScanResult(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const runSmartAiScan = async () => {
    if (!imageBase64) return;
    if (!geminiApiKey.trim()) {
      alert('Please enter your Gemini API key first!');
      return;
    }

    setIsScanning(true);
    setScanResult(null);

    try {
      const base64Data = imageBase64.split(',')[1];
      const mimeType = imageBase64.substring(imageBase64.indexOf(':') + 1, imageBase64.indexOf(';'));

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey.trim()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Analyze this food image accurately. Return ONLY a valid JSON object with these exact keys: item (string name of food), calories (string estimated kcal), protein (string estimated grams), healthScore (string score out of 100 with short rationale), aiConfidence (string percentage like '98.5%'). Do not include markdown code blocks or extra text."
                },
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: base64Data
                  }
                }
              ]
            }
          ]
        })
      });

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw new Error('No response received from Gemini API.');
      }

      const cleanedJsonText = rawText.replace(/```json/g, '').replace(/
