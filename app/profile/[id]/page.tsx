import React from 'react';
import Logo from '@/components/Logo';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { AvailabilityIndicator } from '@/components/ui/AvailabilityIndicator';
import { formatPhoneNumber } from '@/utils/equipment';

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // Get current user to check ownership
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  const isOwner = currentUser?.id === id;

  // Try fetching full profile with contact, availability, and equipment
  let profile: any = null;
  const { data: fullProfile, error: fullError } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      avatar_url,
      bio,
      wilaya,
      experience_level,
      phone_number,
      phone_visible,
      availability_status,
      equipment,
      profile_roles ( roles ( name ) )
    `)
    .eq('id', id)
    .single();

  if (!fullError && fullProfile) {
    profile = fullProfile;
  } else {
    // Fallback to basic columns if migration is pending
    const { data: basicProfile } = await supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        avatar_url,
        bio,
        wilaya,
        experience_level,
        profile_roles ( roles ( name ) )
      `)
      .eq('id', id)
      .single();

    profile = basicProfile;
  }

  if (!profile) {
    // Provide a graceful fallback profile for demo and preview artisan IDs
    profile = {
      id,
      full_name: id.includes('rachid') ? 'Rachid Meziane' : id.includes('omar') ? 'Omar Mansour' : id.includes('sonia') ? 'Sonia Kerroum' : 'Lina Benyahia',
      avatar_url: id.includes('rachid')
        ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0Vq2VhoFu44ICvw4kX78ly5ngopQcd_jvPL-otjDl181yWrKmnKypoBLLGF_g44Y8YBOh0mYjQ0zz4fwOwlK0CUHqqhB-DIjyGYJAoL6LMv2ZRNzoPa3XblLnj7m4miCSjVy-hCCt7iV1LwUuXfbheo4qzqpYirr03951PR09kO0u83QfMV99AmHdkFiVtDn8IqhzWEXvu5ozxK1fE3-jQ4MgyJ8aMt4DQ_s1iLegIKF0ZeZjmLw5L3Sz0rWM6PYP1JKGnZWsPgY'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      bio: 'Textile artisan and designer dedicated to modernizing traditional Algerian fashion with sustainable techniques.',
      wilaya: id.includes('rachid') ? 'Oran' : 'Algiers',
      experience_level: 'Master',
      phone_number: '+213555123456',
      phone_visible: true,
      availability_status: id.includes('rachid') ? 'busy' : 'available',
      equipment: [
        'Piqueuse Plate Industrielle (Single Needle Lockstitch)',
        'Surjeteuse / Overlock Machine',
        'Cadre de Broderie Traditionnelle (Gargaf / Traditional Frame)',
        'Brodeuse Numérique / Industrial Embroidery Machine'
      ],
      profile_roles: [{ roles: { name: 'Fashion Designer' } }]
    };
  }

  // Fetch User Projects
  const { data: projects } = await supabase
    .from('projects')
    .select(`
      id,
      title,
      description,
      project_media ( media_url )
    `)
    .eq('author_id', id)
    .order('created_at', { ascending: false });

  const fullName = profile.full_name || 'Lina Benyahia';
  const avatarUrl = profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256';
  const roles = profile.profile_roles?.map((pr: any) => pr.roles.name).join(' & ') || 'Fashion Designer';
  const bio = profile.bio || 'I create contemporary Algerian fashion inspired by traditional craftsmanship and modern silhouettes.';
  const wilaya = profile.wilaya || 'Alger';

  // Availability status (defaults to 'unavailable' if not set)
  const availabilityStatus = profile.availability_status || 'unavailable';

  // Contact info & visibility logic (Requirement 1)
  // Only expose phone if visible publicly OR if current logged-in user is the profile owner
  const isPhoneVisibleToViewer = Boolean(profile.phone_visible) || isOwner;
  const rawPhoneNumber = isPhoneVisibleToViewer ? (profile.phone_number || '') : '';
  const phoneFormatted = formatPhoneNumber(rawPhoneNumber);
  const canContactPhone = isPhoneVisibleToViewer && phoneFormatted.isValid;

  // Machinery & Equipment (Requirement 3)
  const equipment: string[] = Array.isArray(profile.equipment) ? profile.equipment : [];

  return (
    <div className="stitch-screen-wrapper">
      
      <main className="pt-20 pb-12">

        {/* Cover & Profile Header */}
        <div className="relative w-full h-[400px] overflow-hidden bg-surface-dim group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20 z-10"></div>
          <img 
            className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105" 
            src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=2000" 
            alt="Cover" 
          />
          <div className="absolute bottom-10 left-margin-desktop right-margin-desktop flex justify-between items-end max-w-container-max mx-auto z-20">
            <div className="flex items-center gap-8">
              {/* Profile Avatar with Requirement 2: Availability Dot at bottom-right */}
              <div className="relative w-40 h-40 rounded-3xl border-4 border-surface shadow-xl bg-white translate-y-20 shrink-0">
                <img className="w-full h-full rounded-[20px] object-cover" alt={fullName} src={avatarUrl} />
                <div className="absolute bottom-2 right-2">
                  <AvailabilityIndicator status={availabilityStatus} size="lg" />
                </div>
              </div>
              <div className="text-white pb-4">
                <h1 className="font-headline-md text-headline-md mb-1">{fullName}</h1>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-body-lg text-body-lg opacity-90">{roles}</p>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/60"></span>
                  <div className="bg-black/30 backdrop-blur-md px-3 py-0.5 rounded-full border border-white/20">
                    <AvailabilityIndicator status={availabilityStatus} size="sm" showLabel />
                  </div>
                </div>
              </div>
            </div>

            {/* Requirement 1: [Message] [Call] [WhatsApp] */}
            <div className="flex flex-wrap items-center gap-3 pb-4">
              {/* Message Button (Preserved) */}
              <Link 
                href={`/messages?recipient=${id}`} 
                className="px-6 py-3 bg-white text-primary font-label-md text-label-md rounded-full shadow-lg hover:bg-surface-container-low transition-all active:scale-95 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                Message
              </Link>

              {/* Call Button */}
              {canContactPhone ? (
                <a
                  href={`tel:${phoneFormatted.tel}`}
                  className="px-6 py-3 bg-white text-primary font-label-md text-label-md rounded-full shadow-lg hover:bg-surface-container-low transition-all active:scale-95 flex items-center gap-2"
                  title={`Call ${fullName} at ${phoneFormatted.raw}`}
                >
                  <span className="material-symbols-outlined text-[18px]">call</span>
                  Call
                </a>
              ) : (
                <button
                  disabled
                  className="px-6 py-3 bg-white/50 text-on-surface-variant/40 font-label-md text-label-md rounded-full cursor-not-allowed flex items-center gap-2"
                  title={profile.phone_number ? "Phone number is set to private" : "Phone number not provided"}
                >
                  <span className="material-symbols-outlined text-[18px]">call</span>
                  Call
                </button>
              )}

              {/* WhatsApp Button */}
              {canContactPhone ? (
                <a
                  href={`https://wa.me/${phoneFormatted.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white text-primary font-label-md text-label-md rounded-full shadow-lg hover:bg-surface-container-low transition-all active:scale-95 flex items-center gap-2"
                  title={`Open WhatsApp chat with ${fullName}`}
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  WhatsApp
                </a>
              ) : (
                <button
                  disabled
                  className="px-6 py-3 bg-white/50 text-on-surface-variant/40 font-label-md text-label-md rounded-full cursor-not-allowed flex items-center gap-2"
                  title={profile.phone_number ? "WhatsApp contact is set to private" : "WhatsApp not provided"}
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  WhatsApp
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="max-w-container-max mx-auto px-margin-desktop mt-24 flex flex-col md:flex-row gap-gutter">

          {/* Left Column (Bio, Connect, Machinery & Equipment) */}
          <aside className="w-full md:w-80 flex flex-col gap-8">
            <div className="bg-white p-8 rounded-[24px] shadow-sm flex flex-col gap-6">
              <div>
                <h3 className="font-label-md text-label-md text-primary mb-2 uppercase tracking-widest">About</h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  {bio}
                </p>
              </div>
              <div className="h-px bg-outline-variant/30"></div>
              <div className="flex flex-col gap-4">
                <h3 className="font-label-md text-label-md text-primary uppercase tracking-widest">Connect</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-on-surface-variant">
                    <span className="material-symbols-outlined text-outline">location_on</span>
                    <span className="text-body-md">{wilaya}</span>
                  </div>
                  <div className="flex items-center gap-3 text-on-surface-variant">
                    <span className="material-symbols-outlined text-outline">star</span>
                    <span className="text-body-md">{profile.experience_level || 'Professional'} Level</span>
                  </div>
                  <div className="flex items-center gap-3 text-on-surface-variant">
                    <span className="material-symbols-outlined text-outline">schedule</span>
                    <span className="text-body-md flex items-center gap-2">
                      Availability:
                      <AvailabilityIndicator status={availabilityStatus} size="sm" showLabel />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Requirement 3: Machinery & Equipment Section */}
            <div className="bg-white p-8 rounded-[24px] shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-[20px]">precision_manufacturing</span>
                <h3 className="font-label-md text-label-md uppercase tracking-widest">Machinery & Equipment</h3>
              </div>
              {equipment.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {equipment.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-low text-on-surface border border-outline-variant/30 text-[12px] font-sans font-medium hover:border-primary/40 transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-on-surface-variant text-sm italic">No equipment listed yet.</p>
              )}
            </div>

            {/* Portfolio Activity Widget */}
            <div className="bg-secondary-fixed text-on-secondary-fixed p-8 rounded-[24px] shadow-sm relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="font-label-md text-label-md opacity-80 mb-4">Portfolio Activity</h4>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-end">
                    <span className="font-headline-sm text-headline-sm">{projects?.length || 0}</span>
                    <span className="font-label-md text-label-md">Live Projects</span>
                  </div>
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <span className="material-symbols-outlined text-[120px]">pen_magic</span>
              </div>
            </div>
          </aside>

          {/* Right Column: Portfolio Showcase */}
          <section className="flex-1">
            {/* Machinery & Equipment Chips Banner before Portfolio */}
            {equipment.length > 0 && (
              <div className="mb-8 p-6 bg-white dark:bg-surface-container-low rounded-[24px] border border-outline-variant/20 shadow-xs">
                <div className="flex items-center gap-2 text-primary mb-3">
                  <span className="material-symbols-outlined text-[20px]">precision_manufacturing</span>
                  <h3 className="font-headline-sm text-[16px] text-primary">Atelier Machinery & Equipment</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {equipment.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/5 text-primary border border-primary/20 text-[13px] font-medium"
                    >
                      <span className="material-symbols-outlined text-[14px]">check</span>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mb-8">
              <h2 className="font-headline-sm text-headline-sm">Portfolio Showcase</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects && projects.length > 0 ? (
                projects.map((project: any) => (
                  <div key={project.id} className="group relative overflow-hidden rounded-[24px] bg-white shadow-sm hover:shadow-xl transition-all duration-500">
                    <div className="aspect-[4/3] overflow-hidden bg-surface-container-high">
                      <img 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        src={project.project_media?.[0]?.media_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400'} 
                        alt={project.title} 
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-title-lg text-title-lg mb-1">{project.title}</h3>
                      <p className="text-on-surface-variant text-sm mb-4 line-clamp-2">{project.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 py-16 text-center text-on-surface-variant bg-surface-container-low rounded-2xl">
                  <span className="material-symbols-outlined text-[48px] opacity-50 mb-2">image_not_supported</span>
                  <p>No projects showcased yet.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <footer className="mt-20 border-t border-outline-variant/20 bg-surface-container-low py-12">
        <div className="max-w-container-max mx-auto px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2">
            <Link href="/"><Logo className="h-12 w-auto object-contain" /></Link>
            <p className="text-on-surface-variant text-sm">The Professional Network for Algerian Textile Heritage.</p>
          </div>
          <div className="flex gap-8">
            <Link className="text-on-surface-variant hover:text-primary transition-colors text-sm" href="#">Privacy Policy</Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors text-sm" href="#">Terms of Service</Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors text-sm" href="#">Contact Support</Link>
          </div>
          <div className="text-on-surface-variant text-sm">
            © 2024 TIRAZY. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
