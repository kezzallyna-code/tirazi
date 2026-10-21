"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/Logo';
import { createClient } from '@/utils/supabase/client';
import AvailabilityIndicator from '@/components/ui/AvailabilityIndicator';

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session?.user) {
        // Try fetching with availability_status
        let res = await supabase
          .from('profiles')
          .select(`
            full_name,
            avatar_url,
            availability_status,
            profile_roles (
              roles ( name )
            )
          `)
          .eq('id', session.user.id)
          .single();

        if (res.error) {
          // Fallback if column not yet added
          res = await supabase
            .from('profiles')
            .select(`
              full_name,
              avatar_url,
              profile_roles (
                roles ( name )
              )
            `)
            .eq('id', session.user.id)
            .single();
        }

        if (!res.error && res.data) {
          // Overlay local extra if available
          let extra: any = {};
          try {
            extra = JSON.parse(localStorage.getItem('tirazy_profile_extra') || '{}');
          } catch (e) {}
          setProfile({
            ...res.data,
            availability_status: res.data.availability_status || extra.availability_status || 'available'
          });
        }
      } else {
        // Check mock login credentials
        try {
          const mockUser = JSON.parse(localStorage.getItem('tirazy_auth_mock') || 'null');
          if (mockUser) {
            setSession({ user: { id: mockUser.id, email: mockUser.email } });
            setProfile({
              full_name: mockUser.name,
              avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
              availability_status: 'available',
              profile_roles: [{ roles: { name: mockUser.role === 'admin' ? 'Administrator' : 'Fashion Designer' } }]
            });
          }
        } catch (e) {}
      }
      setIsLoading(false);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      setSession(currentSession);
      if (!currentSession) {
        setProfile(null);
      } else if (!profile) {
        fetchSession();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Close on Escape & click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isProfileDropdownOpen) {
        setIsProfileDropdownOpen(false);
      }
    };
    
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Artisans', path: '/artisans' },
    { name: 'Explore', path: '/explore' },
  ];

  const handleLogout = async () => {
    setIsProfileDropdownOpen(false);
    try {
      localStorage.removeItem('tirazy_auth_mock');
      document.cookie = 'tirazy_mock_user=; path=/; max-age=0';
    } catch (e) {}
    await supabase.auth.signOut();
    // Use the route to clear server cookies as well
    await fetch('/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  const displayName = profile?.full_name || 'Lina Benyahia';
  const displayRole = profile?.profile_roles?.[0]?.roles?.name || 'Fashion Designer';
  const displayAvatar = profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256';

  if (pathname?.startsWith('/admin')) {
    return (
      <nav className="fixed top-0 left-0 w-full z-50 bg-surface/90 dark:bg-surface-dim/90 backdrop-blur-md shadow-sm border-b border-outline-variant/20">
        <div className="flex justify-between items-center px-4 md:px-12 py-3 max-w-container-max mx-auto">
          <Link href="/admin" className="focus:outline-none focus:ring-2 focus:ring-primary rounded-lg flex items-center gap-3">
            <Logo className="h-10 w-auto object-contain" />
            <span className="font-bold text-primary font-serif hidden md:block">Admin Console</span>
          </Link>
          <Link href="/" className="text-sm font-bold text-on-surface-variant hover:text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            Return to Site
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-surface/90 dark:bg-surface-dim/90 backdrop-blur-md shadow-sm border-b border-outline-variant/20">
      <div className="flex justify-between items-center px-4 md:px-12 py-3 max-w-container-max mx-auto">
        
        <div className="flex items-center gap-4">
          <button 
            className="lg:hidden p-2 text-on-surface-variant hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="material-symbols-outlined text-[28px]">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
          <Link href="/" className="focus:outline-none focus:ring-2 focus:ring-primary rounded-lg">
            <Logo className="h-10 w-auto object-contain" />
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-8 font-label-md text-label-md">
          {navLinks.map((link) => {
            const isActive = pathname === link.path || (link.path !== '/' && pathname?.startsWith(link.path));
            return (
              <Link 
                key={link.name}
                href={link.path}
                className={`transition-colors font-bold relative py-2 focus:outline-none focus:ring-2 focus:ring-primary rounded-md px-2 ${
                  isActive 
                    ? 'text-primary' 
                    : 'text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-inverse-primary'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-t-full"></span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          {!isLoading && !session ? (
            <>
              <Link href="/login" className="font-label-md text-label-md font-bold text-on-surface-variant hover:text-primary transition-colors hidden md:block focus:outline-none focus:ring-2 focus:ring-primary rounded-lg px-3 py-2">
                Log In
              </Link>
              <Link href="/register" className="px-6 py-2 bg-primary text-on-primary font-label-md text-label-md rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                Join the Atelier
              </Link>
            </>
          ) : !isLoading && session ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                className="flex items-center gap-2 p-1 rounded-full hover:bg-surface-variant/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                aria-haspopup="true"
                aria-expanded={isProfileDropdownOpen}
                aria-label="User profile menu"
              >
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-surface-variant shadow-sm">
                    <img 
                      src={displayAvatar} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <AvailabilityIndicator 
                    status={profile?.availability_status || 'available'}
                    size="sm"
                    className="absolute -bottom-0.5 -right-0.5"
                  />
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-[20px] hidden md:block">
                  expand_more
                </span>
              </button>

              {isProfileDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsProfileDropdownOpen(false)}
                    aria-hidden="true"
                  ></div>
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-surface-container-high rounded-2xl shadow-xl border border-outline-variant/20 z-50 overflow-hidden transform origin-top-right transition-all">
                    <div className="p-4 border-b border-outline-variant/20 bg-surface-container-low/50">
                      <p className="font-title-lg text-title-lg text-on-surface">{displayName}</p>
                      <p className="font-label-md text-label-md text-on-surface-variant truncate">{displayRole}</p>
                    </div>
                    <div className="flex flex-col py-2">
                      <Link href={`/profile/${session.user.id}`} className="flex items-center gap-3 px-4 py-3 text-on-surface hover:bg-surface-variant/50 transition-colors focus:bg-surface-variant/50 focus:outline-none" onClick={() => setIsProfileDropdownOpen(false)}>
                        <span className="material-symbols-outlined text-[20px]">person</span>
                        <span className="font-label-md">My Profile</span>
                      </Link>
                      <Link href="/user" className="flex items-center gap-3 px-4 py-3 text-on-surface hover:bg-surface-variant/50 transition-colors focus:bg-surface-variant/50 focus:outline-none" onClick={() => setIsProfileDropdownOpen(false)}>
                        <span className="material-symbols-outlined text-[20px]">dashboard</span>
                        <span className="font-label-md">My Dashboard</span>
                      </Link>
                      <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-on-surface hover:bg-surface-variant/50 transition-colors focus:bg-surface-variant/50 focus:outline-none" onClick={() => setIsProfileDropdownOpen(false)}>
                        <span className="material-symbols-outlined text-[20px]">settings</span>
                        <span className="font-label-md">Settings</span>
                      </Link>
                      <Link href="/messages" className="flex items-center gap-3 px-4 py-3 text-on-surface hover:bg-surface-variant/50 transition-colors focus:bg-surface-variant/50 focus:outline-none" onClick={() => setIsProfileDropdownOpen(false)}>
                        <span className="material-symbols-outlined text-[20px]">mail</span>
                        <span className="font-label-md">Messages</span>
                      </Link>
                      <div className="h-px bg-outline-variant/20 my-1"></div>
                      <button className="flex items-center gap-3 px-4 py-3 text-error hover:bg-error-container/20 transition-colors w-full text-left focus:bg-error-container/20 focus:outline-none" onClick={handleLogout}>
                        <span className="material-symbols-outlined text-[20px]">logout</span>
                        <span className="font-label-md">Log Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-surface-variant/30 animate-pulse"></div>
          )}
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-surface dark:bg-surface-dim border-b border-outline-variant/20 shadow-lg animate-in slide-in-from-top-2">
          <div className="flex flex-col py-4 px-6 gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.path || (link.path !== '/' && pathname?.startsWith(link.path));
              return (
                <Link 
                  key={link.name}
                  href={link.path}
                  className={`flex items-center px-4 py-3 rounded-xl transition-colors font-bold font-label-md text-label-md ${
                    isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-on-surface-variant hover:bg-surface-variant/50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
