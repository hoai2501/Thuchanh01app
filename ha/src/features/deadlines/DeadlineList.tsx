import DeadlineItem from "./DeadlineItem";
import { useDeadline } from "../../hooks/useDeadline";
import type { DeadlineStatus } from "../../types/deadline";

interface Props {
  filter: DeadlineStatus;
}

function DeadlineList({ filter }: Props) {
  const { deadlines } = useDeadline(filter);

  if (deadlines.length === 0) {
    return (
      <div className="empty">
        Không có bài tập nào.
      </div>
    );
  }

  return (
    <div className="deadline-list">
      {deadlines.map((deadline) => (
        <DeadlineItem
          key={deadline.id}
          deadline={deadline}
        />
      ))}
    </div>
  );
}

export default DeadlineList;
