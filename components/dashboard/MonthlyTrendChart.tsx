"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useFinance } from "@/context/FinanceContext";
import { formatVND, formatShortVND } from "@/lib/formatters";
import { BarChart3 } from "lucide-react";

interface CustomBarTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

function CustomBarTooltip({ active, payload, label }: CustomBarTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white text-xs p-3 rounded-xl shadow-xl border border-slate-800">
        <p className="font-bold text-slate-200 mb-1.5 border-b border-slate-700 pb-1">
          {label}
        </p>
        {payload.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4 py-0.5">
            <span className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-300">{item.name}:</span>
            </span>
            <span className="font-semibold text-white">{formatVND(item.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export function MonthlyTrendChart() {
  const { monthlyTrendData } = useFinance();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Thu - Chi các tháng</h3>
            <p className="text-xs text-slate-400 font-medium">Xu hướng thu nhập & chi tiêu</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-emerald-600">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Thu nhập
          </span>
          <span className="flex items-center gap-1.5 text-rose-600">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            Chi tiêu
          </span>
        </div>
      </div>

      <div className="flex-1 min-h-[260px] pt-4">
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyTrendData}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <XAxis
                dataKey="label"
                stroke="#94A3B8"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: "#E2E8F0" }}
              />
              <YAxis
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => formatShortVND(val)}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar
                dataKey="income"
                name="Thu nhập"
                fill="#10B981"
                radius={[6, 6, 0, 0]}
                maxBarSize={32}
              />
              <Bar
                dataKey="expense"
                name="Chi tiêu"
                fill="#F43F5E"
                radius={[6, 6, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-slate-400">
            Đang tải dữ liệu biểu đồ...
          </div>
        )}
      </div>
    </div>
  );
}
