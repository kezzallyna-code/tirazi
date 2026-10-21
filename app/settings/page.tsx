"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { MACHINERY_EQUIPMENT_OPTIONS } from '@/utils/equipment';
import { AvailabilityIndicator, AvailabilityStatus } from '@/components/ui/AvailabilityIndicator';

export default function SettingsPage() {
  // Active Tab state
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy' | 'language'>('profile');

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((curr) => (curr === message ? null : curr));
    }, 2500);
  };

  // Profile Details state
  const [fullName, setFullName] = useState('Lina Benyahia');
  const [emailAddress, setEmailAddress] = useState('lina.benyahia@example.com');
  const [specialization, setSpecialization] = useState('Fashion Designer');
  const [location, setLocation] = useState('Alger, Algeria');
  const [aboutMe, setAboutMe] = useState(
    'I create contemporary Algerian fashion inspired by traditional craftsmanship and modern silhouettes.'
  );
  const [avatarUrl, setAvatarUrl] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuANf5msGfpBwraVf80zGPy0n3JBSPQp6MJnVF9YgMG58-etwGk_a54lmk8QfX1EXbv_uilQ--5g1qGqkj96Jq1s1HxQHwrKM6G_8JXsDi61ArduC2YHPX5ze6HdbARr2B9o5apGNiSMVlfuqennc3iCRJIveZmPd62P4gyjNBOTihnjFjw_D11zWSkiNWJOe3Z6RVlGJURqPC2HDH2q0aCLd_2puyyNjN6gV3ToAS27HUt0Pgw4OeZJWV2jaKEJ_mkq1zOIZGRgRo4');

  // Client Requirement 1: Phone Contact & Visibility
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneVisible, setPhoneVisible] = useState(false);

  // Client Requirement 2: Availability Status
  const [availabilityStatus, setAvailabilityStatus] = useState<AvailabilityStatus>('unavailable');

  // Client Requirement 3: Machinery & Equipment
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Restore cached / local values first
      try {
        const localExtra = localStorage.getItem('tirazy_profile_extra');
        if (localExtra) {
          const parsed = JSON.parse(localExtra);
          if (parsed.phoneNumber !== undefined) setPhoneNumber(parsed.phoneNumber);
          if (parsed.phoneVisible !== undefined) setPhoneVisible(Boolean(parsed.phoneVisible));
          if (parsed.availabilityStatus) setAvailabilityStatus(parsed.availabilityStatus);
          if (Array.isArray(parsed.equipment)) setSelectedEquipment(parsed.equipment);
        }
      } catch (e) {}

      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setEmailAddress(session.user.email || '');

        // Try selecting with new columns first
        const { data: fullProfile, error: fullError } = await supabase
          .from('profiles')
          .select(`
            full_name,
            bio,
            wilaya,
            avatar_url,
            phone_number,
            phone_visible,
            availability_status,
            equipment,
            profile_roles (
              roles ( name )
            )
          `)
          .eq('id', session.user.id)
          .single();

        let profileData: any = fullProfile;

        if (fullError || !fullProfile) {
          // Fallback to basic columns if table migration is pending
          const { data: basicProfile } = await supabase
            .from('profiles')
            .select(`
              full_name,
              bio,
              wilaya,
              avatar_url,
              profile_roles (
                roles ( name )
              )
            `)
            .eq('id', session.user.id)
            .single();
          profileData = basicProfile;
        } else {
          if (fullProfile.phone_number !== undefined && fullProfile.phone_number !== null) {
            setPhoneNumber(fullProfile.phone_number);
          }
          if (fullProfile.phone_visible !== undefined && fullProfile.phone_visible !== null) {
            setPhoneVisible(Boolean(fullProfile.phone_visible));
          }
          if (fullProfile.availability_status) {
            setAvailabilityStatus(fullProfile.availability_status as AvailabilityStatus);
          }
          if (Array.isArray(fullProfile.equipment)) {
            setSelectedEquipment(fullProfile.equipment);
          }
        }

        if (profileData) {
          if (profileData.full_name) setFullName(profileData.full_name);
          if (profileData.bio) setAboutMe(profileData.bio);
          if (profileData.wilaya) setLocation(profileData.wilaya);
          if (profileData.avatar_url) setAvatarUrl(profileData.avatar_url);
          
          const roles = profileData.profile_roles?.map((pr: any) => pr.roles?.name);
          if (roles && roles.length > 0) {
            setSpecialization(roles.join(' · '));
          }
        }
      }
    };
    fetchData();
  }, []);

  const [isSaving, setIsSaving] = useState(false);

  const handleToggleEquipment = (option: string) => {
    setSelectedEquipment((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Save locally immediately to guarantee persistence
    try {
      localStorage.setItem(
        'tirazy_profile_extra',
        JSON.stringify({
          phoneNumber,
          phoneVisible,
          availabilityStatus,
          equipment: selectedEquipment,
        })
      );
    } catch (e) {}

    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
      // Try updating with all columns
      const { error: fullError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          bio: aboutMe,
          wilaya: location,
          phone_number: phoneNumber.trim() || null,
          phone_visible: phoneVisible,
          availability_status: availabilityStatus,
          equipment: selectedEquipment,
        })
        .eq('id', session.user.id);

      if (fullError) {
        // Fallback update for basic columns
        await supabase
          .from('profiles')
          .update({
            full_name: fullName,
            bio: aboutMe,
            wilaya: location,
          })
          .eq('id', session.user.id);
      }
      showToast('Profile changes saved.');
    } else {
      showToast('Profile changes saved.');
    }

    setIsSaving(false);
  };

  // Notification states
  const [notifComments, setNotifComments] = useState(true);
  const [notifAppreciations, setNotifAppreciations] = useState(true);
  const [notifFollowers, setNotifFollowers] = useState(false);
  const [notifMessages, setNotifMessages] = useState(true);
  const [notifUpdates, setNotifUpdates] = useState(false);

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Notification preferences saved.");
  };

  // Privacy states
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [allowDMs, setAllowDMs] = useState<'everyone' | 'followers'>('everyone');
  const [showLocation, setShowLocation] = useState(true);

  const handleSavePrivacy = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Privacy settings saved.");
  };

  // Language states
  const [displayLanguage, setDisplayLanguage] = useState<'en' | 'fr' | 'ar'>('en');

  const handleSaveLanguage = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Language preference saved.");
  };

  return (
    <div className="stitch-screen-wrapper bg-background min-h-screen">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 font-label-md animate-in fade-in slide-in-from-bottom-4 duration-300">
          <span className="material-symbols-outlined text-[20px] text-primary">info</span>
          {toastMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-24 pb-12 w-full">
        
        {/* Left Column — User Summary and Tab Nav */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          
          {/* Summary Card */}
          <div className="bg-white dark:bg-surface-container-low p-6 rounded-[24px] border border-outline-variant/20 shadow-sm flex flex-col items-center text-center">
            <div className="relative w-20 h-20 rounded-full border-2 border-outline-variant/30 shadow-sm mb-4">
              <img 
                src={avatarUrl} 
                alt={fullName} 
                className="w-full h-full rounded-full object-cover" 
              />
              <AvailabilityIndicator 
                status={availabilityStatus} 
                size="md" 
                className="absolute bottom-0 right-0" 
              />
            </div>
            <h3 className="font-title-lg text-title-lg text-on-surface font-bold leading-normal mb-1">
              {fullName}
            </h3>
            <p className="text-[13px] text-on-surface-variant/90 font-sans mb-4">
              {specialization} &middot; {location}
            </p>
            
            <div className="w-full flex flex-col gap-2 mt-2">
              <Link 
                href="/explore" 
                className="w-full bg-primary text-on-primary py-2.5 px-4 rounded-full font-label-md text-label-md hover:bg-primary-dark hover:shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                Create Post
              </Link>
              <Link 
                href="/publish" 
                className="w-full bg-transparent border-2 border-primary text-primary py-2.5 px-4 rounded-full font-label-md text-label-md hover:bg-primary/5 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                Create Project
              </Link>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="bg-white dark:bg-surface-container-low p-4 rounded-[24px] border border-outline-variant/20 shadow-sm">
            <nav className="flex flex-col gap-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'profile'
                    ? 'bg-primary/10 text-primary font-bold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-variant/30'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">person</span>
                <span className="font-label-md">Profile</span>
              </button>
              
              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'notifications'
                    ? 'bg-primary/10 text-primary font-bold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-variant/30'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                <span className="font-label-md">Notifications</span>
              </button>
              
              <button
                onClick={() => setActiveTab('privacy')}
                className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'privacy'
                    ? 'bg-primary/10 text-primary font-bold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-variant/30'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">security</span>
                <span className="font-label-md">Privacy</span>
              </button>
              
              <button
                onClick={() => setActiveTab('language')}
                className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'language'
                    ? 'bg-primary/10 text-primary font-bold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-variant/30'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">language</span>
                <span className="font-label-md">Language</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Right Column — Tab Content Panels */}
        <div className="lg:col-span-8 xl:col-span-9">
          
          {/* PROFILE PANEL */}
          {activeTab === 'profile' && (
            <section className="bg-white dark:bg-surface-container-low rounded-[24px] p-8 shadow-[0_10px_30px_rgba(75,153,145,0.05)] border border-primary/5 animate-in fade-in duration-300">
              <h3 className="font-headline-sm text-headline-sm mb-6 flex items-center gap-3 text-primary">
                <span className="material-symbols-outlined">person</span>
                Profile Details
              </h3>
              
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="font-label-md text-label-md text-on-surface-variant ml-1">
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-[#E8DED3] focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 transition-all outline-none"
                      type="text"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="emailAddress" className="font-label-md text-label-md text-on-surface-variant ml-1">
                      Email Address
                    </label>
                    <input
                      id="emailAddress"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-[#E8DED3] focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 transition-all outline-none"
                      type="email"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="specialization" className="font-label-md text-label-md text-on-surface-variant ml-1">
                      Specialization
                    </label>
                    <input
                      id="specialization"
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-[#E8DED3] focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 transition-all outline-none"
                      type="text"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="location" className="font-label-md text-label-md text-on-surface-variant ml-1">
                      Wilaya / City
                    </label>
                    <input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-[#E8DED3] focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 transition-all outline-none"
                      type="text"
                      required
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label htmlFor="aboutMe" className="font-label-md text-label-md text-on-surface-variant ml-1">
                      About Me
                    </label>
                    <textarea
                      id="aboutMe"
                      value={aboutMe}
                      onChange={(e) => setAboutMe(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-[#E8DED3] focus:border-primary rounded-xl px-4 py-3 transition-all outline-none resize-none font-body-md"
                      rows={5}
                      required
                    />
                  </div>

                  {/* Client Requirement 2: Availability Status */}
                  <div className="md:col-span-2 space-y-3 pt-4 border-t border-outline-variant/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-label-md text-label-md text-on-surface font-bold flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-[20px]">schedule</span>
                          Professional Availability Status
                        </label>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          Indicate your current project workload and readiness for new commissions.
                        </p>
                      </div>
                      <AvailabilityIndicator status={availabilityStatus} size="md" showLabel />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      {[
                        {
                          id: 'available' as AvailabilityStatus,
                          label: 'Available',
                          desc: 'Ready for new projects & orders',
                          dotClass: 'bg-emerald-500',
                          borderActive: 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20',
                        },
                        {
                          id: 'busy' as AvailabilityStatus,
                          label: 'Busy',
                          desc: 'Limited capacity / in-progress work',
                          dotClass: 'bg-amber-500',
                          borderActive: 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20',
                        },
                        {
                          id: 'unavailable' as AvailabilityStatus,
                          label: 'Unavailable',
                          desc: 'Not accepting new commissions',
                          dotClass: 'bg-gray-400',
                          borderActive: 'border-gray-400 bg-gray-50/50 dark:bg-gray-900/20',
                        },
                      ].map((item) => {
                        const isSelected = availabilityStatus === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setAvailabilityStatus(item.id)}
                            className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col gap-1 cursor-pointer ${
                              isSelected
                                ? `${item.borderActive} shadow-sm`
                                : 'border-outline-variant/30 hover:border-outline-variant hover:bg-surface-container-lowest'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className={`w-3 h-3 rounded-full ${item.dotClass} shadow-xs shrink-0`} />
                              <span className="font-label-md text-sm text-on-surface font-bold">
                                {item.label}
                              </span>
                              {isSelected && (
                                <span className="material-symbols-outlined text-primary text-[16px] ml-auto">
                                  check_circle
                                </span>
                              )}
                            </div>
                            <span className="text-[12px] text-on-surface-variant leading-tight pl-5">
                              {item.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Client Requirement 1: Phone Contact Details & Visibility */}
                  <div className="md:col-span-2 space-y-4 pt-4 border-t border-outline-variant/20">
                    <div>
                      <label className="font-label-md text-label-md text-on-surface font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[20px]">call</span>
                        Direct Contact Preferences (Call & WhatsApp)
                      </label>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Allow clients and collaborating ateliers to reach you directly via phone or WhatsApp.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="phoneNumber" className="text-xs font-semibold text-on-surface-variant ml-1">
                          Phone Number
                        </label>
                        <div className="relative">
                          <input
                            id="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="e.g. 0555 12 34 56 or +213 555 12 34 56"
                            type="tel"
                            className="w-full bg-surface-container-lowest border border-[#E8DED3] focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 pl-10 transition-all outline-none text-sm"
                          />
                          <span className="material-symbols-outlined text-[18px] text-outline absolute left-3 top-3.5">
                            phone_iphone
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center pt-6">
                        <label className="flex items-start gap-3 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={phoneVisible}
                            onChange={(e) => setPhoneVisible(e.target.checked)}
                            className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 mt-0.5 cursor-pointer"
                          />
                          <div>
                            <span className="font-label-md text-sm text-on-surface block leading-tight font-medium">
                              Display phone number on public profile
                            </span>
                            <span className="text-xs text-on-surface-variant/80 block mt-0.5 leading-snug">
                              Enables the Call and WhatsApp buttons on your public profile. If disabled, these buttons are hidden or disabled.
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Client Requirement 3: Machinery & Equipment */}
                  <div className="md:col-span-2 space-y-3 pt-4 border-t border-outline-variant/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-label-md text-label-md text-on-surface font-bold flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-[20px]">precision_manufacturing</span>
                          Machinery & Equipment
                        </label>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          Select the specialized machines and tools available in your atelier ({selectedEquipment.length} selected).
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                      {MACHINERY_EQUIPMENT_OPTIONS.map((item) => {
                        const isChecked = selectedEquipment.includes(item);
                        return (
                          <label
                            key={item}
                            className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                              isChecked
                                ? 'bg-primary/5 border-primary/40 shadow-xs'
                                : 'border-outline-variant/30 hover:border-outline-variant/60 hover:bg-surface-container-lowest'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleEquipment(item)}
                              className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 cursor-pointer shrink-0"
                            />
                            <span className={`text-[13px] leading-tight font-sans ${isChecked ? 'text-primary font-bold' : 'text-on-surface'}`}>
                              {item}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-primary text-white font-label-md text-label-md px-8 py-3 rounded-full hover:shadow-lg active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSaving && <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* NOTIFICATIONS PANEL */}
          {activeTab === 'notifications' && (
            <section className="bg-white dark:bg-surface-container-low rounded-[24px] p-8 shadow-[0_10px_30px_rgba(75,153,145,0.05)] border border-primary/5 animate-in fade-in duration-300">
              <h3 className="font-headline-sm text-headline-sm mb-6 flex items-center gap-3 text-primary">
                <span className="material-symbols-outlined">notifications</span>
                Notifications
              </h3>
              
              <form onSubmit={handleSaveNotifications} className="space-y-6">
                <div className="space-y-6">
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-label-md text-label-md text-on-surface" id="comment-label">
                        New comments on my posts
                      </p>
                      <p className="text-sm text-on-surface-variant" id="comment-desc">
                        Notify when someone leaves a comment on your shared update
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={notifComments}
                        onChange={(e) => setNotifComments(e.target.checked)}
                        className="sr-only peer" 
                        aria-labelledby="comment-label" 
                        aria-describedby="comment-desc" 
                      />
                      <div className="w-12 h-6 bg-outline-variant rounded-full p-1 transition-all peer-focus:ring-2 peer-focus:ring-primary peer-focus:ring-offset-2 peer-checked:bg-primary">
                        <div className="w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-6"></div>
                      </div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-label-md text-label-md text-on-surface" id="appreciation-label">
                        New appreciations on my posts
                      </p>
                      <p className="text-sm text-on-surface-variant" id="appreciation-desc">
                        Notify when someone appreciates your work post
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={notifAppreciations}
                        onChange={(e) => setNotifAppreciations(e.target.checked)}
                        className="sr-only peer" 
                        aria-labelledby="appreciation-label" 
                        aria-describedby="appreciation-desc" 
                      />
                      <div className="w-12 h-6 bg-outline-variant rounded-full p-1 transition-all peer-focus:ring-2 peer-focus:ring-primary peer-focus:ring-offset-2 peer-checked:bg-primary">
                        <div className="w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-6"></div>
                      </div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-label-md text-label-md text-on-surface" id="followers-label">
                        New followers
                      </p>
                      <p className="text-sm text-on-surface-variant" id="followers-desc">
                        Notify when a new designer or artisan starts following you
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={notifFollowers}
                        onChange={(e) => setNotifFollowers(e.target.checked)}
                        className="sr-only peer" 
                        aria-labelledby="followers-label" 
                        aria-describedby="followers-desc" 
                      />
                      <div className="w-12 h-6 bg-outline-variant rounded-full p-1 transition-all peer-focus:ring-2 peer-focus:ring-primary peer-focus:ring-offset-2 peer-checked:bg-primary">
                        <div className="w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-6"></div>
                      </div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-label-md text-label-md text-on-surface" id="dm-label">
                        Direct messages
                      </p>
                      <p className="text-sm text-on-surface-variant" id="dm-desc">
                        Notify when you receive private messages from connections
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={notifMessages}
                        onChange={(e) => setNotifMessages(e.target.checked)}
                        className="sr-only peer" 
                        aria-labelledby="dm-label" 
                        aria-describedby="dm-desc" 
                      />
                      <div className="w-12 h-6 bg-outline-variant rounded-full p-1 transition-all peer-focus:ring-2 peer-focus:ring-primary peer-focus:ring-offset-2 peer-checked:bg-primary">
                        <div className="w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-6"></div>
                      </div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-label-md text-label-md text-on-surface" id="updates-label">
                        Platform updates
                      </p>
                      <p className="text-sm text-on-surface-variant" id="updates-desc">
                        Periodic digests, features, and Mediterranean community news
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={notifUpdates}
                        onChange={(e) => setNotifUpdates(e.target.checked)}
                        className="sr-only peer" 
                        aria-labelledby="updates-label" 
                        aria-describedby="updates-desc" 
                      />
                      <div className="w-12 h-6 bg-outline-variant rounded-full p-1 transition-all peer-focus:ring-2 peer-focus:ring-primary peer-focus:ring-offset-2 peer-checked:bg-primary">
                        <div className="w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-6"></div>
                      </div>
                    </label>
                  </div>

                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    className="bg-primary text-white font-label-md text-label-md px-8 py-3 rounded-full hover:shadow-lg active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    Save Notification Preferences
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* PRIVACY PANEL */}
          {activeTab === 'privacy' && (
            <section className="bg-white dark:bg-surface-container-low rounded-[24px] p-8 shadow-[0_10px_30px_rgba(75,153,145,0.05)] border border-primary/5 animate-in fade-in duration-300">
              <h3 className="font-headline-sm text-headline-sm mb-6 flex items-center gap-3 text-primary">
                <span className="material-symbols-outlined">security</span>
                Privacy
              </h3>
              
              <form onSubmit={handleSavePrivacy} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  
                  <div className="space-y-2">
                    <label htmlFor="visibility" className="font-label-md text-label-md text-on-surface-variant ml-1">
                      Profile visibility
                    </label>
                    <select
                      id="visibility"
                      value={visibility}
                      onChange={(e) => setVisibility(e.target.value as any)}
                      className="w-full bg-surface-container-low border border-transparent focus:bg-white focus:border-primary rounded-xl px-4 py-3 outline-none transition-all cursor-pointer font-body-md"
                    >
                      <option value="public">Public (Visible to anyone on the internet)</option>
                      <option value="private">Private (Visible only to approved connections)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="allowDMs" className="font-label-md text-label-md text-on-surface-variant ml-1">
                      Allow direct messages
                    </label>
                    <select
                      id="allowDMs"
                      value={allowDMs}
                      onChange={(e) => setAllowDMs(e.target.value as any)}
                      className="w-full bg-surface-container-low border border-transparent focus:bg-white focus:border-primary rounded-xl px-4 py-3 outline-none transition-all cursor-pointer font-body-md"
                    >
                      <option value="everyone">Everyone</option>
                      <option value="followers">Followers only</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <p className="font-label-md text-label-md text-on-surface" id="location-label">
                        Show my location on profile
                      </p>
                      <p className="text-sm text-on-surface-variant" id="location-desc">
                        Display your Wilaya/City in public listings
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={showLocation}
                        onChange={(e) => setShowLocation(e.target.checked)}
                        className="sr-only peer" 
                        aria-labelledby="location-label" 
                        aria-describedby="location-desc" 
                      />
                      <div className="w-12 h-6 bg-outline-variant rounded-full p-1 transition-all peer-focus:ring-2 peer-focus:ring-primary peer-focus:ring-offset-2 peer-checked:bg-primary">
                        <div className="w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-6"></div>
                      </div>
                    </label>
                  </div>

                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    className="bg-primary text-white font-label-md text-label-md px-8 py-3 rounded-full hover:shadow-lg active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    Save Privacy Settings
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* LANGUAGE PANEL */}
          {activeTab === 'language' && (
            <section className="bg-white dark:bg-surface-container-low rounded-[24px] p-8 shadow-[0_10px_30px_rgba(75,153,145,0.05)] border border-primary/5 animate-in fade-in duration-300">
              <h3 className="font-headline-sm text-headline-sm mb-6 flex items-center gap-3 text-primary">
                <span className="material-symbols-outlined">language</span>
                Language
              </h3>
              
              <form onSubmit={handleSaveLanguage} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <label className="font-label-md text-label-md text-on-surface-variant ml-1 mb-2 block" id="lang-label">
                      Display Language
                    </label>
                    <div className="flex items-center gap-3 flex-wrap" role="group" aria-labelledby="lang-label">
                      <button
                        type="button"
                        onClick={() => setDisplayLanguage('en')}
                        aria-pressed={displayLanguage === 'en'}
                        className={`px-6 py-2.5 rounded-full border transition-all font-label-md text-[13px] focus:outline-none focus:ring-2 focus:ring-primary ${
                          displayLanguage === 'en'
                            ? 'border-primary bg-primary/10 text-primary font-bold'
                            : 'border-outline-variant text-on-surface-variant hover:border-primary'
                        }`}
                      >
                        English
                      </button>
                      <button
                        type="button"
                        onClick={() => setDisplayLanguage('fr')}
                        aria-pressed={displayLanguage === 'fr'}
                        className={`px-6 py-2.5 rounded-full border transition-all font-label-md text-[13px] focus:outline-none focus:ring-2 focus:ring-primary ${
                          displayLanguage === 'fr'
                            ? 'border-primary bg-primary/10 text-primary font-bold'
                            : 'border-outline-variant text-on-surface-variant hover:border-primary'
                        }`}
                      >
                        Français
                      </button>
                      <button
                        type="button"
                        onClick={() => setDisplayLanguage('ar')}
                        aria-pressed={displayLanguage === 'ar'}
                        className={`px-6 py-2.5 rounded-full border transition-all font-label-md text-[13px] focus:outline-none focus:ring-2 focus:ring-primary ${
                          displayLanguage === 'ar'
                            ? 'border-primary bg-primary/10 text-primary font-bold'
                            : 'border-outline-variant text-on-surface-variant hover:border-primary'
                        }`}
                      >
                        العربية
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    className="bg-primary text-white font-label-md text-label-md px-8 py-3 rounded-full hover:shadow-lg active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    Save Language Preference
                  </button>
                </div>
              </form>
            </section>
          )}

        </div>

      </div>

    </div>
  );
}
