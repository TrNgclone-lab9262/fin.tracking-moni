"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught runtime error caught by GlobalErrorBoundary:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetCache = () => {
    try {
      // Xóa session tạm thời nếu có lỗi xung đột state
      sessionStorage.clear();
      window.location.href = "/";
    } catch {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F6F8FB] flex flex-col items-center justify-center p-4 select-none">
          <div className="w-full max-w-md bg-white rounded-[3px] border border-slate-200/90 p-6 sm:p-8 shadow-sm text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100 shadow-xs">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#172B4D]">
                Đã xảy ra sự cố hiển thị tạm thời
              </h2>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Ứng dụng <strong>HOME MONI</strong> đã tự động ngăn chặn màn hình trắng để bảo vệ dữ liệu tài chính của gia đình bạn.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-slate-50 rounded-[3px] border border-slate-200 text-left overflow-hidden">
                <p className="text-[11px] font-mono text-rose-600 break-words line-clamp-3">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-[3px] shadow-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Tải lại trang</span>
              </button>
              <button
                type="button"
                onClick={this.handleResetCache}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-[3px] border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Home className="w-3.5 h-3.5 text-slate-500" />
                <span>Về trang chủ</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

