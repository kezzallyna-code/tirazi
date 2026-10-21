"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserPreviewSidebar } from '@/components/user-preview/UserPreviewSidebar';
import { UserOverview } from '@/components/user-preview/UserOverview';
import { createClient } from '@/utils/supabase/client';
import { ExploreProvider, useExplore } from '@/components/explore/ExploreContext';
import { PostCard } from '@/components/explore/PostCard';

interface Project {
  id: string;
  title: string;
  category: string;
  wilaya: string;
  views: number;
  appreciations: number;
  image: string;
}

function UserPreviewPageContent() {
  const { posts, savedPostIds } = useExplore();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<string | null>(null);

  // User Profile state initialized empty
  const [profile, setProfile] = useState<{
    fullName: string;
    roles: string[];
    wilaya: string;
    experience: string;
    bio: string;
    avatarUrl: string;
  }>({
    fullName: '',
    roles: [],
    wilaya: '',
    experience: '',
    bio: '',
    avatarUrl: '/images/default-avatar.png',
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [savedProjects, setSavedProjects] = useState<Project[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Selected subscription plan
  const [selectedPlan, setSelectedPlan] = useState<string>('free');

  // Load registration onboarding profile and plan if available in localStorage
  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setCurrentUserId(session.user.id);
        // Fetch Profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select(`
            full_name,
            bio,
            wilaya,
            experience_level,
            subscription_plan,
            avatar_url,
            profile_roles (
              roles ( name )
            )
          `)
          .eq('id', session.user.id)
          .single();

        if (profileData) {
          setProfile({
            fullName: profileData.full_name || 'Lina Benyahia',
            roles: profileData.profile_roles?.map((pr: any) => pr.roles?.name) || ['Fashion Designer'],
            wilaya: profileData.wilaya || 'Alger',
            experience: profileData.experience_level || 'Experienced',
            bio: profileData.bio || 'Passionate about textile arts.',
            avatarUrl: profileData.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
          });
          setSelectedPlan(profileData.subscription_plan || 'free');
        }

        // Fetch Projects
        const { data: projectsData } = await supabase
          .from('projects')
          .select(`
            id,
            title,
            category_id,
            wilaya,
            project_media ( media_url )
          `)
          .eq('author_id', session.user.id)
          .order('created_at', { ascending: false });

        if (projectsData) {
          const formattedProjects = projectsData.map((p: any) => ({
            id: p.id,
            title: p.title,
            category: 'Project', // we could join categories, keeping simple for now
            wilaya: p.wilaya || 'Alger',
            views: 0,
            appreciations: 0,
            image: p.project_media?.[0]?.media_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
          }));
          setProjects(formattedProjects);
        }

        // Fetch Saved Projects
        const { data: savedProjectsData } = await supabase
          .from('saved_projects')
          .select(`
            project_id,
            projects (
              id,
              title,
              category_id,
              wilaya,
              project_media ( media_url )
            )
          `)
          .eq('profile_id', session.user.id);

        if (savedProjectsData) {
          const formattedSavedProjects = savedProjectsData.map((sp: any) => {
            const p = sp.projects;
            if (!p) return null;
            return {
              id: p.id,
              title: p.title,
              category: 'Project',
              wilaya: p.wilaya || 'Alger',
              views: 0,
              appreciations: 0,
              image: p.project_media?.[0]?.media_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
            };
          }).filter(Boolean);
          setSavedProjects(formattedSavedProjects as any);
        }
      } else {
        // Load mock user session if logged in as a@gmail.com or admin@gmail.com
        try {
          const mockAuth = JSON.parse(localStorage.getItem('tirazy_auth_mock') || 'null');
          if (mockAuth) {
            setCurrentUserId(mockAuth.id);
            setProfile({
              fullName: mockAuth.name || 'Lina Benyahia',
              roles: [mockAuth.role === 'admin' ? 'Administrator' : 'Fashion Designer'],
              wilaya: 'Algiers',
              experience: 'Master Level',
              bio: 'Passionate about traditional Algerian craftsmanship and contemporary textile creations.',
              avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
            });
            setSelectedPlan('premium_pro');
            setProjects([
              {
                id: 'demo-proj-1',
                title: 'Modern Karakou Velvet Collection',
                category: 'Couture',
                wilaya: 'Algiers',
                views: 342,
                appreciations: 89,
                image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=800'
              },
              {
                id: 'demo-proj-2',
                title: 'Amazigh Hand-Embroidered Silk Shawls',
                category: 'Embroidery',
                wilaya: 'Tizi Ouzou',
                views: 512,
                appreciations: 124,
                image: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?auto=format&fit=crop&q=80&w=800'
              }
            ]);
          }
        } catch (e) {}
      }
    };
    
    fetchData();
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((curr) => (curr === message ? null : curr));
    }, 3000);
  };

  const handleDeleteClick = (id: string) => {
    setShowConfirmModal(id);
  };

  const confirmDeleteProject = () => {
    if (showConfirmModal) {
      setProjects((prev) => prev.filter((p) => p.id !== showConfirmModal));
      setShowConfirmModal(null);
      showToast('Project removed from your portfolio.');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <UserOverview
            userData={profile}
            selectedPlan={selectedPlan}
            userProjects={projects}
            onPublishProject={() => showToast('Project publishing will be available soon.')}
            showToast={showToast}
          />
        );
      
      case 'profile':
        return (
          <div className="bg-white dark:bg-surface-container-low p-8 rounded-[24px] border border-outline-variant/10 shadow-sm space-y-8 animate-in fade-in duration-300">
            <div>
              <h3 className="font-title-lg text-title-lg text-primary font-serif">Profile Preview</h3>
              <p className="text-[12px] text-on-surface-variant/80 mt-0.5">Manage and preview how others discover your profile.</p>
            </div>

            {/* Profile Card Layout */}
            <div className="border border-outline-variant/20 rounded-2xl overflow-hidden bg-surface-container/20">
              {/* Cover image placeholder */}
              <div className="h-36 bg-gradient-to-r from-primary/30 to-secondary/30 relative">
                <div className="absolute inset-0 textile-grid opacity-10"></div>
              </div>
              <div className="px-6 pb-6 relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 -mt-12">
                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-surface shrink-0 bg-surface shadow-md">
                    <img src={profile.avatarUrl} alt={profile.fullName} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1 pb-1">
                    <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                      <h4 className="font-title-lg text-on-surface font-bold">{profile.fullName}</h4>
                      {selectedPlan === 'pro' && (
                        <span className="material-symbols-outlined text-secondary text-[20px]" data-weight="fill">
                          verified
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] text-on-surface-variant font-medium">{profile.roles.join(' · ')}</p>
                    <p className="text-[11px] text-on-surface-variant/70 flex items-center gap-0.5 justify-center sm:justify-start">
                      <span className="material-symbols-outlined text-[13px]">location_on</span>
                      {profile.wilaya} &middot; {profile.experience} level
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <Link
                    href="/settings"
                    className="px-5 py-2 bg-primary text-on-primary rounded-full font-label-md text-xs shadow-sm hover:shadow-md transition-all active:scale-95"
                  >
                    Edit Profile
                  </Link>
                  <button
                    onClick={() => showToast('Public profile view will be available in production.')}
                    className="px-5 py-2 border border-outline rounded-full text-on-surface hover:bg-surface-container-low transition-colors font-label-md text-xs cursor-pointer"
                  >
                    View Public Profile
                  </button>
                </div>
              </div>

              {/* Bio Section */}
              <div className="px-6 pb-6 border-t border-outline-variant/10 pt-4 bg-surface-container-low/20">
                <h5 className="font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant mb-1 font-bold">Biography</h5>
                <p className="text-[13px] text-on-surface-variant leading-relaxed italic">
                  "{profile.bio}"
                </p>
              </div>
            </div>
          </div>
        );

      case 'portfolio':
        return (
          <div className="bg-white dark:bg-surface-container-low p-8 rounded-[24px] border border-outline-variant/10 shadow-sm space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-outline-variant/10 pb-4">
              <div>
                <h3 className="font-title-lg text-title-lg text-primary font-serif">My Portfolio</h3>
                <p className="text-[12px] text-on-surface-variant/80 mt-0.5">Manage your showcased projects and creations.</p>
              </div>
              <Link
                href="/publish"
                className="px-5 py-2 bg-primary text-on-primary rounded-full font-label-md text-xs shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                Create Project
              </Link>
            </div>

            {projects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((proj) => (
                  <div key={proj.id} className="bg-white dark:bg-surface-container-lowest rounded-[24px] border border-outline-variant/10 overflow-hidden shadow-sm flex flex-col group hover:-translate-y-1 transition-all duration-300">
                    <div className="relative h-36 bg-surface-container-high overflow-hidden">
                      <img src={proj.image} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <span className="text-[9px] font-bold text-primary uppercase tracking-wider mb-1">{proj.category}</span>
                      <h4 className="font-label-md text-on-surface font-bold line-clamp-1 leading-normal mb-1">{proj.title}</h4>
                      <p className="text-[10px] text-on-surface-variant flex items-center gap-0.5 mb-4">
                        <span className="material-symbols-outlined text-[12px]">location_on</span>
                        {proj.wilaya}
                      </p>

                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-outline-variant/5">
                        <div className="flex gap-2 text-[10px] text-on-surface-variant/75">
                          <span className="flex items-center gap-0.5"><span className="material-symbols-outlined text-[12px]">visibility</span>{proj.views}</span>
                          <span className="flex items-center gap-0.5"><span className="material-symbols-outlined text-[12px]">thumb_up</span>{proj.appreciations}</span>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => showToast('Project editing will be available soon.')}
                            className="p-1.5 border border-outline-variant rounded-full text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                            title="Edit project"
                          >
                            <span className="material-symbols-outlined text-[14px]">edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(proj.id)}
                            className="p-1.5 border border-outline-variant rounded-full text-error hover:bg-error-container/20 transition-colors cursor-pointer"
                            title="Delete project"
                          >
                            <span className="material-symbols-outlined text-[14px]">delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center border-2 border-dashed border-outline-variant/30 rounded-2xl text-on-surface-variant/50 max-w-sm mx-auto space-y-4">
                <span className="material-symbols-outlined text-[48px] text-outline/25">draw</span>
                <div className="space-y-1">
                  <p className="font-title-lg text-sm text-on-surface font-bold">Your portfolio is ready for its first creation.</p>
                  <p className="text-[11px] text-on-surface-variant/80">Showcase your textile work and professional projects.</p>
                </div>
                <Link
                  href="/projects"
                  className="px-6 py-2 border border-primary text-primary hover:bg-primary/5 rounded-full font-label-md text-xs transition-all active:scale-95 inline-block"
                >
                  Explore Projects
                </Link>
              </div>
            )}
          </div>
        );

      case 'posts': {
        const myPosts = currentUserId ? posts.filter((post) => post.artisan.id === currentUserId) : [];
        return (
          <div className="bg-white dark:bg-surface-container-low p-8 rounded-[24px] border border-outline-variant/10 shadow-sm space-y-6 animate-in fade-in duration-300">
            <div>
              <h3 className="font-title-lg text-title-lg text-primary font-serif">My Posts</h3>
              <p className="text-[12px] text-on-surface-variant/80 mt-0.5">Manage the text thought updates or questions you shared.</p>
            </div>
            
            {myPosts.length > 0 ? (
              <div className="space-y-6">
                {myPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center border-2 border-dashed border-outline-variant/30 rounded-2xl text-on-surface-variant/50 max-w-sm mx-auto space-y-4">
                <span className="material-symbols-outlined text-[48px] text-outline/25">feed</span>
                <div className="space-y-1">
                  <p className="font-title-lg text-sm text-on-surface font-bold">You have not shared any posts yet.</p>
                  <p className="text-[11px] text-on-surface-variant/80">Share your first thought, textile tip, or atelier update.</p>
                </div>
                <Link
                  href="/explore"
                  className="px-6 py-2 bg-primary text-on-primary rounded-full font-label-md text-xs shadow-sm hover:bg-primary-dark transition-all active:scale-95 inline-block"
                >
                  Create a Post
                </Link>
              </div>
            )}
          </div>
        );
      }

      case 'saved': {
        const savedPostsList = posts.filter(post => savedPostIds.includes(post.id));
        const hasSaved = savedPostsList.length > 0 || savedProjects.length > 0;
        
        return (
          <div className="bg-white dark:bg-surface-container-low p-8 rounded-[24px] border border-outline-variant/10 shadow-sm space-y-6 animate-in fade-in duration-300">
            <div>
              <h3 className="font-title-lg text-title-lg text-primary font-serif">Saved Inspirations</h3>
              <p className="text-[12px] text-on-surface-variant/80 mt-0.5">Quickly revisit and filter saved posts and projects.</p>
            </div>
            
            {hasSaved ? (
              <div className="space-y-10">
                {savedPostsList.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-title-md text-primary font-serif">Saved Posts</h4>
                    <div className="space-y-6">
                      {savedPostsList.map((post) => (
                        <PostCard key={post.id} post={post} />
                      ))}
                    </div>
                  </div>
                )}
                
                {savedProjects.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-title-md text-primary font-serif">Saved Projects</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {savedProjects.map((proj) => (
                        <div key={proj.id} className="bg-white dark:bg-surface-container-lowest rounded-[24px] border border-outline-variant/10 overflow-hidden shadow-sm flex flex-col group hover:-translate-y-1 transition-all duration-300">
                          <div className="relative h-36 bg-surface-container-high overflow-hidden">
                            <img src={proj.image} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                          <div className="p-4 flex flex-col flex-grow">
                            <span className="text-[9px] font-bold text-primary uppercase tracking-wider mb-1">{proj.category}</span>
                            <h4 className="font-label-md text-on-surface font-bold line-clamp-1 leading-normal mb-1">{proj.title}</h4>
                            <p className="text-[10px] text-on-surface-variant flex items-center gap-0.5 mb-4">
                              <span className="material-symbols-outlined text-[12px]">location_on</span>
                              {proj.wilaya}
                            </p>
                            <div className="flex items-center justify-between mt-auto pt-3 border-t border-outline-variant/5">
                              <div className="flex gap-2 text-[10px] text-on-surface-variant/75">
                                <span className="flex items-center gap-0.5"><span className="material-symbols-outlined text-[12px]">visibility</span>{proj.views}</span>
                                <span className="flex items-center gap-0.5"><span className="material-symbols-outlined text-[12px]">thumb_up</span>{proj.appreciations}</span>
                              </div>
                              <Link
                                href="/projects"
                                className="px-3 py-1 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-full font-label-md text-[10px] transition-colors"
                              >
                                View
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-16 text-center border-2 border-dashed border-outline-variant/30 rounded-2xl text-on-surface-variant/50 max-w-sm mx-auto space-y-4">
                <span className="material-symbols-outlined text-[48px] text-outline/25">bookmark</span>
                <div className="space-y-1">
                  <p className="font-title-lg text-sm text-on-surface font-bold">No saved inspirations yet.</p>
                  <p className="text-[11px] text-on-surface-variant/80">Save posts or projects to revisit them here.</p>
                </div>
                <div className="flex gap-3 justify-center">
                  <Link
                    href="/explore"
                    className="px-6 py-2 border border-primary text-primary hover:bg-primary/5 rounded-full font-label-md text-xs transition-all active:scale-95 inline-block"
                  >
                    Explore Posts
                  </Link>
                  <Link
                    href="/projects"
                    className="px-6 py-2 border border-primary text-primary hover:bg-primary/5 rounded-full font-label-md text-xs transition-all active:scale-95 inline-block"
                  >
                    Explore Projects
                  </Link>
                </div>
              </div>
            )}
          </div>
        );
      }

      case 'messages':
        return (
          <div className="bg-white dark:bg-surface-container-low p-8 rounded-[24px] border border-outline-variant/10 shadow-sm space-y-6 animate-in fade-in duration-300">
            <div>
              <h3 className="font-title-lg text-title-lg text-primary font-serif">Messages</h3>
              <p className="text-[12px] text-on-surface-variant/80 mt-0.5">Private conversations with artisans and designers.</p>
            </div>

            <div className="py-16 text-center border-2 border-dashed border-outline-variant/30 rounded-2xl text-on-surface-variant/50 max-w-sm mx-auto space-y-4">
              <span className="material-symbols-outlined text-[48px] text-outline/25">mail</span>
              <div className="space-y-1">
                <p className="font-title-lg text-sm text-on-surface font-bold">No messages yet.</p>
                <p className="text-[11px] text-on-surface-variant/80">When you connect with artisans, your conversations will appear here.</p>
              </div>
              <Link
                href="/messages"
                className="px-6 py-2 border border-primary text-primary hover:bg-primary/5 rounded-full font-label-md text-xs transition-all active:scale-95 inline-block"
              >
                Open Inbox
              </Link>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="bg-white dark:bg-surface-container-low p-8 rounded-[24px] border border-outline-variant/10 shadow-sm space-y-8 animate-in fade-in duration-300">
            <div>
              <h3 className="font-title-lg text-title-lg text-primary font-serif">Profile Analytics</h3>
              <p className="text-[12px] text-on-surface-variant/80 mt-0.5">Understand how people engage with your creations.</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-surface-container/30 rounded-xl border border-outline-variant/5">
                <span className="text-on-surface-variant/70 block text-[10px] uppercase tracking-wider mb-1">Profile Views</span>
                <span className="text-xl font-bold text-primary">0</span>
              </div>
              <div className="p-4 bg-surface-container/30 rounded-xl border border-outline-variant/5">
                <span className="text-on-surface-variant/70 block text-[10px] uppercase tracking-wider mb-1">Unique Visitors</span>
                <span className="text-xl font-bold text-primary">0</span>
              </div>
              <div className="p-4 bg-surface-container/30 rounded-xl border border-outline-variant/5">
                <span className="text-on-surface-variant/70 block text-[10px] uppercase tracking-wider mb-1">Portfolio Views</span>
                <span className="text-xl font-bold text-primary">0</span>
              </div>
              <div className="p-4 bg-surface-container/30 rounded-xl border border-outline-variant/5">
                <span className="text-on-surface-variant/70 block text-[10px] uppercase tracking-wider mb-1">New Followers</span>
                <span className="text-xl font-bold text-primary">0</span>
              </div>
            </div>

            {/* Recent Profile Visitors */}
            <div className="space-y-4 pt-2">
              <h4 className="font-title-lg text-[15px] text-primary font-serif">Recent Profile Visitors</h4>
              <div className="py-6 text-center text-on-surface-variant/50 border border-outline-variant/20 rounded-2xl bg-surface-container/10">
                <p className="text-sm">No recent profile visitors to show.</p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/analytics"
                className="px-6 py-2.5 bg-primary text-on-primary rounded-full font-label-md text-xs shadow-sm hover:bg-primary-dark transition-all active:scale-95 flex items-center gap-1.5 w-fit"
              >
                <span className="material-symbols-outlined text-[16px]">insights</span>
                View Full Analytics
              </Link>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="bg-white dark:bg-surface-container-low p-8 rounded-[24px] border border-outline-variant/10 shadow-sm space-y-6 animate-in fade-in duration-300">
            <div>
              <h3 className="font-title-lg text-title-lg text-primary font-serif">Account Settings</h3>
              <p className="text-[12px] text-on-surface-variant/80 mt-0.5">Manage your profile details, privacy, notifications, and language preferences.</p>
            </div>

            <div className="pt-2">
              <Link
                href="/settings"
                className="px-6 py-2.5 bg-primary text-on-primary rounded-full font-label-md text-xs shadow-sm hover:bg-primary-dark transition-all active:scale-95 flex items-center gap-1.5 w-fit"
              >
                <span className="material-symbols-outlined text-[16px]">settings</span>
                Open Settings
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-background min-h-screen w-full pt-24 pb-16 px-margin-mobile md:px-margin-desktop">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 font-label-md animate-in fade-in slide-in-from-bottom-4 duration-300">
          <span className="material-symbols-outlined text-[20px] text-primary">info</span>
          {toastMessage}
        </div>
      )}

      {/* Custom Confirmation Modal for deletion */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-surface-container p-6 rounded-[28px] max-w-sm w-full space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 border border-outline-variant/30 text-left">
            <div className="space-y-2">
              <h3 className="font-headline-sm text-lg text-primary font-serif">Remove Project?</h3>
              <p className="text-[13px] text-on-surface-variant leading-relaxed">
                Are you sure you want to remove this project from your portfolio? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowConfirmModal(null)}
                className="px-5 py-2.5 border border-outline rounded-full text-on-surface font-label-md text-xs hover:bg-surface-container transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteProject}
                className="px-5 py-2.5 bg-error text-on-error rounded-full font-label-md text-xs shadow-md hover:bg-error-container hover:text-on-error-container transition-colors cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-container-max mx-auto space-y-8">
        
        {/* User Preview Banner Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white dark:bg-surface-container-low rounded-[24px] border border-outline-variant/30 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
            <span className="font-label-lg text-primary font-bold uppercase tracking-wider text-sm">
              User Dashboard Workspace
            </span>
          </div>
          <span className="text-[12px] text-on-surface-variant/70 italic">
            This dashboard demonstrates layout views for registered users.
          </span>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
          
          {/* Sidebar */}
          <div className="w-full">
            <UserPreviewSidebar 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              userName={profile.fullName || 'Lina Benyahia'}
              userRole={profile.roles.length > 0 ? profile.roles.join(' · ') : 'Fashion Designer'}
              userLocation={profile.wilaya || 'Alger'}
            />
          </div>

          {/* Main content pane */}
          <main className="min-w-0">
            {renderTabContent()}
          </main>

        </div>
      </div>
    </div>
  );
}

export default function UserPreviewPage() {
  return (
    <ExploreProvider>
      <UserPreviewPageContent />
    </ExploreProvider>
  );
}
