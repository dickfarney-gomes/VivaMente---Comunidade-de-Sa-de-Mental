
import React, { useState, useEffect } from 'react';
import { User, Community, Condition } from '../types';

interface CommunitiesViewProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

const INITIAL_COMMUNITIES: Community[] = [
  { id: 'c1', name: 'Ansiedade Zero', description: 'Um espaço para compartilhar técnicas de respiração e apoio diário.', condition: Condition.ANXIETY, creatorId: 'u1', membersCount: 1240, tags: ['Calma', 'Apoio'] },
  { id: 'c2', name: 'Foco no TDAH', description: 'Estratégias de organização e produtividade para mentes neurodivergentes.', condition: Condition.ADHD, creatorId: 'u2', membersCount: 850, tags: ['Produtividade', 'Dicas'] },
  { id: 'c3', name: 'Espectro Amigo', description: 'Comunidade voltada para adultos e adolescentes no espectro autista.', condition: Condition.ASD, creatorId: 'u3', membersCount: 420, tags: ['Inclusão', 'Diálogo'] },
  { id: 'c4', name: 'Luz no Fim do Túnel', description: 'Apoio mútuo para quem enfrenta a depressão clínica.', condition: Condition.DEPRESSION, creatorId: 'u4', membersCount: 2100, tags: ['Esperança', 'Escuta'] },
];

export const CommunitiesView: React.FC<CommunitiesViewProps> = ({ user, onUpdateUser }) => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCond, setNewCond] = useState<Condition>(Condition.OTHER);

  useEffect(() => {
    const stored = localStorage.getItem('vivamente_communities');
    if (stored) {
      setCommunities(JSON.parse(stored));
    } else {
      setCommunities(INITIAL_COMMUNITIES);
      localStorage.setItem('vivamente_communities', JSON.stringify(INITIAL_COMMUNITIES));
    }
  }, []);

  const saveCommunities = (updated: Community[]) => {
    setCommunities(updated);
    localStorage.setItem('vivamente_communities', JSON.stringify(updated));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const id = 'c_' + Math.random().toString(36).substr(2, 9);
    const newCommunity: Community = {
      id,
      name: newName,
      description: newDesc,
      condition: newCond,
      creatorId: user.id,
      membersCount: 1,
      tags: [newCond]
    };
    const updatedComms = [newCommunity, ...communities];
    saveCommunities(updatedComms);
    
    const updatedUser = {
      ...user,
      joinedCommunities: [...user.joinedCommunities, id]
    };
    onUpdateUser(updatedUser);
    
    setShowCreateModal(false);
    setNewName('');
    setNewDesc('');
  };

  const toggleJoin = (communityId: string) => {
    const isMember = user.joinedCommunities.includes(communityId);
    let updatedCommunities = communities.map(c => {
      if (c.id === communityId) {
        return { ...c, membersCount: isMember ? c.membersCount - 1 : c.membersCount + 1 };
      }
      return c;
    });

    let updatedJoined = isMember 
      ? user.joinedCommunities.filter(id => id !== communityId)
      : [...user.joinedCommunities, communityId];

    saveCommunities(updatedCommunities);
    onUpdateUser({ ...user, joinedCommunities: updatedJoined });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Suas Comunidades</h2>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Criar Grupo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {communities.map((community) => {
          const isMember = user.joinedCommunities.includes(community.id);
          return (
            <div key={community.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md ${
                    community.condition === Condition.DEPRESSION ? 'bg-blue-100 text-blue-700' :
                    community.condition === Condition.ANXIETY ? 'bg-orange-100 text-orange-700' :
                    community.condition === Condition.ADHD ? 'bg-purple-100 text-purple-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {community.condition}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    {community.membersCount}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">{community.name}</h3>
                <p className="text-sm text-slate-500 line-clamp-2">{community.description}</p>
              </div>
              
              <div className="mt-6 flex items-center justify-between">
                <div className="flex gap-1 flex-wrap">
                  {community.tags.map(tag => (
                    <span key={tag} className="text-[10px] bg-slate-50 text-slate-400 border border-slate-100 px-2 py-0.5 rounded">#{tag}</span>
                  ))}
                </div>
                <button 
                  onClick={() => toggleJoin(community.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors border ${
                    isMember 
                    ? 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200' 
                    : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'
                  }`}
                >
                  {isMember ? 'Sair do Grupo' : 'Participar'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Novo Grupo de Apoio</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nome da Comunidade</label>
                <input 
                  type="text" 
                  required 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: Vida Consciente"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Foco Principal</label>
                <select 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  value={newCond}
                  onChange={(e) => setNewCond(e.target.value as Condition)}
                >
                  {Object.values(Condition).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Descrição</label>
                <textarea 
                  required 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Qual o objetivo deste grupo?"
                ></textarea>
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                >
                  Criar Agora
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
