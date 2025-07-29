
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X } from "lucide-react";
import { useApi } from "../../hooks/useApi";

export default function TodoList() {
  const { data: tasks, loading, error, createItem: createTask, updateItem: updateTask, deleteItem: deleteTask } = useApi('/api/tasks');
  const [newTask, setNewTask] = useState("");
  const [showInput, setShowInput] = useState(false);

  const handleAddTask = async () => {
    if (newTask.trim()) {
      await createTask({
        title: newTask.trim(),
        completed: false,
        priority: 'medium'
      });
      setNewTask("");
      setShowInput(false);
    }
  };

  const handleToggleTask = async (task) => {
    await updateTask(task.id, {
      ...task,
      completed: !task.completed
    });
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
  };

  const displayTasks = tasks || [];
  const pendingTasks = displayTasks.filter(task => !task.completed);
  const completedTasks = displayTasks.filter(task => task.completed);

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading tasks...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">Tasks</CardTitle>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowInput(!showInput)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {showInput && (
          <div className="flex gap-2">
            <Input
              placeholder="Add a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
              className="flex-1"
              autoFocus
            />
            <Button size="sm" onClick={handleAddTask}>
              Add
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setShowInput(false);
                setNewTask("");
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {pendingTasks.map((task) => (
            <div key={task.id} className="flex items-center gap-2 p-2 rounded-lg border">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => handleToggleTask(task)}
              />
              <span className="flex-1 text-sm">{task.title}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDeleteTask(task.id)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}

          {completedTasks.length > 0 && (
            <>
              <div className="border-t pt-2 mt-3">
                <p className="text-xs text-muted-foreground mb-2">Completed</p>
                {completedTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-2 p-2 rounded-lg border opacity-60">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => handleToggleTask(task)}
                    />
                    <span className="flex-1 text-sm line-through">{task.title}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteTask(task.id)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}

          {displayTasks.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No tasks yet. Add one to get started!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
