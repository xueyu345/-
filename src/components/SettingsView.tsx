import React from 'react';
import { useAuth } from '@/src/lib/AuthContext';
import { LogOut, User, Bell, Palette, Shield, Heart, ChevronRight } from 'lucide-react';

export function SettingsView() {
  const { user, signOut } = useAuth();

  return (
    <div className="space-y-6 pb-24">
      <div className="px-2 mb-6">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">设置</h2>
      </div>

      <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden">
          <img src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900">{user?.displayName || '用户'}</h3>
          <p className="text-xs text-gray-400 font-medium">{user?.email}</p>
        </div>
        <button className="p-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors">
          <User className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">通用</span>
        </div>
        <div className="divide-y divide-gray-50">
          <SettingsItem icon={<Bell className="text-blue-500 w-5 h-5" />} label="消息通知" />
          <SettingsItem icon={<Palette className="text-purple-500 w-5 h-5" />} label="主题外观" />
          <SettingsItem icon={<Shield className="text-green-500 w-5 h-5" />} label="隐私安全" />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">关于</span>
        </div>
        <div className="divide-y divide-gray-50">
          <SettingsItem icon={<Heart className="text-red-500 w-5 h-5" />} label="支持我们" />
          <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                 <span className="text-gray-500 font-bold text-xs">v</span>
               </div>
               <span className="font-medium text-gray-700">版本</span>
             </div>
             <span className="text-xs text-gray-400 font-bold">1.0.0</span>
          </div>
        </div>
      </div>

      <button 
        onClick={() => signOut()}
        className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        <span>退出登录</span>
      </button>
    </div>
  );
}

function SettingsItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
          {icon}
        </div>
        <span className="font-medium text-gray-700">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-300" />
    </div>
  );
}
