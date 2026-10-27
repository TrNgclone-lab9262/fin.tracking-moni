"use client";

import React from "react";
import {
  Home,
  Receipt,
  Plus,
  CreditCard,
  Target,
} from "lucide-react";
import { useFinance, NavTab } from "@/context/FinanceContext";

interface BottomNavBarProps {
  onOpenAddModal: () => void;
}

export function BottomNavBar({ onOpenAddModal }: BottomNavBarProps) {
  const { activeTab, setActiveTab } = useFinance();

  const navItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "overview", label: "Tổng quan", icon: Home },
    { id: "transactions", label: "Sổ GD", icon: Receipt },
    { id: "accounts", label: "Ví & Thẻ", icon: CreditCard },
    { id: "planning", label: "Kế hoạch", icon: Target },
  ];

  return (
    <nav
      aria-label="Thanh điều hướng di động"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#DCE4EE] shadow-lg px-2 py-1.5 flex items-center justify-around select-none safe-area-pb"
    >
      {/* 2 tab đầu tiên: Tổng quan & Sổ GD */}
      {navItems.slice(0, 2).map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex-1 flex flex-col items-center justify-center py-1 rounded-md transition-all ${
              isActive
                ? "text-blue-600 font-bold"
                : "text-slate-400 hover:text-slate-600 font-medium"
            }`}
          >
            <div className={`p-1 rounded-md transition-colors ${isActive ? "bg-blue-50" : ""}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
          </button>
        );
      })}

      {/* Nút hành động trung tâm [+] Thêm nhanh */}
      <div className="flex-1 flex items-center justify-center -mt-5">
        <button
          onClick={onOpenAddModal}
          aria-label="Thêm nhanh giao dịch"
          className="w-13 h-13 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white shadow-lg shadow-blue-600/35 flex items-center justify-center active:scale-90 transition-transform border-4 border-[#F6F8FB]"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* 2 tab kế tiếp: Ví & Thẻ, Kế hoạch */}
      {navItems.slice(2, 4).map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex-1 flex flex-col items-center justify-center py-1 rounded-md transition-all ${
              isActive
                ? "text-blue-600 font-bold"
                : "text-slate-400 hover:text-slate-600 font-medium"
            }`}
          >
            <div className={`p-1 rounded-md transition-colors ${isActive ? "bg-blue-50" : ""}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
