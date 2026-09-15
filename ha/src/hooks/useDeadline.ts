
import { useMemo } from "react";

import { useAppSelector } from "../app/hooks";

import type {
  DeadlineStatus,
} from "../types/deadline";

// ================================
// CUSTOM HOOK
// ================================

export function useDeadline(
  filter: DeadlineStatus
) {
  const deadlines =
    useAppSelector(
      (state) => state.deadlines.items
    );

  const filteredDeadlines =
    useMemo(() => {
      const today = new Date();

      today.setHours(
        0,
        0,
        0,
        0
      );

      return deadlines.filter(
        (deadline) => {
          const dueDate = new Date(
            deadline.dueDate
          );

          dueDate.setHours(
            0,
            0,
            0,
            0
          );

          // Đã hoàn thành
          if (filter === "completed") {
            return deadline.completed;
          }

          // Chưa hoàn thành
          if (filter === "pending") {
            return (
              !deadline.completed &&
              dueDate >= today
            );
          }

          // Quá hạn
          if (filter === "overdue") {
            return (
              !deadline.completed &&
              dueDate < today
            );
          }

          // Tất cả
          return true;
        }
      );
    }, [deadlines, filter]);

  return {
    deadlines: filteredDeadlines,
    total: deadlines.length,
  };
}

// ================================
// TÍNH SỐ NGÀY
// ================================

export function getRemainingDays(
  dueDate: string
): number {
  const today = new Date();
  const target = new Date(dueDate);

  today.setHours(
    0,
    0,
    0,
    0
  );

  target.setHours(
    0,
    0,
    0,
    0
  );

  const difference =
    target.getTime() -
    today.getTime();

  return Math.ceil(
    difference /
      (1000 * 60 * 60 * 24)
  );
}
