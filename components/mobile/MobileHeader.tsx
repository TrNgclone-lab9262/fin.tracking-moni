"use client";

import React from "react";
import { Menu, Home, Users, RefreshCw } from "lucide-react";
import { useFinance, PerspectiveMode } from "@/context/FinanceContext";

interface MobileHeaderProps {
  onOpenDrawer: () => void;
}

export function MobileHeader({ onOpenDrawer }: MobileHeaderProps) {
  const { activePerspective, setActivePerspective, isCloudConnected, isSyncing } = useFinance();

  const perspectives: { id: PerspectiveMode; label: string; icon: string }[] = [
    { id: "ALL", label: "Tất cả", icon: "🏡" },
    { id: "HUSBAND", label: "Chuột", icon: "👨" },
    { id: "WIFE", label: "Mèo", icon: "👩" },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#DCE4EE] px-4 py-2.5 flex items-center justify-between shadow-xs">
      {/* Nút Hamburger + Logo Brand */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenDrawer}
          aria-label="Mở menu tổ ấm"
          className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-md bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Home className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="font-black text-sm tracking-wide text-[#1E3A8A]">
            HOME MONI
          </span>
        </div>
      </div>

      {/* Perspective Switcher 3 Viên (Thumb-friendly) */}
      <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/80">
        {perspectives.map((p) => {
          const isActive = activePerspective === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setActivePerspective(p.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                isActive
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>{p.icon}</span>
              <span className="text-[11px]">{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* Cloud Sync Status Mini Indicator */}
      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
        {isSyncing ? (
          <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
        ) : isCloudConnected ? (
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100" title="Cloud Sync Hoạt động" />
        ) : (
          <span className="w-2.5 h-2.5 rounded-full bg-slate-400" title="Local-first Storage" />
        )}
      </div>
    </header>
  );
}
