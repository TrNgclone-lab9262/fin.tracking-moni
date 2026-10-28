"use client";

import React from "react";
import {
  Home,
  Receipt,
  CreditCard,
  Target,
  Coins,
  HelpCircle,
  Settings,
  X,
  RefreshCw,
} from "lucide-react";
import { useFinance, NavTab } from "@/context/FinanceContext";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const {
    activeTab,
    setActiveTab,
    transactions,
    accounts,
    goals,
    isCloudConnected,
    isSyncing,
  } = useFinance();

  if (!isOpen) return null;

  const totalTxCount = transactions.length;
  const creditCardsCount = accounts.filter((a) => a.type === "CREDIT_CARD").length;
  const goalsCount = goals.length;

  const menuItems: {
    id: NavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    badgeColor?: string;
  }[] = [
    {
      id: "overview",
      label: "Tổng Quan Tài Chính",
      icon: Home,
    },
    {
      id: "transactions",
      label: "Sổ Giao Dịch",
      icon: Receipt,
      badge: `${totalTxCount} GD`,
      badgeColor: "bg-blue-800 text-blue-200",
    },
    {
      id: "accounts",
      label: "Ví & Thẻ Tín Dụng",
      icon: CreditCard,
      badge: `${creditCardsCount} thẻ BIDV`,
      badgeColor: "bg-amber-900/80 text-amber-200 border border-amber-600/40",
    },
    {
      id: "planning",
      label: "Kế Hoạch & Tích Lũy",
      icon: Target,
      badge: `${goalsCount} Quỹ`,
      badgeColor: "bg-purple-900/80 text-purple-200 border border-purple-600/40",
    },
    {
      id: "debts_invest",
      label: "Nợ & Danh Mục Đầu Tư",
      icon: Coins,
    },
    {
      id: "guide",
      label: "Cẩm Nang Tổ Ấm",
      icon: HelpCircle,
    },
    {
      id: "settings",
      label: "Cài Đặt Hệ Thống",
      icon: Settings,
    },
  ];

  const handleSelectTab = (tab: NavTab) => {
    setActiveTab(tab);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex md:hidden bg-[#0B132B]/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Drawer Panel - Rộng chuẩn 350px khớp Figma Screen 7 */}
      <div
        className="w-[350px] max-w-[85vw] bg-gradient-to-b from-[#1E3A8A] via-[#1D4ED8] to-[#172554] text-white h-full flex flex-col p-5 shadow-2xl animate-in slide-in-from-left duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-4 border-b border-blue-400/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Home className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-black text-lg tracking-wider block leading-tight">
                HOME MONI
              </span>
              <span className="text-[10px] text-blue-200 uppercase tracking-widest block font-bold mt-0.5">
                🏡 Tổ Ấm Hạnh Phúc
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-blue-900/80 hover:bg-blue-800 text-blue-200 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mini-Profile Gia Đình (👨 Anh Chuột & 👩 Bé Mèo) */}
        <div className="my-4 p-3 rounded-xl bg-blue-950/40 border border-blue-400/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-400 flex items-center justify-center text-sm shadow-xs font-bold">
              👫
            </div>
            <div>
              <span className="font-extrabold text-xs text-white block">
                Anh Chuột & Bé Mèo
              </span>
              <span className="text-[10px] text-blue-300 block font-medium">
                Tổ ấm vững tài chính
              </span>
            </div>
          </div>

          <div
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
              isCloudConnected
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "bg-slate-700/50 text-slate-300"
            }`}
          >
            {isSyncing ? (
              <RefreshCw className="w-2.5 h-2.5 animate-spin" />
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            )}
            <span>{isCloudConnected ? "Cloud Sync" : "Local-First"}</span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 py-1 space-y-1.5 overflow-y-auto scrollbar-none">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? "bg-white text-[#1D4ED8] shadow-md font-extrabold translate-x-1"
                    : "text-blue-100 hover:bg-blue-800/50 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#1D4ED8]" : "text-blue-300"}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      isActive
                        ? "bg-blue-100 text-blue-800"
                        : item.badgeColor || "bg-blue-900 text-blue-200"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Area */}
        <div className="pt-3 border-t border-blue-400/20 flex items-center justify-between text-xs text-blue-300">
          <span className="font-mono text-[11px] font-semibold">HOME MONI v4.0.2</span>
          <span className="text-[11px] text-blue-200 font-medium">Bảo toàn CIC gia đình</span>
        </div>
      </div>

      {/* Dismiss area */}
      <div className="flex-1" />
    </div>
  );
}
