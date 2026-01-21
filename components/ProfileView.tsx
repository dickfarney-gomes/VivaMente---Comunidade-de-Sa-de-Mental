
import React, { useState } from 'react';
import { User, Condition } from '../types';

interface ProfileViewProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User>(user);

  const handleSave = () => {
    onUpdateUser(editedUser);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="h-32 bg-indigo-600 relative">
        <div className="absolute -bottom-12 left-8 p-1 bg-white rounded-2xl shadow-md">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-24 h-24 rounded-xl object-cover"
          />
        </div>
      </div>
      
      <div className="pt-16 p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            {isEditing ? (
              <input 
                className="text-3xl font-bold text-slate-800 border-b-2 border-indigo-600 outline-none"
                value={editedUser.name}
                onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
              />
            ) : (
              <h1 className="text-3xl font-bold text-slate-800">{user.name}</h1>
            )}
            <p className="text-slate-500">{user.email}</p>
          </div>
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`px-6 py-2 rounded-lg font-bold transition-colors ${
              isEditing ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isEditing ? 'Salvar Perfil' : 'Editar Perfil'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          <div className="md:col-span-2 space-y-6">
            <section>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Biografia</h3>
              {isEditing ? (
                <textarea 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none min-h-[120px]"
                  value={editedUser.bio}
                  onChange={(e) => setEditedUser({...editedUser, bio: e.target.value})}
                ></textarea>
              ) : (
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 italic">
                  "{user.bio}"
                </p>
              )}
            </section>

            <section>
              <h3 className="text-lg font-bold text-slate-800 mb-3">Minhas Condições</h3>
              <div className="flex flex-wrap gap-2">
                {user.conditions.map(cond => (
                  <span key={cond} className="px-4 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-sm font-semibold">
                    {cond}
                  </span>
                ))}
                {!isEditing && user.conditions.length === 0 && (
                  <span className="text-slate-400 text-sm">Nenhuma condição selecionada</span>
                )}
              </div>
            </section>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Estatísticas</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500 font-medium">Postagens</span>
                <span className="font-bold text-slate-800">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500 font-medium">Comunidades</span>
                <span className="font-bold text-slate-800">4</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500 font-medium">Membro desde</span>
                <span className="font-bold text-slate-800">Mar 2024</span>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate-200">
              <h4 className="text-xs uppercase font-bold text-slate-400 mb-4 tracking-widest">Selo de Segurança</h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 leading-tight">Membro Verificado</p>
                  <p className="text-[10px] text-slate-500">Comprometido com a paz</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
