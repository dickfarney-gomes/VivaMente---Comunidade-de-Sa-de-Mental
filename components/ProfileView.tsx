
import React, { useState, useRef } from 'react';
import { User, Condition } from '../types';

interface ProfileViewProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User>(user);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onUpdateUser(editedUser);
    setIsEditing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // Limite de 2MB para evitar estouro de localStorage
        alert("A imagem é muito grande. Escolha uma foto com menos de 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedUser({ ...editedUser, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleCondition = (cond: Condition) => {
    const currentConditions = editedUser.conditions || [];
    if (currentConditions.includes(cond)) {
      setEditedUser({
        ...editedUser,
        conditions: currentConditions.filter(c => c !== cond)
      });
    } else {
      setEditedUser({
        ...editedUser,
        conditions: [...currentConditions, cond]
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="h-32 bg-indigo-600 relative">
        <div 
          className={`absolute -bottom-12 left-8 p-1 bg-white rounded-2xl shadow-md group ${isEditing ? 'cursor-pointer' : ''}`}
          onClick={() => isEditing && fileInputRef.current?.click()}
        >
          <img 
            src={isEditing ? editedUser.avatar : user.avatar} 
            alt={user.name} 
            className="w-24 h-24 rounded-xl object-cover"
          />
          {isEditing && (
            <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
          />
        </div>
      </div>
      
      <div className="pt-16 p-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
          <div className="flex-1 w-full">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Nome de Exibição</label>
                  <input 
                    className="w-full text-2xl font-bold text-slate-800 border-b-2 border-indigo-600 outline-none pb-1"
                    value={editedUser.name}
                    onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                    placeholder="Seu nome"
                  />
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Alterar Foto de Perfil
                </button>
              </div>
            ) : (
              <div>
                <h1 className="text-3xl font-bold text-slate-800">{user.name}</h1>
                <p className="text-slate-500 font-medium">{user.email}</p>
              </div>
            )}
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            {isEditing ? (
              <>
                <button 
                  onClick={() => {
                    setEditedUser(user);
                    setIsEditing(false);
                  }}
                  className="flex-1 md:flex-none px-6 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-1 md:flex-none px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                  Salvar Alterações
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="w-full md:w-auto px-6 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Editar Perfil
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <section>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Biografia</h3>
              {isEditing ? (
                <textarea 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none min-h-[120px] text-slate-700 leading-relaxed"
                  value={editedUser.bio}
                  onChange={(e) => setEditedUser({...editedUser, bio: e.target.value})}
                  placeholder="Conte um pouco sobre você..."
                ></textarea>
              ) : (
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-100 italic">
                  "{user.bio || 'Nenhuma biografia adicionada.'}"
                </p>
              )}
            </section>

            <section>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Minhas Condições & Tratamentos</h3>
              <div className="flex flex-wrap gap-2">
                {isEditing ? (
                  Object.values(Condition).map((cond) => {
                    const isSelected = editedUser.conditions?.includes(cond);
                    return (
                      <button
                        key={cond}
                        type="button"
                        onClick={() => toggleCondition(cond)}
                        className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                          isSelected 
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                            : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300'
                        }`}
                      >
                        {cond}
                      </button>
                    );
                  })
                ) : (
                  user.conditions && user.conditions.length > 0 ? (
                    user.conditions.map(cond => (
                      <span key={cond} className="px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-xs font-bold shadow-sm">
                        {cond}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 text-sm italic">Nenhuma condição informada.</span>
                  )
                )}
              </div>
            </section>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 mb-4">Estatísticas</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500 font-medium">Postagens</span>
                  <span className="font-bold text-slate-800">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500 font-medium">Comunidades</span>
                  <span className="font-bold text-slate-800">{user.joinedCommunities?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500 font-medium">Desde</span>
                  <span className="font-bold text-slate-800">Mar 2024</span>
                </div>
              </div>
            </div>
            
            <p className="text-[10px] text-slate-400 text-center px-4 leading-relaxed">
              Suas informações são privadas e visíveis apenas para membros dos mesmos grupos que você.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
