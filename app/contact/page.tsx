import React from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { TIRAZY_CONTACT } from '@/utils/equipment';

export const metadata = {
  title: 'Contact TIRAZY Support & Network',
  description: 'Connect directly with the TIRAZY platform team across 69 wilayas.',
};

export default function ContactPage() {
  return (
    <div className="stitch-screen-wrapper w-full min-h-screen bg-background">
      <main className="pt-24 pb-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 text-primary font-label-md text-xs mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Official Platform Support & Inquiries
          </div>
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-primary mb-4 font-bold">
            Get in Touch with TIRAZY
          </h1>
          <p className="font-body-lg text-on-surface-variant leading-relaxed">
            We are dedicated to supporting Algeria’s textile masters, designers, and ateliers across all 69 wilayas. Reach out to our central team for platform support, verification inquiries, or partnership opportunities.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          
          {/* Phone Card */}
          <div className="bg-white dark:bg-surface-container-low p-8 rounded-[24px] border border-outline-variant/20 shadow-sm flex flex-col items-center text-center group hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[28px]">call</span>
            </div>
            <h3 className="font-title-lg text-title-lg text-on-surface mb-1">Direct Call</h3>
            <p className="text-xs text-on-surface-variant mb-4">Monday – Thursday, 9am – 5pm</p>
            <a
              href={TIRAZY_CONTACT.telUrl}
              className="text-primary font-bold text-lg hover:underline mb-4 font-mono"
            >
              {TIRAZY_CONTACT.phone}
            </a>
            <a
              href={TIRAZY_CONTACT.telUrl}
              className="mt-auto px-6 py-2.5 bg-primary text-white rounded-full font-label-md text-xs hover:bg-primary-dark transition-colors"
            >
              Call Now
            </a>
          </div>

          {/* WhatsApp Card */}
          <div className="bg-white dark:bg-surface-container-low p-8 rounded-[24px] border border-outline-variant/20 shadow-sm flex flex-col items-center text-center group hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center mb-5 group-hover:bg-[#25D366] group-hover:text-white transition-colors">
              <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.53 7.33C8.36 7.33 8.1 7.4 7.87 7.64C7.65 7.89 7.02 8.48 7.02 9.68C7.02 10.88 7.9 12.04 8.02 12.2C8.14 12.37 9.73 14.83 12.18 15.89C12.77 16.14 13.22 16.29 13.58 16.41C14.17 16.6 14.71 16.57 15.13 16.51C15.61 16.44 16.6 15.91 16.81 15.33C17.02 14.74 17.02 14.24 16.96 14.14C16.9 14.04 16.73 13.98 16.47 13.85C16.21 13.72 14.96 13.11 14.73 13.02C14.5 12.94 14.34 12.9 14.17 13.15C14.01 13.4 13.54 13.98 13.39 14.14C13.25 14.31 13.1 14.33 12.85 14.2C12.59 14.08 11.78 13.81 10.81 12.95C10.06 12.28 9.55 11.45 9.4 11.2C9.26 10.95 9.39 10.82 9.52 10.69C9.63 10.58 9.77 10.4 9.9 10.25C10.03 10.1 10.07 9.99 10.16 9.82C10.24 9.66 10.2 9.51 10.14 9.39C10.07 9.26 9.61 8.13 9.42 7.67C9.24 7.22 9.05 7.28 8.91 7.27C8.78 7.27 8.65 7.33 8.53 7.33Z" />
              </svg>
            </div>
            <h3 className="font-title-lg text-title-lg text-on-surface mb-1">WhatsApp Chat</h3>
            <p className="text-xs text-on-surface-variant mb-4">Instant messaging & assistance</p>
            <a
              href={TIRAZY_CONTACT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25D366] font-bold text-lg hover:underline mb-4 font-mono"
            >
              {TIRAZY_CONTACT.phone}
            </a>
            <a
              href={TIRAZY_CONTACT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto px-6 py-2.5 bg-[#25D366] text-white rounded-full font-label-md text-xs hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.53 7.33C8.36 7.33 8.1 7.4 7.87 7.64C7.65 7.89 7.02 8.48 7.02 9.68C7.02 10.88 7.9 12.04 8.02 12.2C8.14 12.37 9.73 14.83 12.18 15.89C12.77 16.14 13.22 16.29 13.58 16.41C14.17 16.6 14.71 16.57 15.13 16.51C15.61 16.44 16.6 15.91 16.81 15.33C17.02 14.74 17.02 14.24 16.96 14.14C16.9 14.04 16.73 13.98 16.47 13.85C16.21 13.72 14.96 13.11 14.73 13.02C14.5 12.94 14.34 12.9 14.17 13.15C14.01 13.4 13.54 13.98 13.39 14.14C13.25 14.31 13.1 14.33 12.85 14.2C12.59 14.08 11.78 13.81 10.81 12.95C10.06 12.28 9.55 11.45 9.4 11.2C9.26 10.95 9.39 10.82 9.52 10.69C9.63 10.58 9.77 10.4 9.9 10.25C10.03 10.1 10.07 9.99 10.16 9.82C10.24 9.66 10.2 9.51 10.14 9.39C10.07 9.26 9.61 8.13 9.42 7.67C9.24 7.22 9.05 7.28 8.91 7.27C8.78 7.27 8.65 7.33 8.53 7.33Z" />
              </svg>
              Open WhatsApp
            </a>
          </div>

          {/* Email Card */}
          <div className="bg-white dark:bg-surface-container-low p-8 rounded-[24px] border border-outline-variant/20 shadow-sm flex flex-col items-center text-center group hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-tertiary/15 text-tertiary flex items-center justify-center mb-5 group-hover:bg-tertiary group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[28px]">mail</span>
            </div>
            <h3 className="font-title-lg text-title-lg text-on-surface mb-1">Email Support</h3>
            <p className="text-xs text-on-surface-variant mb-4">Official platform inquiries</p>
            <a
              href={TIRAZY_CONTACT.mailtoUrl}
              className="text-tertiary font-bold text-sm hover:underline mb-4 break-all"
            >
              {TIRAZY_CONTACT.email}
            </a>
            <a
              href={TIRAZY_CONTACT.mailtoUrl}
              className="mt-auto px-6 py-2.5 bg-tertiary text-white rounded-full font-label-md text-xs hover:bg-tertiary/80 transition-colors"
            >
              Send Email
            </a>
          </div>

        </div>

        {/* Informational Callout */}
        <div className="max-w-4xl mx-auto bg-white/70 dark:bg-surface-container-low p-8 rounded-[28px] border border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-title-lg text-on-surface font-serif">Are you an artisan seeking onboarding support?</h4>
            <p className="text-sm text-on-surface-variant">
              Our network coordination team assists textile professionals in all 69 wilayas with profile setup, equipment listing, and verification.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              href="/register"
              className="px-6 py-3 bg-primary text-white rounded-full font-label-md text-xs hover:shadow-md transition-all active:scale-95"
            >
              Join the Network
            </Link>
            <Link
              href="/artisans"
              className="px-6 py-3 border border-outline text-on-surface rounded-full font-label-md text-xs hover:bg-surface-container transition-all"
            >
              Browse Directory
            </Link>
          </div>
        </div>

      </main>

      <footer className="mt-12 border-t border-outline-variant/20 bg-surface-container-low py-12">
        <div className="max-w-container-max mx-auto px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-1 items-center md:items-start">
            <Link href="/"><Logo className="h-10 w-auto object-contain" /></Link>
            <p className="text-on-surface-variant text-xs">The Professional Network for Algerian Textile Heritage.</p>
          </div>
          <div className="flex gap-6 text-xs text-on-surface-variant">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <Link href="/artisans" className="hover:text-primary transition-colors">Artisans</Link>
            <Link href="/explore" className="hover:text-primary transition-colors">Explore</Link>
            <Link href="/contact" className="text-primary font-bold">Contact Support</Link>
          </div>
          <div className="text-xs text-on-surface-variant">
            © 2024 TIRAZY. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
