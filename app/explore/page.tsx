"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useExplore } from '@/components/explore/ExploreContext';
import { PostCard } from '@/components/explore/PostCard';

const WILAYAS = [
  'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar', 'Blida', 'Bouira', 
  'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Alger', 'Djelfa', 'Jijel', 'Sétif', 'Saïda', 
  'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma', 'Constantine', 'Médéa', 'Mostaganem', 'M\'Sila', 'Mascara', 
  'Ouargla', 'Oran', 'El Bayadh', 'Illizi', 'Bordj Bou Arreridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 
  'El Oued', 'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent', 'Ghardaïa', 'Relizane'
];

const CATEGORIES = [
  'Fashion Design', 'Stylisme', 'Modélisme', 'Couture', 
  'Traditional Clothing', 'Crochet', 'Embroidery', 'Leather Work', 'Repair Service'
];

const POST_TYPES = ['Thought', 'Question', 'Tip', 'Work Showcase'];

export default function ExploreFeedPage() {
  const { posts, handlePublishPost, showToast, isInitialized, activeCategory, setActiveCategory, checkGuestAction, currentUser } = useExplore();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPostType, setFilterPostType] = useState<string>('All');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4;

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterPostType, activeCategory]);

  // Post composer state
  const [isExpanded, setIsExpanded] = useState(false);
  const [composerText, setComposerText] = useState('');
  const [composerPostType, setComposerPostType] = useState<string>('Thought');
  const [composerCategory, setComposerCategory] = useState<string>('');
  const [composerWilaya, setComposerWilaya] = useState<string>('');
  
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File size / type rules
  const IMAGE_MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const VIDEO_MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_IMAGES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const ALLOWED_VIDEOS = ['video/mp4', 'video/webm', 'video/quicktime']; // quicktime is .mov

  // Revoke object URLs on unmount
  useEffect(() => {
    return () => {
      if (mediaUrl) {
        URL.revokeObjectURL(mediaUrl);
      }
    };
  }, [mediaUrl]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check type
    if (type === 'image' && !ALLOWED_IMAGES.includes(file.type)) {
      showToast("Invalid image format. Allowed formats: JPG, JPEG, PNG, WEBP.");
      return;
    }
    if (type === 'video' && !ALLOWED_VIDEOS.includes(file.type)) {
      showToast("Invalid video format. Allowed formats: MP4, WEBM, MOV.");
      return;
    }

    // Check size
    if (type === 'image' && file.size > IMAGE_MAX_SIZE) {
      showToast("Image size exceeds 10 MB limit.");
      return;
    }
    if (type === 'video' && file.size > VIDEO_MAX_SIZE) {
      showToast("Video size exceeds 10 MB limit.");
      return;
    }

    if (mediaUrl) {
      URL.revokeObjectURL(mediaUrl);
    }

    // Generate local preview URL
    const objectUrl = URL.createObjectURL(file);
    setMediaUrl(objectUrl);
    setMediaType(type);
  };

  const clearComposerMedia = () => {
    if (mediaUrl) {
      URL.revokeObjectURL(mediaUrl);
    }
    setMediaUrl(null);
    setMediaType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkGuestAction()) return;
    if (!composerText.trim() && !mediaUrl) return;
    if (!composerCategory) {
      showToast("Please select a category.");
      return;
    }
    if (!composerWilaya) {
      showToast("Please select a wilaya.");
      return;
    }

    handlePublishPost(composerText, mediaUrl, mediaType, composerCategory, composerWilaya, composerPostType);
    setComposerText('');
    setMediaUrl(null);
    setMediaType(null);
    setComposerCategory('');
    setComposerWilaya('');
    setComposerPostType('Thought');
    setIsExpanded(false);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterPostType('All');
    setActiveCategory('All Categories');
  };

  // Local Search Filter
  const filteredPosts = posts.filter((post) => {
    // 1. Text / Author Search
    let matchesSearch = true;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      matchesSearch = 
        (post.text?.toLowerCase() || '').includes(query) ||
        (post.artisan?.name?.toLowerCase() || '').includes(query) ||
        (post.artisan?.specialization?.toLowerCase() || '').includes(query) ||
        (post.wilaya?.toLowerCase() || '').includes(query) ||
        (post.category?.toLowerCase() || '').includes(query);
    }

    // 2. Category Filter
    let matchesCategory = true;
    if (activeCategory !== 'All Categories') {
      matchesCategory = post.category === activeCategory;
    }

    // 3. Post Type Filter
    let matchesType = true;
    if (filterPostType !== 'All') {
      matchesType = post.postType === filterPostType;
    }

    return matchesSearch && matchesCategory && matchesType;
  });

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage) || 1;
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  if (!isInitialized) {
    return (
      <div className="flex justify-center py-12">
        <span className="material-symbols-outlined text-primary text-[36px] animate-spin">
          progress_activity
        </span>
      </div>
    );
  }

  const hasFilters = searchQuery.trim() || activeCategory !== 'All Categories' || filterPostType !== 'All';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      <div className="bg-white dark:bg-surface-container-low p-6 rounded-[24px] border border-outline-variant/30 shadow-sm flex flex-col gap-4">
        <h1 className="font-display text-2xl text-primary font-bold">Discover the TIRAZY Community</h1>
        
        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-grow bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 flex items-center gap-3">
            <span className="material-symbols-outlined text-on-surface-variant/60">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts, artisans, categories, wilayas..."
              className="w-full bg-transparent border-none outline-none font-body-md text-on-surface placeholder:text-on-surface-variant/45"
            />
          </div>
          
          <select 
            value={filterPostType} 
            onChange={(e) => setFilterPostType(e.target.value)}
            className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 font-body-md text-on-surface outline-none focus:border-primary shrink-0"
          >
            <option value="All">All Post Types</option>
            {POST_TYPES.map(pt => <option key={pt} value={pt}>{pt}</option>)}
          </select>
        </div>

        {/* Clear Filters */}
        {hasFilters && (
          <div className="flex items-center gap-4 text-label-md">
            <span className="text-on-surface-variant/70">
              Showing {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''}
            </span>
            <button 
              onClick={clearFilters}
              className="text-secondary hover:text-primary transition-colors font-bold flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Post Composer */}
      <div className="bg-white dark:bg-surface-container-low p-6 rounded-[24px] border border-outline-variant/30 shadow-sm">
        <form onSubmit={handlePublishSubmit} className="space-y-4">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/20 shadow-sm shrink-0">
              <img src={currentUser?.avatar} alt="Current User Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="flex-grow">
              {isExpanded ? (
                <textarea
                  rows={4}
                  maxLength={1000}
                  value={composerText}
                  onChange={(e) => setComposerText(e.target.value)}
                  placeholder="Share a thought, showcase your work, or ask a question..."
                  className="w-full bg-surface-container-low/50 border border-outline-variant/30 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md text-on-surface resize-none"
                  autoFocus
                />
              ) : (
                <div 
                  onClick={() => {
                    if (checkGuestAction()) setIsExpanded(true);
                  }}
                  className="w-full bg-surface-container-low/50 hover:bg-surface-container-low border border-outline-variant/30 rounded-full py-2.5 px-6 font-body-md text-on-surface-variant/60 cursor-pointer transition-colors"
                >
                  Share an update with the community...
                </div>
              )}
            </div>
          </div>

          {isExpanded && (
            <div className="pl-14 space-y-4">
              
              <div className="flex flex-wrap gap-3">
                <select 
                  value={composerPostType}
                  onChange={(e) => setComposerPostType(e.target.value)}
                  className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-1.5 font-label-md text-sm outline-none"
                >
                  {POST_TYPES.map(pt => <option key={pt} value={pt}>{pt}</option>)}
                </select>

                <select 
                  value={composerCategory}
                  onChange={(e) => setComposerCategory(e.target.value)}
                  required
                  className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-1.5 font-label-md text-sm outline-none"
                >
                  <option value="" disabled>Select Category *</option>
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>

                <select 
                  value={composerWilaya}
                  onChange={(e) => setComposerWilaya(e.target.value)}
                  required
                  className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-1.5 font-label-md text-sm outline-none"
                >
                  <option value="" disabled>Select Wilaya *</option>
                  {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>

              {/* Media Preview */}
              {mediaUrl && (
                <div className="relative rounded-2xl overflow-hidden border border-outline-variant/20 shadow-sm max-h-72 bg-black/5 flex items-center justify-center">
                  <div className="absolute top-3 left-3 bg-black/60 text-white text-[11px] px-2 py-1 rounded font-bold uppercase backdrop-blur-md">
                    Local media preview
                  </div>
                  {mediaType === 'image' ? (
                    <img src={mediaUrl} alt="Upload preview" className="max-h-72 object-contain" />
                  ) : (
                    <video controls className="max-h-72 object-contain w-full">
                      <source src={mediaUrl} />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  <button
                    type="button"
                    onClick={clearComposerMedia}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                    title="Remove media"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
              )}

              <div className="flex flex-wrap justify-between items-center gap-3 text-label-md font-label-md">
                <span className="text-on-surface-variant/50">
                  {composerText.length} / 1000 characters
                </span>
                
                <div className="flex items-center gap-2">
                  
                  {/* Photo Button */}
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    ref={fileInputRef}
                    onChange={(e) => handleFileSelect(e, 'image')}
                    className="hidden"
                    disabled={!!mediaUrl}
                    id="composer-photo-input"
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('composer-photo-input')?.click()}
                    disabled={!!mediaUrl}
                    className={`flex items-center gap-1.5 px-3 py-1.5 border border-outline-variant rounded-full text-on-surface-variant transition-colors ${
                      !!mediaUrl ? 'opacity-40 cursor-not-allowed' : 'hover:bg-surface-variant/50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px] text-secondary">image</span>
                    Add Photo
                  </button>

                  {/* Video Button */}
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    onChange={(e) => handleFileSelect(e, 'video')}
                    className="hidden"
                    disabled={!!mediaUrl}
                    id="composer-video-input"
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('composer-video-input')?.click()}
                    disabled={!!mediaUrl}
                    className={`flex items-center gap-1.5 px-3 py-1.5 border border-outline-variant rounded-full text-on-surface-variant transition-colors ${
                      !!mediaUrl ? 'opacity-40 cursor-not-allowed' : 'hover:bg-surface-variant/50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px] text-primary">movie</span>
                    Add Video
                  </button>

                  <button
                    type="submit"
                    disabled={(!composerText.trim() && !mediaUrl) || !composerCategory || !composerWilaya}
                    className={`px-6 py-1.5 rounded-full font-label-md shadow-sm transition-all active:scale-95 ${
                      (!composerText.trim() && !mediaUrl) || !composerCategory || !composerWilaya
                        ? 'bg-outline-variant/30 text-on-surface-variant/40 cursor-not-allowed'
                        : 'bg-primary text-on-primary hover:bg-primary-dark shadow-md hover:shadow-lg'
                    }`}
                  >
                    Publish
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Feed list */}
      {filteredPosts.length > 0 ? (
        <div className="space-y-6">
          {paginatedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}

          {/* Pagination Controls */}
          {filteredPosts.length > postsPerPage && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-surface-container-low p-5 rounded-[24px] border border-outline-variant/30 shadow-sm">
              <div className="text-[13px] text-on-surface-variant font-label-md">
                Showing <span className="font-bold text-on-surface">{startIndex + 1}</span>–<span className="font-bold text-on-surface">{Math.min(startIndex + postsPerPage, filteredPosts.length)}</span> of <span className="font-bold text-primary">{filteredPosts.length}</span> posts
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                  className="px-3.5 py-2 rounded-xl border border-outline-variant/40 font-label-md text-[13px] text-on-surface hover:bg-surface-variant/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => {
                      setCurrentPage(pageNumber);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-9 h-9 rounded-xl font-label-md text-[13px] font-bold transition-all cursor-pointer ${
                      currentPage === pageNumber
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-on-surface hover:bg-surface-variant/40 border border-outline-variant/20'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === totalPages}
                  className="px-3.5 py-2 rounded-xl border border-outline-variant/40 font-label-md text-[13px] text-on-surface hover:bg-surface-variant/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer"
                >
                  Next
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-surface-container-low p-12 rounded-[24px] border border-outline-variant/20 shadow-sm text-center">
          <span className="material-symbols-outlined text-on-surface-variant/30 text-[48px] mb-4">
            search_off
          </span>
          <h3 className="font-headline-sm text-[20px] text-on-surface mb-2">No posts found.</h3>
          <p className="font-body-md text-on-surface-variant max-w-sm mx-auto leading-relaxed">
            Try adjusting your search query, or clear the category/type filters.
          </p>
        </div>
      )}

    </div>
  );
}
