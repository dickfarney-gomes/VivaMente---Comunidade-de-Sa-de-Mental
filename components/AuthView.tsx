
import React, { useState } from 'react';
import { User, Condition } from '../types';

interface AuthViewProps {
  onAuthSuccess: (user: User) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedConditions, setSelectedConditions] = useState<Condition[]>([]);

  const toggleCondition = (cond: Condition) => {
    if (selectedConditions.includes(cond)) {
      setSelectedConditions(selectedConditions.filter(c => c !== cond));
    } else {
      setSelectedConditions([...selectedConditions, cond]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate authentication
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: name || 'Usuário Teste',
      email: email,
      bio: 'Bem-vindo ao meu perfil!',
      conditions: selectedConditions.length > 0 ? selectedConditions : [Condition.OTHER],
      avatar: `https://picsum.photos/seed/${email}/200`,
      joinedCommunities: ['general'] // Default community
    };
    onAuthSuccess(mockUser);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-indigo-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-2">
            VivaMente
          </h1>
          <p className="text-slate-500 mt-2">
            {isLogin ? 'Bem-vindo de volta à sua rede de apoio.' : 'Crie sua conta e encontre sua comunidade.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nome Completo</label>
              <input 
                type="text" 
                required 
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: João Silva"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">E-mail</label>
            <input 
              type="email" 
              required 
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Senha</label>
            <input 
              type="password" 
              required 
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Interesses de Apoio</label>
              <div className="flex flex-wrap gap-2">
                {Object.values(Condition).map((cond) => (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => toggleCondition(cond)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                      selectedConditions.includes(cond) 
                        ? 'bg-indigo-600 border-indigo-600 text-white' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                    }`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 mt-4"
          >
            {isLogin ? 'Entrar' : 'Começar Agora'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 font-semibold hover:underline"
          >
            {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já possui uma conta? Faça login'}
          </button>
        </div>

        <p className="text-xs text-slate-400 mt-8 text-center leading-relaxed">
          Ao entrar, você concorda em manter um ambiente seguro e respeitoso para todos os membros da comunidade.
        </p>
      </div>
    </div>
  );
};
