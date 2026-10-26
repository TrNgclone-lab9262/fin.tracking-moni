"use client";

import React from "react";
import {
  Home,
  ArrowLeftRight,
  CreditCard,
  Target,
  Coins,
  HelpCircle,
  Settings,
  X,
  Heart,
} from "lucide-react";
import { useFinance, NavTab } from "@/context/FinanceContext";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavGroup {
  title: string;
  items: {
    id: NavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: "Dòng tiền tổ ấm",
    items: [
      { id: "overview", label: "Tổng quan tổ ấm", icon: Home },
      { id: "transactions", label: "Sổ giao dịch", icon: ArrowLeftRight },
      { id: "accounts", label: "Tài khoản & Thẻ", icon: CreditCard },
    ],
  },
  {
    title: "Kế hoạch & Tích lũy",
    items: [
      { id: "planning", label: "Ngân sách & Mục tiêu", icon: Target },
      { id: "debts_invest", label: "Khoản nợ & Đầu tư", icon: Coins },
    ],
  },
  {
    title: "Hệ thống",
    items: [
      { id: "guide", label: "Cẩm nang tổ ấm", icon: HelpCircle },
      { id: "settings", label: "Cài đặt & Tùy biến", icon: Settings },
    ],
  },
];

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const { activeTab, setActiveTab } = useFinance();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex md:hidden bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-4/5 max-w-xs bg-gradient-to-b from-[#1E3A8A] via-[#1D4ED8] to-[#172554] text-white h-full flex flex-col p-4 shadow-2xl animate-in slide-in-from-left duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-3 border-b border-blue-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-base tracking-wider block leading-tight">
                HOME MONI
              </span>
              <span className="text-[10px] text-blue-200 uppercase tracking-widest block font-bold mt-0.5">
                🏡 My Home
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md bg-blue-900/80 text-blue-200 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List grouped */}
        <nav className="flex-1 py-4 space-y-4 overflow-y-auto scrollbar-none">
          {NAV_GROUPS.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <h4 className="px-2 text-[10px] font-bold text-blue-300/70 uppercase tracking-widest mb-1">
                {group.title}
              </h4>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      onClose();
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs sm:text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-white text-blue-900 font-black shadow-md"
                        : "text-blue-100 hover:bg-white/10"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Drawer Footer */}
        <div className="pt-3 border-t border-blue-800/40 text-[11px] text-blue-200">
          <p className="flex items-center gap-1.5 font-bold">
            <span>👨</span> Anh Chuột
            <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
            Bé Mèo <span>👩</span>
          </p>
          <p className="text-[10px] text-blue-400 mt-0.5">HOME MONI v4.0 · My Home</p>
        </div>
      </div>
    </div>
  );
}
