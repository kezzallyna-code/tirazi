"use client";

import React, { useState } from 'react';
import Logo from '@/components/Logo';
import Link from 'next/link';

export default function NotificationsPage() {
  const [collabStatus, setCollabStatus] = useState<'pending' | 'accepted' | 'declined'>('pending');
  const [extraLoaded, setExtraLoaded] = useState(false);

  return (
    <div className="stitch-screen-wrapper">
      
      <aside className="hidden lg:flex flex-col gap-2 p-4 h-screen w-64 fixed left-0 top-0 pt-20 bg-surface-container-low transition-all duration-300 ease-in-out overflow-y-auto custom-scrollbar pb-6">
        <div className="flex items-center gap-3 px-2 py-4 mb-4 border-b border-outline-variant/20">
          <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary-container">palette</span>
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface leading-none">Maison de Couture</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">Algiers, DZ</p>
          </div>
        </div>

        <Link 
          href="/publish"
          className="mt-auto mb-8 mx-2 bg-primary text-on-primary py-3 px-4 rounded-full font-label-md text-label-md hover:shadow-lg transition-shadow active:scale-95 duration-200 text-center flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Publish Project
        </Link>
      </aside>

      <main className="pt-24 pb-12 px-4 md:px-margin-desktop max-w-4xl mx-auto lg:ml-72">

        <div className="space-y-12">

          <section>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="font-label-md text-label-md text-primary uppercase tracking-[0.2em]">New</h2>
              <div className="flex-grow h-[1px] bg-outline-variant/30"></div>
            </div>
            <div className="space-y-4">

              {/* Collab Invitation Card */}
              <div className="notification-card group relative bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgba(7,103,96,0.06)] border border-primary/5 hover:border-primary/20 transition-all overflow-hidden">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img 
                      alt="Lina Benali" 
                      className="w-14 h-14 rounded-full object-cover border-2 border-primary-fixed" 
                      data-alt="A portrait of a professional female fashion entrepreneur in Algeria, wearing a stylish modern hijab and blazer. She is smiling confidently in a bright, sunlit creative studio filled with premium fabrics and sketches, capturing a high-end, sophisticated aesthetic." 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhsVpQaphEaGZUQqYlLAxksXB-h9_REdN5SSJCySsc8P3kPsiEI8f3uWkZ0C_pGnKNwyYgX0Fo3BiIk4w1JCfmEddY01fvvgAD8pbuVok81WxJa5ZEG66VoZ1f_NW3qcnmA7BfjIRsrT57FtJreceqNa8GtAWoL2Eaa8Yqkg0asoKBuuqnFZO4OPYu2b7cPzDoF8t6w2Nc3GLRJBYhGhRZsO7VdyzG4FyaMBMfQ_MszzAmw4uzkYHzB0zILjyxsxNr_JnsW2Trzts"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-secondary-container rounded-full flex items-center justify-center border-2 border-white">
                      <span className="material-symbols-outlined text-[14px] text-on-secondary-container">handshake</span>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <p className="font-body-md text-body-md text-on-surface">
                        <span className="font-bold">Lina Benali</span> invited you to collaborate on the <span className="text-primary italic">"Sahara Silk Collection"</span> project.
                      </p>
                      <span className="text-[12px] text-on-surface-variant font-label-md">2m ago</span>
                    </div>

                    {collabStatus === 'pending' && (
                      <div className="mt-4 flex gap-3">
                        <button 
                          onClick={() => setCollabStatus('accepted')}
                          className="bg-primary text-on-primary px-6 py-2 rounded-full font-label-md text-label-md active:scale-95 transition-transform cursor-pointer shadow-sm hover:shadow-md"
                        >
                          Accept Request
                        </button>
                        <button 
                          onClick={() => setCollabStatus('declined')}
                          className="bg-surface-container-high text-on-surface px-6 py-2 rounded-full font-label-md text-label-md active:scale-95 transition-transform cursor-pointer hover:bg-surface-container-highest"
                        >
                          Decline
                        </button>
                      </div>
                    )}

                    {collabStatus === 'accepted' && (
                      <div className="mt-3 flex items-center gap-2 text-primary font-label-md text-[13px] bg-primary/10 px-4 py-2 rounded-full w-fit">
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        <span>Collaboration request accepted. You can message Lina directly.</span>
                      </div>
                    )}

                    {collabStatus === 'declined' && (
                      <div className="mt-3 flex items-center gap-2 text-on-surface-variant font-label-md text-[13px] bg-surface-container-high px-4 py-2 rounded-full w-fit">
                        <span className="material-symbols-outlined text-[18px]">cancel</span>
                        <span>Collaboration request declined.</span>
                      </div>
                    )}
                  </div>
                  {collabStatus === 'pending' && (
                    <div className="w-2 h-2 bg-tertiary rounded-full mt-2 shrink-0"></div>
                  )}
                </div>
              </div>

              {/* Showcase Approval Card */}
              <div className="notification-card group bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgba(7,103,96,0.06)] border border-primary/5 hover:border-primary/20 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-on-primary-container text-3xl">verified</span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <p className="font-body-md text-body-md text-on-surface">
                        Your project <span className="font-bold">"Kabyle Geometry Redefined"</span> has been approved by the Editorial Board and is now featured in <span className="text-primary font-semibold">Markets</span>.
                      </p>
                      <span className="text-[12px] text-on-surface-variant font-label-md">45m ago</span>
                    </div>
                    <Link 
                      href="/showcase" 
                      className="mt-3 inline-flex items-center gap-2 text-primary font-label-md text-label-md hover:underline"
                    >
                      <span>View showcase status</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                  </div>
                  <div className="w-2 h-2 bg-tertiary rounded-full mt-2"></div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-[0.2em]">Earlier</h2>
              <div className="flex-grow h-[1px] bg-outline-variant/30"></div>
            </div>
            <div className="space-y-4">

              {/* Profile Views Card */}
              <div className="notification-card bg-surface-container-low/50 backdrop-blur-sm rounded-[24px] p-6 border border-outline-variant/10 hover:bg-surface-container-low transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex -space-x-3 shrink-0">
                    <img alt="Viewer 1" className="w-12 h-12 rounded-full border-2 border-white object-cover" data-alt="A close-up professional headshot of a male textile engineer with a sharp, modern appearance. The background is a clean, minimalist architectural space with soft daylight, highlighting his professional and focused expression for a creative industry network." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLQFbMNhB7jZ-5tXRZDWHDS0jEmeaSai6ajrrSMfBMnZg4z77If4UtImDFKjvyNrgf_zFEwBDORdTIKdQe6Y6SuOFzsYhryCHtZYJfvQu4O2r7Rp-jInR9r8b-YEcKukIJNRX9Ck6gvFmDaRtW8PyPhvDHF1DevlR3KRtCweS8no_Yeqofpv1nMJFMraFMK14wcc5pckwECMAHjKgIXwNm4vMVhWKENusEhwLDq1HeYAq-fIoTNPiwDb0uCNjn3XR7eOE4SjNyMQA"/>
                    <img alt="Viewer 2" className="w-12 h-12 rounded-full border-2 border-white object-cover" data-alt="A portrait of a refined female creative director in an Algerian fashion house. She is wearing elegant attire, captured in a bright studio with soft, professional lighting. The overall mood is high-end, editorial, and focused on professional excellence in design." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWcfIcxwbBujrrkMyIkoLcni6Q2pZtbslXdxw3RtoxxGCIe0EK04QLUg-3P9l2SlgpZOY-L1sdGR0YsxNWM8bVCwiMNsWg5KGQu6Umy0F1W-2e43n9N7HqWV9dzFp00PaCxHxgKy8EYe7ky7i3OBh3ufL6iQtKc-LZFgTr0A4uasl2p4dsaP7Gpw3pGNUIPD99MVVUIyIZ2GxOZTRc_p-v7Zi2MGg8_ZwoLw1Y-7KMRCt-rg1nvDLDkB85O6z18Ni2Ibpn7oU1vYA"/>
                    <div className="w-12 h-12 rounded-full border-2 border-white bg-secondary-fixed flex items-center justify-center font-label-md text-label-md text-on-secondary-fixed-variant">
                      +8
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <p className="font-body-md text-body-md text-on-surface">
                        <span className="font-bold">8 professionals</span> from <span className="italic text-secondary">Tlemcen Textiles</span> and <span className="italic text-secondary">Oran Atelier</span> viewed your profile.
                      </p>
                      <span className="text-[12px] text-on-surface-variant font-label-md">Yesterday</span>
                    </div>
                    <Link 
                      href="/analytics" 
                      className="mt-2 inline-block text-primary font-label-md text-label-md hover:underline"
                    >
                      See detailed analytics
                    </Link>
                  </div>
                </div>
              </div>

              {/* Network Growth Card */}
              <div className="notification-card bg-surface-container-low/50 backdrop-blur-sm rounded-[24px] p-6 border border-outline-variant/10 hover:bg-surface-container-low transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-on-secondary-container">trending_up</span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <p className="font-body-md text-body-md text-on-surface">
                        Your network has grown to <span className="font-bold text-secondary">500+ professionals</span>. Celebrate this milestone by updating your portfolio showcase.
                      </p>
                      <span className="text-[12px] text-on-surface-variant font-label-md">2 days ago</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summit Schedule Card */}
              <div className="notification-card bg-surface-container-low/50 backdrop-blur-sm rounded-[24px] p-6 border border-outline-variant/10 hover:bg-surface-container-low transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-outline-variant/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-outline">info</span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        The <span className="font-semibold">TIRAZY Summer Artisan Summit</span> schedule has been released. Early access registration is now open for Gold members.
                      </p>
                      <span className="text-[12px] text-on-surface-variant font-label-md">3 days ago</span>
                    </div>
                  </div>
                </div>
              </div>

              {extraLoaded && (
                <div className="notification-card bg-surface-container-low/50 backdrop-blur-sm rounded-[24px] p-6 border border-outline-variant/10 hover:bg-surface-container-low transition-all animate-fadeIn">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary">
                      <span className="material-symbols-outlined">workspace_premium</span>
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <p className="font-body-md text-body-md text-on-surface-variant">
                          Your profile verification was renewed for the upcoming quarter. All verification badges are active.
                        </p>
                        <span className="text-[12px] text-on-surface-variant font-label-md">1 week ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </section>
        </div>

        <div className="mt-12 text-center">
          <button 
            onClick={() => setExtraLoaded(true)}
            className="font-label-md text-label-md text-primary border-b-2 border-primary pb-1 hover:text-primary-container hover:border-primary-container transition-all cursor-pointer"
          >
            {extraLoaded ? 'All activity loaded' : 'Load more activity'}
          </button>
          <div className="mt-8 flex justify-center gap-1 text-outline/30">
            <span className="material-symbols-outlined text-xs">diamond</span>
            <span className="material-symbols-outlined text-xs">diamond</span>
            <span className="material-symbols-outlined text-xs">diamond</span>
          </div>
        </div>
      </main>
    </div>
  );
}
