"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import { createClient } from '@/utils/supabase/client';

export interface Project {
  id: string;
  title: string;
  category: string;
  location: string;
  wilaya: string;
  artisanName: string;
  artisanAvatar: string;
  artisanWilaya: string;
  text: string;
  image: string;
  status: string;
  applicants: number;
}

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [wilayaSearch, setWilayaSearch] = useState<string>('');
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [savedProjectIds, setSavedProjectIds] = useState<Set<string>>(new Set());
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const categories = ['All', 'Embroidery', 'Pattern Making', 'Silk Weaving', 'Sustainable Dyeing', 'Leather Work', 'Haute Couture', 'Traditional Karakou'];

  // Local Mock Projects Data matching static cards
  const initialProjects: Project[] = [
    {
      id: "proj-1",
      title: "Looking for Modéliste",
      category: "Pattern Making",
      location: "Algiers, Algeria",
      wilaya: "Algiers",
      artisanName: "Maison de Couture",
      artisanAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDF3bvWAEetkDHZJAGPeux8hHGYgX6x4PRbJl9dQvSj8fDnf_r9n6DbmU9Kw4KdN1nGP2boA46S75vJSa7m5ilwY8SPXdkCvJRgAt9BuLPXWw0IDA_j9WJm95F4tWzUSS02JuegxYkxn3eP55J9rc1jOfqUTNxPTymbVo-V3oT2uie2NPeQiugQxn_mUHfsYA8RnIgoOyrf-aP0yfnLVobN9VCdSEGgetxJzfpL9CIKNaquPRzaVk5PVmJ5LEXKgZY1lVIWTjENtbg",
      artisanWilaya: "Algiers",
      text: "Seeking a highly skilled pattern maker (Modéliste) for a collection of contemporary luxury Kaftans. Requires experience with high-end silk and intricate draping techniques.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOUy3fCNkF_b4p3zgvCKu4yBLJKTRJh9GBTvwJMHFYjALFuGq4J856vdp-s2Bo49TcIg0Yw-quv8UahWhZb4vqKuXDNQH5Fvucv3huBay-RP32toSmiD4ROeOVsWbPQ3nkrpqrCe8rVkyviCeuuBrsx1WHg3BHZ16O3IkLXgtRuotJ7kzVEymCCbKVPZ1RbNhd_HaIjnYzrgQ7juvlgh0nrjOj41LmR-G1Cx2KaNVKVEWciyScaJhwKhm-0-hog5yzAwtWLtYZT2k",
      status: "Urgent",
      applicants: 4
    },
    {
      id: "proj-2",
      title: "Authentic Ghardaia Weaver",
      category: "Silk Weaving",
      location: "Ghardaia, DZ",
      wilaya: "Ghardaia",
      artisanName: "Studio M'zab",
      artisanAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBiDmX5E3JO2varMUPwwQHzt5fBDQcpXmVfEt0YolLgv8uue5CAdBUQJGHh16_ZVBZrlXruIY6J6aJM0RN8lfIu18Mq0tvNXzSBemQozdLlsuw2s0KuwcnZja6R7J4Khz57k2rHCtP_ZwkPR5WJSIzYFtZBPy6x0dRzmcidROcnP5dOx0oTzvS8PQKblwtRvlwxOqbvQTkuWGrWZtLAiVw96kev5jsZprZcNQsHXgAjkDWlNh6jHrm52bX3RlyHdRVyIIjpKNxJhiw",
      artisanWilaya: "Ghardaia",
      text: "We are a design studio looking for a master weaver specialized in M'zab style patterns for a collaborative home decor series. Partnership based on profit share.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAqmR38wKUArH1jCI6hvkULy8Krkd9kcXLt7w89-lyhohqe3Yj5cgDpVY_xsxcJSnsKMwGbrsNZNQ7ORsMRlAj-jfdIswL3diyPgJLOv8AXUHHGkY1I-9Ee6qEnxUOZaIUZ_RBgjSDtbVkRZyhX2gPsHvbyUjfoHYbGtrLrbPIASoE1qI2eWqthbNViYeVluUhBMCWVVCAhlmlb2oM4gsHpTsw7-IrZtgsICGoqq50kHm1cj8fBn0t-i3VaOut4BdR_9P1n_pQPmVs",
      status: "Ongoing",
      applicants: 0
    },
    {
      id: "proj-3",
      title: "Fetla Embroidery Expert",
      category: "Embroidery",
      location: "Constantine, DZ",
      wilaya: "Constantine",
      artisanName: "Couture Palace",
      artisanAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNTtNY_xhHd0zaDEwTbxVad4Mc4gK1XpJfz2MhQPiaFLxD1yinvMJ-GaSl8uWvAf2sJy7vOf1faMtc2xfZBXq-hCqf2l-p5r8KSsMlZyx1wJxMEBdnMC2rSYymjAAS4_EOdHWYv0es8zS7bufsfZF4pN9jVGxjSLwMsAEs8HRoB8zTrkDZYPlJ-OLIlCxt43jQdr7bQuoQh2UeAyJZDeutJzebiIhx9Zp6oAqYth5WrUR5eXqgwbq7J9doF77oFom9k9kqGoXOPUc",
      artisanWilaya: "Constantine",
      text: "Modern couture house in Constantine looking for embroidery specialists for seasonal festive wear. Contract-based work for 3 months.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCnYNso6SqGYN9mbFQ3LMgtCorWbBUGboPNULEnpCBLVkFDFkO7BmmDWW58BVD6zW4YLDNWqsoDvDZR80mSFuvEleH2qC607ABF_pNEwpSwOa8W7Is_jOB6t3jkPaUabR-UuUsykXxC0cUWq62GVxwwUGpC6AdPHateWXuldMINlurJXr33u_Odj658W0C0Fh8OnU9wFMA-Qs_OOvvKbN7oXeWeU7cX8evBXVViYA8fTOQv-ph1rFo8Y2ZXA-hhX_spA8mklB2U2pg",
      status: "New",
      applicants: 12
    },
    {
      id: "proj-4",
      title: "Eco-Dyeing Partner",
      category: "Sustainable Dyeing",
      location: "Tlemcen, DZ",
      wilaya: "Tlemcen",
      artisanName: "EcoColors",
      artisanAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuANf5msGfpBwraVf80zGPy0n3JBSPQp6MJnVF9YgMG58-etwGk_a54lmk8QfX1EXbv_uilQ--5g1qGqkj96Jq1s1HxQHwrKM6G_8JXsDi61ArduC2YHPX5ze6HdbARr2B9o5apGNiSMVlfuqennc3iCRJIveZmPd62P4gyjNBOTihnjFjw_D11zWSkiNWJOe3Z6RVlGJURqPC2HDH2q0aCLd_2puyyNjN6gV3ToAS27HUt0Pgw4OeZJWV2jaKEJ_mkq1zOIZGRgRo4",
      artisanWilaya: "Tlemcen",
      text: "Seeking a small-batch dyeing facility that uses plant-based pigments. We need to process 500 meters of organic cotton for an eco-friendly summer line.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdWxs9mvmZ8tAUtZiYpYCb887fLW6pxYPWgHRmW3igpQRNBAq_-JkpzPIa1ZXvaiqkmQ-dFtnR1WYyHxAM2ovdWU9eoGQ3W5ISu9dKYg7aE63IaL4k3fbEIlYAYHZcvmhAp_2hAAyD29D88xEbzASBUwBDNMiv42NyVyv56mfPDFJUpFFRT9fy2GleeBaqKdU0A_RGSGmIvdSY0TLJm1SEZMTjf33Mg3EgRdAbfQu3T_Mn5Q0-bTZIaud9KLwWE5XImyM6LZVW_AU",
      status: "Normal",
      applicants: 0
    },
    {
      id: "proj-5",
      title: "Bulk Linen Sourcing",
      category: "Leather Work",
      location: "Oran, Algeria",
      wilaya: "Oran",
      artisanName: "LinenCraft",
      artisanAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdsisJLsNytP5IqFY9IJml2oTo2hZxJahnNAmqjJFnPBQmncrl9Z-d2Q0elaswILDwfrUCOKsovfnv-hNyb1ooBK87GY-TQ3h1SLwGa3iE5ix_fXR0SO5GbXd39HyGQoT6UiNNJeNgrVohh_heRYb5bBMn70BckYZe2b_Zulfvrq7JTSeNI6LXP3R3s68tgdDyKT2GrmoIVJ2XONpJgclvtm7LgOAYdNY-PZs2zEdudNal7wgrY8pgFISNI34FvlzbLbtg7-IuWeU",
      artisanWilaya: "Oran",
      text: "Manufacturer looking for a local source of high-quality linen. We are shifting production to 100% locally sourced materials. Open to long-term contracts.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0Vq2VhoFu44ICvw4kX78ly5ngopQcd_jvPL-otjDl181yWrKmnKypoBLLGF_g44Y8YBOh0mYjQ0zz4fwOwlK0CUHqqhB-DIjyGYJAoL6LMv2ZRNzoPa3XblLnj7m4miCSjVy-hCCt7iV1LwUuXfbheo4qzqpYirr03951PR09kO0u83QfMV99AmHdkFiVtDn8IqhzWEXvu5ozxK1fE3-jQ4MgyJ8aMt4DQ_s1iLegIKF0ZeZjmLw5L3Sz0rWM6PYP1JKGnZWsPgY",
      status: "Normal",
      applicants: 8
    },
    {
      id: "proj-6",
      title: "Digital Print Designer",
      category: "Embroidery",
      location: "Remote / Algiers",
      wilaya: "Algiers",
      artisanName: "Amazigh Prints",
      artisanAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuA3koWWcERGdLOv4wuYsDzlX_Z1qLxp7Ozfn-zmj5KVlxwS4Phxd4zxeIV9i40DmEtMvPL91Chdz7TtGqO2PQW81MvzK_UdlNfAHIhW082_yRpSRQgbMb3-91usAy83l5N8ZGGNH0UuOBVOpQe-S8j4T--IIsoCuIB7-saUKKhFtgd3LAKlR6JRKGeD18-IVOWztEPbNHdvPTVqpKF31AB57o7O5Fg5jgdHDpuJA--5w-JwUIaQhGfyIfdV5ma5Q5jss6pZMKtG0X4",
      artisanWilaya: "Algiers",
      text: "Need an artist to create unique digital prints inspired by Amazigh symbols for a new collection of silk scarves. Looking for a contemporary graphic style.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAItdWOY1pa8uzAkEWfvWhanlTiXv9DAoduMTmWyO3IE6RDN82XvD58K4_6SF-C86dsaKsAaGQ2dClIuJ7vsSpIdt_g5-vXTTazjbv1k5ROJmzUobVENKACilTR0qMVo_fbj6g_2lfu5jsinhuT-uOtT4_-1_elVDRy9qgoCSDwRerl13FtayNlmGBQeA401jB0e5NI--XWlgcF65mKn3ayMC8HVXAsHIzP_M1Yz2YzYhcwcPpzOFGKEweeMMaeEa4I3vacwU_RRMc",
      status: "Normal",
      applicants: 1
    }
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id,
          title,
          description,
          status,
          wilaya,
          categories ( name ),
          profiles ( full_name, avatar_url, wilaya ),
          project_media ( media_url )
        `)
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        const formatted = data.map((p: any) => ({
          id: p.id,
          title: p.title,
          category: p.categories?.name || 'Project',
          location: p.profiles?.wilaya || p.wilaya || 'Algeria',
          wilaya: p.wilaya || p.profiles?.wilaya || 'Algeria',
          artisanName: p.profiles?.full_name || 'Artisan',
          artisanAvatar: p.profiles?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
          artisanWilaya: p.profiles?.wilaya || 'Algeria',
          text: p.description,
          image: p.project_media?.[0]?.media_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
          status: p.status === 'approved' ? 'New' : p.status, // mapping status
          applicants: 0
        }));
        setProjectsList([...formatted, ...initialProjects]);
      } else {
        setProjectsList(initialProjects);
      }

      // Fetch current user and their saved projects
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUserId(session.user.id);
        const { data: savedData } = await supabase
          .from('saved_projects')
          .select('project_id')
          .eq('profile_id', session.user.id);
        
        if (savedData) {
          setSavedProjectIds(new Set(savedData.map((s: any) => s.project_id)));
        }
      }
    };
    fetchProjects();
  }, []);

  const handleSaveProject = async (projectId: string) => {
    if (!currentUserId) {
      alert('Please log in to save projects.');
      return;
    }

    const supabase = createClient();
    const isSaved = savedProjectIds.has(projectId);
    
    // Optimistic UI update
    setSavedProjectIds(prev => {
      const newSet = new Set(prev);
      if (isSaved) newSet.delete(projectId);
      else newSet.add(projectId);
      return newSet;
    });

    try {
      if (isSaved) {
        await supabase.from('saved_projects').delete().match({ project_id: projectId, profile_id: currentUserId });
      } else {
        await supabase.from('saved_projects').insert({ project_id: projectId, profile_id: currentUserId });
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      // Revert on error
      setSavedProjectIds(prev => {
        const newSet = new Set(prev);
        if (isSaved) newSet.add(projectId);
        else newSet.delete(projectId);
        return newSet;
      });
    }
  };

  // Combined Category + Wilaya filter
  const filteredProjects = projectsList.filter((project) => {
    // 1. Category Filter
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;

    // 2. Wilaya Search Filter (compares against both project wilaya and artisan wilaya)
    const query = wilayaSearch.trim().toLowerCase();
    const matchesWilaya = !query || 
      project.wilaya.toLowerCase().includes(query) || 
      project.artisanWilaya.toLowerCase().includes(query);

    return matchesCategory && matchesWilaya;
  });

  return (
    <div className="stitch-screen-wrapper">
      
      {/* Main Content Area */}
      <main className="pt-24 pb-12 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">

        {/* Title Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="font-headline-md text-headline-md text-primary mb-2">Projects</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Connect with Algeria's finest textile artisans, designers, and manufacturers to bring your creative vision to life.</p>
          </div>
          <div className="flex gap-3">
            <button 
              type="button"
              onClick={() => {
                const searchInput = document.getElementById('project-wilaya-search');
                if (searchInput) {
                  searchInput.focus();
                  searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              className="flex items-center gap-2 px-6 py-3 border border-primary text-primary rounded-full font-label-md hover:bg-primary/5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              Filter Requests
            </button>
            <Link href="/publish" className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-full font-label-md shadow-md hover:shadow-xl transition-all">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Create Project
            </Link>
          </div>
        </div>

        {/* Interactive Category Filters and Wilaya Search Bar */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full font-label-md text-label-md transition-all active:scale-95 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-primary text-on-primary shadow-sm font-bold'
                    : 'bg-primary-container/20 text-primary border border-primary/10 hover:bg-primary-container/30'
                }`}
              >
                {cat === 'All' ? 'All Requests' : cat}
              </button>
            ))}
          </div>

          {/* Wilaya Search Field */}
          <div className="relative w-full md:w-72 bg-white dark:bg-surface-container-low p-3 rounded-xl border border-outline-variant/30 shadow-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-on-surface-variant/60 text-[20px]">
              location_on
            </span>
            <input
              id="project-wilaya-search"
              type="text"
              value={wilayaSearch}
              onChange={(e) => setWilayaSearch(e.target.value)}
              placeholder="Search by Wilaya..."
              className="w-full bg-transparent border-none outline-none font-body-md text-on-surface placeholder:text-on-surface-variant/45 text-sm"
            />
            {wilayaSearch && (
              <button
                type="button"
                onClick={() => setWilayaSearch('')}
                className="p-1 hover:bg-surface-container rounded-full text-on-surface-variant/60 transition-colors shrink-0"
                title="Clear search"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

        </div>

        {/* Search Result Feedback */}
        {wilayaSearch.trim() && (
          <div className="text-label-md font-label-md text-on-surface-variant/70 mb-6 pl-2">
            Showing {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} in {wilayaSearch}
          </div>
        )}

        {/* Projects Cards List Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <article key={project.id} className="bg-white rounded-[24px] overflow-hidden border border-primary/5 portfolio-card-shadow flex flex-col group hover:-translate-y-1 transition-all duration-300">
                
                <div className="relative h-64 overflow-hidden">
                  <img alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={project.image}/>
                  {project.status !== 'Normal' && (
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className={`px-3 py-1 text-[12px] font-bold rounded-full uppercase tracking-wider flex items-center gap-1 ${
                        project.status === 'Urgent' 
                          ? 'bg-tertiary text-white' 
                          : 'bg-secondary text-on-secondary'
                      }`}>
                        {project.status === 'Urgent' && <span className="material-symbols-outlined text-[14px]">bolt</span>}
                        {project.status}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-title-lg text-title-lg text-on-surface mb-1">{project.title}</h3>
                      <p className="font-label-md text-label-md text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">location_on</span> 
                        {project.location}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-surface-container-high overflow-hidden border border-outline-variant shrink-0">
                      <img alt={project.artisanName} className="w-full h-full object-cover" src={project.artisanAvatar}/>
                    </div>
                  </div>

                  <p className="font-body-md text-body-md text-on-surface-variant mb-6 flex-grow">
                    {project.text}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex -space-x-2">
                      {project.applicants > 0 ? (
                        <>
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-surface-container">
                            <img alt="applicant" className="w-full h-full rounded-full object-cover" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100"/>
                          </div>
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-primary text-[10px] text-white flex items-center justify-center font-bold">
                            +{project.applicants}
                          </div>
                        </>
                      ) : (
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-surface-container flex items-center justify-center font-bold text-[10px] text-on-surface-variant italic">
                          0
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleSaveProject(project.id)}
                        className={`p-2 border rounded-full transition-colors ${
                          savedProjectIds.has(project.id) 
                            ? 'bg-primary border-primary text-white' 
                            : 'border-outline-variant text-on-surface-variant hover:bg-surface-container'
                        }`}
                        title={savedProjectIds.has(project.id) ? "Unsave Project" : "Save Project"}
                      >
                        <span className="material-symbols-outlined" data-weight={savedProjectIds.has(project.id) ? "fill" : "regular"}>
                          bookmark
                        </span>
                      </button>
                      <Link href="/messages" className="px-6 py-2 bg-primary text-on-primary rounded-full font-label-md active:scale-95 transition-transform inline-flex items-center justify-center">
                        Apply
                      </Link>
                    </div>
                  </div>

                </div>

              </article>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-surface-container-low p-12 rounded-[24px] border border-primary/5 shadow-sm text-center">
            <span className="material-symbols-outlined text-on-surface-variant/30 text-[48px] mb-4 animate-pulse">
              location_off
            </span>
            <h3 className="font-headline-sm text-[20px] text-on-surface mb-2">No projects found in this Wilaya.</h3>
            <p className="font-body-md text-on-surface-variant max-w-sm mx-auto leading-relaxed">
              Try another region or clear the filter.
            </p>
          </div>
        )}

      </main>

    </div>
  );
}
