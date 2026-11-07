"use client";

import React, { useState } from "react";
import {
  CreditCard,
  Heart,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Calendar,
  Check,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export function DesignSystemPreview() {
  const [activeTab, setActiveTab] = useState<"ALL" | "HUSBAND" | "WIFE">("ALL");

  return (
    <div className="bg-white rounded-[3px] border border-[#DCE4EE] p-6 shadow-xs space-y-8 my-6">
      {/* 1. Header & Preset Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E9EEF5]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-50 text-[#2563EB] px-2 py-0.5 rounded-[3px] border border-blue-200">
              --preset b2dJCEImFF
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-50 text-[#F43F5E] px-2 py-0.5 rounded-[3px] border border-rose-200 flex items-center gap-1">
              <Heart className="w-3 h-3 text-[#F43F5E]" /> Bé Mèo Palette Active
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[#172B4D] mt-1.5">
            Bản Xem Trước Phong Cách: Sharp Precision 2px & Gender Harmony
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Mẫu so sánh thực tế giữa thực thể của Anh Chuột (Navy) và Bé Mèo (Rose/Blush) với bo góc vi mô 2px
          </p>
        </div>

        {/* 3-Pill Switcher Preview */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-[3px] border border-[#DCE4EE] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("ALL")}
            className={`px-3 py-1 text-xs font-bold transition-all rounded-[3px] ${
              activeTab === "ALL"
                ? "bg-[#172B4D] text-white shadow-xs"
                : "text-slate-600 hover:text-[#172B4D]"
            }`}
          >
            🏡 My Home
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("HUSBAND")}
            className={`px-3 py-1 text-xs font-bold transition-all rounded-[3px] ${
              activeTab === "HUSBAND"
                ? "bg-[#2563EB] text-white shadow-xs"
                : "text-slate-600 hover:text-[#2563EB]"
            }`}
          >
            👨 Anh Chuột
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("WIFE")}
            className={`px-3 py-1 text-xs font-bold transition-all rounded-[3px] ${
              activeTab === "WIFE"
                ? "bg-[#F43F5E] text-white shadow-xs"
                : "text-slate-600 hover:text-[#F43F5E]"
            }`}
          >
            👩 Bé Mèo
          </button>
        </div>
      </div>

      {/* 2. So Sánh Thẻ Thẻ Tín Dụng & Tài Khoản (Dual-Cards) */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          1. Thẻ Tài Khoản / Thẻ Tín Dụng (Bo góc 2px & Viền tinh tế)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card Anh Chuột (Deep Navy / Terminal) */}
          <div className="bg-[#172B4D] text-white rounded-[3px] border border-[#172B4D] p-5 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-[3px] bg-blue-600/30 text-blue-300 flex items-center justify-center font-bold text-xs">
                  👨
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white tracking-wide">
                    BIDV Credit Platinum (Anh Chuột)
                  </h4>
                  <p className="text-[10px] text-slate-300">Hạn mức: 50.000.000 ₫</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-[3px] bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Sao kê ngày 20
              </span>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <div>
                <p className="text-[11px] text-slate-300">Dư nợ đang dùng:</p>
                <p className="text-2xl font-bold tracking-tight text-white tabular-nums mt-0.5">
                  12.500.000 ₫
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-400">25.0% an toàn</span>
            </div>

            {/* Thanh tiến độ 2px */}
            <div className="w-full bg-slate-800 h-1.5 rounded-[3px] mt-3 overflow-hidden">
              <div className="bg-blue-500 h-full rounded-[3px]" style={{ width: "25%" }} />
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-300 text-[11px]">Hạn trả: 25 hàng tháng</span>
              <button
                type="button"
                className="px-3 py-1 bg-white hover:bg-slate-100 text-[#172B4D] font-bold rounded-[3px] text-xs transition-colors"
              >
                Thanh Toán Thẻ
              </button>
            </div>
          </div>

          {/* Card Bé Mèo (Rose / Feminine Blush) */}
          <div className="bg-rose-50/40 text-[#172B4D] rounded-[3px] border border-rose-200 p-5 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-rose-200/70">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-[3px] bg-rose-100 text-[#F43F5E] flex items-center justify-center font-bold text-xs">
                  👩
                </div>
                <div>
                  <h4 className="text-xs font-bold text-rose-900 tracking-wide flex items-center gap-1.5">
                    BIDV Credit Flexi (Bé Mèo)
                    <Sparkles className="w-3 h-3 text-[#F43F5E]" />
                  </h4>
                  <p className="text-[10px] text-rose-700 font-medium">Hạn mức: 20.000.000 ₫</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-[3px] bg-rose-100 text-rose-700 border border-rose-300">
                Sao kê ngày 20
              </span>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <div>
                <p className="text-[11px] text-rose-800 font-medium">Dư nợ đang dùng:</p>
                <p className="text-2xl font-bold tracking-tight text-rose-600 tabular-nums mt-0.5">
                  6.850.000 ₫
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-600">34.2% an toàn</span>
            </div>

            {/* Thanh tiến độ 2px */}
            <div className="w-full bg-rose-100 h-1.5 rounded-[3px] mt-3 overflow-hidden">
              <div className="bg-[#F43F5E] h-full rounded-[3px]" style={{ width: "34.2%" }} />
            </div>

            <div className="mt-4 pt-3 border-t border-rose-200/70 flex items-center justify-between text-xs">
              <span className="text-rose-700 text-[11px] font-medium">Hạn trả: 25 hàng tháng</span>
              <button
                type="button"
                className="px-3 py-1 bg-[#F43F5E] hover:bg-[#E11D48] text-white font-bold rounded-[3px] text-xs transition-colors shadow-xs"
              >
                Thanh Toán Thẻ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Dòng Giao Dịch Mẫu & Tags Phân Loại */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          2. Dòng Giao Dịch & Nhãn (Bento Tags 2px)
        </h3>
        <div className="divide-y divide-slate-100 border border-[#DCE4EE] rounded-[3px] bg-white overflow-hidden">
          {/* Giao dịch của Anh Chuột */}
          <div className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[3px] bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-[#172B4D]">Đổ xăng Petrolimex</p>
                  <span className="px-1.5 py-0.5 rounded-[3px] text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    👨 Anh Chuột
                  </span>
                  <span className="px-1.5 py-0.5 rounded-[3px] text-[10px] font-bold bg-slate-100 text-slate-600">
                    🏠 Chung
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Vietinbank • 14:30 25/10/2026</p>
              </div>
            </div>
            <p className="text-xs font-bold text-rose-600 tabular-nums">-120.000 ₫</p>
          </div>

          {/* Giao dịch của Bé Mèo */}
          <div className="p-3.5 flex items-center justify-between hover:bg-rose-50/20 transition-colors bg-rose-50/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[3px] bg-rose-100 text-[#F43F5E] flex items-center justify-center shrink-0">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-[#172B4D]">Đi siêu thị WinMart</p>
                  <span className="px-1.5 py-0.5 rounded-[3px] text-[10px] font-bold bg-rose-100 text-[#F43F5E] border border-rose-200">
                    👩 Bé Mèo
                  </span>
                  <span className="px-1.5 py-0.5 rounded-[3px] text-[10px] font-bold bg-slate-100 text-slate-600">
                    🏠 Chung
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">ACB • 09:15 26/10/2026</p>
              </div>
            </div>
            <p className="text-xs font-bold text-rose-600 tabular-nums">-350.000 ₫</p>
          </div>
        </div>
      </div>

      {/* 4. Form Controls & Buttons Bộ Sưu Tập */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          3. Nút Bấm & Ô Nhập Dữ Liệu (Sharp Precision 2px)
        </h3>
        <div className="flex flex-wrap gap-2.5 items-center">
          <button className="h-9 px-4 rounded-[3px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs transition-colors shadow-xs">
            Primary Navy Blue (#2563EB)
          </button>
          <button className="h-9 px-4 rounded-[3px] bg-[#F43F5E] hover:bg-[#E11D48] text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5" /> Bé Mèo Rose (#F43F5E)
          </button>
          <button className="h-9 px-4 rounded-[3px] bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-colors">
            Blush Soft Accent
          </button>
          <button className="h-9 px-4 rounded-[3px] border border-[#DCE4EE] bg-white hover:bg-slate-50 text-[#172B4D] font-bold text-xs transition-colors">
            Outline 2px
          </button>
          <button className="h-9 px-4 rounded-[3px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors">
            Secondary
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <input
            type="text"
            readOnly
            value="Nội dung ghi chú siêu thị..."
            className="flex-1 h-9 px-3 text-xs font-medium border border-[#DCE4EE] rounded-[3px] bg-white text-[#172B4D] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
          />
          <input
            type="text"
            readOnly
            value="350.000 ₫"
            className="w-full sm:w-48 h-9 px-3 text-xs font-bold border border-rose-200 bg-rose-50/30 text-rose-700 rounded-[3px] focus:outline-none"
          />
          <button className="h-9 px-4 rounded-[3px] bg-[#2563EB] text-white font-bold text-xs shrink-0">
            Lưu Giao Dịch
          </button>
        </div>
      </div>
    </div>
  );
}


