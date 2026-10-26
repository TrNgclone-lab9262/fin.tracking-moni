"use client";

import React, { useMemo } from "react";
import { Users, Heart, Calendar as CalendarIcon } from "lucide-react";
import { useFinance } from "@/context/FinanceContext";
import { formatVND } from "@/lib/formatters";

export function FamilyCashflowWidget() {
  const { summary, transactions } = useFinance();

  // Tính lịch chi tiêu 31 ngày của Tháng 10/2026 (Calendar Heatmap)
  const heatmapDays = useMemo(() => {
    const daysMap = new Map<number, number>();
    for (let i = 1; i <= 31; i++) daysMap.set(i, 0);

    transactions.forEach((tx) => {
      if (tx.type === "EXPENSE" && tx.date.startsWith("2026-10")) {
        const day = parseInt(tx.date.split("-")[2], 10);
        const cur = daysMap.get(day) || 0;
        daysMap.set(day, cur + tx.amount);
      }
    });

    return Array.from(daysMap.entries()).map(([day, amount]) => {
      let level = "zero"; // 0: không chi
      if (amount > 0 && amount <= 500000) level = "low"; // <= 500k: xanh
      else if (amount > 500000 && amount <= 2000000) level = "medium"; // <= 2tr: vàng cam
      else if (amount > 2000000) level = "high"; // > 2tr: đỏ/hồng (tiền nhà, mua sắm lớn)

      return { day, amount, level };
    });
  }, [transactions]);

  const totalIncome = summary.husbandIncome + summary.wifeIncome || 1;
  const husbandPct = Math.round((summary.husbandIncome / totalIncome) * 100);
  const wifePct = 100 - husbandPct;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* 1. CƠ CẤU ĐÓNG GÓP THU NHẬP 2 VỢ CHỒNG */}
      <div className="bg-white rounded-xl p-5 border border-[#DCE4EE] shadow-xs flex flex-col justify-between space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E9EEF5]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#172B4D]">
                Đóng Góp Thu Nhập Tổ Ấm
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Tỷ trọng lương Anh Chuột (Vietinbank) vs Lương Bé Mèo (VCB)
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
            Tổng {formatVND(totalIncome)}
          </span>
        </div>

        {/* Thanh tỷ lệ Anh Chuột vs Bé Mèo */}
        <div className="space-y-2.5">
          <div className="w-full h-3.5 bg-slate-100 rounded-md overflow-hidden flex shadow-inner">
            <div
              className="h-full bg-blue-600 transition-all flex items-center justify-center text-[10px] text-white font-bold"
              style={{ width: `${husbandPct}%` }}
            >
              {husbandPct}%
            </div>
            <div
              className="h-full bg-emerald-600 transition-all flex items-center justify-center text-[10px] text-white font-bold"
              style={{ width: `${wifePct}%` }}
            >
              {wifePct}%
            </div>
          </div>

          <div className="flex justify-between items-center text-xs pt-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <div>
                <span className="font-bold text-slate-800">👨 Anh Chuột (Vietinbank)</span>
                <p className="text-[11px] text-slate-500 font-medium">
                  {formatVND(summary.husbandIncome)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-right">
              <div>
                <span className="font-bold text-slate-800">👩 Bé Mèo (Vietcombank)</span>
                <p className="text-[11px] text-slate-500 font-medium">
                  {formatVND(summary.wifeIncome)}
                </p>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-lg border border-[#E9EEF5] flex items-center gap-2 text-xs text-slate-600">
          <Heart className="w-4 h-4 text-rose-500 shrink-0" />
          <span>
            Hai vợ chồng cùng hợp lực tích lũy được{" "}
            <strong className="text-[#172B4D]">{formatVND(summary.savingsAmount)}</strong> trong tháng này!
          </span>
        </div>
      </div>

      {/* 2. LỊCH CHI TIÊU GIA ĐÌNH (CALENDAR HEATMAP 31 NGÀY) */}
      <div className="bg-white rounded-xl p-5 border border-[#DCE4EE] shadow-xs flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-[#E9EEF5]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#172B4D]">
                Lịch Chi Tiêu Tháng 10
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Bản đồ nhiệt theo dõi ngày tiết kiệm vs ngày mua sắm lớn
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
            <span className="w-2 h-2 rounded-xs bg-slate-100" /> 0₫
            <span className="w-2 h-2 rounded-xs bg-emerald-400" /> &lt;500k
            <span className="w-2 h-2 rounded-xs bg-amber-400" /> &lt;2tr
            <span className="w-2 h-2 rounded-xs bg-rose-500" /> &gt;2tr
          </div>
        </div>

        {/* 31 Ô Ngày Trong Tháng */}
        <div className="grid grid-cols-7 gap-1.5 pt-1">
          {heatmapDays.map((d) => {
            let bgClass = "bg-slate-100 text-slate-400";
            if (d.level === "low") bgClass = "bg-emerald-100 text-emerald-800 font-semibold";
            if (d.level === "medium") bgClass = "bg-amber-100 text-amber-900 font-semibold";
            if (d.level === "high") bgClass = "bg-rose-500 text-white font-bold shadow-xs";

            return (
              <div
                key={d.day}
                title={`Ngày ${d.day}/10: ${d.amount > 0 ? formatVND(d.amount) : "Không chi tiêu"}`}
                className={`h-8 rounded-md flex flex-col items-center justify-center text-xs transition-transform hover:scale-105 cursor-pointer ${bgClass}`}
              >
                <span>{d.day}</span>
              </div>
            );
          })}
        </div>

        <p className="text-[10px] text-slate-400 text-center font-medium">
          💡 Ngày 6 (Tiền nhà 6.5tr) & Ngày 10, 12 (Siêu thị & Sắm đồ) là những ngày phát sinh chi phí chính.
        </p>
      </div>
    </div>
  );
}
