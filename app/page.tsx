"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useFinance } from "@/context/FinanceContext";
import { Sidebar } from "@/components/common/Sidebar";
import { TopBar } from "@/components/common/TopBar";
import { MobileDrawer } from "@/components/common/MobileDrawer";
import { BottomNavBar } from "@/components/common/BottomNavBar";

// 1. Desktop Shell Views - Giữ OverviewView & TransactionsView tĩnh cho FCP tức thì
import { OverviewView } from "@/components/views/OverviewView";
import { TransactionsView } from "@/components/views/TransactionsView";

// Dynamic Code-splitting cho các Views ít dùng ban đầu
const AccountsView = dynamic(() => import("@/components/views/AccountsView").then((m) => m.AccountsView));
const PlanningView = dynamic(() => import("@/components/views/PlanningView").then((m) => m.PlanningView));
const DebtsInvestView = dynamic(() => import("@/components/views/DebtsInvestView").then((m) => m.DebtsInvestView));
const GuideView = dynamic(() => import("@/components/views/GuideView").then((m) => m.GuideView));
const SettingsView = dynamic(() => import("@/components/views/SettingsView").then((m) => m.SettingsView));
const MasterDataBackendView = dynamic(() => import("@/components/views/MasterDataBackendView").then((m) => m.MasterDataBackendView));

// 2. Mobile Shell Views (Chuẩn Vàng Figma 1:1 - Cô đọng, Bento, Thumb-zone)
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { MobileOverviewView } from "@/components/mobile/views/MobileOverviewView";
import { MobileTransactionsView } from "@/components/mobile/views/MobileTransactionsView";
const MobileAccountsView = dynamic(() => import("@/components/mobile/views/MobileAccountsView").then((m) => m.MobileAccountsView));
const MobilePlanningView = dynamic(() => import("@/components/mobile/views/MobilePlanningView").then((m) => m.MobilePlanningView));

// 3. Modals & Action Sheets - Chỉ nạp khi người dùng mở
const TransactionFormModal = dynamic(() => import("@/components/transactions/TransactionFormModal").then((m) => m.TransactionFormModal));
const MobileNumpadSheet = dynamic(() => import("@/components/mobile/sheets/MobileNumpadSheet").then((m) => m.MobileNumpadSheet));
const ExportImportModal = dynamic(() => import("@/components/common/ExportImportModal").then((m) => m.ExportImportModal));
const ConfirmDialog = dynamic(() => import("@/components/common/ConfirmDialog").then((m) => m.ConfirmDialog));
import { SecurityGate } from "@/components/security/SecurityGate";

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
      case "backend":
        return <MasterDataBackendView />;
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
      case "backend":
        return <MasterDataBackendView />;
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
    <SecurityGate>
      {/* 1. DESKTOP VIEW SHELL (>= 768px - md:flex) */}
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

      {/* 2. MOBILE VIEW SHELL (< 768px - block md:hidden) ⭐ CHUẨN VÀNG FIGMA */}
      <div className="block md:hidden min-h-screen bg-[#F6F8FB] text-slate-900 font-sans antialiased pb-24">
        <MobileHeader onOpenDrawer={() => setIsMobileMenuOpen(true)} />
        <main className="p-3.5 space-y-3.5">
          {renderActiveMobileView()}
        </main>
        <BottomNavBar onOpenAddModal={() => setIsMobileNumpadOpen(true)} />
      </div>

      {/* 3. GLOBAL MODALS & BOTTOM SHEETS (Dynamic Loaded) */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {isMobileNumpadOpen && (
        <MobileNumpadSheet
          isOpen={isMobileNumpadOpen}
          onClose={() => setIsMobileNumpadOpen(false)}
        />
      )}

      {isAddModalOpen && (
        <TransactionFormModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {isBackupModalOpen && (
        <ExportImportModal
          isOpen={isBackupModalOpen}
          onClose={() => setIsBackupModalOpen(false)}
          onOpenResetDemo={() => setIsResetConfirmOpen(true)}
        />
      )}

      {isResetConfirmOpen && (
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
      )}
    </SecurityGate>
  );
}