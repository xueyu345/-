import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, Chrome, ArrowRight, Github } from 'lucide-react';
import { useAuth } from '@/src/lib/AuthContext';
import { cn } from '@/src/lib/utils';

export function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, signUp, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsSubmitting(true);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFB] flex flex-col items-center justify-center p-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-8"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-black rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl rotate-3">
             <div className="w-8 h-8 border-4 border-white rounded-full border-t-transparent animate-spin-slow" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter italic">DailyPulse</h1>
          <p className="text-gray-500 mt-2 font-medium">
            {isLogin ? '欢迎回来' : '开启你的习惯之旅'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
             <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="email"
                  placeholder="邮箱"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
             </div>
             <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="password"
                  placeholder="密码"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
             </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{isLogin ? '登录' : '注册'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="relative">
           <div className="absolute inset-0 flex items-center">
             <div className="w-full border-t border-gray-100"></div>
           </div>
           <div className="relative flex justify-center text-xs">
             <span className="px-2 bg-[#FDFDFB] text-gray-400 font-bold uppercase tracking-widest">或者</span>
           </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
           <button 
             onClick={() => signInWithGoogle()}
             className="w-full py-4 bg-white border border-gray-100 text-gray-900 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors shadow-sm"
           >
              <Chrome className="w-5 h-5" />
              <span>Google 登录</span>
           </button>
        </div>

        <p className="text-center text-sm text-gray-500">
          {isLogin ? '还没有账号？' : '已经有账号了？'}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 font-bold text-black underline underline-offset-4"
          >
            {isLogin ? '立即注册' : '返回登录'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
