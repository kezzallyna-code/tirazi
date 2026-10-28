"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { OnboardingData } from '@/components/onboarding/types';
import { Step1 } from '@/components/onboarding/Step1';
import { Step2 } from '@/components/onboarding/Step2';
import { Step3 } from '@/components/onboarding/Step3';
import { Step4 } from '@/components/onboarding/Step4';
import { SuccessStep } from '@/components/onboarding/SuccessStep';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

const STEP_LABELS = [
  'Basic Information',
  'Professional Roles',
  'Location & Experience',
  'Complete Profile',
];

import { createClient } from '@/utils/supabase/client';
import { validateEquipment } from '@/utils/equipment';

function RegisterWizard() {
  const searchParams = useSearchParams();
  const rawPlan = searchParams.get('plan');
  
  let initialPlan = 'free';
  if (rawPlan === 'premium-basic' || rawPlan === 'premium-pro') {
    initialPlan = rawPlan;
  }

  const [step, setStep] = useState<number>(1);
  const [data, setData] = useState<OnboardingData>({
    fullName: '',
    email: '',
    password: '',
    roles: [],
    wilaya: '',
    experience: '',
    bio: '',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    selectedPlan: initialPlan
  });
  
  const [globalError, setGlobalError] = useState<string | null>(null);
  const supabase = createClient();

  const updateData = (newData: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setStep((prev) => prev - 1);
  };

  const generateUsername = (fullName: string) => {
    const slug = fullName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return `${slug}-${randomDigits}`;
  };

  const handleSignupSubmit = async (finalData: OnboardingData) => {
    setGlobalError(null);
    try {
      // 1. Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: finalData.email,
        password: finalData.password || '',
        options: {
          data: {
            full_name: finalData.fullName,
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Failed to create user.");

      const userId = authData.user.id;
      let finalAvatarUrl = finalData.avatarUrl;

      // 2. Upload custom avatar if exists
      if (finalData.avatarFile) {
        const fileExt = finalData.avatarFile.name.split('.').pop();
        const safeName = finalData.avatarFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
        const fileName = `${Date.now()}-${safeName}`;
        const filePath = `${userId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, finalData.avatarFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          throw new Error(`Avatar upload failed: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
        finalAvatarUrl = publicUrlData.publicUrl;
      }

      // Update data state so Success step has the right URL
      updateData({ avatarUrl: finalAvatarUrl });

      // 3. Generate unique username
      let username = generateUsername(finalData.fullName);
      
      const validEquipment = validateEquipment(finalData.equipment);
      
      // Cache extra profile details locally for fallback
      try {
        localStorage.setItem('tirazy_profile_extra', JSON.stringify({
          equipment: validEquipment,
          availabilityStatus: 'unavailable',
        }));
      } catch (e) {}

      // 4. Update profile record
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          username: username,
          avatar_url: finalAvatarUrl,
          bio: finalData.bio,
          wilaya: finalData.wilaya,
          experience_level: finalData.experience,
          equipment: validEquipment,
        })
        .eq('id', userId);

      if (profileError) {
        // If username conflict, try once more with different random digits
        if (profileError.code === '23505') { 
          username = generateUsername(finalData.fullName);
          const { error: retryError } = await supabase
            .from('profiles')
            .update({
              username: username,
              avatar_url: finalAvatarUrl,
              bio: finalData.bio,
              wilaya: finalData.wilaya,
              experience_level: finalData.experience,
              equipment: validEquipment,
            })
            .eq('id', userId);
            
          if (retryError) throw new Error(`Profile update failed: ${retryError.message}`);
        } else {
          // If equipment column not present yet, fallback to update without equipment
          await supabase
            .from('profiles')
            .update({
              username: username,
              avatar_url: finalAvatarUrl,
              bio: finalData.bio,
              wilaya: finalData.wilaya,
              experience_level: finalData.experience,
            })
            .eq('id', userId);
        }
      }

      // 5. Insert roles
      if (finalData.roles.length > 0) {
        // First get the role IDs for the selected roles
        const { data: rolesData, error: rolesError } = await supabase
          .from('roles')
          .select('id, name');
          
        if (!rolesError && rolesData) {
          const selectedRoleIds = finalData.roles
            .map(roleName => {
              const role = rolesData.find(r => r.name.toLowerCase() === roleName.toLowerCase());
              return role ? role.id : null;
            })
            .filter(Boolean);

          if (selectedRoleIds.length > 0) {
            const roleInserts = selectedRoleIds.map(roleId => ({
              profile_id: userId,
              role_id: roleId
            }));

            const { error: profileRolesError } = await supabase
              .from('profile_roles')
              .insert(roleInserts);

            if (profileRolesError) {
              console.error('Failed to insert roles:', profileRolesError);
              // Not throwing here to allow registration to complete even if roles fail
            }
          }
        }
      }

      handleNext();
    } catch (err: any) {
      console.error(err);
      setGlobalError(err.message || 'An unexpected error occurred during signup.');
      throw err; // throw so Step4 can catch it and reset loading state
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 data={data} updateData={updateData} onNext={handleNext} />;
      case 2:
        return <Step2 data={data} updateData={updateData} onNext={handleNext} onPrev={handlePrev} />;
      case 3:
        return <Step3 data={data} updateData={updateData} onNext={handleNext} onPrev={handlePrev} />;
      case 4:
        return <Step4 data={data} updateData={updateData} onFinish={() => {}} onPrev={handlePrev} onSubmit={handleSignupSubmit} globalError={globalError} />;
      case 5:
        return <SuccessStep data={data} />;
      default:
        return null;
    }
  };

  return (
    <div className="stitch-screen-wrapper bg-background min-h-screen flex items-center justify-center py-20 px-margin-mobile md:px-margin-desktop relative">
      
      {/* Top Left Logo Link */}
      <div className="absolute top-8 left-8">
        <Link href="/">
          <Logo className="h-10 w-auto object-contain" />
        </Link>
      </div>

      <main className="w-full max-w-[1100px] flex gap-12 items-center">
        
        {/* Left Editorial Visual Section (Hidden on success and on mobile) */}
        {step < 5 && (
          <div className="hidden lg:flex flex-col flex-1 gap-6">
            <h1 className="font-headline-md text-headline-md text-primary leading-tight">
              Craft your professional identity in the Algerian textile world.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-sm">
              Join a specialized network of artisans, designers, and manufacturers dedicated to Mediterranean excellence.
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
        )}

        {/* Wizard Form Panel */}
        <div className={`flex-grow w-full ${step === 5 ? 'max-w-xl mx-auto' : 'max-w-xl'}`}>
          <div className="glass-card rounded-[32px] p-8 border border-surface-container-high bg-white/75 backdrop-blur-md shadow-xl">
            
            {/* Step Indicators and Header */}
            {step < 5 && (
              <div className="mb-6 space-y-4">
                {/* Selected Plan Display */}
                <div className="flex justify-between items-center bg-surface-container-low p-3 rounded-xl border border-outline-variant/30 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-primary">workspace_premium</span>
                    <span className="text-[13px] text-on-surface-variant">
                      Selected Plan: <strong className="text-primary">{initialPlan === 'premium-pro' ? 'Premium Pro' : initialPlan === 'premium-basic' ? 'Premium Basic' : 'Free'}</strong>
                    </span>
                  </div>
                  <Link href="/join" className="text-[12px] text-primary underline font-medium hover:text-primary-dark transition-colors">
                    Change Plan
                  </Link>
                </div>

                {/* Step Indicator Header (Trail on desktop, text on mobile) */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[11px] font-bold text-primary tracking-wider uppercase">
                    <span>Step {step} of 4</span>
                    <span>{Math.round(((step - 1) / 3) * 100)}% Complete</span>
                  </div>

                  {/* Horizontal step trail for larger screens */}
                  <div className="hidden sm:flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-on-surface-variant/50">
                    {STEP_LABELS.map((label, index) => {
                      const isCurrent = step === index + 1;
                      const isCompleted = step > index + 1;
                      return (
                        <React.Fragment key={label}>
                          <span
                            className={
                              isCurrent
                                ? 'text-primary'
                                : isCompleted
                                ? 'text-primary/70 line-through'
                                : 'text-on-surface-variant/45'
                            }
                          >
                            {label}
                          </span>
                          {index < STEP_LABELS.length - 1 && (
                            <span className="text-on-surface-variant/30 select-none">→</span>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                  
                  {/* Progress Bar Track */}
                  <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${(step / 4) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-2 border-t border-outline-variant/10">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface mb-1">
                    {STEP_LABELS[step - 1]}
                  </h2>
                </div>
              </div>
            )}

            {/* Render current step component */}
            <div className="mt-4">
              {renderStep()}
            </div>

            {/* Bottom Footer message on Step 1 */}
            {step === 1 && (
              <div className="mt-8 pt-6 border-t border-outline-variant/20 flex justify-center items-center gap-2 opacity-50">
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                <span className="font-label-md text-[12px] uppercase tracking-widest">
                  Secured Artisan Network
                </span>
              </div>
            )}

          </div>
        </div>

      </main>

      {/* Decorative Amazigh Pattern BG element */}
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

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
      <RegisterWizard />
    </Suspense>
  );
}
