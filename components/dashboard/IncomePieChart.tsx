"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useFinance } from "@/context/FinanceContext";
import { formatVND, formatShortVND } from "@/lib/formatters";
import { ArrowDownLeft, Info } from "lucide-react";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white text-xs p-3 rounded-xl shadow-xl border border-slate-800">
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: data.color }}
          />
          <span className="font-bold text-sm text-slate-100">{data.name}</span>
        </div>
        <div className="flex justify-between gap-4 text-slate-300">
          <span>Thu nhập:</span>
          <span className="font-semibold text-white">{formatVND(data.amount)}</span>
        </div>
        <div className="flex justify-between gap-4 text-slate-300 mt-1">
          <span>Tỷ trọng:</span>
          <span className="font-bold text-emerald-400">{data.percentage}%</span>
        </div>
      </div>
    );
  }
  return null;
}

export function IncomePieChart() {
  const { transactions, categories, selectedMonth, summary, getCategoryById } = useFinance();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const incomeStats = useMemo(() => {
    const map = new Map<string, number>();
    let totalIncome = 0;

    for (const tx of transactions) {
      if (tx.type !== "INCOME") continue;
      if (selectedMonth !== "ALL" && !tx.date.startsWith(selectedMonth)) continue;

      const cur = map.get(tx.categoryId) || 0;
      map.set(tx.categoryId, cur + tx.amount);
      totalIncome += tx.amount;
    }

    if (totalIncome === 0) return [];

    const result: { id: string; name: string; color: string; amount: number; percentage: number }[] = [];
    map.forEach((amount, catId) => {
      const cat = getCategoryById(catId);
      result.push({
        id: catId,
        name: cat?.name || "Khác",
        color: cat?.color || "#10B981",
        amount,
        percentage: Math.round((amount / totalIncome) * 100),
      });
    });

    return result.sort((a, b) => b.amount - a.amount);
  }, [transactions, selectedMonth, getCategoryById]);

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ArrowDownLeft className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Thu nhập theo nguồn</h3>
            <p className="text-xs text-slate-400 font-medium">Tỷ trọng các nguồn thu</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center py-4">
        {incomeStats.length === 0 ? (
          <div className="text-center py-10 px-4">
            <Info className="w-6 h-6 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-400">Chưa phát sinh thu nhập trong kỳ</p>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            <div className="relative w-full h-56 max-w-xs mx-auto flex items-center justify-center">
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={<CustomTooltip />} />
                    <Pie
                      data={incomeStats}
                      dataKey="amount"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={3}
                      stroke="#FFFFFF"
                      strokeWidth={2}
                    >
                      {incomeStats.map((entry) => (
                        <Cell key={`cell-${entry.id}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}

              {/* Tâm của Donut Chart - giống ảnh overview-1.JPG */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Tổng thu
                </span>
                <span className="text-xl font-black text-slate-800 tracking-tight">
                  {formatShortVND(summary.monthlyIncome)}
                </span>
              </div>
            </div>

            {/* Legend badges */}
            <div className="w-full mt-3 flex flex-wrap justify-center gap-2 pt-3 border-t border-slate-100">
              {incomeStats.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 text-xs font-semibold text-slate-700"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                  <span className="text-[10px] text-slate-400">({item.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
