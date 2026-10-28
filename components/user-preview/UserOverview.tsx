import React from 'react';
import Link from 'next/link';
import AvailabilityIndicator from '@/components/ui/AvailabilityIndicator';

interface UserOverviewProps {
  userData: {
    fullName: string;
    roles: string[];
    wilaya: string;
    avatarUrl: string;
    bio: string;
    experience: string;
    availabilityStatus?: string;
  };
  selectedPlan: string;
  userProjects: Array<{
    id: string;
    title: string;
    category: string;
    wilaya: string;
    views: number;
    appreciations: number;
    image: string;
  }>;
  onPublishProject: () => void;
  showToast: (msg: string) => void;
}

const userActivities: Array<{ text: string; time: string; icon: string; color: string }> = [];

export function UserOverview({
  userData,
  selectedPlan,
  userProjects,
  onPublishProject,
  showToast,
}: UserOverviewProps) {
  // Extract user first name
  const firstName = userData.fullName.split(' ')[0] || 'Lina';

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      
      {/* Welcome Area */}
      <div className="bg-white dark:bg-surface-container-low p-6 rounded-[28px] border border-outline-variant/15 shadow-sm flex flex-col sm:flex-row items-center sm:justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="relative w-20 h-20 rounded-full border-2 border-primary/20 bg-surface">
            <img src={userData.avatarUrl} alt={userData.fullName} className="w-full h-full object-cover rounded-full" />
            <div className="absolute bottom-0 right-0 p-0.5 bg-white dark:bg-surface rounded-full shadow-sm">
              <AvailabilityIndicator status={userData.availabilityStatus || 'unavailable'} size="md" />
            </div>
          </div>
          <div>
            <h2 className="font-headline-sm text-headline-sm text-primary mb-1">
              Welcome back, {firstName}
            </h2>
            <p className="font-body-md text-sm text-on-surface-variant/80">
              Here is what is happening with your professional presence.
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mt-2">
              <span className="text-[12px] text-on-surface font-semibold">
                {userData.fullName}
              </span>
              <span className="text-on-surface-variant/50 text-[11px]">&middot;</span>
              <span className="text-[12px] text-on-surface-variant">
                {userData.roles.join(' · ')}
              </span>
              <span className="text-on-surface-variant/50 text-[11px]">&middot;</span>
              <span className="text-[12px] text-on-surface-variant flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[14px]">location_on</span>
                {userData.wilaya || 'Alger'}
              </span>
              <span className="text-on-surface-variant/50 text-[11px]">&middot;</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                selectedPlan === 'pro'
                  ? 'bg-secondary text-on-secondary shadow-sm'
                  : selectedPlan === 'basic'
                  ? 'bg-primary/20 text-primary-dark border border-primary/10'
                  : 'bg-outline-variant/30 text-on-surface-variant'
              }`}>
                {selectedPlan === 'pro' ? 'Premium Pro' : selectedPlan === 'basic' ? 'Premium Basic' : 'Free Plan'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 shrink-0">
          <Link
            href="/settings"
            className="px-6 py-2.5 bg-transparent border border-outline hover:bg-surface-container text-on-surface hover:border-primary font-label-md text-label-md rounded-full transition-all active:scale-95 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            Edit Profile
          </Link>
          <Link
            href="/explore"
            className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-on-primary font-label-md text-label-md rounded-full shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Create Post
          </Link>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-surface-container-low p-6 rounded-[24px] border border-outline-variant/10 shadow-sm">
          <p className="font-label-sm text-[12px] text-on-surface-variant uppercase tracking-wider mb-2">Profile Views</p>
          <div className="flex items-baseline justify-between">
            <span className="font-headline-sm text-primary font-bold">0</span>
            <span className="text-[11px] text-on-surface-variant/40">this week</span>
          </div>
        </div>
        <div className="bg-white dark:bg-surface-container-low p-6 rounded-[24px] border border-outline-variant/10 shadow-sm">
          <p className="font-label-sm text-[12px] text-on-surface-variant uppercase tracking-wider mb-2">Portfolio Projects</p>
          <div className="flex items-baseline justify-between">
            <span className="font-headline-sm text-primary font-bold">{userProjects.length}</span>
            <span className="text-[11px] text-on-surface-variant/40">active</span>
          </div>
        </div>
        <div className="bg-white dark:bg-surface-container-low p-6 rounded-[24px] border border-outline-variant/10 shadow-sm">
          <p className="font-label-sm text-[12px] text-on-surface-variant uppercase tracking-wider mb-2">Post Appreciations</p>
          <div className="flex items-baseline justify-between">
            <span className="font-headline-sm text-primary font-bold">0</span>
            <span className="text-[11px] text-on-surface-variant/40">this week</span>
          </div>
        </div>
        <div className="bg-white dark:bg-surface-container-low p-6 rounded-[24px] border border-outline-variant/10 shadow-sm">
          <p className="font-label-sm text-[12px] text-on-surface-variant uppercase tracking-wider mb-2">New Followers</p>
          <div className="flex items-baseline justify-between">
            <span className="font-headline-sm text-primary font-bold">0</span>
            <span className="text-[11px] text-on-surface-variant/40">this week</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Projects & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: My Portfolio Preview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
            <div>
              <h3 className="font-title-lg text-title-lg text-primary font-serif">My Portfolio</h3>
              <p className="text-[12px] text-on-surface-variant/75 mt-0.5">Your latest professional projects and textile creations.</p>
            </div>
            <div className="flex gap-2">
              <Link 
                href="/projects" 
                className="px-4 py-2 border border-primary text-primary hover:bg-primary/5 rounded-full font-label-md text-[12px] transition-all active:scale-95 flex items-center gap-1"
              >
                View All
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
              <button 
                type="button"
                onClick={onPublishProject}
                className="px-4 py-2 bg-primary text-on-primary hover:bg-primary-dark rounded-full font-label-md text-[12px] transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                Publish
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {userProjects.slice(0, 3).map((proj) => (
              <div key={proj.id} className="bg-white dark:bg-surface-container-low rounded-[24px] border border-outline-variant/10 overflow-hidden shadow-sm flex flex-col group hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-32 bg-surface-container-high overflow-hidden">
                  <img src={proj.image} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <span className="text-[9px] font-bold text-primary uppercase tracking-wider mb-1">{proj.category}</span>
                  <h4 className="font-label-md text-on-surface font-bold line-clamp-1 leading-normal mb-1">{proj.title}</h4>
                  <p className="text-[10px] text-on-surface-variant flex items-center gap-0.5 mb-3">
                    <span className="material-symbols-outlined text-[12px]">location_on</span>
                    {proj.wilaya}
                  </p>
                  <div className="flex justify-between text-[11px] text-on-surface-variant/75 mt-auto pt-2 border-t border-outline-variant/5">
                    <span className="flex items-center gap-0.5"><span className="material-symbols-outlined text-[12px]">visibility</span>{proj.views}</span>
                    <span className="flex items-center gap-0.5"><span className="material-symbols-outlined text-[12px]">thumb_up</span>{proj.appreciations}</span>
                  </div>
                </div>
              </div>
            ))}
            {userProjects.length === 0 && (
              <div className="col-span-3 py-10 text-center border-2 border-dashed border-outline-variant/30 rounded-2xl text-on-surface-variant/50">
                <span className="material-symbols-outlined text-[36px] text-outline/30 mb-2">draw</span>
                <p className="text-sm font-bold">No projects uploaded yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recent Activity Timeline */}
        <div className="space-y-6">
          <div className="border-b border-outline-variant/20 pb-3">
            <h3 className="font-title-lg text-title-lg text-primary font-serif">Recent Activity</h3>
            <p className="text-[12px] text-on-surface-variant/75 mt-0.5">Community engagement alerts.</p>
          </div>
          <div className="space-y-5 bg-white dark:bg-surface-container-low p-6 rounded-[24px] border border-outline-variant/10 shadow-sm">
            {userActivities.length > 0 ? (
              userActivities.map((act, index) => (
                <div key={index} className="flex gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${act.color}`}>
                    <span className="material-symbols-outlined text-[18px]">{act.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] text-on-surface leading-normal">{act.text}</p>
                    <span className="text-[10px] text-on-surface-variant/40 mt-0.5 block">{act.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-on-surface-variant/50">
                <p className="text-sm">No recent activity to show.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Optional Upgrade Card */}
      {selectedPlan !== 'pro' && (
        <div className="bg-gradient-to-r from-primary-dark to-primary text-white p-8 rounded-[28px] border-2 border-secondary shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[24px] animate-pulse">workspace_premium</span>
              <h3 className="font-title-lg text-md text-white font-bold">Grow Your Visibility</h3>
            </div>
            <p className="text-xs text-white/90 leading-relaxed">
              You are currently on the <span className="font-bold capitalize">{selectedPlan || 'Free'} plan</span>. Upgrade to Premium Basic or Premium Pro to access more portfolio space, stronger search visibility, visitor insights, and advanced analytics.
            </p>
          </div>
          <Link
            href="/subscriptions"
            className="px-6 py-3 bg-secondary hover:bg-secondary-dark text-on-secondary font-label-md text-label-md rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 whitespace-nowrap text-center"
          >
            View Plans
          </Link>
        </div>
      )}

      {/* Quick Actions Section */}
      <div className="space-y-4">
        <div className="border-b border-outline-variant/20 pb-2">
          <h3 className="font-title-lg text-title-lg text-primary font-serif">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/explore" className="bg-white dark:bg-surface-container-low hover:bg-primary/5 p-5 rounded-[20px] border border-outline-variant/15 text-center flex flex-col items-center gap-2 transition-colors shadow-sm">
            <span className="material-symbols-outlined text-primary text-[28px]">add_circle</span>
            <span className="font-label-md text-[13px] text-on-surface font-bold">Create a Post</span>
          </Link>
          <Link href="/artisans" className="bg-white dark:bg-surface-container-low hover:bg-primary/5 p-5 rounded-[20px] border border-outline-variant/15 text-center flex flex-col items-center gap-2 transition-colors shadow-sm">
            <span className="material-symbols-outlined text-primary text-[28px]">group</span>
            <span className="font-label-md text-[13px] text-on-surface font-bold">Explore Artisans</span>
          </Link>
          <Link href="/projects" className="bg-white dark:bg-surface-container-low hover:bg-primary/5 p-5 rounded-[20px] border border-outline-variant/15 text-center flex flex-col items-center gap-2 transition-colors shadow-sm">
            <span className="material-symbols-outlined text-primary text-[28px]">work</span>
            <span className="font-label-md text-[13px] text-on-surface font-bold">Browse Projects</span>
          </Link>
          <Link href="/messages" className="bg-white dark:bg-surface-container-low hover:bg-primary/5 p-5 rounded-[20px] border border-outline-variant/15 text-center flex flex-col items-center gap-2 transition-colors shadow-sm">
            <span className="material-symbols-outlined text-primary text-[28px]">mail</span>
            <span className="font-label-md text-[13px] text-on-surface font-bold">Open Messages</span>
          </Link>
        </div>
      </div>

    </div>
  );
}
