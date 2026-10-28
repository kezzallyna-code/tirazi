"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ExploreProvider, useExplore } from '@/components/explore/ExploreContext';
import AvailabilityIndicator from '@/components/ui/AvailabilityIndicator';

function ExploreLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { suggestedArtisans, following, handleFollowToggle, toastMessage, activeCategory, setActiveCategory } = useExplore();

  const navLinks = [
    { name: 'Explore Feed', path: '/explore', icon: 'explore' },
    { name: 'My Posts', path: '/explore/my-posts', icon: 'edit_note' },
    { name: 'Saved Posts', path: '/explore/saved', icon: 'bookmark' },
    { name: 'Following', path: '/explore/following', icon: 'group' },
    { name: 'Messages', path: '/messages', icon: 'mail' },
  ];

  return (
    <div className="stitch-screen-wrapper bg-background min-h-screen">
      <main className="pt-24 pb-12 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto relative">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 font-label-md animate-in fade-in slide-in-from-bottom-4 duration-300">
            <span className="material-symbols-outlined text-[20px] text-primary">info</span>
            {toastMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-[240px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)_280px] gap-6 w-full">
          
          {/* Left Column — Explore Navigation */}
          <aside className="hidden md:block">
            <div className="bg-white dark:bg-surface-container-low p-6 rounded-[24px] border border-outline-variant/30 shadow-sm">
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      href={link.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? 'bg-primary/10 text-primary font-bold'
                          : 'text-on-surface-variant hover:bg-surface-variant/50'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                      <span className="font-label-md">{link.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Categories */}
              <div className="mt-6 pt-6 border-t border-outline-variant/15">
                <h3 className="font-headline-sm text-[16px] text-primary mb-3 px-2">Categories</h3>
                <nav className="flex flex-col gap-0.5">
                  {[
                    'All Categories',
                    'Fashion Design',
                    'Stylisme',
                    'Modélisme',
                    'Couture',
                    'Traditional Clothing',
                    'Crochet',
                    'Embroidery',
                    'Leather Work',
                    'Repair Service'
                  ].map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`text-left px-4 py-2 rounded-xl text-[13px] transition-all font-label-md ${
                        activeCategory === category
                          ? 'bg-surface-variant text-on-surface font-bold'
                          : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          {/* Middle Column — Main content area */}
          <div className="min-w-0">
            {children}
          </div>

          {/* Right Column — Suggested Artisans & Trending */}
          <aside className="hidden lg:block">
            <div className="space-y-6">
              <div className="bg-white dark:bg-surface-container-low p-6 rounded-[24px] border border-outline-variant/30 shadow-sm">
                <h3 className="font-headline-sm text-[18px] text-primary mb-4 pb-2 border-b border-outline-variant/20">
                  Suggested Professionals
                </h3>
                <div className="flex flex-col gap-4">
                  {suggestedArtisans.map((artisan) => {
                    const isFollowing = following.includes(artisan.id);
                    return (
                      <div key={artisan.id} className="flex flex-col gap-3 p-3 rounded-xl hover:bg-surface-container-low/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/20 shadow-sm">
                              <img src={artisan.avatar} alt={artisan.name} className="w-full h-full object-cover" />
                            </div>
                            <AvailabilityIndicator 
                              status={artisan.availability || 'unavailable'} 
                              size="sm" 
                              className="absolute -bottom-0.5 -right-0.5" 
                            />
                          </div>
                          <div className="min-w-0 flex-grow">
                            <div className="flex items-center gap-1">
                              <span className="font-label-md text-[14px] text-on-surface truncate block font-bold leading-normal">
                                {artisan.name}
                              </span>
                              {artisan.verified && (
                                <span className="material-symbols-outlined text-secondary text-[16px] shrink-0" data-weight="fill" title="Verified Artisan">
                                  verified
                                </span>
                              )}
                            </div>
                            <span className="text-[12px] text-on-surface-variant truncate block">{artisan.specialization}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleFollowToggle(artisan.id)}
                            className={`flex-grow py-1.5 px-3 rounded-full text-[12px] font-bold transition-all active:scale-95 ${
                              isFollowing 
                                ? 'bg-outline-variant/20 text-on-surface-variant border border-outline-variant/20' 
                                : 'bg-primary text-on-primary hover:bg-primary-dark shadow-sm'
                            }`}
                          >
                            {isFollowing ? 'Following' : 'Follow'}
                          </button>
                          <Link 
                            href={`/messages?recipient=${artisan.id}`}
                            className="p-1.5 px-3 border border-outline-variant rounded-full text-on-surface-variant hover:bg-surface-container transition-colors flex items-center justify-center shrink-0"
                            title="Message"
                          >
                            <span className="material-symbols-outlined text-[16px]">mail</span>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                  <Link href="/artisans" className="text-[13px] text-primary hover:underline font-label-md mt-2 block text-center">
                    View All Artisans →
                  </Link>
                </div>
              </div>

              <div className="bg-white dark:bg-surface-container-low p-6 rounded-[24px] border border-outline-variant/30 shadow-sm">
                <h3 className="font-headline-sm text-[18px] text-primary mb-4 pb-2 border-b border-outline-variant/20">
                  Trending Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Traditional Karakou',
                    'Haute Couture',
                    'Hand Embroidery',
                    'Bridal Couture',
                    'Silk Weaving',
                    'Leather Craft'
                  ].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setActiveCategory(tag)}
                      className="px-3 py-1.5 bg-surface-variant/50 hover:bg-primary/10 text-on-surface-variant hover:text-primary rounded-lg text-[12px] font-label-md transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return (
    <ExploreProvider>
      <ExploreLayoutContent>{children}</ExploreLayoutContent>
    </ExploreProvider>
  );
}
