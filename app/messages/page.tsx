import React from 'react';
import Logo from '@/components/Logo';
import Link from 'next/link';

export default function MessagesPage() {
  return (
    <div className="stitch-screen-wrapper">


      <div className="flex pt-16 h-screen">

        <aside className="h-screen w-64 fixed left-0 top-0 pt-20 bg-surface-container-low dark:bg-surface-dim flex flex-col gap-2 p-4 hidden lg:flex overflow-y-auto custom-scrollbar pb-6">
          <div className="mb-8 px-2">
            <h2 className="font-headline-sm text-headline-sm text-primary">Maison de Couture</h2>
            <p className="font-label-md text-label-md text-on-surface-variant">Algiers, DZ</p>
          </div>

          <button className="mt-auto bg-primary text-on-primary py-3 px-4 rounded-full font-label-md hover:opacity-90 transition-all flex items-center justify-center gap-2 mb-4">
            <span className="material-symbols-outlined text-sm" data-icon="add">add</span>
            Publish Project
          </button>
        </aside>

        <main className="lg:ml-64 flex-grow h-full bg-background relative overflow-hidden flex">
          <div className="amazigh-pattern absolute inset-0 pointer-events-none"></div>

          <section className="w-full md:w-80 lg:w-96 flex flex-col border-r border-outline-variant bg-surface-container-lowest z-10">
            <div className="p-6 border-b border-outline-variant/30">
              <div className="flex items-center justify-between mb-6">
                <h1 className="font-headline-sm text-headline-sm text-on-surface">Messages</h1>
                <button className="p-2 bg-primary text-white hover:bg-primary-dark rounded-full transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-[20px]" data-icon="edit_square">edit_square</span>
                </button>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm" data-icon="search">search</span>
                <input className="w-full pl-10 pr-4 py-2 bg-surface-container rounded-xl border-none focus:ring-2 focus:ring-primary text-label-md" placeholder="Search discussions..." type="text" />
              </div>
            </div>
            
            <div className="flex-grow flex flex-col items-center justify-center p-8 text-center text-on-surface-variant/50">
              <span className="material-symbols-outlined text-[48px] text-outline/30 mb-4">forum</span>
              <p className="font-title-md text-sm text-on-surface font-bold">No active conversations</p>
              <p className="text-[11px] text-on-surface-variant/80 mt-1">When you connect with artisans or clients, your chats will appear here.</p>
            </div>
          </section>

          <section className="hidden md:flex flex-grow flex-col items-center justify-center bg-surface-bright/40 z-10 p-8 text-center">
            <div className="w-24 h-24 rounded-full bg-surface-container-high flex items-center justify-center mb-6 shadow-sm border border-outline-variant/20">
              <span className="material-symbols-outlined text-[40px] text-primary/40" data-icon="mail">mail</span>
            </div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-2">Your Messages</h2>
            <p className="font-body-md text-on-surface-variant max-w-md leading-relaxed">
              Select a conversation from the sidebar or start a new one to begin messaging with other professionals in the TIRAZY network.
            </p>
            <button className="mt-8 px-6 py-3 bg-primary text-on-primary rounded-full font-label-md shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]" data-icon="edit_square">edit_square</span>
              New Message
            </button>
          </section>
        </main>
      </div>
    </div>
  );
}
