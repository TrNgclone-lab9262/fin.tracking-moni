"use client";

import React, { useState, useEffect } from "react";
import {
  Home,
  ArrowLeftRight,
  CreditCard,
  Target,
  Coins,
  HelpCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  Heart,
} from "lucide-react";
import { useFinance, NavTab } from "@/context/FinanceContext";

interface NavItemDef {
  id: NavTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: {
    text: string;
    variant: "warning" | "danger" | "info";
  };
}

interface NavGroup {
  title: string;
  items: NavItemDef[];
}

export function Sidebar() {
  const {
    activeTab,
    setActiveTab,
    husbandCreditCard,
    wifeCreditCard,
    budgetSummary,
    debts,
  } = useFinance();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Khôi phục trạng thái thu gọn từ LocalStorage hoặc tự động thu gọn trên Tablet (768px - 1023px)
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("HOME_MONI_SIDEBAR_COLLAPSED");
    if (saved !== null) {
      setIsCollapsed(saved === "true");
    } else if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsCollapsed(true);
    }

    const handleResize = () => {
      const savedPref = localStorage.getItem("HOME_MONI_SIDEBAR_COLLAPSED");
      if (savedPref === null && window.innerWidth >= 768 && window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    try {
      localStorage.setItem("HOME_MONI_SIDEBAR_COLLAPSED", String(nextState));
    } catch (e) {
      // ignore
    }
  };

  // Tính toán dynamic badges
  const creditCardWarning =
    (husbandCreditCard && husbandCreditCard.usagePercentage >= 70) ||
    (wifeCreditCard && wifeCreditCard.usagePercentage >= 70);

  const budgetOverLimit = budgetSummary.items.some((i) => i.percentage >= 100);
  const activeDebtsCount = debts.filter((d) => d.status === "ACTIVE").length;

  const NAV_GROUPS: NavGroup[] = [
    {
      title: "Dòng tiền tổ ấm",
      items: [
        { id: "overview", label: "Tổng quan tổ ấm", icon: Home },
        { id: "transactions", label: "Sổ giao dịch", icon: ArrowLeftRight },
        {
          id: "accounts",
          label: "Tài khoản & Thẻ",
          icon: CreditCard,
          badge: creditCardWarning
            ? { text: "Cảnh báo thẻ", variant: "warning" }
            : undefined,
        },
      ],
    },
    {
      title: "Kế hoạch & Tích lũy",
      items: [
        {
          id: "planning",
          label: "Ngân sách & Mục tiêu",
          icon: Target,
          badge: budgetOverLimit
            ? { text: "Vượt trần", variant: "danger" }
            : undefined,
        },
        {
          id: "debts_invest",
          label: "Khoản nợ & Đầu tư",
          icon: Coins,
          badge:
            activeDebtsCount > 0
              ? { text: `${activeDebtsCount}`, variant: "info" }
              : undefined,
        },
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

  return (
    <aside
      className={`hidden md:flex flex-col bg-gradient-to-b from-[#1E3A8A] via-[#1D4ED8] to-[#172554] text-white transition-all duration-300 relative z-30 shrink-0 border-r border-blue-900/40 shadow-xl shadow-blue-950/20 sticky top-0 h-screen select-none ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* 1. Nút Thu gọn Nổi viền (Floating Edge Toggle) */}
      <button
        onClick={toggleCollapse}
        aria-label={isCollapsed ? "Mở rộng menu" : "Thu gọn menu"}
        title={isCollapsed ? "Mở rộng menu" : "Thu gọn menu"}
        className="absolute -right-3.5 top-7 z-40 w-7 h-7 rounded-full bg-blue-600 border-2 border-white text-white flex items-center justify-center shadow-lg hover:bg-blue-500 hover:scale-110 active:scale-95 transition-all cursor-pointer"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* 2. Brand Header: HOME MONI */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-blue-800/40 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-rose-500/25 ring-2 ring-white/20">
            <Home className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <span className="font-black text-lg tracking-wider text-white block truncate leading-tight">
                HOME MONI
              </span>
              <span className="text-[10px] text-blue-200 uppercase tracking-widest font-bold block mt-0.5">
                🏡 My Home
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Danh sách Điều Hướng Phân Nhóm (Grouped Navigation - Thoáng đãng & Tinh gọn) */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto scrollbar-none">
        {NAV_GROUPS.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1.5">
            {/* Group Header (ẩn khi thu gọn) */}
            {!isCollapsed && (
              <h4 className="px-3 text-[10px] font-bold text-blue-300/60 uppercase tracking-widest mb-1.5">
                {group.title}
              </h4>
            )}

            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <div key={item.id} className="relative group">
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-md text-xs sm:text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-white text-blue-900 shadow-md shadow-blue-950/25 font-black"
                        : "text-blue-100 hover:bg-white/10 hover:text-white hover:translate-x-1"
                    } ${isCollapsed ? "justify-center px-0 hover:translate-x-0" : ""}`}
                  >
                    <Icon
                      className={`w-5 h-5 shrink-0 transition-transform ${
                        isActive
                          ? "text-blue-700 scale-110"
                          : "text-blue-200 group-hover:text-white"
                      }`}
                    />

                    {!isCollapsed && (
                      <span className="truncate flex-1 text-left">{item.label}</span>
                    )}

                    {!isCollapsed && item.badge && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 shadow-xs ${
                          item.badge.variant === "warning"
                            ? "bg-amber-400 text-amber-950"
                            : item.badge.variant === "danger"
                            ? "bg-rose-500 text-white"
                            : "bg-blue-900 text-blue-200"
                        }`}
                      >
                        {item.badge.text}
                      </span>
                    )}
                  </button>

                  {/* Tooltip nổi khi Sidebar ở trạng thái thu gọn */}
                  {isCollapsed && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-slate-900/95 backdrop-blur-md text-white text-xs font-semibold rounded-md shadow-2xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 z-50 border border-slate-700/60 flex items-center gap-2">
                      <span>{item.label}</span>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                            item.badge.variant === "warning"
                              ? "bg-amber-400 text-amber-950"
                              : item.badge.variant === "danger"
                              ? "bg-rose-500 text-white"
                              : "bg-blue-600 text-white"
                          }`}
                        >
                          {item.badge.text}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* 4. Footer Sidebar */}
      {!isCollapsed ? (
        <div className="p-4 border-t border-blue-800/40 text-[11px] text-blue-200 bg-blue-950/30 shrink-0">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span>👨</span>
              <span>Anh Chuột</span>
              <Heart className="w-3 h-3 text-rose-400 fill-rose-400 inline" />
              <span>Bé Mèo</span>
              <span>👩</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Local-First Sync" />
          </div>
          <div className="flex items-center justify-between text-[10px] text-blue-300/80 mt-1">
            <span>HOME MONI v4.0</span>
            <span className="text-emerald-300 font-medium">Bảo mật cục bộ</span>
          </div>
        </div>
      ) : (
        <div className="p-3.5 border-t border-blue-800/40 flex justify-center shrink-0 group relative">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div className="absolute left-full bottom-2 ml-3 px-2.5 py-1 bg-slate-900/95 text-white text-[10px] font-semibold rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 border border-slate-700/50">
            🟢 Local-First đã sẵn sàng
          </div>
        </div>
      )}
    </aside>
  );
}
