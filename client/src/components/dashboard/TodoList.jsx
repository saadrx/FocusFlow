
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckSquare, Plus, Square, X, ExternalLink, Clock, Flag } from "lucide-react";
import { useState } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TodoList() {
  const [tasks, setTasks] = useLocalStorage("focusflow-tasks"); 
  const [newTaskText, setNewTaskText] = useState("");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTaskDetails, setNewTaskDetails] = useState({
    title: "",
    priority: "",
    dueTime: "",
    category: ""
  });

  const dashboardTasks = tasks.slice(0, 5);

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = () => {
    if (newTaskText.trim()) {
      const newTask = { 
        id: Date.now().toString(),
        title: newTaskText.trim(), 
        completed: false,
        dueDate: "Today",
        folderId: null,
      };
      setTasks([newTask, ...tasks]);
      setNewTaskText("");
    }
  };

  const addDetailedTask = () => {
    if (newTaskDetails.title.trim()) {
      const newTask = {
        id: Date.now().toString(),
        title: newTaskDetails.title.trim(),
        completed: false,
        dueDate: "Today",
        priority: newTaskDetails.priority || undefined,
        dueTime: newTaskDetails.dueTime || undefined,
        category: newTaskDetails.category || undefined,
        folderId: null,
      };
      setTasks([newTask, ...tasks]);
      setNewTaskDetails({ title: "", priority: "", dueTime: "", category: "" });
      setShowTaskForm(false);
    }
  };

  const cancelDetailedTask = () => {
    setNewTaskDetails({ title: "", priority: "", dueTime: "", category: "" });
    setShowTaskForm(false);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckSquare className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Today's Tasks</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = "/tasks"}
              className="text-blue-600 hover:text-blue-800"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button 
              onClick={() => setShowTaskForm(true)} 
              size="sm" 
              variant="ghost"
              title="Add detailed task"
            >
              <Flag className="h-4 w-4" />
            </Button>
            <Button onClick={addTask} size="sm" variant="ghost" title="Quick add task">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Detailed Task Form */}
        {showTaskForm && (
          <div className="mb-4 p-4 border rounded-lg bg-gray-50 space-y-3">
            <Input
              placeholder="Task title..."
              value={newTaskDetails.title}
              onChange={(e) => setNewTaskDetails({ ...newTaskDetails, title: e.target.value })}
              className="text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <Select 
                value={newTaskDetails.priority} 
                onValueChange={(value) => setNewTaskDetails({ ...newTaskDetails, priority: value })}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="time"
                value={newTaskDetails.dueTime}
                onChange={(e) => setNewTaskDetails({ ...newTaskDetails, dueTime: e.target.value })}
                className="text-xs"
                placeholder="Due time"
              />
            </div>
            <Input
              placeholder="Category (Work, Personal, etc.)"
              value={newTaskDetails.category}
              onChange={(e) => setNewTaskDetails({ ...newTaskDetails, category: e.target.value })}
              className="text-sm"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={cancelDetailedTask}>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button size="sm" onClick={addDetailedTask}>
                <Plus className="h-4 w-4 mr-1" />
                Add Task
              </Button>
            </div>
          </div>
        )}
        <div className="mb-4 flex space-x-2">
          <Input
            placeholder="Add a new task..."
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={addTask} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-3">
          {dashboardTasks.map((task) => (
            <div key={task.id} className="flex items-center space-x-3 group">
              <button
                onClick={() => toggleTask(task.id)}
                className="text-blue-600 hover:text-blue-700"
              >
                {task.completed ? (
                  <CheckSquare className="h-4 w-4" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
              </button>
              <div className="flex-1">
                <span className={`text-sm ${
                  task.completed ? 'line-through text-gray-500' : 'text-gray-700'
                }`}>
                  {task.title}
                </span>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {task.folderId && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full">
                      📁 Folder
                    </span>
                  )}
                  {task.priority && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${getPriorityClass(task.priority)}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  )}
                  {task.category && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">
                      {task.category}
                    </span>
                  )}
                  {task.dueTime && (
                    <span className="text-xs bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {task.dueTime}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          {tasks.length > 5 && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-blue-600"
              onClick={() => window.location.href = "/tasks"}
            >
              View all {tasks.length} tasks
            </Button>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
            <span>{dashboardTasks.filter(t => t.completed).length} of {dashboardTasks.length} completed</span>
            {dashboardTasks.filter(t => t.completed).length > 0 && (
              <button
                onClick={() => setTasks(tasks.filter(t => !t.completed))}
                className="text-red-500 hover:text-red-700 text-xs"
              >
                Clear completed
              </button>
            )}
          </div>
          {dashboardTasks.length > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(dashboardTasks.filter(t => t.completed).length / dashboardTasks.length) * 100}%` }}
              ></div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
