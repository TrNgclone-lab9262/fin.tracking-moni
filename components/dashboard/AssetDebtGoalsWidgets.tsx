"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useFinance } from "@/context/FinanceContext";
import { formatVND, formatShortVND } from "@/lib/formatters";
import { Landmark, Briefcase, Coins, Target } from "lucide-react";

export function AssetDebtGoalsWidgets() {
  const { accounts, investments, debts, goals } = useFinance();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 1. Cơ cấu tài sản
  const assetStructure = useMemo(() => {
    const totalInvest = investments
      .filter((i) => i.status === "ACTIVE")
      .reduce((sum, i) => sum + (i.currentValue || i.amount), 0);

    const list = [
      ...accounts.map((a) => ({
        name: a.name,
        amount: Math.max(0, a.currentBalance),
        color: a.color || "#0284C7",
      })),
      {
        name: "Đầu tư",
        amount: totalInvest,
        color: "#10B981",
      },
    ];

    const total = list.reduce((sum, item) => sum + item.amount, 0);
    return { list, total };
  }, [accounts, investments]);

  // 2. Đầu tư đang hoạt động (Vốn vs Giá trị ước tính)
  const activeInvestmentsData = useMemo(() => {
    return investments
      .filter((i) => i.status === "ACTIVE")
      .map((i) => ({
        name: i.name.length > 14 ? `${i.name.substring(0, 12)}...` : i.name,
        principal: i.amount,
        estimated: i.currentValue || i.amount,
      }));
  }, [investments]);

  // 3. Tiến độ trả nợ
  const debtProgress = useMemo(() => {
    const activeDebts = debts.filter((d) => d.status === "ACTIVE");
    const totalRemaining = activeDebts.reduce(
      (sum, d) => sum + (d.totalAmount - d.paidAmount),
      0
    );

    const items = activeDebts.map((d) => {
      const pct = Math.round((d.paidAmount / d.totalAmount) * 100);
      return {
        name: d.name,
        percentage: pct,
      };
    });

    return { totalRemaining, items };
  }, [debts]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
        <Landmark className="w-4 h-4 text-blue-600" />
        Tài sản, nợ & mục tiêu
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* WIDGET 1: CƠ CẤU TÀI SẢN */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700">Cơ cấu tài sản</h4>
          </div>

          <div className="relative w-full h-40 flex items-center justify-center my-1">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    formatter={(v: any) => [formatVND(Number(v)), "Giá trị"]}
                    contentStyle={{ borderRadius: 12, fontSize: 11 }}
                  />
                  <Pie
                    data={assetStructure.list}
                    dataKey="amount"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={2}
                  >
                    {assetStructure.list.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[9px] font-bold text-slate-400 uppercase">Tổng tài sản</span>
              <span className="text-sm font-black text-slate-800">
                {formatShortVND(assetStructure.total)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-100 text-[10px] text-slate-500 font-semibold">
            {assetStructure.list.slice(0, 4).map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* WIDGET 2: ĐẦU TƯ ĐANG HOẠT ĐỘNG */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-xs font-bold text-slate-700">Đầu tư đang hoạt động</h4>
            <div className="flex items-center gap-2 text-[10px] font-semibold">
              <span className="flex items-center gap-1 text-slate-500">
                <span className="w-2 h-2 rounded-full bg-slate-400" /> Vốn
              </span>
              <span className="flex items-center gap-1 text-blue-600">
                <span className="w-2 h-2 rounded-full bg-blue-600" /> Giá trị
              </span>
            </div>
          </div>

          <div className="h-40 w-full pt-2">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={activeInvestmentsData}
                  layout="vertical"
                  margin={{ top: 5, right: 10, left: -25, bottom: 5 }}
                >
                  <XAxis
                    type="number"
                    stroke="#94A3B8"
                    fontSize={9}
                    tickFormatter={(v) => formatShortVND(v)}
                  />
                  <YAxis type="category" dataKey="name" stroke="#94A3B8" fontSize={9} />
                  <Tooltip formatter={(v: any) => formatVND(Number(v))} />
                  <Bar dataKey="principal" fill="#94A3B8" radius={[0, 4, 4, 0]} maxBarSize={12} />
                  <Bar dataKey="estimated" fill="#2563EB" radius={[0, 4, 4, 0]} maxBarSize={12} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 text-center font-medium">
            Lợi nhuận bình quân ~ 6.5% / năm
          </div>
        </div>

        {/* WIDGET 3: TIẾN ĐỘ TRẢ NỢ */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700">Tiến độ trả nợ</h4>
          </div>

          <div className="flex flex-col items-center justify-center my-auto py-2">
            <div className="w-24 h-24 rounded-full border-4 border-slate-100 border-t-blue-600 border-r-blue-600 flex flex-col items-center justify-center">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Còn nợ</span>
              <span className="text-base font-black text-slate-800">
                {formatShortVND(debtProgress.totalRemaining)}
              </span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-[11px]">
            {debtProgress.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5 font-medium truncate">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      item.percentage > 0 ? "bg-blue-600" : "bg-emerald-500"
                    }`}
                  />
                  {item.name}:
                </span>
                <span className="font-bold text-slate-800">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* WIDGET 4: MỤC TIÊU TIẾT KIỆM */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-700">Mục tiêu tiết kiệm</h4>
          </div>

          <div className="space-y-3.5 my-auto">
            {goals.map((g) => {
              const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
              return (
                <div key={g.id} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">{g.name}</span>
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                        pct === 100
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {pct}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        pct === 100 ? "bg-emerald-500" : "bg-blue-600"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 text-center font-medium">
            Tự động theo dõi từ các khoản nạp
          </div>
        </div>
      </div>
    </div>
  );
}
