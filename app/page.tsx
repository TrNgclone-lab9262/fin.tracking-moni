"use client";

import React, { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { Sidebar } from "@/components/common/Sidebar";
import { TopBar } from "@/components/common/TopBar";
import { MobileDrawer } from "@/components/common/MobileDrawer";
import { BottomNavBar } from "@/components/common/BottomNavBar";

// 1. Desktop Shell Views (Bản mở rộng đầy đủ Recharts, Heatmap 31 ngày, Bảng 8 cột)
import { OverviewView } from "@/components/views/OverviewView";
import { TransactionsView } from "@/components/views/TransactionsView";
import { AccountsView } from "@/components/views/AccountsView";
import { PlanningView } from "@/components/views/PlanningView";
import { DebtsInvestView } from "@/components/views/DebtsInvestView";
import { GuideView } from "@/components/views/GuideView";
import { SettingsView } from "@/components/views/SettingsView";

// 2. Mobile Shell Views (Chuẩn Vàng Figma 1:1 - Cô đọng, Bento, Thumb-zone)
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { MobileOverviewView } from "@/components/mobile/views/MobileOverviewView";
import { MobileTransactionsView } from "@/components/mobile/views/MobileTransactionsView";
import { MobileAccountsView } from "@/components/mobile/views/MobileAccountsView";
import { MobilePlanningView } from "@/components/mobile/views/MobilePlanningView";

// 3. Modals & Action Sheets
import { TransactionFormModal } from "@/components/transactions/TransactionFormModal";
import { MobileNumpadSheet } from "@/components/mobile/sheets/MobileNumpadSheet";
import { ExportImportModal } from "@/components/common/ExportImportModal";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

export default function HomePage() {
  const { isLoaded, activeTab, resetToMockData } = useFinance();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMobileNumpadOpen, setIsMobileNumpadOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Skeleton Loader khi chờ hydrate từ LocalStorage
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#F6F8FB] flex">
        <aside className="w-64 bg-[#1E3A8A] hidden md:block animate-pulse" />
        <div className="flex-1 flex flex-col">
          <header className="h-20 bg-white border-b border-slate-200 animate-pulse" />
          <main className="p-8 space-y-6">
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-slate-200/80 rounded-xl animate-pulse" />
              ))}
            </div>
            <div className="h-80 bg-slate-200/80 rounded-xl animate-pulse" />
          </main>
        </div>
      </div>
    );
  }

  // Luồng render View cho Desktop
  const renderActiveDesktopView = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewView />;
      case "transactions":
        return (
          <TransactionsView
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onOpenBackupModal={() => setIsBackupModalOpen(true)}
          />
        );
      case "accounts":
        return <AccountsView />;
      case "planning":
        return <PlanningView />;
      case "debts_invest":
        return <DebtsInvestView />;
      case "guide":
        return <GuideView />;
      case "settings":
        return (
          <SettingsView
            onOpenBackupModal={() => setIsBackupModalOpen(true)}
            onOpenResetConfirm={() => setIsResetConfirmOpen(true)}
          />
        );
      default:
        return <OverviewView />;
    }
  };

  // Luồng render View cho Mobile (Chuẩn Vàng Figma)
  const renderActiveMobileView = () => {
    switch (activeTab) {
      case "overview":
        return <MobileOverviewView />;
      case "transactions":
        return (
          <MobileTransactionsView
            onOpenAddModal={() => setIsMobileNumpadOpen(true)}
          />
        );
      case "accounts":
        return <MobileAccountsView />;
      case "planning":
        return <MobilePlanningView />;
      case "debts_invest":
        return <DebtsInvestView />;
      case "guide":
        return <GuideView />;
      case "settings":
        return (
          <SettingsView
            onOpenBackupModal={() => setIsBackupModalOpen(true)}
            onOpenResetConfirm={() => setIsResetConfirmOpen(true)}
          />
        );
      default:
        return <MobileOverviewView />;
    }
  };

  return (
    <>
      {/* =========================================================================
          1. DESKTOP VIEW SHELL (>= 768px - md:flex)
          Nguyên bản 100%: Sidebar mở rộng, TopBar desktop, Bảng 8 cột, Recharts
         ========================================================================= */}
      <div className="hidden md:flex min-h-screen bg-[#F6F8FB] text-slate-900 font-sans antialiased">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onOpenBackupModal={() => setIsBackupModalOpen(true)}
            onOpenResetConfirm={() => setIsResetConfirmOpen(true)}
            onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
          />
          <main className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-8 py-8">
            {renderActiveDesktopView()}
          </main>
        </div>
      </div>

      {/* =========================================================================
          2. MOBILE VIEW SHELL (< 768px - block md:hidden) ⭐ CHUẨN VÀNG FIGMA
          Cô đọng, Bento layout, thumb-zone tối ưu, zero layout clutter
         ========================================================================= */}
      <div className="block md:hidden min-h-screen bg-[#F6F8FB] text-slate-900 font-sans antialiased pb-24">
        {/* Mobile Header Bar */}
        <MobileHeader onOpenDrawer={() => setIsMobileMenuOpen(true)} />

        {/* Thân Màn Hình Mobile Cô Đọng Khớp 100% Figma */}
        <main className="p-3.5 space-y-3.5">
          {renderActiveMobileView()}
        </main>

        {/* Thanh Điều Hướng Đáy Cho Di Động */}
        <BottomNavBar onOpenAddModal={() => setIsMobileNumpadOpen(true)} />
      </div>

      {/* =========================================================================
          3. GLOBAL MODALS & BOTTOM SHEETS
         ========================================================================= */}
      {/* Drawer Menu cho Di Động */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Numpad 3 Giây Bottom Sheet (Khớp Figma Screen 2) */}
      <MobileNumpadSheet
        isOpen={isMobileNumpadOpen}
        onClose={() => setIsMobileNumpadOpen(false)}
      />

      {/* Desktop Transaction Form Modal */}
      <TransactionFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <ExportImportModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        onOpenResetDemo={() => setIsResetConfirmOpen(true)}
      />

      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        title="Khôi phục toàn bộ dữ liệu mẫu?"
        message="Hệ thống sẽ nạp lại toàn bộ dữ liệu mẫu chuẩn (Tài khoản, Khoản nợ, Đầu tư, Kế hoạch & Giao dịch) theo bộ thiết kế tham khảo. Các thay đổi của bạn sẽ được thiết lập lại."
        confirmLabel="Nạp lại mẫu chuẩn"
        cancelLabel="Hủy"
        isDanger={false}
        onConfirm={() => {
          resetToMockData();
          setIsResetConfirmOpen(false);
        }}
        onCancel={() => setIsResetConfirmOpen(false)}
      />
    </>
  );
}
