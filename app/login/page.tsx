"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { createClient } from '@/utils/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const supabase = createClient();

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((curr) => (curr === message ? null : curr));
    }, 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    // 1. Admin login support (admin@gmail.com / 123456789)
    if (cleanEmail === 'admin@gmail.com' && password === '123456789') {
      const mockAdmin = {
        id: 'admin-tirazy',
        email: 'admin@gmail.com',
        role: 'admin',
        name: 'Admin Tirazy',
      };
      try {
        localStorage.setItem('tirazy_auth_mock', JSON.stringify(mockAdmin));
        document.cookie = 'tirazy_mock_user=admin@gmail.com; path=/; max-age=86400; SameSite=Lax';
      } catch (err) {}

      setToastMessage('Welcome back, Admin Tirazy.');
      setTimeout(() => {
        const redirectParams = new URLSearchParams(window.location.search);
        const redirectUrl = redirectParams.get('redirect');
        router.push(redirectUrl || '/admin');
      }, 1000);
      return;
    }

    // 2. Regular user login support (a@gmail.com / 123456789)
    if (cleanEmail === 'a@gmail.com' && password === '123456789') {
      const mockUser = {
        id: '0936d63a-4596-4b41-985a-d844025fd72f',
        email: 'a@gmail.com',
        role: 'artisan',
        name: 'Lina Benyahia',
      };
      try {
        localStorage.setItem('tirazy_auth_mock', JSON.stringify(mockUser));
        document.cookie = 'tirazy_mock_user=a@gmail.com; path=/; max-age=86400; SameSite=Lax';
      } catch (err) {}

      setToastMessage('Welcome back, Lina Benyahia.');
      setTimeout(() => {
        const redirectParams = new URLSearchParams(window.location.search);
        const redirectUrl = redirectParams.get('redirect');
        router.push(redirectUrl || '/user');
      }, 1000);
      return;
    }

    // Standard Supabase login
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
      return;
    }

    // Retrieve name from profile or metadata if available
    let greetingName = 'Artisan';
    if (data?.user?.user_metadata?.full_name) {
      greetingName = data.user.user_metadata.full_name;
    }

    // Display welcome toast
    setToastMessage(`Welcome back, ${greetingName}.`);

    // Redirect to user workspace or original page after 1.5 seconds
    setTimeout(() => {
      const redirectParams = new URLSearchParams(window.location.search);
      const redirectUrl = redirectParams.get('redirect');
      router.push(redirectUrl || '/user');
    }, 1500);
  };

  return (
    <div className="stitch-screen-wrapper bg-background min-h-screen flex items-center justify-center py-20 px-margin-mobile md:px-margin-desktop relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 font-label-md animate-in fade-in slide-in-from-bottom-4 duration-300">
          <span className="material-symbols-outlined text-[20px] text-primary">verified_user</span>
          {toastMessage}
        </div>
      )}

      {/* Top Left Logo Link */}
      <div className="absolute top-8 left-8">
        <Link href="/">
          <Logo className="h-10 w-auto object-contain" />
        </Link>
      </div>

      <main className="w-full max-w-[1000px] flex gap-12 items-center">
        
        {/* Left Side Visual (Hidden on mobile) */}
        <div className="hidden lg:flex flex-col flex-1 gap-6">
          <h1 className="font-headline-md text-headline-md text-primary leading-tight">
            Welcome back to the Algerian textile network.
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-sm">
            Access your atelier, manage your portfolio, and connect with top artisans and designers.
          </p>
          <div className="relative w-full aspect-[4/5] rounded-[24px] overflow-hidden shadow-2xl">
            <img
              alt="Textile Craftsmanship"
              className="absolute inset-0 w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1_P_McTG6T0r-whpcZdGCSlyUaXrI1MwnJmc2c1uCQIgnTMkcmjQePR4E0iqjzI9t5kr8kjvVf5QevPKD5Ve9LTrT5tjsSbTL1_5MNCmtpuX7prZ8NYXODi3v4sI5m5toKfyFK6PImnOKRXUcJiYrfORJWgGjV-hBdVsOI2HaibmvzU4Gdfn0003AHZxXpazS8xSXnS2DlYTgJYX7WJaQ0zrKyLiFwccjhqX-8fEzOhAKK2tk8JpRoAFYXhRYqacq1fug_WHvrOk"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <span className="inline-block px-3 py-1 bg-surface-container-lowest/90 rounded-full font-label-md text-label-md text-primary mb-2">
                Featured Atelier
              </span>
              <p className="text-white font-title-lg text-title-lg">Maison de Couture Algiers</p>
            </div>
          </div>
        </div>

        {/* Login Form Panel */}
        <div className="flex-1 w-full max-w-md">
          <div className="glass-card rounded-[32px] p-8 border border-surface-container-high bg-white/75 backdrop-blur-md shadow-xl">
            
            <div className="mb-8">
              <h2 className="font-headline-sm text-headline-sm text-on-surface mb-1">
                Welcome Back
              </h2>
              <p className="font-body-md text-[13px] text-on-surface-variant leading-relaxed">
                Continue building your professional presence in Algeria’s textile community.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* Email Address */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    className="w-full rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest py-3 px-4 font-body-md text-on-surface placeholder:text-outline/50 transition-all"
                    id="email"
                    placeholder="amine@tirazy.dz"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setError(null);
                      setEmail(e.target.value);
                    }}
                  />
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="password">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!email.trim()) {
                          setError('Please enter your email address first.');
                          return;
                        }
                        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
                          redirectTo: `${window.location.origin}/update-password`,
                        });
                        if (error) {
                          setError(error.message);
                        } else {
                          triggerToast('Password reset link sent to your email.');
                        }
                      }}
                      className="font-label-md text-[13px] text-primary hover:underline bg-transparent border-0 cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <input
                    className="w-full rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest py-3 px-4 font-body-md text-on-surface placeholder:text-outline/50 transition-all"
                    id="password"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setError(null);
                      setPassword(e.target.value);
                    }}
                  />
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center gap-3">
                <input
                  className="rounded border-outline-variant text-primary focus:ring-primary cursor-pointer w-4 h-4"
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label className="font-body-md text-[13px] text-on-surface-variant leading-none cursor-pointer select-none" htmlFor="remember">
                  Remember me
                </label>
              </div>

              {/* Quick Access Profile Selectors */}
              <div className="pt-2 border-t border-outline-variant/15 space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70 text-center">
                  Quick Access Profiles
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('admin@gmail.com');
                      setPassword('123456789');
                      setError(null);
                    }}
                    className="p-3 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">shield_person</span>
                    <span className="font-bold text-[13px]">Admin</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEmail('a@gmail.com');
                      setPassword('123456789');
                      setError(null);
                    }}
                    className="p-3 rounded-xl border border-outline-variant/30 bg-surface-container-low hover:bg-surface-container text-on-surface transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">person</span>
                    <span className="font-bold text-[13px]">Artisan</span>
                  </button>
                </div>
              </div>

              {error && (
                <span className="text-xs text-error font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">error</span>
                  {error}
                </span>
              )}

              {/* Log In Button */}
              <button
                className="w-full bg-primary text-white font-label-md text-label-md py-4 rounded-full shadow-lg shadow-primary/20 hover:bg-primary-dark hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Log In'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-outline-variant/20 text-center">
              <p className="font-body-md text-sm text-on-surface-variant">
                New to TIRAZY?{' '}
                <Link className="text-primary font-bold hover:underline" href="/register">
                  Create your free account →
                </Link>
              </p>
            </div>

            <div className="mt-6 flex justify-center items-center gap-2 opacity-30">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <span className="font-label-md text-[12px] uppercase tracking-widest">
                Secured Login
              </span>
            </div>

          </div>
        </div>

      </main>

      {/* Background Amazigh Pattern */}
      <div className="fixed bottom-0 right-0 p-12 opacity-5 hidden xl:block pointer-events-none">
        <svg fill="none" height="200" viewBox="0 0 100 100" width="200" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 5L95 50L50 95L5 50L50 5Z" stroke="#076760" strokeWidth="2"></path>
          <path d="M50 15L85 50L50 85L15 50L50 15Z" stroke="#076760" strokeWidth="1"></path>
          <circle cx="50" cy="50" fill="#076760" r="5"></circle>
        </svg>
      </div>

    </div>
  );
}
