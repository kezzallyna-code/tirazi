import React from 'react';
import Logo from '@/components/Logo';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { AvailabilityIndicator } from '@/components/ui/AvailabilityIndicator';
import { formatPhoneNumber, validateEquipment } from '@/utils/equipment';

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

  // Machinery & Equipment (Requirement 3: strictly validate against approved 9 options)
  const equipment: string[] = validateEquipment(profile.equipment);

  return (
    <div className="stitch-screen-wrapper">
      
      <main className="pt-20 pb-12">

        {/* Cover & Profile Header */}
        <div className="relative w-full min-h-[380px] md:h-[400px] overflow-hidden bg-surface-dim group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/20 z-10"></div>
          <img 
            className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105" 
            src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=2000" 
            alt="Cover" 
          />
          <div className="absolute bottom-6 md:bottom-10 left-4 right-4 md:left-margin-desktop md:right-margin-desktop flex flex-col md:flex-row justify-between items-start md:items-end gap-6 max-w-container-max mx-auto z-20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
              {/* Profile Avatar with Requirement 2: Availability Dot at bottom-right */}
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-3xl border-4 border-surface shadow-xl bg-white translate-y-10 sm:translate-y-16 md:translate-y-20 shrink-0">
                <img className="w-full h-full rounded-[20px] object-cover" alt={fullName} src={avatarUrl} />
                <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2">
                  <AvailabilityIndicator status={availabilityStatus} size="lg" />
                </div>
              </div>
              <div className="text-white pt-2 sm:pt-0 sm:pb-2 md:pb-4">
                <h1 className="font-headline-md text-2xl sm:text-headline-md mb-1">{fullName}</h1>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <p className="font-body-md sm:font-body-lg text-sm sm:text-body-lg opacity-90">{roles}</p>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/60"></span>
                  <div className="bg-black/40 backdrop-blur-md px-3 py-0.5 rounded-full border border-white/20">
                    <AvailabilityIndicator status={availabilityStatus} size="sm" showLabel />
                  </div>
                </div>
              </div>
            </div>

            {/* Requirement 1: [Message] [Call] [WhatsApp] */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pb-2 md:pb-4 w-full sm:w-auto">
              {/* Message Button (Preserved) */}
              <Link 
                href={`/messages?recipient=${id}`} 
                className="flex-1 sm:flex-initial justify-center px-5 sm:px-6 py-2.5 sm:py-3 bg-white text-primary font-label-md text-xs sm:text-label-md rounded-full shadow-lg hover:bg-surface-container-low transition-all active:scale-95 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                Message
              </Link>

              {/* Call Button */}
              {canContactPhone ? (
                <a
                  href={`tel:${phoneFormatted.tel}`}
                  className="flex-1 sm:flex-initial justify-center px-5 sm:px-6 py-2.5 sm:py-3 bg-white text-primary font-label-md text-xs sm:text-label-md rounded-full shadow-lg hover:bg-surface-container-low transition-all active:scale-95 flex items-center gap-2"
                  title={`Call ${fullName} at ${phoneFormatted.raw}`}
                >
                  <span className="material-symbols-outlined text-[18px]">call</span>
                  Call
                </a>
              ) : (
                <button
                  disabled
                  aria-disabled="true"
                  className="flex-1 sm:flex-initial justify-center px-5 sm:px-6 py-2.5 sm:py-3 bg-white/50 text-on-surface-variant/40 font-label-md text-xs sm:text-label-md rounded-full cursor-not-allowed flex items-center gap-2"
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
                  className="flex-1 sm:flex-initial justify-center px-5 sm:px-6 py-2.5 sm:py-3 bg-white text-primary font-label-md text-xs sm:text-label-md rounded-full shadow-lg hover:bg-surface-container-low transition-all active:scale-95 flex items-center gap-2"
                  title={`Open WhatsApp chat with ${fullName}`}
                >
                  <svg
                    className="w-[18px] h-[18px] fill-[#25D366] shrink-0"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.53 7.33C8.36 7.33 8.1 7.4 7.87 7.64C7.65 7.89 7.02 8.48 7.02 9.68C7.02 10.88 7.9 12.04 8.02 12.2C8.14 12.37 9.73 14.83 12.18 15.89C12.77 16.14 13.22 16.29 13.58 16.41C14.17 16.6 14.71 16.57 15.13 16.51C15.61 16.44 16.6 15.91 16.81 15.33C17.02 14.74 17.02 14.24 16.96 14.14C16.9 14.04 16.73 13.98 16.47 13.85C16.21 13.72 14.96 13.11 14.73 13.02C14.5 12.94 14.34 12.9 14.17 13.15C14.01 13.4 13.54 13.98 13.39 14.14C13.25 14.31 13.1 14.33 12.85 14.2C12.59 14.08 11.78 13.81 10.81 12.95C10.06 12.28 9.55 11.45 9.4 11.2C9.26 10.95 9.39 10.82 9.52 10.69C9.63 10.58 9.77 10.4 9.9 10.25C10.03 10.1 10.07 9.99 10.16 9.82C10.24 9.66 10.2 9.51 10.14 9.39C10.07 9.26 9.61 8.13 9.42 7.67C9.24 7.22 9.05 7.28 8.91 7.27C8.78 7.27 8.65 7.33 8.53 7.33Z" />
                  </svg>
                  <span>WhatsApp</span>
                </a>
              ) : (
                <button
                  disabled
                  aria-disabled="true"
                  className="flex-1 sm:flex-initial justify-center px-5 sm:px-6 py-2.5 sm:py-3 bg-white/50 text-on-surface-variant/40 font-label-md text-xs sm:text-label-md rounded-full cursor-not-allowed flex items-center gap-2"
                  title={profile.phone_number ? "WhatsApp contact is set to private" : "WhatsApp not provided"}
                >
                  <svg
                    className="w-[18px] h-[18px] fill-current opacity-40 shrink-0"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.53 7.33C8.36 7.33 8.1 7.4 7.87 7.64C7.65 7.89 7.02 8.48 7.02 9.68C7.02 10.88 7.9 12.04 8.02 12.2C8.14 12.37 9.73 14.83 12.18 15.89C12.77 16.14 13.22 16.29 13.58 16.41C14.17 16.6 14.71 16.57 15.13 16.51C15.61 16.44 16.6 15.91 16.81 15.33C17.02 14.74 17.02 14.24 16.96 14.14C16.9 14.04 16.73 13.98 16.47 13.85C16.21 13.72 14.96 13.11 14.73 13.02C14.5 12.94 14.34 12.9 14.17 13.15C14.01 13.4 13.54 13.98 13.39 14.14C13.25 14.31 13.1 14.33 12.85 14.2C12.59 14.08 11.78 13.81 10.81 12.95C10.06 12.28 9.55 11.45 9.4 11.2C9.26 10.95 9.39 10.82 9.52 10.69C9.63 10.58 9.77 10.4 9.9 10.25C10.03 10.1 10.07 9.99 10.16 9.82C10.24 9.66 10.2 9.51 10.14 9.39C10.07 9.26 9.61 8.13 9.42 7.67C9.24 7.22 9.05 7.28 8.91 7.27C8.78 7.27 8.65 7.33 8.53 7.33Z" />
                  </svg>
                  <span>WhatsApp</span>
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
            <div className="bg-white p-6 sm:p-8 rounded-[24px] shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-[20px]">precision_manufacturing</span>
                <h3 className="font-label-md text-label-md uppercase tracking-widest font-bold">Machinery & Equipment</h3>
              </div>
              {equipment.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {equipment.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-container-low text-on-surface border border-outline-variant/30 text-[12px] font-sans font-medium hover:border-primary/40 transition-colors break-words leading-snug"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
                      <span>{item}</span>
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
            <Link className="text-on-surface-variant hover:text-primary transition-colors text-sm" href="/contact#privacy">Privacy Policy</Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors text-sm" href="/contact#terms">Terms of Service</Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors text-sm" href="/contact">Contact Support</Link>
          </div>
          <div className="text-on-surface-variant text-sm">
            © 2024 TIRAZY. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
