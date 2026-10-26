"use client";

import React, { useState, useRef } from "react";
import {
  X,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileJson,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { useFinance } from "@/context/FinanceContext";

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenResetDemo: () => void;
}

export function ExportImportModal({
  isOpen,
  onClose,
  onOpenResetDemo,
}: ExportImportModalProps) {
  const { transactions, categories, exportBackup, importBackup } = useFinance();
  const [activeTab, setActiveTab] = useState<"EXPORT" | "IMPORT">("EXPORT");
  const [importStatus, setImportStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message?: string;
  }>({ type: "idle" });

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    exportBackup();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportStatus({ type: "loading", message: "Đang kiểm tra và nhập dữ liệu..." });

    try {
      const result = await importBackup(file);
      if (result.success) {
        setImportStatus({
          type: "success",
          message: "Dữ liệu đã được phục hồi thành công vào LocalStorage!",
        });
      } else {
        setImportStatus({
          type: "error",
          message: result.error || "File sao lưu không đúng định dạng.",
        });
      }
    } catch (err: any) {
      setImportStatus({
        type: "error",
        message: "Có lỗi xảy ra khi xử lý file JSON.",
      });
    }

    // Reset input để có thể chọn lại file cùng tên nếu cần
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileJson className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800">
              Sao lưu & Phục hồi dữ liệu
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/30 flex gap-2">
          <button
            onClick={() => {
              setActiveTab("EXPORT");
              setImportStatus({ type: "idle" });
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === "EXPORT"
                ? "bg-white text-blue-600 shadow-sm border border-slate-200/80"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Download className="w-4 h-4" />
            Xuất dữ liệu (Export)
          </button>
          <button
            onClick={() => {
              setActiveTab("IMPORT");
              setImportStatus({ type: "idle" });
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === "IMPORT"
                ? "bg-white text-blue-600 shadow-sm border border-slate-200/80"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Upload className="w-4 h-4" />
            Nhập dữ liệu (Import)
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {activeTab === "EXPORT" ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-900 leading-relaxed">
                  Toàn bộ dữ liệu của bạn chỉ lưu trong LocalStorage trình duyệt này. Hãy xuất file sao lưu định kỳ để không bị mất dữ liệu khi dọn dẹp cache.
                </div>
              </div>

              {/* Tóm tắt data */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Tổng giao dịch:</span>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">
                    {transactions.length} bản ghi
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Danh mục cấu hình:</span>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">
                    {categories.length} danh mục
                  </p>
                </div>
              </div>

              <button
                onClick={handleExport}
                className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 active:scale-95"
              >
                <Download className="w-4 h-4" />
                Tải file sao lưu JSON về máy (.json)
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-6 text-center transition-colors bg-slate-50/50">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs sm:text-sm font-bold text-slate-700">
                  Chọn tệp JSON sao lưu từ máy tính
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Định dạng chuẩn do ứng dụng HOME MONI tạo ra
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json,application/json"
                  onChange={handleFileChange}
                  className="hidden"
                  id="json-file-input"
                />
                <label
                  htmlFor="json-file-input"
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl shadow-sm cursor-pointer transition-colors"
                >
                  Duyệt file...
                </label>
              </div>

              {/* Status feedback */}
              {importStatus.type === "success" && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{importStatus.message}</span>
                </div>
              )}

              {importStatus.type === "error" && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{importStatus.message}</span>
                </div>
              )}
            </div>
          )}

          {/* Nút Reset Mock data phụ bên dưới */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Muốn dùng lại dữ liệu mẫu demo?</span>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenResetDemo();
              }}
              className="text-blue-600 hover:text-blue-700 font-bold inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Nạp lại mẫu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
