
import React, { useState, useMemo, useEffect } from 'react';
import { User, Post, Comment, Community } from '../types';

interface FeedViewProps {
  user: User;
  onNotify?: (message: string, type?: 'info' | 'success') => void;
}

const INITIAL_MOCK_POSTS: Post[] = [
  { 
    id: '1', 
    communityId: 'c1', 
    authorId: 'u1', 
    authorName: 'Ana Souza', 
    content: 'Hoje tive um dia difícil com minha ansiedade, mas meditar por 10 minutos realmente ajudou a acalmar meus pensamentos. Alguém mais usa essa técnica?', 
    createdAt: '2h atrás', 
    likes: 12,
    likedBy: [],
    comments: [
      { id: 'com1', authorId: 'u2', authorName: 'Marcos Lima', content: 'Eu uso! Me ajuda muito no trabalho.', createdAt: '1h atrás', likes: 3, likedBy: [], replies: [] }
    ]
  },
  { 
    id: '2', 
    communityId: 'c2', 
    authorId: 'u2', 
    authorName: 'Marcos Lima', 
    content: 'Acabei de organizar minha mesa usando o método 5S e me sinto muito mais produtivo para focar no TDAH hoje!', 
    createdAt: '5h atrás', 
    likes: 8,
    likedBy: [],
    comments: []
  }
];

const CommentItem: React.FC<{ 
  comment: Comment, 
  onReply: (commentId: string, content: string) => void,
  onLike: (commentId: string) => void,
  onDelete: (commentId: string) => void,
  user: User,
  canInteract: boolean
}> = ({ comment, onReply, onLike, onDelete, user, canInteract }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  
  const isAuthor = comment.authorId === user.id;
  const isLiked = comment.likedBy?.includes(user.id);

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onReply(comment.id, replyText);
    setReplyText('');
    setShowReplyInput(false);
  };

  return (
    <div className="mt-4 pl-4 border-l-2 border-slate-100 group/comment">
      <div className="flex items-start gap-3">
        <img src={`https://picsum.photos/seed/${comment.authorName}/30`} className="w-8 h-8 rounded-full border border-slate-100" alt="" />
        <div className="flex-1 bg-slate-50 p-3 rounded-xl relative">
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold text-xs text-slate-800">{comment.authorName}</span>
            <div className="flex items-center gap-2">
               <span className="text-[10px] text-slate-400">{comment.createdAt}</span>
               {isAuthor && (
                 <button 
                  onClick={() => onDelete(comment.id)}
                  className="text-slate-300 hover:text-red-500 opacity-0 group-hover/comment:opacity-100 transition-opacity p-1 rounded-md hover:bg-red-50"
                  title="Excluir meu comentário"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                   </svg>
                 </button>
               )}
            </div>
          </div>
          <p className="text-sm text-slate-700">{comment.content}</p>
          <div className="flex items-center gap-4 mt-2">
            <button 
              onClick={() => canInteract && onLike(comment.id)}
              disabled={!canInteract}
              className={`flex items-center gap-1 text-[10px] font-bold transition-colors ${
                canInteract ? (isLiked ? 'text-pink-600' : 'text-slate-500 hover:text-pink-500') : 'text-slate-300 cursor-not-allowed'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 ${isLiked ? 'fill-pink-500 text-pink-500' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{comment.likes > 0 ? comment.likes : ''} {isLiked ? 'Curtiu' : 'Curtir'}</span>
            </button>
            <button 
              onClick={() => canInteract && setShowReplyInput(!showReplyInput)}
              disabled={!canInteract}
              className={`text-[10px] font-bold transition-colors ${
                canInteract ? 'text-indigo-600 hover:underline' : 'text-slate-300 cursor-not-allowed'
              }`}
            >
              Responder
            </button>
          </div>
        </div>
      </div>

      {showReplyInput && canInteract && (
        <form onSubmit={handleReplySubmit} className="mt-2 pl-11 flex gap-2">
          <input 
            autoFocus
            className="flex-1 text-sm p-2 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Escreva sua resposta..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <button type="submit" className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-lg font-bold">Enviar</button>
        </form>
      )}

      {comment.replies && comment.replies.map(reply => (
        <CommentItem 
          key={reply.id} 
          comment={reply} 
          onReply={onReply} 
          onLike={onLike} 
          onDelete={onDelete}
          user={user} 
          canInteract={canInteract} 
        />
      ))}
    </div>
  );
};

export const FeedView: React.FC<FeedViewProps> = ({ user, onNotify }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedCommunityForPost, setSelectedCommunityForPost] = useState<string>(user.joinedCommunities[0] || 'general');
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  
  const allCommunities: Community[] = JSON.parse(localStorage.getItem('vivamente_communities') || '[]');

  useEffect(() => {
    const storedPosts = localStorage.getItem('vivamente_posts');
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    } else {
      setPosts(INITIAL_MOCK_POSTS);
      localStorage.setItem('vivamente_posts', JSON.stringify(INITIAL_MOCK_POSTS));
    }
  }, []);

  const savePosts = (updatedPosts: Post[]) => {
    setPosts(updatedPosts);
    localStorage.setItem('vivamente_posts', JSON.stringify(updatedPosts));
  };

  const joinedCommunityObjects = useMemo(() => {
    return user.joinedCommunities.map(id => {
      if (id === 'general') return { id: 'general', name: 'Geral' };
      const found = allCommunities.find(c => c.id === id);
      return { id, name: found ? found.name : `Grupo ${id}` };
    });
  }, [user.joinedCommunities, allCommunities]);

  const visiblePosts = useMemo(() => {
    return posts.filter(post => user.joinedCommunities.includes(post.communityId) || post.communityId === 'general');
  }, [posts, user.joinedCommunities]);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost: Post = {
      id: Date.now().toString(),
      communityId: selectedCommunityForPost,
      authorId: user.id,
      authorName: user.name,
      content: newPostContent,
      createdAt: 'Agora',
      likes: 0,
      likedBy: [],
      comments: []
    };

    savePosts([newPost, ...posts]);
    setNewPostContent('');
    onNotify?.("Postagem publicada com sucesso!");
  };

  const handleDeletePost = (postId: string) => {
    if (window.confirm('Excluir esta postagem permanentemente?')) {
      savePosts(posts.filter(p => p.id !== postId));
      onNotify?.("Postagem removida.");
    }
  };

  const handleLikePost = (postId: string) => {
    const updated = posts.map(post => {
      if (post.id === postId) {
        const likedBy = post.likedBy || [];
        const isLiked = likedBy.includes(user.id);
        if (!isLiked) onNotify?.(`Você curtiu a postagem de ${post.authorName}`);
        return {
          ...post,
          likedBy: isLiked ? likedBy.filter(id => id !== user.id) : [...likedBy, user.id],
          likes: isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    });
    savePosts(updated);
  };

  const handleAddComment = (postId: string) => {
    if (!newCommentText.trim()) return;
    
    const post = posts.find(p => p.id === postId);
    const newComment: Comment = {
      id: Math.random().toString(),
      authorId: user.id,
      authorName: user.name,
      content: newCommentText,
      createdAt: 'Agora',
      likes: 0,
      likedBy: [],
      replies: []
    };

    const updated = posts.map(post => {
      if (post.id === postId) {
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    });
    savePosts(updated);
    setNewCommentText('');
    setActiveCommentId(null);
    
    // Notification logic
    if (post) {
      onNotify?.(`${user.name} comentou na postagem de ${post.authorName}`);
    }
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    if (!window.confirm('Deseja excluir seu comentário permanentemente?')) return;

    const filterComments = (comments: Comment[]): Comment[] => {
      return comments
        .filter(c => c.id !== commentId)
        .map(c => ({
          ...c,
          replies: c.replies ? filterComments(c.replies) : []
        }));
    };

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return { ...post, comments: filterComments(post.comments) };
      }
      return post;
    });
    
    savePosts(updatedPosts);
    onNotify?.("Comentário excluído.");
  };

  const handleLikeComment = (postId: string, commentId: string) => {
    const updateComments = (comments: Comment[]): Comment[] => {
      return comments.map(c => {
        if (c.id === commentId) {
          const likedBy = c.likedBy || [];
          const isLiked = likedBy.includes(user.id);
          return { 
            ...c, 
            likedBy: isLiked ? likedBy.filter(id => id !== user.id) : [...likedBy, user.id],
            likes: isLiked ? c.likes - 1 : c.likes + 1 
          };
        }
        if (c.replies && c.replies.length > 0) {
          return { ...c, replies: updateComments(c.replies) };
        }
        return c;
      });
    };

    const updated = posts.map(post => {
      if (post.id === postId) {
        return { ...post, comments: updateComments(post.comments) };
      }
      return post;
    });
    savePosts(updated);
  };

  const handleAddReply = (postId: string, commentId: string, content: string) => {
    const newReply: Comment = {
      id: Math.random().toString(),
      authorId: user.id,
      authorName: user.name,
      content: content,
      createdAt: 'Agora',
      likes: 0,
      likedBy: [],
      replies: []
    };

    const updateComments = (comments: Comment[]): Comment[] => {
      return comments.map(c => {
        if (c.id === commentId) {
          return { ...c, replies: [...(c.replies || []), newReply] };
        }
        if (c.replies && c.replies.length > 0) {
          return { ...c, replies: updateComments(c.replies) };
        }
        return c;
      });
    };

    const updated = posts.map(post => {
      if (post.id === postId) {
        return { ...post, comments: updateComments(post.comments) };
      }
      return post;
    });
    savePosts(updated);
    onNotify?.("Sua resposta foi enviada.");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Compartilhar com seus grupos</h2>
        <form onSubmit={handleCreatePost}>
          <div className="mb-4">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Postar em:</label>
            <div className="flex flex-wrap gap-2">
              {joinedCommunityObjects.map(comm => (
                <button
                  key={comm.id}
                  type="button"
                  onClick={() => setSelectedCommunityForPost(comm.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                    selectedCommunityForPost === comm.id 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-slate-50'
                  }`}
                >
                  {comm.name}
                </button>
              ))}
            </div>
          </div>
          <textarea 
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px] resize-none text-slate-700"
            placeholder="Compartilhe algo apenas com os membros..."
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          ></textarea>
          <div className="flex justify-end mt-3">
            <button 
              type="submit" 
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Publicar
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {visiblePosts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
               </svg>
            </div>
            <p className="text-slate-400 font-medium">Nenhuma postagem nos seus grupos ainda.</p>
          </div>
        ) : (
          visiblePosts.map((post) => {
            const canInteract = user.joinedCommunities.includes(post.communityId) || post.communityId === 'general';
            const comm = allCommunities.find(c => c.id === post.communityId);
            const communityName = comm ? comm.name : (post.communityId === 'general' ? 'Geral' : `Grupo ${post.communityId}`);
            const isAuthor = post.authorId === user.id;
            const isLiked = post.likedBy?.includes(user.id);
            
            return (
              <div key={post.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative group/post">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img src={`https://picsum.photos/seed/${post.authorName}/50`} alt={post.authorName} className="w-10 h-10 rounded-full object-cover border border-slate-100" />
                    <div>
                      <h3 className="font-bold text-slate-800 leading-tight">{post.authorName}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-400 font-medium">{post.createdAt}</span>
                        <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full uppercase font-bold border border-indigo-100">
                          {communityName}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {isAuthor && (
                    <button 
                      onClick={() => handleDeletePost(post.id)}
                      className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover/post:opacity-100 transition-all rounded-lg hover:bg-red-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>

                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                
                <div className="mt-4 pt-4 border-t border-slate-100 flex gap-6">
                  <button 
                    onClick={() => handleLikePost(post.id)}
                    className={`flex items-center gap-2 transition-colors ${isLiked ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isLiked ? 'fill-indigo-600 text-indigo-600' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="text-sm font-medium">{post.likes}</span>
                  </button>
                  <button 
                    onClick={() => setActiveCommentId(activeCommentId === post.id ? null : post.id)}
                    className={`flex items-center gap-2 transition-colors ${activeCommentId === post.id ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="text-sm font-medium">{post.comments.length} Comentários</span>
                  </button>
                </div>

                <div className="mt-4 space-y-2">
                  {post.comments.map(comment => (
                    <CommentItem 
                      key={comment.id} 
                      comment={comment} 
                      user={user} 
                      canInteract={canInteract}
                      onReply={(cid, content) => handleAddReply(post.id, cid, content)} 
                      onLike={(cid) => handleLikeComment(post.id, cid)}
                      onDelete={(cid) => handleDeleteComment(post.id, cid)}
                    />
                  ))}
                  
                  {activeCommentId === post.id && (
                    <div className="mt-4 pt-4 border-t border-slate-50 flex gap-2">
                      <img src={user.avatar} className="w-8 h-8 rounded-full" alt="" />
                      <div className="flex-1 flex gap-2">
                        <input 
                          autoFocus
                          className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                          placeholder="Adicione um comentário..."
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                        />
                        <button 
                          onClick={() => handleAddComment(post.id)}
                          className="bg-indigo-600 text-white px-4 py-1 rounded-lg text-xs font-bold"
                        >
                          Enviar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
