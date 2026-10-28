"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface Visitor {
  id: string;
  name: string;
  avatar: string;
  specialization: string;
  wilaya: string;
  timeLabel: string;
  filterGroup: 'today' | 'week' | 'month';
}

interface Activity {
  id: string;
  icon: string;
  iconColor: string;
  text: string;
  time: string;
}

export default function AnalyticsPage() {
  const [visitorFilter, setVisitorFilter] = useState<'today' | 'week' | 'month'>('today');

  // Local Mock Visitors Data
  const mockVisitors: Visitor[] = [
    {
      id: "v-1",
      name: "Nadia Cherif",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
      specialization: "Wedding Designer",
      wilaya: "Oran",
      timeLabel: "Visited your profile 2 hours ago",
      filterGroup: "today"
    },
    {
      id: "v-2",
      name: "Yasmine Oualid",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAItdWOY1pa8uzAkEWfvWhanlTiXv9DAoduMTmWyO3IE6RDN82XvD58K4_6SF-C86dsaKsAaGQ2dClIuJ7vsSpIdt_g5-vXTTazjbv1k5ROJmzUobVENKACilTR0qMVo_fbj6g_2lfu5jsinhuT-uOtT4_-1_elVDRy9qgoCSDwRerl13FtayNlmGBQeA401jB0e5NI--XWlgcF65mKn3ayMC8HVXAsHIzP_M1Yz2YzYhcwcPpzOFGKEweeMMaeEa4I3vacwU_RRMc",
      specialization: "Embroidery Artist",
      wilaya: "Tlemcen",
      timeLabel: "Visited your profile 5 hours ago",
      filterGroup: "today"
    },
    {
      id: "v-3",
      name: "Rachid Meziane",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0Vq2VhoFu44ICvw4kX78ly5ngopQcd_jvPL-otjDl181yWrKmnKypoBLLGF_g44Y8YBOh0mYjQ0zz4fwOwlK0CUHqqhB-DIjyGYJAoL6LMv2ZRNzoPa3XblLnj7m4miCSjVy-hCCt7iV1LwUuXfbheo4qzqpYirr03951PR09kO0u83QfMV99AmHdkFiVtDn8IqhzWEXvu5ozxK1fE3-jQ4MgyJ8aMt4DQ_s1iLegIKF0ZeZjmLw5L3Sz0rWM6PYP1JKGnZWsPgY",
      specialization: "Leather Craft Master",
      wilaya: "Oran",
      timeLabel: "Visited your profile 1 day ago",
      filterGroup: "week"
    },
    {
      id: "v-4",
      name: "Leila Belkacem",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2_x3_d3fVvyfHmnTf9fgvjmwC81AdX3f4JADyna4UXNNDoa9V1sUEQHWINsexZUMDixO7iZAbFXpFardkBjutDk8WcuQeqPDdqD3Uezidv6ERUlKShh1oKH15AAha-fLMeYY3NgXAxrnq5X-yl99hkJ6GJixSKAT1CAoHK5xMpKZGaMuz1KzmY8-6WskzJIyvFPNcL3XBlPCA567Jv1HALykY7BJDjZV0e4Xoa_YjUFRexhnb88GErM9c2T4CaVfquy1zZb9TsTc",
      specialization: "Modern Kabyle Designer",
      wilaya: "Tizi Ouzou",
      timeLabel: "Visited your profile 3 days ago",
      filterGroup: "week"
    },
    {
      id: "v-5",
      name: "Master Amine",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQqWvx-XEkF3kIz7IfbDKJ_zEzBMaKlbtbEdJ6f7ImIhCW4ZOeQkTCg774sPTDbDoulWLTvmO6SuxSpiuPOntp780WT55dLAg_zD_8Cj-tvuC3WgdSr64Xl8ZyLC8XtAXmYI5vDCaKyKjsm7NdAs7sgJqI0e8fwNafFeYL7z7uqL37TrjpgzXet1TNV-gw97I8oKtXJsR6XDt_xGuYahSApIL28AXr5j_Vefzc8bbO4MR8WdB-2g5sfqPf_XtG1kETQHm_t_kjVrA",
      specialization: "Master Couturier & Tailor",
      wilaya: "Constantine",
      timeLabel: "Visited your profile 2 weeks ago",
      filterGroup: "month"
    }
  ];

  // Filter visitors based on filter group
  const filteredVisitors = mockVisitors.filter((visitor) => {
    if (visitorFilter === 'today') return visitor.filterGroup === 'today';
    if (visitorFilter === 'week') return visitor.filterGroup === 'today' || visitor.filterGroup === 'week';
    return true; // month includes all
  });

  // Local Mock Activity Data
  const mockActivities: Activity[] = [
    {
      id: "act-1",
      icon: "visibility",
      iconColor: "text-primary bg-primary/10",
      text: "Your profile was viewed by Nadia Cherif.",
      time: "2 hours ago"
    },
    {
      id: "act-2",
      icon: "bar_chart",
      iconColor: "text-secondary bg-secondary/10",
      text: "Your project “Golden Karakou Collection” received 14 new views.",
      time: "5 hours ago"
    },
    {
      id: "act-3",
      icon: "person_add",
      iconColor: "text-tertiary bg-tertiary/10",
      text: "Omar Mansour started following you.",
      time: "1 day ago"
    },
    {
      id: "act-4",
      icon: "thumb_up",
      iconColor: "text-accent bg-accent/10",
      text: "Your post received 8 new appreciations.",
      time: "2 days ago"
    }
  ];

  // Last 7 days views for the CSS bar chart
  const viewsData = [
    { day: "Sun", views: 120 },
    { day: "Mon", views: 180 },
    { day: "Tue", views: 150 },
    { day: "Wed", views: 210 },
    { day: "Thu", views: 190 },
    { day: "Fri", views: 240 },
    { day: "Sat", views: 220 }
  ];

  const maxViews = Math.max(...viewsData.map((d) => d.views));

  return (
    <div className="stitch-screen-wrapper">
      
      {/* Collaboration Sidebar Navigation */}
      <aside className="hidden xl:flex h-screen w-64 fixed left-0 top-0 pt-20 flex-col gap-2 p-4 bg-surface-container-low transition-all duration-300 ease-in-out overflow-y-auto custom-scrollbar pb-6">
        <div className="mb-8 px-4">
          <h3 className="font-title-lg text-title-lg text-primary">Collaboration</h3>
          <p className="font-label-md text-label-md text-on-surface-variant">Manage your partnerships</p>
        </div>

        <nav className="flex flex-col gap-1">
          <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-variant/50 rounded-lg transition-all" href="/showcase">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-label-md">Dashboard</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-variant/50 rounded-lg transition-all" href="/profile">
            <span className="material-symbols-outlined">palette</span>
            <span className="font-label-md">Portfolio</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-primary font-bold bg-surface-container-high rounded-lg" href="/analytics">
            <span className="material-symbols-outlined">insights</span>
            <span className="font-label-md">Analytics</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-variant/50 rounded-lg transition-all" href="/projects">
            <span className="material-symbols-outlined">group</span>
            <span className="font-label-md">Projects</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-variant/50 rounded-lg transition-all" href="/settings">
            <span className="material-symbols-outlined">settings</span>
            <span className="font-label-md">Settings</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-variant/50 rounded-lg transition-all" href="/messages">
            <span className="material-symbols-outlined">mail</span>
            <span className="font-label-md">Messages</span>
          </Link>
        </nav>
        <div className="mt-auto p-4 flex flex-col gap-2">
          <Link href="/explore" className="w-full bg-primary text-on-primary py-2.5 px-4 rounded-full font-label-md text-label-md hover:bg-primary-dark hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
            Create Post
          </Link>
          <Link href="/publish" className="w-full bg-transparent border-2 border-primary text-primary py-2 px-4 rounded-full font-label-md text-label-md hover:bg-primary/5 transition-all active:scale-95 flex items-center justify-center gap-2">
            Create Project
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="pt-24 pb-12 px-margin-mobile md:px-margin-desktop xl:ml-64 max-w-container-max mx-auto">
        
        {/* Title */}
        <div className="mb-10">
          <h2 className="font-headline-md text-headline-md text-primary mb-2">Profile Analytics</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Understand how people discover and engage with your professional profile.</p>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          
          <div className="bg-white rounded-[24px] p-6 border border-primary/5 shadow-sm">
            <p className="font-label-md text-[12px] text-on-surface-variant uppercase tracking-wider mb-2">Profile Views</p>
            <div className="flex items-baseline justify-between">
              <span className="font-headline-md text-primary font-bold">1,248</span>
              <span className="text-[12px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">+12%</span>
            </div>
            <p className="text-[11px] text-on-surface-variant/50 mt-2">this month</p>
          </div>

          <div className="bg-white rounded-[24px] p-6 border border-primary/5 shadow-sm">
            <p className="font-label-md text-[12px] text-on-surface-variant uppercase tracking-wider mb-2">Unique Visitors</p>
            <div className="flex items-baseline justify-between">
              <span className="font-headline-md text-primary font-bold">842</span>
              <span className="text-[12px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">+8%</span>
            </div>
            <p className="text-[11px] text-on-surface-variant/50 mt-2">this month</p>
          </div>

          <div className="bg-white rounded-[24px] p-6 border border-primary/5 shadow-sm">
            <p className="font-label-md text-[12px] text-on-surface-variant uppercase tracking-wider mb-2">Portfolio Views</p>
            <div className="flex items-baseline justify-between">
              <span className="font-headline-md text-primary font-bold">684</span>
              <span className="text-[12px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">+15%</span>
            </div>
            <p className="text-[11px] text-on-surface-variant/50 mt-2">this month</p>
          </div>

          <div className="bg-white rounded-[24px] p-6 border border-primary/5 shadow-sm">
            <p className="font-label-md text-[12px] text-on-surface-variant uppercase tracking-wider mb-2">New Followers</p>
            <div className="flex items-baseline justify-between">
              <span className="font-headline-md text-primary font-bold">36</span>
              <span className="text-[12px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">+20%</span>
            </div>
            <p className="text-[11px] text-on-surface-variant/50 mt-2">this month</p>
          </div>

        </div>

        {/* CSS-based Bar Chart */}
        <div className="bg-white rounded-[24px] p-8 border border-primary/5 shadow-sm mb-10">
          <h3 className="font-title-lg text-title-lg text-primary mb-6">Profile Views Over Time</h3>
          
          <div className="flex items-end justify-between h-48 border-b border-outline-variant/30 pb-4 max-w-3xl mx-auto">
            {viewsData.map((data) => {
              const heightPercent = (data.views / maxViews) * 100;
              return (
                <div key={data.day} className="flex flex-col items-center gap-2 group flex-grow">
                  <div className="relative w-12 md:w-16 bg-primary/15 hover:bg-primary rounded-t-xl transition-all duration-300 flex justify-center" style={{ height: `${heightPercent}%` }}>
                    <span className="absolute -top-8 bg-inverse-surface text-inverse-on-surface text-[11px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                      {data.views}
                    </span>
                  </div>
                  <span className="text-[12px] text-on-surface-variant font-label-md uppercase tracking-wider">{data.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Visitors and Activity split section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Recent Profile Visitors */}
          <div className="bg-white rounded-[24px] p-8 border border-primary/5 shadow-sm flex flex-col">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h3 className="font-headline-sm text-[20px] text-primary">Recent Profile Visitors</h3>
              
              {/* Filter Tabs */}
              <div className="flex gap-1.5 p-1 bg-surface-container-low rounded-xl">
                <button
                  type="button"
                  onClick={() => setVisitorFilter('today')}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
                    visitorFilter === 'today'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setVisitorFilter('week')}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
                    visitorFilter === 'week'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  This Week
                </button>
                <button
                  type="button"
                  onClick={() => setVisitorFilter('month')}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
                    visitorFilter === 'month'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  This Month
                </button>
              </div>
            </div>

            {/* Visitors list */}
            {filteredVisitors.length > 0 ? (
              <div className="divide-y divide-outline-variant/15 flex-grow">
                {filteredVisitors.map((visitor) => (
                  <div key={visitor.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/20 shadow-sm shrink-0">
                        <img src={visitor.avatar} alt={visitor.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-label-md text-on-surface truncate block font-bold leading-normal">{visitor.name}</h4>
                        <p className="text-[12px] text-on-surface-variant truncate block">{visitor.specialization} &middot; {visitor.wilaya}</p>
                        <p className="text-[11px] text-on-surface-variant/40 mt-0.5">{visitor.timeLabel}</p>
                      </div>
                    </div>
                    <Link
                      href={`/profile/${visitor.id}`}
                      className="px-4 py-1.5 border border-primary text-primary rounded-full hover:bg-primary hover:text-white transition-colors text-[12px] font-bold self-start sm:self-center inline-flex items-center"
                    >
                      View Profile
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-on-surface-variant/50">
                <span className="material-symbols-outlined text-[36px] mb-2 block">group_off</span>
                No profile visitors in this period.
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-[24px] p-8 border border-primary/5 shadow-sm">
            <h3 className="font-headline-sm text-[20px] text-primary mb-6">Recent Activity</h3>
            
            <div className="space-y-6">
              {mockActivities.map((activity) => (
                <div key={activity.id} className="flex gap-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${activity.iconColor}`}>
                    <span className="material-symbols-outlined text-[20px]">{activity.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-body-md text-[14px] text-on-surface leading-normal">{activity.text}</p>
                    <span className="text-[11px] text-on-surface-variant/50 mt-1 block">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
