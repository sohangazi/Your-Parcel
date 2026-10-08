import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { BrandLogo } from '../common/BrandLogo';
import {
  LayoutDashboard,
  Package,
  Plane,
  ClipboardList,
  Globe2,
  Boxes,
  DollarSign,
  FileText,
  Settings,
  Bell,
  History,
  Download,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  Search,
} from 'lucide-react';

interface AdminLayoutProps {
  currentSection: string;
  setCurrentSection: (section: string) => void;
  onExitAdmin: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentSection,
  setCurrentSection,
  onExitAdmin,
  children,
}) => {
  const { adminUser, logout } = useAuth();
  const { unreadNotificationCount, notifications, markAllNotificationsRead } = useData();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'shipments', label: 'Shipments & Tracking', icon: Package },
    { id: 'quotes', label: 'Quote Requests', icon: ClipboardList, badge: true },
    { id: 'pricing', label: 'Pricing Engine', icon: DollarSign },
    { id: 'countries', label: 'Destination Countries', icon: Globe2 },
    { id: 'products', label: 'Parcel Categories', icon: Boxes },
    { id: 'cms', label: 'Website CMS', icon: Settings },
    { id: 'blog', label: 'Shipping Guides & Blog', icon: FileText },
    { id: 'messages', label: 'Customer Inquiries', icon: ExternalLink },
    { id: 'logs', label: 'Activity Audit Log', icon: History },
    { id: 'deploy', label: 'Source & Deployment', icon: Download },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Top Admin App Bar */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 lg:hidden hover:text-white"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2">
            <BrandLogo size="sm" showTagline={false} lightText={true} />
            <span className="hidden sm:inline-block text-[10px] font-mono uppercase bg-purple-950 text-purple-300 border border-purple-800 px-1.5 py-0.5 rounded font-bold">
              Admin Console
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="relative p-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-800 text-slate-300 transition-colors"
            >
              <Bell className="w-4 h-4 text-[#FF6B00]" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF6B00] text-white text-[10px] font-black flex items-center justify-center shadow-sm">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 p-4 space-y-3 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-xs uppercase tracking-wider text-white">
                    Operations Notifications
                  </span>
                  {unreadNotificationCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-cyan-400 hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2">
                  {notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-xl text-xs transition-colors ${
                        n.read ? 'bg-slate-950/60 text-slate-400' : 'bg-slate-800 text-slate-200 border-l-2 border-amber-400'
                      }`}
                    >
                      <div className="font-bold text-white mb-0.5">{n.title}</div>
                      <p className="line-clamp-2">{n.message}</p>
                      <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="text-center py-4 text-xs text-slate-500">No new notifications</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Admin User Badge */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
              {adminUser?.name?.[0] || 'A'}
            </div>
            <div className="text-left text-xs">
              <span className="font-bold text-white block leading-tight">{adminUser?.name || 'Admin'}</span>
              <span className="text-[10px] text-slate-400 font-mono">{adminUser?.email}</span>
            </div>
          </div>

          {/* Exit / Back to Public Site */}
          <button
            onClick={onExitAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors"
          >
            <span>Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Admin Workspace (Sidebar + Content) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800 p-4 space-y-1 overflow-y-auto">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-2 font-mono">
            Navigation Modules
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentSection(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-purple-900/60 text-[#FF6B00] border border-purple-600/50 shadow-sm font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF6B00]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}

          <div className="pt-6 mt-auto border-t border-slate-800/80 space-y-1">
            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/30 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* Mobile Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden bg-slate-950/80 backdrop-blur-sm flex">
            <div className="w-72 bg-slate-900 h-full p-4 space-y-2 overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="font-bold text-sm text-white">YOUR PARCEL Menu</span>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentSection(item.id);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                      isActive ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={() => {
                    logout();
                    setMobileSidebarOpen(false);
                  }}
                  className="w-full flex items-center gap-2 text-xs font-bold text-rose-400 p-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
