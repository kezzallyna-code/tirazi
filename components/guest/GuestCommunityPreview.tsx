import React from 'react';
import Link from 'next/link';

interface Comment {
  id: string;
  name: string;
  avatar: string;
  text: string;
  date: string;
}

interface Post {
  id: string;
  artisan: {
    name: string;
    avatar: string;
    specialization: string;
    verified: boolean;
  };
  date: string;
  text: string;
  image?: string;
  appreciations: number;
  comments: Comment[];
}

export function GuestCommunityPreview({ post }: { post: Post }) {
  return (
    <div className="bg-white rounded-[24px] p-6 border border-outline-variant/20 shadow-sm flex flex-col gap-4">
      {/* Author Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/15 shrink-0">
          <img src={post.artisan.avatar} alt={post.artisan.name} className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-label-md text-on-surface truncate block font-bold leading-normal">
              {post.artisan.name}
            </span>
            {post.artisan.verified && (
              <span className="material-symbols-outlined text-secondary text-[16px] shrink-0" data-weight="fill">
                verified
              </span>
            )}
          </div>
          <span className="text-[11px] text-on-surface-variant truncate block">{post.artisan.specialization} &middot; {post.date}</span>
        </div>
      </div>

      {/* Post Text */}
      <p className="font-body-md text-on-surface leading-relaxed whitespace-pre-wrap">{post.text}</p>

      {/* Optional Image */}
      {post.image && (
        <div className="rounded-xl overflow-hidden max-h-80 bg-surface-container border border-outline-variant/10">
          <img src={post.image} alt="Post content" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Footer statistics (Read Only) */}
      <div className="flex items-center justify-between text-[12px] text-on-surface-variant/60 pt-2 border-t border-outline-variant/10">
        <span>{post.appreciations} appreciations</span>
        <span>{post.comments.length} comments</span>
      </div>

      {/* Interaction Buttons linking to Join / Login */}
      <div className="flex items-center justify-between gap-1 pt-1">
        <Link 
          href="/register" 
          title="Join TIRAZY to appreciate this post"
          className="flex-grow py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-on-surface-variant/80 hover:text-primary hover:bg-surface-container transition-colors text-[12px] font-bold"
        >
          <span className="material-symbols-outlined text-[16px]">thumb_up</span>
          Appreciate
        </Link>
        <Link 
          href="/register" 
          title="Join TIRAZY to comment on this post"
          className="flex-grow py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-on-surface-variant/80 hover:text-primary hover:bg-surface-container transition-colors text-[12px] font-bold"
        >
          <span className="material-symbols-outlined text-[16px]">chat_bubble</span>
          Comment
        </Link>
        <Link 
          href="/register" 
          title="Join TIRAZY to save this post"
          className="flex-grow py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-on-surface-variant/80 hover:text-primary hover:bg-surface-container transition-colors text-[12px] font-bold"
        >
          <span className="material-symbols-outlined text-[16px]">bookmark</span>
          Save
        </Link>
      </div>
    </div>
  );
}
