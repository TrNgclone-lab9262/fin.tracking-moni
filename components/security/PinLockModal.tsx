"use client";

import React, { useState } from "react";
import { Lock, ShieldCheck, Delete, AlertCircle, Check } from "lucide-react";
import { useSecurity } from "@/context/SecurityContext";

interface PinLockModalProps {
  mode?: "UNLOCK" | "SETUP";
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PinLockModal({ mode = "UNLOCK", onSuccess, onCancel }: PinLockModalProps) {
  const { unlockWithPin, setupNewPin, isConfigured } = useSecurity();
  const [pin, setPin] = useState<string>("");
  const [confirmPin, setConfirmPin] = useState<string>("");
  const [step, setStep] = useState<"INPUT" | "CONFIRM">("INPUT");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isShaking, setIsShaking] = useState<boolean>(false);

  const isSetupMode = mode === "SETUP" || !isConfigured;

  const triggerShake = (msg: string) => {
    setErrorMsg(msg);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
    setPin("");
    if (step === "CONFIRM") {
      setConfirmPin("");
      setStep("INPUT");
    }
  };

  const handleKeyPress = (num: string) => {
    if (isSubmitting) return;
    setErrorMsg("");

    if (!isSetupMode) {
      // Chế độ Mở Khóa (Unlock)
      if (pin.length < 6) {
        const nextPin = pin + num;
        setPin(nextPin);
        if (nextPin.length >= 4) {
          // Tự động thử unlock nếu đã đủ độ dài 4-6
        }
      }
    } else {
      // Chế độ Thiết Lập PIN mới (Setup)
      if (step === "INPUT") {
        if (pin.length < 6) setPin(pin + num);
      } else {
        if (confirmPin.length < 6) setConfirmPin(confirmPin + num);
      }
    }
  };

  const handleDelete = () => {
    if (isSubmitting) return;
    setErrorMsg("");
    if (!isSetupMode) {
      setPin((prev) => prev.slice(0, -1));
    } else {
      if (step === "INPUT") {
        setPin((prev) => prev.slice(0, -1));
      } else {
        setConfirmPin((prev) => prev.slice(0, -1));
      }
    }
  };

  const handleClear = () => {
    if (isSubmitting) return;
    setErrorMsg("");
    if (!isSetupMode) {
      setPin("");
    } else {
      if (step === "INPUT") setPin("");
      else setConfirmPin("");
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!isSetupMode) {
      if (pin.length < 4) {
        triggerShake("Vui lòng nhập tối thiểu 4 số");
        return;
      }
      setIsSubmitting(true);
      const res = await unlockWithPin(pin);
      setIsSubmitting(false);
      if (res.success) {
        if (onSuccess) onSuccess();
      } else {
        triggerShake(res.message || "Mã PIN không đúng");
      }
    } else {
      // Chế độ Setup
      if (step === "INPUT") {
        if (pin.length < 4) {
          triggerShake("Mã PIN phải từ 4 đến 6 chữ số");
          return;
        }
        setStep("CONFIRM");
      } else {
        if (confirmPin !== pin) {
          triggerShake("Mã PIN xác nhận không khớp! Vui lòng thử lại.");
          return;
        }
        setIsSubmitting(true);
        const ok = await setupNewPin(pin);
        setIsSubmitting(false);
        if (ok) {
          if (onSuccess) onSuccess();
        } else {
          triggerShake("Có lỗi xảy ra khi lưu mã PIN.");
        }
      }
    }
  };

  const currentDisplayPin = !isSetupMode ? pin : step === "INPUT" ? pin : confirmPin;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div
        className={`w-full max-w-sm bg-white rounded-[3px] border border-slate-200 shadow-2xl p-6 sm:p-7 flex flex-col items-center transition-transform ${
          isShaking ? "animate-bounce ring-2 ring-rose-500" : ""
        }`}
      >
        {/* Biểu tượng Khiên An Ninh */}
        <div className="w-14 h-14 rounded-[3px] bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-4 shadow-xs">
          {isSetupMode ? <ShieldCheck className="w-7 h-7" /> : <Lock className="w-7 h-7" />}
        </div>

        {/* Tiêu đề & Thông điệp */}
        <h2 className="text-xl font-black text-[#172B4D] tracking-tight text-center">
          {!isSetupMode
            ? "Mở Khóa HOME MONI"
            : step === "INPUT"
            ? "Thiết Lập Mã PIN Mới"
            : "Xác Nhận Lại Mã PIN"}
        </h2>
        <p className="text-xs text-slate-500 text-center mt-1.5 mb-6">
          {!isSetupMode
            ? "Nhập mã PIN gia đình để truy cập thông tin tài chính"
            : step === "INPUT"
            ? "Tạo mã PIN 4-6 số bí mật cho 2 vợ chồng"
            : "Nhập lại mã PIN bạn vừa tạo để xác nhận"}
        </p>

        {/* Hiển thị Dot chấm tròn PIN */}
        <div className="flex items-center gap-3 mb-6">
          {[0, 1, 2, 3, 4, 5].map((index) => {
            const isFilled = index < currentDisplayPin.length;
            return (
              <div
                key={index}
                className={`w-3.5 h-3.5 rounded-full border transition-all duration-150 ${
                  isFilled
                    ? "bg-blue-600 border-blue-600 scale-110 shadow-xs"
                    : "bg-slate-100 border-slate-300"
                }`}
              />
            );
          })}
        </div>

        {/* Báo lỗi nếu có */}
        {errorMsg && (
          <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-[3px] mb-4 w-full justify-center">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {/* Bàn phím số Numpad Fintech chuẩn bo góc 3px */}
        <div className="grid grid-cols-3 gap-2.5 w-full mb-5">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              className="h-12 bg-slate-50 hover:bg-slate-100 active:bg-blue-50 active:text-blue-600 text-slate-800 text-lg font-bold rounded-[3px] border border-slate-200 transition-all flex items-center justify-center shadow-xs"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="h-12 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-500 text-xs font-semibold rounded-[3px] border border-slate-200 transition-all flex items-center justify-center"
          >
            Xóa hết
          </button>
          <button
            onClick={() => handleKeyPress("0")}
            className="h-12 bg-slate-50 hover:bg-slate-100 active:bg-blue-50 active:text-blue-600 text-slate-800 text-lg font-bold rounded-[3px] border border-slate-200 transition-all flex items-center justify-center shadow-xs"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            aria-label="Xóa lùi"
            className="h-12 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-600 rounded-[3px] border border-slate-200 transition-all flex items-center justify-center"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Thông báo chính sách bảo mật tự động khóa */}
        {!isSetupMode && (
          <p className="text-[11px] text-slate-500 mb-5 text-center">
            🔒 Tự động khóa sau <strong>5 phút</strong> không hoạt động hoặc khi đóng tab / tắt app.
          </p>
        )}

        {/* Nút hành động Submit */}
        <div className="flex gap-2 w-full">
          {onCancel && (
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-[3px] border border-slate-200 transition-colors"
            >
              Hủy
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || currentDisplayPin.length < 4}
            className={`flex-1 py-2.5 text-xs font-bold text-white rounded-[3px] shadow-sm transition-all flex items-center justify-center gap-1.5 ${
              currentDisplayPin.length >= 4 && !isSubmitting
                ? "bg-blue-600 hover:bg-blue-700 active:scale-[0.99]"
                : "bg-slate-300 cursor-not-allowed text-slate-500"
            }`}
          >
            {isSubmitting ? (
              <span>Đang kiểm tra...</span>
            ) : isSetupMode ? (
              step === "INPUT" ? (
                <span>Tiếp tục</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Hoàn tất thiết lập</span>
                </>
              )
            ) : (
              <span>Mở Khóa Ngay</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

