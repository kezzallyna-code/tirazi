import React from 'react';
import Logo from '@/components/Logo';
import Link from 'next/link';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          return (await cookieStore).get(name)?.value;
        },
      },
    }
  );

  // Fetch Profile data
  const { data: profile } = await supabase
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

  if (!profile) {
    notFound();
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

  return (
    <div className="stitch-screen-wrapper">
      
<main className="pt-20 pb-12">

<div className="relative w-full h-[400px] overflow-hidden bg-surface-dim group">
<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20 z-10"></div>
<img className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105" src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=2000" alt="Cover" />
<div className="absolute bottom-10 left-margin-desktop right-margin-desktop flex justify-between items-end max-w-container-max mx-auto z-20">
<div className="flex items-center gap-8">
<div className="w-40 h-40 rounded-3xl border-4 border-surface shadow-xl overflow-hidden bg-white translate-y-20">
<img className="w-full h-full object-cover" alt={fullName} src={avatarUrl} />
</div>
<div className="text-white pb-4">
<h1 className="font-headline-md text-headline-md mb-1">{fullName}</h1>
<p className="font-body-lg text-body-lg opacity-90">{roles}</p>
</div>
</div>
<div className="flex gap-4 pb-4">
<Link href="/messages" className="px-8 py-3 bg-white text-primary font-label-md text-label-md rounded-full shadow-lg hover:bg-surface-container-low transition-all active:scale-95 flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]">chat_bubble</span> Message
</Link>
</div>
</div>
</div>

<div className="max-w-container-max mx-auto px-margin-desktop mt-24 flex flex-col md:flex-row gap-gutter">

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
</div>
</div>
</div>

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

<section className="flex-1">
<div className="flex justify-between items-center mb-8">
<h2 className="font-headline-sm text-headline-sm">Portfolio Showcase</h2>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  {projects && projects.length > 0 ? (
    projects.map((project: any) => (
      <div key={project.id} className="group relative overflow-hidden rounded-[24px] bg-white shadow-sm hover:shadow-xl transition-all duration-500">
        <div className="aspect-[4/3] overflow-hidden bg-surface-container-high">
          <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={project.project_media?.[0]?.media_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400'} alt={project.title} />
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
