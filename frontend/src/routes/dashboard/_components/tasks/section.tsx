import { useGetTasksOnUserQuery } from "@/services/queries/tasks";
import { EmptyState } from "./empty-state";
import { TaskCard } from "./card";

export const TasksSection = () => {
  const { data: tasks = [] } = useGetTasksOnUserQuery();

  return (
    <div>
      {tasks.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};
