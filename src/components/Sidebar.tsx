import React from 'react';
import {
    LayoutDashboard,
    Package,
    Layers,
    TrendingUp,
    ChevronRight,
    LogOut
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'inventory', label: 'Inventaire', icon: Package },
        { id: 'lots', label: 'Achats de Lots', icon: Layers },
        { id: 'profit', label: 'Rentabilité', icon: TrendingUp },
    ];

    return (
        <aside className="w-64 h-screen bg-white border-r border-slate-100 flex flex-col sticky top-0">
            <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-200">
                    <Package className="text-white w-6 h-6" />
                </div>
                <h1 className="text-xl font-bold text-slate-800 tracking-tight">ColleKepo</h1>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                            activeTab === item.id
                                ? "bg-teal-50 text-teal-700 shadow-sm"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                        )}
                    >
                        <item.icon className={cn(
                            "w-5 h-5",
                            activeTab === item.id ? "text-teal-600" : "text-slate-400 group-hover:text-slate-600"
                        )} />
                        {item.label}
                        {activeTab === item.id && <ChevronRight className="ml-auto w-4 h-4 text-teal-400" />}
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-50">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all">
                    <LogOut className="w-5 h-5" />
                    Déconnexion
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
