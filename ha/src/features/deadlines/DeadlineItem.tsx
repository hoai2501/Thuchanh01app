
import {
  useAppDispatch,
} from "../../app/hooks";

import {
  toggleDeadline,
  deleteDeadline,
} from "./deadlineSlice";

import {
  getRemainingDays,
} from "../../hooks/useDeadline";

import type {
  Deadline,
} from "../../types/deadline";

interface Props {
  deadline: Deadline;
}

function DeadlineItem({
  deadline,
}: Props) {
  const dispatch =
    useAppDispatch();

  const remainingDays =
    getRemainingDays(
      deadline.dueDate
    );

  const isOverdue =
    remainingDays < 0 &&
    !deadline.completed;

  return (
    <div
      className={`deadline-item ${
        deadline.completed
          ? "completed"
          : ""
      }`}
    >
      <div className="deadline-info">

        <h3>
          {deadline.title}
        </h3>

        <p>
          <strong>
            Môn học:
          </strong>{" "}
          {deadline.subject}
        </p>

        <p>
          <strong>
            Hạn nộp:
          </strong>{" "}
          {deadline.dueDate}
        </p>

        <p>
          <strong>
            Ưu tiên:
          </strong>{" "}

          <span
            className={`priority ${deadline.priority.toLowerCase()}`}
          >
            {deadline.priority}
          </span>
        </p>

        {!deadline.completed && (
          <p
            className={
              isOverdue
                ? "overdue"
                : "remaining"
            }
          >
            {isOverdue
              ? `Quá hạn ${Math.abs(
                  remainingDays
                )} ngày`
              : `Còn ${remainingDays} ngày`}
          </p>
        )}

        {deadline.completed && (
          <p className="done">
            ✓ Đã hoàn thành
          </p>
        )}
      </div>

      <div className="deadline-actions">

        <button
          onClick={() =>
            dispatch(
              toggleDeadline(
                deadline.id
              )
            )
          }
        >
          {deadline.completed
            ? "Bỏ hoàn thành"
            : "Hoàn thành"}
        </button>

        <button
          className="delete"
          onClick={() =>
            dispatch(
              deleteDeadline(
                deadline.id
              )
            )
          }
        >
          Xoá
        </button>

      </div>
    </div>
  );
}

export default DeadlineItem;

