import React, { useState } from 'react';

export default function AuthScreen({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass the email up to App.js to switch views
    onLogin(email);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 mb-4 rounded-3xl overflow-hidden shadow-xl bg-white p-2 border border-white">
          <img src="/logo.jpg" alt="Habitly Logo" className="w-full h-full object-contain" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
          {isLogin ? 'Welcome back to Habitly' : 'Start your journey'}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {isLogin ? 'Track your habits, transform your health.' : 'Build better daily routines effortlessly.'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white/80 backdrop-blur-xl py-8 px-6 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-white">
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
              onClick={() => setIsLogin(true)}
            >
              Log in
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                !isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800 text-sm bg-slate-50/50 transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800 text-sm bg-slate-50/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800 text-sm bg-slate-50/50 transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl text-white bg-teal-600 hover:bg-teal-700 font-medium shadow-lg shadow-teal-600/30 transition-all"
            >
              {isLogin ? 'Log in' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}