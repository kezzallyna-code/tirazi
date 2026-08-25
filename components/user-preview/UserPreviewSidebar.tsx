import React from 'react';
import Link from 'next/link';

interface SidebarItem {
  id: string;
  name: string;
  icon: string;
}

interface UserPreviewSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userName?: string;
  userRole?: string;
  userLocation?: string;
}

export function UserPreviewSidebar({ 
  activeTab, 
  setActiveTab, 
  userName = 'Lina Benyahia', 
  userRole = 'Fashion Designer', 
  userLocation = 'Alger' 
}: UserPreviewSidebarProps) {
  const sidebarItems: SidebarItem[] = [
    { id: 'overview', name: 'Overview', icon: 'dashboard' },
    { id: 'profile', name: 'My Profile', icon: 'person' },
    { id: 'portfolio', name: 'My Portfolio', icon: 'palette' },
    { id: 'posts', name: 'My Posts', icon: 'feed' },
    { id: 'saved', name: 'Saved Posts', icon: 'bookmark' },
    { id: 'messages', name: 'Messages', icon: 'mail' },
    { id: 'analytics', name: 'Analytics', icon: 'insights' },
    { id: 'settings', name: 'Settings', icon: 'settings' },
  ];

  return (
    <div className="w-full">
      {/* Desktop Sidebar Layout */}
      <aside className="hidden md:flex flex-col gap-2 p-6 bg-white dark:bg-surface-container-low rounded-[24px] border border-outline-variant/20 shadow-sm sticky top-28 w-full">
        <div className="mb-6 px-4">
          <h3 className="font-title-lg text-title-lg text-primary font-serif font-bold">{userName}</h3>
          <p className="text-[12px] text-on-surface-variant font-medium mt-1">{userRole} &middot; {userLocation}</p>
        </div>
        <nav className="flex flex-col gap-1 w-full mb-4">
          {sidebarItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left w-full font-label-md text-label-md ${
                  isActive
                    ? 'bg-primary/10 text-primary font-bold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-variant/30'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                {item.name}
              </button>
            );
          })}
        </nav>
        
        {/* Create Post & Create Project Buttons */}
        <div className="pt-6 border-t border-outline-variant/20 flex flex-col gap-2 w-full">
          <Link href="/explore" className="w-full bg-primary text-on-primary py-2.5 px-4 rounded-full font-label-md text-label-md hover:bg-primary-dark hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
            Create Post
          </Link>
          <Link href="/publish" className="w-full bg-transparent border-2 border-primary text-primary py-2 px-4 rounded-full font-label-md text-label-md hover:bg-primary/5 transition-all active:scale-95 flex items-center justify-center gap-2">
            Create Project
          </Link>
        </div>
      </aside>

      {/* Mobile Tab Bar Layout (Horizontal Scroll) */}
      <div className="md:hidden w-full bg-white dark:bg-surface-container-low border-b border-outline-variant/20 py-2.5 overflow-x-auto scrollbar-none sticky top-16 z-30">
        <nav className="flex px-4 gap-2 min-w-max">
          {sidebarItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-label-md text-[13px] transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-primary text-on-primary font-bold shadow-sm'
                    : 'bg-surface-container/40 text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
