"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Post, Comment } from './mockExploreData';
import { useExplore } from './ExploreContext';
import AvailabilityIndicator from '@/components/ui/AvailabilityIndicator';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const {
    handleAppreciate,
    toggleSavePost,
    showToast,
    handleEditPostText,
    handleDeletePost,
    handleAddComment,
    currentUser,
    appreciatedPosts,
    isPostSaved,
    postComments,
    checkGuestAction,
    handleSharePost
  } = useExplore();

  // Local state
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isShowAllComments, setIsShowAllComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  
  // Edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(post.text);

  const isOwnPost = currentUser && post.artisan.id === currentUser.id;
  const hasAppreciated = appreciatedPosts.includes(post.id);
  const hasSaved = isPostSaved(post.id);
  const currentComments = postComments[post.id] || [];
  
  // Combine static mock comments and dynamic ones
  const safePostComments = post.comments || [];
  const allComments = [...safePostComments, ...currentComments];
  const displayedComments = isShowAllComments ? allComments : allComments.slice(0, 3);

  // Handlers
  const handleReportClick = () => {
    if (!checkGuestAction()) return;
    try {
      const reports = JSON.parse(localStorage.getItem('tirazy_reported_posts') || '[]');
      if (!reports.includes(post.id)) {
        reports.push(post.id);
        localStorage.setItem('tirazy_reported_posts', JSON.stringify(reports));
      }
    } catch (e) {}
    showToast("Post reported to the moderation team for review. Thank you.");
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editText.trim()) return;
    handleEditPostText(post.id, editText.trim());
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      handleDeletePost(post.id);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkGuestAction()) return;
    if (!commentText.trim()) return;
    handleAddComment(post.id, commentText.trim());
    setCommentText('');
  };

  return (
    <article className="bg-white dark:bg-surface-container-low rounded-[24px] border border-outline-variant/20 shadow-sm flex flex-col overflow-hidden">
      
      {/* Header */}
      <div className="p-6 pb-4 flex justify-between items-start">
        <div className="flex gap-4">
          <div className="relative shrink-0">
            <div className="w-11 h-11 rounded-full overflow-hidden border border-outline-variant/20 shadow-sm">
              <img src={post.artisan?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'} alt={post.artisan?.name || 'Artisan'} className="w-full h-full object-cover" />
            </div>
            <AvailabilityIndicator
              status={post.artisan?.availability || 'unavailable'}
              size="sm"
              className="absolute -bottom-0.5 -right-0.5"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-title-lg text-[16px] text-on-surface leading-snug">{post.artisan?.name || 'Unknown Artisan'}</h4>
              {post.artisan?.verified && (
                <span className="material-symbols-outlined text-secondary text-[16px]" data-weight="fill" title="Verified Artisan">
                  verified
                </span>
              )}
            </div>
            <p className="text-[12px] text-on-surface-variant/80 font-sans">
              {post.artisan?.specialization || 'Professional'} &middot; {post.wilaya || 'Algeria'}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] text-on-surface-variant/50 font-sans">{post.date || 'Recently'}</span>
              <span className="w-1 h-1 bg-outline-variant/50 rounded-full"></span>
              <span className="text-[11px] font-bold text-primary/80 uppercase tracking-wider">{post.postType || 'Post'}</span>
              <span className="w-1 h-1 bg-outline-variant/50 rounded-full"></span>
              <span className="text-[11px] text-on-surface-variant/80">{post.category || 'General'}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {isOwnPost && !isEditing && (
            <>
              <button 
                onClick={() => setIsEditing(true)}
                className="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant/60 hover:text-primary transition-all"
                title="Edit Post"
              >
                <span className="material-symbols-outlined text-[20px]">edit</span>
              </button>
              <button 
                onClick={handleDeleteClick}
                className="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant/60 hover:text-error transition-all"
                title="Delete Post"
              >
                <span className="material-symbols-outlined text-[20px]">delete</span>
              </button>
            </>
          )}
          <button 
            onClick={() => handleSharePost(post.id)}
            className="w-8 h-8 flex items-center justify-center bg-primary/10 rounded-full text-primary hover:bg-primary hover:text-on-primary hover:shadow-sm transition-all"
            title="Share post"
          >
            <span className="material-symbols-outlined text-[18px]">share</span>
          </button>
        </div>
      </div>

      {/* Body text / Edit input */}
      <div className="px-6 pb-4">
        {isEditing ? (
          <form onSubmit={handleSaveEdit} className="space-y-3">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full bg-surface-container-low/50 border border-outline-variant/30 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md text-on-surface resize-none"
              rows={3}
              maxLength={1000}
              required
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditText(post.text);
                }}
                className="px-4 py-1.5 border border-outline-variant rounded-full font-label-md text-[12px] text-on-surface-variant hover:bg-surface-variant/50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-primary text-on-primary rounded-full font-label-md text-[12px] hover:bg-primary-dark shadow-sm transition-colors"
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          <p className="font-body-md text-body-md text-on-surface leading-relaxed whitespace-pre-wrap">
            {post.text}
          </p>
        )}
      </div>

      {/* Media Attachments */}
      {post.image && (
        <div className="relative border-y border-outline-variant/10 max-h-[480px] bg-black/5 flex items-center justify-center overflow-hidden">
          <img src={post.image} alt="Post Attachment" className="w-full h-full max-h-[480px] object-cover" />
        </div>
      )}

      {post.video && (
        <div className="relative border-y border-outline-variant/10 max-h-[480px] bg-black/5 flex items-center justify-center overflow-hidden">
          <video controls preload="metadata" className="w-full max-h-[480px] object-contain">
            <source src={post.video} />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {/* Stats row */}
      {(post.appreciations > 0 || allComments.length > 0) && (
        <div className="px-6 py-2 flex justify-between items-center text-[12px] text-on-surface-variant/60 border-b border-outline-variant/10 font-sans">
          <div className="flex items-center gap-1.5">
            {post.appreciations > 0 && (
              <>
                <span className="material-symbols-outlined text-secondary text-[14px]" data-weight="fill">thumb_up</span>
                <span>
                  {post.appreciations} {post.appreciations === 1 ? 'Appreciation' : 'Appreciations'}
                </span>
              </>
            )}
          </div>
          <div>
            {allComments.length > 0 && (
              <span>
                {allComments.length} {allComments.length === 1 ? 'comment' : 'comments'}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Actions bar */}
      <div className="px-4 py-2 flex justify-between items-center border-b border-outline-variant/10">
        <button 
          onClick={() => handleAppreciate(post.id)}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl flex-grow font-label-md text-label-md transition-colors hover:bg-surface-variant/30 ${
            hasAppreciated ? 'text-primary font-bold' : 'text-on-surface-variant/80'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]" data-weight={hasAppreciated ? 'fill' : undefined}>thumb_up</span>
          <span className="hidden sm:inline">Appreciate</span>
        </button>

        <button 
          onClick={() => setIsCommentsOpen(!isCommentsOpen)}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl flex-grow font-label-md text-label-md transition-colors hover:bg-surface-variant/30 ${
            isCommentsOpen ? 'text-primary font-bold' : 'text-on-surface-variant/80'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
          <span className="hidden sm:inline">Comment</span>
        </button>

        <button 
          onClick={() => toggleSavePost(post.id)}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl flex-grow font-label-md text-label-md transition-colors hover:bg-surface-variant/30 ${
            hasSaved ? 'text-primary font-bold bg-primary/10' : 'text-on-surface-variant/80'
          }`}
          title={hasSaved ? 'Saved' : 'Save'}
          aria-label={hasSaved ? 'Saved' : 'Save'}
        >
          <span 
            className="material-symbols-outlined text-[20px]" 
            style={{ fontVariationSettings: hasSaved ? "'FILL' 1" : "'FILL' 0" }}
          >
            bookmark
          </span>
          <span>{hasSaved ? 'Saved' : 'Save'}</span>
        </button>

      </div>

      {/* Comments */}
      {isCommentsOpen && (
        <div className="p-6 bg-surface-container-lowest/50 space-y-4">
          
          {/* New Comment */}
          <form onSubmit={handleCommentSubmit} className="flex gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-outline-variant/20 shadow-sm shrink-0">
              <img src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'} alt="Current User Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="flex-grow relative flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onClick={() => checkGuestAction()}
                placeholder="Write a thoughtful comment..."
                className="flex-grow bg-surface-container rounded-xl py-2 px-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md text-on-surface text-sm border-none"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className={`p-2 rounded-xl flex items-center justify-center transition-colors ${
                  !commentText.trim() 
                    ? 'text-on-surface-variant/30 bg-surface-container-low/55' 
                    : 'text-primary hover:bg-primary/10 active:scale-95'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">send</span>
              </button>
            </div>
          </form>

          {/* List of Comments */}
          {allComments.length > 0 && (
            <div className="space-y-4 pt-2">
              {displayedComments.map((comment) => (
                <div key={comment.id} className="flex gap-3 items-start animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/10 shadow-sm shrink-0">
                    <img src={comment.avatar} alt={comment.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-surface-container-low/60 rounded-2xl p-3 flex-grow min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-label-md text-[13px] text-on-surface truncate block font-bold">{comment.name}</span>
                      <span className="text-[10px] text-on-surface-variant/50 shrink-0 font-sans">{comment.date}</span>
                    </div>
                    <p className="font-body-md text-[13px] text-on-surface-variant leading-relaxed whitespace-pre-wrap">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))}

              {/* View all comments toggle */}
              {allComments.length > 3 && (
                <button
                  type="button"
                  onClick={() => setIsShowAllComments(!isShowAllComments)}
                  className="text-primary hover:text-primary-dark font-label-md text-label-md pt-1 block"
                >
                  {isShowAllComments ? 'Show less comments' : `View all ${allComments.length} comments`}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
};
