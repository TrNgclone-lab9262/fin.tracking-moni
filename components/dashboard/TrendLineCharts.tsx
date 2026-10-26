"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useFinance } from "@/context/FinanceContext";
import { formatVND, formatShortVND } from "@/lib/formatters";
import { TrendingUp, Activity } from "lucide-react";

export function TrendLineCharts() {
  const { transactions, budgetSummary } = useFinance();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 1. Dữ liệu Số dư theo thời gian (T5 -> T10)
  const balanceTrendData = useMemo(() => {
    const months = [
      { key: "T5", balance: 20000000 },
      { key: "T6", balance: 22000000 },
      { key: "T7", balance: 21500000 },
      { key: "T8", balance: 45000000 },
      { key: "T9", balance: 52000000 },
      { key: "T10", balance: 57650000 },
    ];
    return months;
  }, []);

  // 2. Dữ liệu Chi tiêu lũy kế trong tháng 10 (Ngày 1 -> 29)
  const monthlyExpenseCumulative = useMemo(() => {
    const points: { day: string; amount: number }[] = [];
    let cum = 0;
    const days = [1, 5, 9, 13, 17, 21, 25, 29];

    days.forEach((d) => {
      if (d === 1) cum = 108000;
      else if (d === 5) cum = 5252000;
      else if (d === 9) cum = 5824000;
      else if (d === 13) cum = 6490000;
      else if (d === 17) cum = 7119000;
      else if (d >= 21) cum = 7469000;

      points.push({ day: `${d}`, amount: cum });
    });

    return points;
  }, []);

  // 3. Dữ liệu Thu nhập lũy kế trong tháng 10
  const monthlyIncomeCumulative = useMemo(() => {
    const points: { day: string; amount: number }[] = [];
    let cum = 0;
    const days = [1, 5, 9, 13, 17, 21, 25, 29];

    days.forEach((d) => {
      if (d < 5) cum = 0;
      else if (d === 5) cum = 18500000;
      else if (d >= 10) cum = 21619000;

      points.push({ day: `${d}`, amount: cum });
    });

    return points;
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
        <Activity className="w-4 h-4 text-blue-600" />
        Xu hướng tích lũy
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Biểu đồ 1: Số dư theo thời gian */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-700">Số dư theo thời gian</h4>
            <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              T5 - T10
            </span>
          </div>
          <div className="h-40 w-full pt-2">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={balanceTrendData}>
                  <XAxis dataKey="key" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#94A3B8"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => formatShortVND(v)}
                  />
                  <Tooltip
                    formatter={(v: any) => [formatVND(Number(v)), "Số dư"]}
                    contentStyle={{ borderRadius: 12, fontSize: 12 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    stroke="#2563EB"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "#2563EB" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Biểu đồ 2: Chi tiêu lũy kế trong tháng */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-700">Chi tiêu lũy kế trong tháng</h4>
            <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
              Mốc {formatShortVND(budgetSummary.totalBudget)}
            </span>
          </div>
          <div className="h-40 w-full pt-2">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyExpenseCumulative}>
                  <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#94A3B8"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => formatShortVND(v)}
                  />
                  <Tooltip
                    formatter={(v: any) => [formatVND(Number(v)), "Đã chi"]}
                    contentStyle={{ borderRadius: 12, fontSize: 12 }}
                  />
                  <ReferenceLine
                    y={budgetSummary.totalBudget}
                    stroke="#F59E0B"
                    strokeDasharray="3 3"
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#F43F5E"
                    strokeWidth={2.5}
                    dot={{ r: 2, fill: "#F43F5E" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Biểu đồ 3: Thu lũy kế trong tháng */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-700">Thu lũy kế trong tháng</h4>
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Tháng 10
            </span>
          </div>
          <div className="h-40 w-full pt-2">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyIncomeCumulative}>
                  <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#94A3B8"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => formatShortVND(v)}
                  />
                  <Tooltip
                    formatter={(v: any) => [formatVND(Number(v)), "Thu nhập"]}
                    contentStyle={{ borderRadius: 12, fontSize: 12 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    dot={{ r: 2, fill: "#10B981" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
