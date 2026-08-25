"use client";

import React, { useState } from 'react';
import { AdminSidebar } from '@/components/admin-preview/AdminSidebar';
import { AdminOverview } from '@/components/admin-preview/AdminOverview';
import { AdminUserManagement } from '@/components/admin-preview/AdminUserManagement';
import { AdminPostModeration } from '@/components/admin-preview/AdminPostModeration';
import { AdminReports } from '@/components/admin-preview/AdminReports';
import { AdminArtisanVerification } from '@/components/admin-preview/AdminArtisanVerification';
import { AdminCategoryManagement } from '@/components/admin-preview/AdminCategoryManagement';
import { AdminPlatformActivity } from '@/components/admin-preview/AdminPlatformActivity';

export default function AdminPreviewPage() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(curr => curr === msg ? null : curr);
    }, 2500);
  };

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminName, setAdminName] = useState<string>('');

  React.useEffect(() => {
    const checkAdmin = async () => {
      const { createClient } = await import('@/utils/supabase/client');
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      
      const { data } = await supabase
        .from('profiles')
        .select(`
          full_name,
          profile_roles!inner (
            roles!inner ( name )
          )
        `)
        .eq('id', session.user.id)
        .single();
        
      const hasAdminRole = data?.profile_roles?.some(
        (pr: any) => pr.roles?.name.toLowerCase() === 'admin'
      );

      if (hasAdminRole) {
        setIsAuthenticated(true);
        setAdminName(data?.full_name || 'Admin');
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };
    checkAdmin();
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview />;
      case 'users':
        return <AdminUserManagement triggerToast={triggerToast} />;
      case 'posts':
        return <AdminPostModeration triggerToast={triggerToast} />;
      case 'reports':
        return <AdminReports triggerToast={triggerToast} />;
      case 'verifications':
        return <AdminArtisanVerification triggerToast={triggerToast} />;
      case 'categories':
        return <AdminCategoryManagement triggerToast={triggerToast} />;
      case 'activity':
        return <AdminPlatformActivity />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen w-full flex items-center justify-center">
        <span className="material-symbols-outlined text-primary text-[36px] animate-spin">
          progress_activity
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-background min-h-screen w-full flex flex-col items-center justify-center px-4">
        <div className="bg-white dark:bg-surface-container-low p-8 rounded-[24px] border border-outline-variant/30 shadow-sm max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-2 text-error">
            <span className="material-symbols-outlined text-[32px]">security</span>
          </div>
          <div>
            <h2 className="font-title-lg text-title-lg text-on-surface font-bold">Access Denied</h2>
            <p className="text-on-surface-variant text-sm mt-2">You do not have the required administrator privileges to access this console.</p>
          </div>
          <a
            href="/"
            className="w-full inline-block bg-primary text-white font-label-md px-4 py-3 rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all"
          >
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen w-full pt-24 pb-16 px-margin-mobile md:px-margin-desktop">
      <div className="max-w-container-max mx-auto space-y-8">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 font-label-md animate-in fade-in slide-in-from-bottom-4 duration-300">
            <span className="material-symbols-outlined text-[20px] text-primary">info</span>
            {toastMessage}
          </div>
        )}

        {/* Admin Preview Mode Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white dark:bg-surface-container-low rounded-[24px] border border-outline-variant/30 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-pulse"></span>
            <span className="font-label-lg text-tertiary font-bold uppercase tracking-wider">
              Admin Preview Mode
            </span>
          </div>
          <span className="text-[12px] text-on-surface-variant/70 italic">
            Prototype demonstration console. Database operations are mocked locally.
          </span>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
          
          {/* Sidebar */}
          <div className="w-full">
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* Tab Viewport */}
          <main className="min-w-0">
            {renderTabContent()}
          </main>

        </div>

      </div>
    </div>
  );
}
