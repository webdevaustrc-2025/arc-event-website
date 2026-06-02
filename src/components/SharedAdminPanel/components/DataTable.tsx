"use client";

import React from "react";
import { useTheme } from "next-themes";
import { ChevronLeft, ChevronRight, Edit2, Trash2 } from "lucide-react";
import { TableSkeleton } from "../skeletons/TableSkeleton";
import type { TableColumn } from "../types/admin";

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  pagination?: {
    page: number;
    total: number;
    limit: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
  hiddenColumns?: (keyof T)[];
}

export function DataTable<T extends { id?: any }>({
  columns,
  data,
  loading = false,
  onEdit,
  onDelete,
  pagination,
  onPageChange,
  hiddenColumns = [],
}: DataTableProps<T>) {
  const { theme } = useTheme();
  const isDark = theme === "dark" || !theme;

  if (loading) {
    return <TableSkeleton />;
  }

  const visibleColumns = columns.filter((col) => !hiddenColumns.includes(col.key));

  if (data.length === 0) {
    return (
      <div
        className={`text-center py-12 rounded-lg border ${
          isDark
            ? "bg-[#0d0d12]/50 border-white/[0.06]"
            : "bg-white/50 border-black/[0.06]"
        }`}
      >
        <p className={isDark ? "text-[#9A9A8E]" : "text-[#4a4a40]"}>
          No data available
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className={`overflow-x-auto border rounded-lg ${
          isDark
            ? "bg-[#0d0d12] border-white/[0.06]"
            : "bg-white border-black/[0.06]"
        }`}
      >
        <table className="w-full">
          <thead>
            <tr
              className={`border-b ${
                isDark
                  ? "border-white/[0.06] bg-white/[0.02]"
                  : "border-black/[0.06] bg-black/[0.02]"
              }`}
            >
              {visibleColumns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-6 py-3 text-left text-sm font-semibold ${
                    isDark ? "text-[#9A9A8E]" : "text-[#4a4a40]"
                  }`}
                  style={{ width: column.width }}
                >
                  {column.label}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th
                  className={`px-6 py-3 text-right text-sm font-semibold ${
                    isDark ? "text-[#9A9A8E]" : "text-[#4a4a40]"
                  }`}
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr
                key={item.id || idx}
                className={`border-b transition-colors hover:bg-white/[0.02] ${
                  isDark
                    ? "border-white/[0.04]"
                    : "border-black/[0.04]"
                }`}
              >
                {visibleColumns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={`px-6 py-4 text-sm ${
                      isDark ? "text-[#F5F5F0]" : "text-[#1a1a14]"
                    }`}
                  >
                    {column.render
                      ? column.render(item[column.key], item)
                      : String(item[column.key] || "")}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="p-2 rounded-lg hover:bg-white/[0.1] transition-colors text-[#588157]"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(item)}
                          className="p-2 rounded-lg hover:bg-red-600/10 transition-colors text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div
          className={`flex items-center justify-between rounded-lg border p-4 ${
            isDark
              ? "bg-[#0d0d12]/50 border-white/[0.06]"
              : "bg-white/50 border-black/[0.06]"
          }`}
        >
          <p className={`text-sm ${isDark ? "text-[#9A9A8E]" : "text-[#4a4a40]"}`}>
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange?.(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isDark
                  ? "hover:bg-white/[0.1]"
                  : "hover:bg-black/[0.1]"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange?.(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isDark
                  ? "hover:bg-white/[0.1]"
                  : "hover:bg-black/[0.1]"
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
