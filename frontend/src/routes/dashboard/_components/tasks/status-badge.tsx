import { Status } from "@/types/types";

interface IProps {
  status: Status;
}

export const StatusBadge = ({ status }: IProps) => {
  const STATUS_NAME: Record<Status, string> = {
    "TaskStatus.NATURA": "Natura",
    "TaskStatus.URBAN": "Urban",
    "TaskStatus.RURAL": "Rural",
  };

  return (
    <div className="px-3 py-2 rounded-md bg-muted">
      <p className="text-xs font-medium">{STATUS_NAME[status]}</p>
    </div>
  );
};
