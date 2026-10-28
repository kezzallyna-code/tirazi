"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialMockPosts, initialMockArtisans, Post, SuggestedArtisan, Comment } from './mockExploreData';

export interface ExploreContextType {
  posts: Post[];
  suggestedArtisans: SuggestedArtisan[];
  savedPostIds: string[];
  appreciatedPosts: string[];
  following: string[];
  postComments: Record<string, Comment[]>;
  isInitialized: boolean;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  
  currentUser: any | null;
  isGuest: boolean;
  showGuestModal: boolean;
  setShowGuestModal: (show: boolean) => void;
  checkGuestAction: () => boolean;

  isPostSaved: (postId: string) => boolean;
  handleAppreciate: (postId: string) => void;
  toggleSavePost: (postId: string) => void;
  handleFollowToggle: (artisanId: string) => void;
  handlePublishPost: (text: string, mediaUrl: string | null, mediaType: 'image' | 'video' | null, category: string, wilaya: string, postType: string) => void;
  handleEditPostText: (postId: string, text: string) => void;
  handleDeletePost: (postId: string) => void;
  handleAddComment: (postId: string, commentText: string) => void;
  handleSharePost: (postId: string) => void;
}

const ExploreContext = createContext<ExploreContextType | undefined>(undefined);

// Fallback mock user for display when real profile isn't loaded yet
const fallbackMockUser = {
  id: "artisan-current",
  name: "Lina Benyahia",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
  specialization: "Fashion Designer",
  wilaya: "Alger",
  verified: false
};

export const ExploreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>(initialMockPosts);
  const [suggestedArtisans, setSuggestedArtisans] = useState<SuggestedArtisan[]>(initialMockArtisans);
  const [savedPostIds, setSavedPostIds] = useState<string[]>([]);
  const [appreciatedPosts, setAppreciatedPosts] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [postComments, setPostComments] = useState<Record<string, Comment[]>>({});
  
  const [activeCategory, setActiveCategory] = useState<string>('All Categories');

  const [isInitialized, setIsInitialized] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const [currentUser, setCurrentUser] = useState<any | null>(fallbackMockUser);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [showGuestModal, setShowGuestModal] = useState(false);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((curr) => (curr === message ? null : curr));
    }, 2500);
  };

  // Auth check - LOCAL PROTOTYPE MODE
  useEffect(() => {
    const checkAuth = () => {
      // Treat the current page as prototype authenticated mode for testing
      setIsGuest(false);
      
      const localProfile = localStorage.getItem('tirazy_onboarding');
      if (localProfile) {
        try {
          const parsed = JSON.parse(localProfile);
          setCurrentUser({
            id: "local-user-id",
            name: parsed.fullName || 'Lina Benyahia',
            avatar: parsed.avatarUrl || fallbackMockUser.avatar,
            specialization: parsed.roles?.[0] || 'Fashion Designer',
            wilaya: parsed.wilaya || 'Alger',
            verified: true
          });
          return;
        } catch(e) {}
      }
      
      // Fallback to minimal user info
      setCurrentUser(fallbackMockUser);
    };
    checkAuth();
  }, []);

  // Load from local storage
  useEffect(() => {
    const storedPosts = localStorage.getItem('tirazy_explore_posts');
    const storedSaved = localStorage.getItem('tirazy_saved_posts');
    const storedAppreciated = localStorage.getItem('tirazy_post_appreciations');
    const storedFollowing = localStorage.getItem('tirazy_following');
    const storedComments = localStorage.getItem('tirazy_post_comments');

    if (storedPosts) {
      try {
        let parsed = JSON.parse(storedPosts);
        if (Array.isArray(parsed)) {
          parsed = parsed.map(post => {
            if (post.artisan?.name?.includes('Amina') || post.artisan?.name === 'Current User') {
              return {
                ...post,
                artisan: {
                  ...post.artisan,
                  name: 'Lina Benyahia',
                  specialization: 'Fashion Designer',
                  wilaya: 'Alger'
                }
              };
            }
            return post;
          });
        }
        setPosts(parsed);
      } catch (e) {
        setPosts(initialMockPosts);
      }
    } else {
      setPosts(initialMockPosts);
      localStorage.setItem('tirazy_explore_posts', JSON.stringify(initialMockPosts));
    }

    try {
      const storedSaved = localStorage.getItem('tirazy_saved_posts');
      if (storedSaved) {
        const parsed = JSON.parse(storedSaved);
        if (Array.isArray(parsed)) {
          setSavedPostIds(parsed);
        } else {
          setSavedPostIds([]);
        }
      } else {
        setSavedPostIds([]);
      }
    } catch (e) {
      setSavedPostIds([]);
    }
    
    if (storedAppreciated) {
      try { setAppreciatedPosts(JSON.parse(storedAppreciated)); } catch (e) { setAppreciatedPosts([]); }
    }
    
    if (storedFollowing) {
      try { setFollowing(JSON.parse(storedFollowing)); } catch (e) { setFollowing([]); }
    }

    if (storedComments) {
      try { 
        let parsedComments = JSON.parse(storedComments);
        if (typeof parsedComments === 'object' && parsedComments !== null) {
          Object.keys(parsedComments).forEach(key => {
            parsedComments[key] = parsedComments[key].map((comment: any) => {
              if (comment.name?.includes('Amina') || comment.name === 'Current User') {
                return { ...comment, name: 'Lina Benyahia' };
              }
              return comment;
            });
          });
        }
        setPostComments(parsedComments); 
      } catch (e) { 
        setPostComments({}); 
      }
    }

    setSuggestedArtisans(initialMockArtisans);
    setIsInitialized(true);
  }, []);

  // Sync state to localStorage when it changes
  useEffect(() => {
    if (isInitialized) localStorage.setItem('tirazy_explore_posts', JSON.stringify(posts));
  }, [posts, isInitialized]);

  useEffect(() => {
    if (isInitialized) localStorage.setItem('tirazy_saved_posts', JSON.stringify(savedPostIds));
  }, [savedPostIds, isInitialized]);

  useEffect(() => {
    if (isInitialized) localStorage.setItem('tirazy_post_appreciations', JSON.stringify(appreciatedPosts));
  }, [appreciatedPosts, isInitialized]);

  useEffect(() => {
    if (isInitialized) localStorage.setItem('tirazy_following', JSON.stringify(following));
  }, [following, isInitialized]);

  useEffect(() => {
    if (isInitialized) localStorage.setItem('tirazy_post_comments', JSON.stringify(postComments));
  }, [postComments, isInitialized]);

  const checkGuestAction = () => {
    if (isGuest) {
      setShowGuestModal(true);
      return false;
    }
    return true;
  };

  const handleAppreciate = (postId: string) => {
    if (!checkGuestAction()) return;
    
    const hasAppreciated = appreciatedPosts.includes(postId);
    
    if (hasAppreciated) {
      setAppreciatedPosts(prev => prev.filter(id => id !== postId));
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, appreciations: Math.max(0, p.appreciations - 1) } : p));
    } else {
      setAppreciatedPosts(prev => [...prev, postId]);
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, appreciations: p.appreciations + 1 } : p));
    }
  };

  const isPostSaved = (postId: string) => {
    return savedPostIds.includes(postId);
  };

  const toggleSavePost = (postId: string) => {
    setSavedPostIds((prevSaved) => {
      const hasSaved = prevSaved.includes(postId);
      const nextSavedIds = hasSaved
        ? prevSaved.filter((id) => id !== postId)
        : [...prevSaved, postId];

      try {
        localStorage.setItem('tirazy_saved_posts', JSON.stringify(nextSavedIds));
      } catch (err) {
        console.error('Failed to update localStorage for tirazy_saved_posts:', err);
      }

      if (hasSaved) {
        showToast("Post removed from saved inspirations.");
      } else {
        showToast("Post saved to inspirations.");
      }

      return nextSavedIds;
    });
  };

  const handleFollowToggle = (artisanId: string) => {
    if (!checkGuestAction()) return;
    
    const isFollowing = following.includes(artisanId);
    if (isFollowing) {
      setFollowing(prev => prev.filter(id => id !== artisanId));
      showToast(`Unfollowed artisan.`);
    } else {
      setFollowing(prev => [...prev, artisanId]);
      showToast(`Following artisan.`);
    }
  };

  const handlePublishPost = (text: string, mediaUrl: string | null, mediaType: 'image' | 'video' | null, category: string, wilaya: string, postType: string) => {
    if (!checkGuestAction()) return;
    if (!currentUser) return;

    const newPost: Post = {
      id: `post-${Date.now()}`,
      artisan: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        specialization: currentUser.specialization,
        wilaya: currentUser.wilaya,
        verified: currentUser.verified,
      },
      date: "Just now",
      text,
      postType,
      category,
      wilaya,
      image: mediaType === 'image' ? (mediaUrl || undefined) : undefined,
      video: mediaType === 'video' ? (mediaUrl || undefined) : undefined,
      appreciations: 0,
      comments: [],
    };

    setPosts((prevPosts) => [newPost, ...prevPosts]);
    showToast("Your post has been published.");
  };

  const handleEditPostText = (postId: string, text: string) => {
    if (!checkGuestAction()) return;
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId && post.artisan.id === currentUser?.id) {
          return { ...post, text };
        }
        return post;
      })
    );
    showToast("Post updated.");
  };

  const handleDeletePost = (postId: string) => {
    if (!checkGuestAction()) return;
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    setSavedPostIds((prev) => prev.filter((id) => id !== postId));
    setAppreciatedPosts((prev) => prev.filter((id) => id !== postId));
    setPostComments((prev) => {
      const updated = { ...prev };
      delete updated[postId];
      return updated;
    });
    showToast("Post deleted.");
  };

  const handleAddComment = (postId: string, commentText: string) => {
    if (!checkGuestAction()) return;
    if (!currentUser) return;

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      name: currentUser.name,
      avatar: currentUser.avatar,
      text: commentText,
      date: "Just now",
    };

    setPostComments((prev) => {
      const currentComments = prev[postId] || [];
      return {
        ...prev,
        [postId]: [...currentComments, newComment]
      };
    });
  };

  const handleSharePost = (postId: string) => {
    const url = `${window.location.origin}/explore?post=${postId}`;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url)
        .then(() => showToast("Post link copied."))
        .catch(() => showToast("Unable to copy link. Please copy it manually."));
    } else {
      showToast("Unable to copy link. Please copy it manually.");
    }
  };

  return (
    <ExploreContext.Provider
      value={{
        posts,
        suggestedArtisans,
        savedPostIds,
        appreciatedPosts,
        following,
        postComments,
        isInitialized,
        toastMessage,
        showToast,
        activeCategory,
        setActiveCategory,
        currentUser,
        isGuest,
        showGuestModal,
        setShowGuestModal,
        checkGuestAction,
        isPostSaved,
        handleAppreciate,
        toggleSavePost,
        handleFollowToggle,
        handlePublishPost,
        handleEditPostText,
        handleDeletePost,
        handleAddComment,
        handleSharePost,
      }}
    >
      {children}
      
      {/* Guest Modal */}
      {showGuestModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-surface-container-lowest rounded-3xl p-8 max-w-sm w-full shadow-2xl relative border border-outline-variant/30 text-center space-y-6">
            <button 
              onClick={() => setShowGuestModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors text-on-surface-variant"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[32px]">group</span>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-headline-sm text-xl text-on-surface">Join TIRAZY</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Join TIRAZY to interact with the community.
              </p>
            </div>
            
            <div className="flex flex-col gap-3 pt-2">
              <a href="/join" className="w-full py-3 bg-primary text-white rounded-full font-label-md hover:bg-primary-dark transition-colors text-center">
                Create Free Account
              </a>
              <a href="/login" className="w-full py-3 border border-outline text-primary rounded-full font-label-md hover:bg-surface-container transition-colors text-center">
                Log In
              </a>
            </div>
          </div>
        </div>
      )}
    </ExploreContext.Provider>
  );
};

export const useExplore = () => {
  const context = useContext(ExploreContext);
  if (!context) {
    throw new Error('useExplore must be used within an ExploreProvider');
  }
  return context;
};
