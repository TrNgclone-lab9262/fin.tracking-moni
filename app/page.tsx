"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useFinance } from "@/context/FinanceContext";
import { Sidebar } from "@/components/common/Sidebar";
import { TopBar } from "@/components/common/TopBar";
import { MobileDrawer } from "@/components/common/MobileDrawer";
import { OverviewView } from "@/components/views/OverviewView";
import { TransactionsView } from "@/components/views/TransactionsView";
import { AccountsView } from "@/components/views/AccountsView";
import { PlanningView } from "@/components/views/PlanningView";
import { DebtsInvestView } from "@/components/views/DebtsInvestView";
import { GuideView } from "@/components/views/GuideView";
import { SettingsView } from "@/components/views/SettingsView";
import { TransactionFormModal } from "@/components/transactions/TransactionFormModal";
import { ExportImportModal } from "@/components/common/ExportImportModal";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

export default function HomePage() {
  const { isLoaded, activeTab, resetToMockData } = useFinance();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Skeleton Loader khi chờ hydrate từ LocalStorage
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <aside className="w-64 bg-[#1E3A8A] hidden md:block animate-pulse" />
        <div className="flex-1 flex flex-col">
          <header className="h-20 bg-white border-b border-slate-200 animate-pulse" />
          <main className="p-8 space-y-6">
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-slate-200/80 rounded-3xl animate-pulse" />
              ))}
            </div>
            <div className="h-80 bg-slate-200/80 rounded-3xl animate-pulse" />
          </main>
        </div>
      </div>
    );
  }

  const renderActiveView = () => {
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-900 font-sans antialiased">
      {/* 1. Sidebar cố định bên trái (Khớp 100% hình ảnh tham khảo) */}
      <Sidebar />

      {/* 2. Drawer Menu cho Thiết bị Di động */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* 3. Vùng làm việc chính */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onOpenBackupModal={() => setIsBackupModalOpen(true)}
          onOpenResetConfirm={() => setIsResetConfirmOpen(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {renderActiveView()}
        </main>
      </div>

      {/* 4. Floating Action Button cho Mobile (Khớp hình uix-mobile.JPG) */}
      <div className="fixed bottom-6 right-6 md:hidden z-40">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/40 flex items-center justify-center active:scale-90 transition-transform"
          aria-label="Thêm giao dịch mới"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>

      {/* 5. Modals toàn cục */}
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
    </div>
  );
}
