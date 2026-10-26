"use client";

import React from "react";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { DualCreditCardsWidget } from "@/components/dashboard/DualCreditCardsWidget";
import { FamilyCashflowWidget } from "@/components/dashboard/FamilyCashflowWidget";
import { MonthlyTrendChart } from "@/components/dashboard/MonthlyTrendChart";
import { ExpensePieChart } from "@/components/dashboard/ExpensePieChart";
import { IncomePieChart } from "@/components/dashboard/IncomePieChart";
import { TrendLineCharts } from "@/components/dashboard/TrendLineCharts";
import { AssetDebtGoalsWidgets } from "@/components/dashboard/AssetDebtGoalsWidgets";
import { RecentActivitySection } from "@/components/dashboard/RecentActivitySection";

export function OverviewView() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* 1. Bốn Thẻ Chỉ Số Gradient Tổng quan */}
      <section aria-label="Thống kê tổng quan">
        <SummaryCards />
      </section>

      {/* 2. Widget Quản lý 2 Thẻ Tín Dụng BIDV Credit (50tr & 20tr) */}
      <section aria-label="Quản lý thẻ tín dụng BIDV">
        <DualCreditCardsWidget />
      </section>

      {/* 3. Phân Tích Dòng Tiền Thu Nhập 2 Vợ Chồng & Lịch Chi Tiêu Heatmap */}
      <section aria-label="Dòng tiền gia đình">
        <FamilyCashflowWidget />
      </section>

      {/* 4. Hàng Biểu Đồ: Thu - Chi các tháng, Chi theo danh mục, Thu theo nguồn */}
      <section aria-label="Biểu đồ phân tích" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <MonthlyTrendChart />
        </div>
        <div className="lg:col-span-1">
          <ExpensePieChart />
        </div>
        <div className="lg:col-span-1">
          <IncomePieChart />
        </div>
      </section>

      {/* 5. Xu hướng tích lũy */}
      <section aria-label="Xu hướng lũy kế">
        <TrendLineCharts />
      </section>

      {/* 6. Tài sản nợ & mục tiêu */}
      <section aria-label="Tài sản nợ và mục tiêu">
        <AssetDebtGoalsWidgets />
      </section>

      {/* 7. Hoạt động gần đây & Ngân sách tháng */}
      <section aria-label="Hoạt động gần đây">
        <RecentActivitySection />
      </section>
    </div>
  );
}
