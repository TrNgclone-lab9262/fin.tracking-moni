"use client";

import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  RowSelectionState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Pencil,
  Trash2,
  Users,
  Eye,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Transaction } from "@/types/finance";
import { useFinance } from "@/context/FinanceContext";
import { useSecurity } from "@/context/SecurityContext";
import { formatVNDMasked, formatDateVN } from "@/lib/formatters";

interface TransactionDataTableProps {
  data: Transaction[];
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
  onSelectDetail: (tx: Transaction) => void;
  onBatchDelete?: (ids: string[]) => void;
}

export function TransactionDataTable({
  data,
  onEdit,
  onDelete,
  onSelectDetail,
  onBatchDelete,
}: TransactionDataTableProps) {
  const { getCategoryById, getAccountById } = useFinance();
  const { isPrivacyMode } = useSecurity();

  const [sorting, setSorting] = useState<SortingState>([
    { id: "date", desc: true },
  ]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pageSize, setPageSize] = useState<number>(15);

  // Định nghĩa các cột của bảng theo chuẩn TanStack Table
  const columns = useMemo<ColumnDef<Transaction>[]>(
    () => [
      // 1. Cột Checkbox (Indeterminate header + Row selection)
      {
        id: "select",
        enableResizing: false,
        size: 40,
        minSize: 40,
        maxSize: 48,
        header: ({ table }) => (
          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              ref={(el) => {
                if (el) {
                  el.indeterminate = table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected();
                }
              }}
              checked={table.getIsAllRowsSelected()}
              onChange={table.getToggleAllRowsSelectedHandler()}
              className="w-4 h-4 rounded-[3px] text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
              aria-label="Chọn tất cả giao dịch"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <input
              type="checkbox"
              checked={row.getIsSelected()}
              disabled={!row.getCanSelect()}
              onChange={row.getToggleSelectedHandler()}
              className="w-4 h-4 rounded-[3px] text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
              aria-label="Chọn giao dịch"
            />
          </div>
        ),
      },

      // 2. Cột Ngày giao dịch (Sortable)
      {
        accessorKey: "date",
        id: "date",
        header: ({ column }) => {
          const isSorted = column.getIsSorted();
          return (
            <button
              type="button"
              onClick={column.getToggleSortingHandler()}
              className="flex items-center gap-1 font-bold text-slate-700 hover:text-blue-600 transition-colors select-none text-left"
            >
              <span>Ngày</span>
              {isSorted === "asc" ? (
                <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
              ) : isSorted === "desc" ? (
                <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
              ) : (
                <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-60" />
              )}
            </button>
          );
        },
        cell: ({ getValue }) => {
          const dateStr = getValue() as string;
          return (
            <span className="font-mono text-xs font-semibold text-slate-600">
              {formatDateVN(dateStr)}
            </span>
          );
        },
        size: 110,
        minSize: 90,
      },

      // 3. Cột Nội dung / Ghi chú (Sortable)
      {
        accessorKey: "note",
        id: "note",
        header: ({ column }) => {
          const isSorted = column.getIsSorted();
          return (
            <button
              type="button"
              onClick={column.getToggleSortingHandler()}
              className="flex items-center gap-1 font-bold text-slate-700 hover:text-blue-600 transition-colors select-none text-left"
            >
              <span>Nội dung ghi chú</span>
              {isSorted === "asc" ? (
                <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
              ) : isSorted === "desc" ? (
                <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
              ) : (
                <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-60" />
              )}
            </button>
          );
        },
        cell: ({ row }) => {
          const tx = row.original;
          const isPlanned = tx.amount === 0 || (tx.note && tx.note.startsWith("[Kế hoạch:"));
          return (
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-slate-800 text-xs line-clamp-1">
                {tx.note || "Giao dịch không tên"}
              </span>
              {isPlanned && (
                <span className="inline-flex items-center text-[10px] font-semibold text-amber-600">
                  ⚡ Còn trong kế hoạch
                </span>
              )}
            </div>
          );
        },
        size: 240,
        minSize: 180,
      },

      // 4. Cột Danh mục (Category)
      {
        accessorKey: "categoryId",
        id: "category",
        header: "Danh mục",
        cell: ({ getValue }) => {
          const catId = getValue() as string;
          const cat = getCategoryById(catId);
          return (
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-[3px] text-[11px] font-bold border truncate max-w-[150px]"
              style={{
                backgroundColor: `${cat?.color || "#64748B"}15`,
                color: cat?.color || "#334155",
                borderColor: `${cat?.color || "#64748B"}30`,
              }}
            >
              {cat?.name || "Khác"}
            </span>
          );
        },
        size: 140,
        minSize: 120,
      },

      // 5. Cột Nguồn tiền / Tài khoản
      {
        accessorKey: "accountId",
        id: "account",
        header: "Tài khoản",
        cell: ({ row }) => {
          const tx = row.original;
          const acc = getAccountById(tx.accountId);
          const toAcc = tx.toAccountId ? getAccountById(tx.toAccountId) : null;

          if (tx.type === "TRANSFER" && toAcc) {
            return (
              <span className="text-[11px] font-semibold text-blue-700 truncate">
                {acc?.name || "Ví gốc"} ➔ {toAcc.name}
              </span>
            );
          }

          return (
            <span className="text-[11px] font-semibold text-slate-700 truncate">
              {acc?.name || "Ví mặc định"}
            </span>
          );
        },
        size: 150,
        minSize: 120,
      },

      // 6. Cột Thành viên & Phạm vi
      {
        id: "member_scope",
        header: "Thành viên",
        cell: ({ row }) => {
          const tx = row.original;
          const isHusband = tx.memberId === "HUSBAND";
          const isFamily = tx.scope === "FAMILY";

          return (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[3px] text-[10px] font-bold ${
                  isHusband
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "bg-[#FFF1F2] text-[#E11D48] border border-rose-200"
                }`}
              >
                {isHusband ? "👨 Chuột" : "👩 Mèo"}
              </span>
              <span
                className={`inline-flex items-center px-1.5 py-0.5 rounded-[3px] text-[10px] font-semibold ${
                  isFamily
                    ? "bg-amber-50 text-amber-800 border border-amber-200"
                    : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                {isFamily ? "🏠 Chung" : "👤 Riêng"}
              </span>
            </div>
          );
        },
        size: 140,
        minSize: 120,
      },

      // 7. Cột Số tiền (Sortable, Masked with Privacy Mode)
      {
        accessorKey: "amount",
        id: "amount",
        header: ({ column }) => {
          const isSorted = column.getIsSorted();
          return (
            <div className="flex justify-end w-full">
              <button
                type="button"
                onClick={column.getToggleSortingHandler()}
                className="flex items-center gap-1 font-bold text-slate-700 hover:text-blue-600 transition-colors select-none text-right"
              >
                <span>Số tiền</span>
                {isSorted === "asc" ? (
                  <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
                ) : isSorted === "desc" ? (
                  <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                ) : (
                  <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-60" />
                )}
              </button>
            </div>
          );
        },
        cell: ({ row }) => {
          const tx = row.original;
          const isIncome = tx.type === "INCOME";
          const isExpense = tx.type === "EXPENSE";

          let colorClass = "text-blue-600";
          let prefix = "";

          if (isIncome) {
            colorClass = "text-emerald-600 font-black";
            prefix = "+";
          } else if (isExpense) {
            colorClass = "text-rose-600 font-bold";
            prefix = "-";
          }

          return (
            <div className="text-right">
              <span className={`font-mono text-xs ${colorClass}`}>
                {prefix}
                {formatVNDMasked(tx.amount, isPrivacyMode)}
              </span>
            </div>
          );
        },
        size: 130,
        minSize: 110,
      },

      // 8. Cột Thao tác (Edit / Delete / View)
      {
        id: "actions",
        enableResizing: false,
        size: 80,
        minSize: 80,
        header: () => <span className="text-center block text-xs">Thao tác</span>,
        cell: ({ row }) => {
          const tx = row.original;
          return (
            <div
              className="flex items-center justify-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => onEdit(tx)}
                title="Chỉnh sửa giao dịch"
                className="p-1 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-[3px] transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(tx.id)}
                title="Xóa giao dịch"
                className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-[3px] transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        },
      },
    ],
    [getCategoryById, getAccountById, isPrivacyMode, onEdit, onDelete]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection,
    },
    enableRowSelection: true,
    columnResizeMode: "onChange",
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const selectedCount = Object.keys(rowSelection).length;
  const selectedIds = useMemo(() => {
    return Object.keys(rowSelection).map((idx) => data[parseInt(idx, 10)]?.id).filter(Boolean);
  }, [rowSelection, data]);

  return (
    <div className="space-y-3">
      {/* Thanh Thông Báo Hành Động Hàng Loạt (Bulk Action Bar) */}
      {selectedCount > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-[3px] p-2.5 px-4 flex items-center justify-between animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 bg-blue-600 text-white rounded-full text-xs font-bold flex items-center justify-center">
              {selectedCount}
            </span>
            <span className="text-xs font-bold text-blue-900">
              Đã chọn {selectedCount} giao dịch
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setRowSelection({})}
              className="text-xs text-slate-600 hover:text-slate-800 px-2 py-1 rounded-[3px] font-semibold"
            >
              Bỏ chọn
            </button>
            {onBatchDelete && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Anh có chắc chắn muốn xóa ${selectedCount} giao dịch đã chọn không?`)) {
                    onBatchDelete(selectedIds);
                    setRowSelection({});
                  }
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-1.5 rounded-[3px] shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa các mục đã chọn</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Vùng Bảng Data Table với TanStack Table */}
      <div className="overflow-x-auto rounded-[3px] border border-[#DCE4EE] bg-white shadow-2xs">
        <table
          className="w-full border-collapse text-left text-xs"
          style={{ width: table.getCenterTotalSize() > 0 ? table.getCenterTotalSize() : "100%" }}
        >
          {/* Header với Column Resize Handle và Sort */}
          <thead className="bg-[#F8FAFC] border-b border-[#DCE4EE] text-slate-700 sticky top-0 z-10 select-none">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{ width: header.getSize() }}
                    className="relative px-3.5 py-3 font-bold text-slate-700 whitespace-nowrap text-xs border-r border-slate-200/50 last:border-r-0"
                    aria-sort={
                      header.column.getIsSorted() === "asc"
                        ? "ascending"
                        : header.column.getIsSorted() === "desc"
                        ? "descending"
                        : "none"
                    }
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}

                    {/* Con trỏ kéo dãn độ rộng cột (Column Resize Handle) */}
                    {header.column.getCanResize() && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={`absolute right-0 top-0 h-full w-1.5 cursor-col-resize select-none touch-none hover:bg-blue-500/60 ${
                          header.column.getIsResizing() ? "bg-blue-600 w-1" : "bg-transparent"
                        }`}
                        title="Kéo để chỉnh độ rộng cột"
                      />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {/* Thân bảng với Zebra Stripes (xen kẽ) và Selected Row Highlight */}
          <tbody className="divide-y divide-[#E9EEF5]">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row, index) => {
                const isSelected = row.getIsSelected();
                // Zebra Stripes: hàng chẵn/lẻ xen kẽ
                const isEven = index % 2 === 1;

                return (
                  <tr
                    key={row.id}
                    onClick={() => onSelectDetail(row.original)}
                    aria-selected={isSelected}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-blue-50/90 text-blue-950 font-medium"
                        : isEven
                        ? "bg-[#F9FBFC] hover:bg-slate-100/70"
                        : "bg-white hover:bg-slate-50"
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        style={{ width: cell.column.getSize() }}
                        className="px-3.5 py-2.5 text-xs text-slate-700 truncate"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-slate-400 font-medium"
                >
                  Không tìm thấy giao dịch nào phù hợp với bộ lọc hiện tại.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Phân Trang (Pagination Controls) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 py-1 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span>Hiển thị</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="bg-white border border-[#DCE4EE] rounded-[3px] px-2 py-1 text-xs font-semibold text-slate-700 outline-none cursor-pointer focus:border-blue-500"
          >
            {[10, 15, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size} dòng / trang
              </option>
            ))}
          </select>
          <span className="text-slate-400">|</span>
          <span>
            Tổng cộng: <strong>{data.length}</strong> giao dịch
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="mr-2">
            Trang{" "}
            <strong>
              {table.getState().pagination.pageIndex + 1} / {table.getPageCount() || 1}
            </strong>
          </span>

          <button
            type="button"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="p-1.5 rounded-[3px] border border-[#DCE4EE] bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Về trang đầu"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-1.5 rounded-[3px] border border-[#DCE4EE] bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Trang trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-1.5 rounded-[3px] border border-[#DCE4EE] bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Trang kế tiếp"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="p-1.5 rounded-[3px] border border-[#DCE4EE] bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Đến trang cuối"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
