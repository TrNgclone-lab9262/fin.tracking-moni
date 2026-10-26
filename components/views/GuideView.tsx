"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  ArrowLeftRight,
  CreditCard,
  Target,
  Coins,
  TrendingUp,
  Settings,
  Home,
  Users,
} from "lucide-react";

interface GuideSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

export function GuideView() {
  const [openSectionId, setOpenSectionId] = useState<string>("family");

  const toggleSection = (id: string) => {
    setOpenSectionId(openSectionId === id ? "" : id);
  };

  const sections: GuideSection[] = [
    {
      id: "family",
      title: "Cơ chế quản lý tài chính Tổ Ấm (Anh Chuột & Bé Mèo)",
      icon: Users,
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <div className="p-4 rounded-lg bg-blue-50/80 border border-blue-200/60 flex items-start gap-3 text-blue-900">
            <Lightbulb className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong>Nguyên tắc đồng thuận:</strong> HOME MONI giúp Anh Chuột và Bé Mèo nắm rõ thu nhập, chi tiêu và nợ thẻ tín dụng của nhau nhưng vẫn tôn trọng các khoản chi tiêu cá nhân hợp lý.
            </div>
          </div>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Bộ lọc góc nhìn (Sidebar & TopBar):</strong> Bấm <code>[ 🏡 My Home ]</code> để xem bức tranh chung tổ ấm, hoặc bấm <code>[ 👨 Anh Chuột ]</code> / <code>[ 👩 Bé Mèo ]</code> để lọc riêng tài khoản và chi phí của từng người.
            </li>
            <li>
              <strong>Phân loại mục đích:</strong> Khi ghi chép, chọn <strong>🏠 Chung gia đình</strong> (tiền nhà, tiền chợ, điện nước, con cái) hoặc <strong>👤 Cá nhân riêng</strong> (cà phê, sở thích riêng).
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "credit",
      title: "Quản lý 2 thẻ tín dụng BIDV Credit (50tr & 20tr)",
      icon: CreditCard,
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            Tổ ấm sử dụng 2 thẻ BIDV Credit: thẻ của <strong>Anh Chuột (Hạn mức 50.000.000 ₫)</strong> và thẻ của <strong>Bé Mèo (Hạn mức 20.000.000 ₫)</strong>.
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Cơ chế dư nợ:</strong> Khi quẹt thẻ tín dụng, số dư nợ sẽ tăng lên. Khi lấy tiền lương Vietinbank/VCB chuyển vào thanh toán thẻ, dư nợ sẽ giảm xuống.
            </li>
            <li>
              <strong>Ngưỡng an toàn 70%:</strong> Không nên quẹt vượt quá 70% hạn mức thẻ để giữ điểm tín dụng tốt và tránh áp lực trả nợ cuối kỳ.
            </li>
            <li>
              <strong>Nhắc ngày sao kê:</strong> Hệ thống tự động cảnh báo ngày sao kê thẻ tín dụng của cả 2 vợ chồng (ngày 20 hàng tháng, hạn trả ngày 25 hàng tháng) trên chuông thông báo.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "accounts",
      title: "Hệ thống 6 tài khoản ngân hàng của gia đình",
      icon: CreditCard,
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Vietinbank (Anh Chuột):</strong> Nhận lương chính của Anh Chuột. Dùng trích tiền nhà và nạp sang ví chi tiêu.</li>
            <li><strong>BIDV (Anh Chuột):</strong> Ví phụ chi tiêu thường ngày của Anh Chuột.</li>
            <li><strong>Vietcombank (Bé Mèo):</strong> Nhận lương chính của Bé Mèo. Dùng tiết kiệm và chuyển sang ví đi chợ.</li>
            <li><strong>ACB (Bé Mèo):</strong> Ví phụ chi tiêu sinh hoạt, đi chợ, siêu thị của Bé Mèo.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "planning",
      title: "Ngân sách tháng & Chỉ số tiêu mỗi ngày",
      icon: Target,
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            Chỉ số <strong>"Mỗi ngày còn được tiêu X VND"</strong> lấy số tiền ngân sách còn lại chia đều cho số ngày thực tế còn lại trong tháng, giúp 2 vợ chồng điều tiết chi tiêu hợp lý.
          </p>
        </div>
      ),
    },
    {
      id: "settings",
      title: "Cài đặt & Sao lưu LocalStorage an toàn",
      icon: Settings,
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            Dữ liệu tài chính gia đình được mã hóa và lưu trực tiếp trên thiết bị này. Hãy xuất file sao lưu JSON định kỳ để bảo toàn dữ liệu.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl p-6 border border-[#DCE4EE] shadow-xs">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          Cẩm nang sử dụng HOME MONI
        </h2>
        <p className="text-xs text-slate-400 font-medium mt-1">
          Quy chuẩn quản lý tài chính song hành cho 2 vợ chồng
        </p>
      </div>

      <div className="space-y-3">
        {sections.map((sec) => {
          const isOpen = openSectionId === sec.id;
          const Icon = sec.icon;

          return (
            <div
              key={sec.id}
              className="bg-white rounded-xl border border-[#DCE4EE] shadow-xs overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleSection(sec.id)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm text-slate-800">{sec.title}</span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-100 bg-white">
                  {sec.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
