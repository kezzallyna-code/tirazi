"use client";

import React, { useState } from 'react';
import Logo from '@/components/Logo';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Project } from '@/app/projects/page';import { createClient } from '@/utils/supabase/client';

export default function PublishPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [skills, setSkills] = useState<string[]>(['Silk Weaving', 'Gold Thread', 'Velvet Work']);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Silk Weaving', 'Gold Thread']);
  const [isPublic, setIsPublic] = useState(true);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleAddSkill = () => {
    const newSkill = window.prompt("Enter new craft skill:");
    if (newSkill && newSkill.trim()) {
      const trimmed = newSkill.trim();
      if (!skills.includes(trimmed)) {
        setSkills(prev => [...prev, trimmed]);
      }
      if (!selectedSkills.includes(trimmed)) {
        setSelectedSkills(prev => [...prev, trimmed]);
      }
    }
  };

  React.useEffect(() => {
    const fetchCategories = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('categories').select('id, name');
      if (data && data.length > 0) {
        setCategories(data);
        setCategory(data[0].id);
      }
    };
    fetchCategories();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handlePublish = async (isDraft: boolean = false) => {
    if (!title.trim() || !description.trim()) {
      alert('Please fill in the project title and description.');
      return;
    }

    setIsPublishing(true);
    const supabase = createClient();
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('You must be logged in to publish a project.');
        router.push('/login');
        return;
      }

      // Insert Project
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert({
          author_id: session.user.id,
          title,
          description,
          category_id: category || null,
          wilaya: 'Alger', // default wilaya
          status: isDraft ? 'draft' : 'approved'
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Upload Image if selected
      if (file && projectData) {
        const fileExt = file.name.split('.').pop();
        // RLS policy for project-media requires foldername to be auth.uid()
        const fileName = `${session.user.id}/${projectData.id}-${Math.random()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('project-media')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('project-media')
          .getPublicUrl(fileName);

        if (publicUrlData.publicUrl) {
          await supabase.from('project_media').insert({
            project_id: projectData.id,
            media_url: publicUrlData.publicUrl,
            media_type: 'image',
            sort_order: 0
          });
        }
      }

      alert(isDraft ? 'Project saved as private draft!' : 'Project published successfully!');
      router.push('/projects');
    } catch (error: any) {
      console.error('Error saving project:', error);
      alert('Failed to save project: ' + error.message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="stitch-screen-wrapper">
      
<main className="pt-24 pb-20 px-4 md:px-margin-desktop max-w-container-max mx-auto">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">

<div className="lg:col-span-7 space-y-6">
<div className="bg-surface-container-lowest rounded-[24px] p-6 shadow-sm border border-outline-variant/20 group cursor-pointer transition-all hover:border-primary">
<label className="block mb-4 font-label-md text-label-md text-primary uppercase tracking-widest">Showcase Imagery</label>
<div className="relative aspect-[4/5] w-full rounded-[24px] border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-4 bg-surface-container-low transition-colors group-hover:bg-primary/5 overflow-hidden">

{previewUrl ? (
  <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
) : (
  <div className="flex flex-col items-center text-center px-12">
    <span className="material-symbols-outlined text-primary text-5xl mb-4">add_photo_alternate</span>
    <h3 className="font-title-lg text-title-lg mb-2">Drop your masterpiece here</h3>
    <p className="text-on-surface-variant text-body-md">High-resolution photography (4:5 ratio) highlights the intricate textures of your textile work.</p>
  </div>
)}
<input 
  onChange={handleFileChange}
  accept="image/*"
  aria-label="Upload project image" 
  className="absolute inset-0 opacity-0 cursor-pointer" 
  type="file"
/>
</div>
<div className="mt-4 flex gap-2">
<div className="w-20 h-20 rounded-lg border border-outline-variant bg-surface-container-low flex items-center justify-center">
<span className="material-symbols-outlined text-outline">add</span>
</div>
<p className="text-label-md font-label-md text-on-surface-variant self-center ml-2">Add detail shots (up to 4)</p>
</div>
</div>
<div className="bg-surface-container-lowest rounded-[24px] p-8 shadow-sm border border-outline-variant/20">
<label className="block mb-4 font-label-md text-label-md text-primary uppercase tracking-widest">Story &amp; Craft</label>
<textarea 
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  className="w-full bg-surface-container-low border-none rounded-xl p-4 text-body-lg focus:ring-2 focus:ring-primary min-h-[200px] placeholder:text-outline" 
  placeholder="Describe the heritage, the technique, and the soul of this piece..."
></textarea>
</div>
</div>

<div className="lg:col-span-5 space-y-6">
<div className="bg-surface-container-lowest rounded-[24px] p-8 shadow-sm border border-outline-variant/20 sticky top-24">
<h2 className="font-headline-sm text-headline-sm mb-8 text-on-surface">Project Details</h2>
<div className="space-y-6">

<div>
<label className="block font-label-md text-label-md mb-2 text-on-surface-variant">Project Title</label>
<input 
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary text-body-md" 
  placeholder="e.g. Karakou d'Alger 'Lumière d'Or'" 
  type="text"
/>
</div>

<div>
<label className="block font-label-md text-label-md mb-2 text-on-surface-variant">Primary Category</label>
<div className="relative">
<select 
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  className="w-full appearance-none bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary text-body-md"
>
  {categories.map((cat) => (
    <option key={cat.id} value={cat.id}>{cat.name}</option>
  ))}
</select>
<span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
</div>
</div>

<div>
<label className="block font-label-md text-label-md mb-3 text-on-surface-variant">Craft Expertise Tags</label>
<div className="flex flex-wrap gap-2">
{skills.map((skill) => {
  const isSelected = selectedSkills.includes(skill);
  return (
    <button
      key={skill}
      type="button"
      onClick={() => toggleSkill(skill)}
      className={`px-4 py-1.5 rounded-full font-label-md text-label-md border transition-all cursor-pointer ${
        isSelected
          ? 'bg-primary text-white border-primary shadow-sm font-bold'
          : 'bg-surface-container-high text-on-surface-variant border-outline-variant hover:border-primary'
      }`}
    >
      {skill}
    </button>
  );
})}
<button
  type="button"
  onClick={handleAddSkill}
  className="px-4 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-md text-label-md border border-outline-variant hover:border-primary transition-all cursor-pointer"
>
  + Add Skill
</button>
</div>
</div>

<div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-primary">public</span>
<div>
<p className="font-label-md text-label-md">Professional Visibility</p>
<p className="text-[12px] text-on-surface-variant">{isPublic ? 'Visible to all Network Partners' : 'Private to your atelier'}</p>
</div>
</div>
<div 
  onClick={() => setIsPublic(!isPublic)}
  className={`relative inline-block w-12 h-6 rounded-full transition-colors cursor-pointer ${
    isPublic ? 'bg-primary' : 'bg-outline-variant'
  }`}
>
<div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
  isPublic ? 'right-1' : 'left-1'
}`}></div>
</div>
</div>

<div className="relative py-4 flex items-center justify-center">
<div className="absolute inset-0 flex items-center">
<div className="w-full border-t border-outline-variant/30"></div>
</div>
<div className="relative bg-surface-container-lowest px-4">
<span className="material-symbols-outlined text-primary/30 text-sm">diamond</span>
</div>
</div>

<div className="pt-4 space-y-3">
<button 
  type="button"
  onClick={() => handlePublish(false)}
  disabled={isPublishing}
  className="w-full py-4 bg-primary text-white rounded-full font-label-md text-label-md shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
>
<span className="material-symbols-outlined" data-weight="fill">
  {isPublishing ? 'hourglass_empty' : 'send'}
</span>
  {isPublishing ? 'Publishing...' : 'Publish Project'}
</button>
<button 
  type="button"
  onClick={() => handlePublish(true)}
  disabled={isPublishing}
  className="w-full py-4 border border-secondary text-secondary rounded-full font-label-md text-label-md hover:bg-secondary/5 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
>
  Save as Private Draft
</button>
</div>
</div>
</div>

<div className="bg-secondary-container/20 p-6 rounded-[24px] border border-secondary-container/30">
<div className="flex gap-4">
<span className="material-symbols-outlined text-secondary">tips_and_updates</span>
<div>
<h4 className="font-label-md text-label-md text-on-secondary-container mb-1">Couture Tip</h4>
<p className="text-[13px] text-on-secondary-container leading-relaxed">Artisans who include process shots and mention specific weaving techniques receive 40% more connection requests from luxury markets.</p>
</div>
</div>
</div>
</div>
</div>
</main>

<footer className="mt-20 py-12 bg-surface-dim border-t border-outline-variant/10">
<div className="max-w-container-max mx-auto px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-6">
<div className="text-on-surface-variant font-label-md text-label-md">
                © 2024 TIRAZY. Artisan Network of Algeria.
            </div>
<div className="flex gap-8">
<Link className="text-on-surface-variant hover:text-primary transition-colors text-label-md font-label-md" href="/contact#privacy">Privacy Standards</Link>
<Link className="text-on-surface-variant hover:text-primary transition-colors text-label-md font-label-md" href="/contact#terms">Terms of Craft</Link>
<Link className="text-on-surface-variant hover:text-primary transition-colors text-label-md font-label-md" href="/contact">Support</Link>
</div>
</div>
</footer>
    </div>
  );
}
