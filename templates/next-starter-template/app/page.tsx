import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowUpRight, ArrowDownRight, ShieldCheck, Heart, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCE4EE] pb-5">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-[2px] border border-blue-200">
            --preset b2dJCEImFF Active
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#172B4D] mt-2">
            Universal Calm Fintech Dashboard
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Mẫu kiến trúc Starter Template bo góc vi mô 2px sắc nét chuẩn Terminal
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Tài Liệu Hướng Dẫn</Button>
          <Button variant="default">Khởi Tạo Dự Án</Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Navy Card */}
        <Card className="bg-[#172B4D] border-[#172B4D] text-white">
          <CardContent className="p-5">
            <p className="text-xs font-semibold text-slate-300">Tổng Số Dư Khả Dụng</p>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight mt-1 text-white tabular-nums">
              368.500.000 ₫
            </p>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-emerald-400 font-semibold">
              <ArrowUpRight className="w-4 h-4" />
              <span>+12.4% so với tháng trước</span>
            </div>
          </CardContent>
        </Card>

        {/* Feminine Rose Card (Bé Mèo) */}
        <Card className="border-rose-200 bg-rose-50/40">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-rose-700">Hũ Tích Lũy Bé Mèo 👩</p>
              <Heart className="w-4 h-4 text-rose-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight mt-1 text-[#172B4D] tabular-nums">
              52.000.000 ₫
            </p>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-rose-600 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Đạt 85% kế hoạch năm</span>
            </div>
          </CardContent>
        </Card>

        {/* Standard White Card */}
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-semibold text-slate-500">Dư Nợ Thẻ Tín Dụng</p>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight mt-1 text-rose-600 tabular-nums">
              19.350.000 ₫
            </p>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-500 font-semibold">
              <ArrowDownRight className="w-4 h-4 text-emerald-600" />
              <span>Hạn sao kê ngày 20</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Component Sandbox Showcase */}
      <Card>
        <CardHeader>
          <CardTitle>Bộ Sưu Tập Components Chuẩn Bo Góc 2px (Sharp Precision)</CardTitle>
          <CardDescription>
            Kiểm tra tính nhất quán giữa các biến thể nút, thẻ và form controls
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Buttons Row */}
          <div>
            <p className="text-xs font-bold text-slate-700 mb-2.5">1. Biến Thể Nút Bấm (Button Variants):</p>
            <div className="flex flex-wrap gap-2.5">
              <Button variant="default">Primary (#2563EB)</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="destructive">Destructive (#F43F5E)</Button>
              <Button variant="feminine">Feminine Rose</Button>
              <Button variant="feminineSubtle">Feminine Subtle</Button>
              <Button variant="ghost">Ghost Button</Button>
            </div>
          </div>

          {/* Form Controls */}
          <div>
            <p className="text-xs font-bold text-slate-700 mb-2.5">2. Form Inputs & Actions:</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input placeholder="Nhập tên danh mục hoặc ghi chú..." className="flex-1" />
              <Input type="number" placeholder="Số tiền (VND)..." className="w-full sm:w-48" />
              <Button variant="default" className="shrink-0">
                Thêm Giao Dịch
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

