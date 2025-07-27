import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Search,
  Calendar,
  Filter,
  Folder,
  FolderPlus,
  Home,
  ArrowUp,
  Trash2,
  Check,
  X,
  Clock,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function Tasks() {
  const [tasks, setTasks] = useLocalStorage("focusflow-tasks");
  const [folders, setFolders] = useLocalStorage("task-folders", []);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [newTaskText, setNewTaskText] = useState("");
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [showDetailedTaskForm, setShowDetailedTaskForm] = useState(false);
  const [newTaskDetails, setNewTaskDetails] = useState({
    title: "",
    priority: "",
    dueTime: "",
    category: ""
  });

  const createFolder = () => {
    if (newFolderName.trim()) {
      const newFolder = {
        id: Date.now() + Math.random(),
        name: newFolderName.trim(),
        createdAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        parentId: currentFolder?.id || null,
      };
      setFolders([...folders, newFolder]);
      setNewFolderName("");
      setShowCreateFolder(false);
    }
  };

  const deleteFolder = (folderId) => {
    const folderToDelete = folders.find((f) => f.id === folderId);
    if (folderToDelete) {
      setTasks(
        tasks.map((task) =>
          task.folderId === folderId
            ? { ...task, folderId: folderToDelete.parentId }
            : task,
        ),
      );
      setFolders(folders.filter((f) => f.id !== folderId));
    }
  };

  const currentFolderTasks = tasks.filter(
    (task) => task.folderId === (currentFolder?.id || null),
  );
  const currentSubFolders = folders.filter(
    (folder) => folder.parentId === (currentFolder?.id || null),
  );

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const addTask = () => {
    if (newTaskText.trim() === "") return;

    const newTask = {
      id: Date.now().toString(),
      title: newTaskText,
      completed: false,
      dueDate: "Today",
      folderId: currentFolder?.id || null,
    };

    setTasks([newTask, ...tasks]);
    setNewTaskText("");
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
        folderId: currentFolder?.id || null,
      };
      setTasks([newTask, ...tasks]);
      setNewTaskDetails({ title: "", priority: "", dueTime: "", category: "" });
      setShowDetailedTaskForm(false);
    }
  };

  const cancelDetailedTask = () => {
    setNewTaskDetails({ title: "", priority: "", dueTime: "", category: "" });
    setShowDetailedTaskForm(false);
  };

  const filteredTasks = currentFolderTasks.filter((task) =>
    task.title.toLowerCase().includes(searchText.toLowerCase()),
  );

  const filteredFolders = currentSubFolders.filter(
    (folder) =>
      folder.name &&
      folder.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  const filterTasksByCategory = (category) => {
    return filteredTasks.filter((task) => task.category === category);
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
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Tasks
        </h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 mb-4 p-3 bg-muted/20 rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentFolder(null)}
              className="h-8 text-xs"
            >
              <Home className="h-3 w-3 mr-1" />
              Home
            </Button>
            {currentFolder && (
              <>
                <span className="text-muted-foreground">/</span>
                <span className="text-sm font-medium">
                  {currentFolder.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const parentFolder = currentFolder.parentId
                      ? folders.find((f) => f.id === currentFolder.parentId)
                      : null;
                    setCurrentFolder(parentFolder);
                  }}
                  className="h-8 ml-auto"
                >
                  <ArrowUp className="h-3 w-3 mr-1" />
                  Up
                </Button>
              </>
            )}
          </div>

          {/* Task search and filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Search tasks and folders..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-10 pr-4 py-2"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetailedTaskForm(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Detailed Task
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateFolder(true)}
                className="flex items-center gap-2"
              >
                <FolderPlus className="h-4 w-4" />
                Folder
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Date</span>
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </div>
          </div>

          {/* Create Folder Input */}
          {showCreateFolder && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-muted/30 rounded-lg border">
              <Folder className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && createFolder()}
                className="flex-1"
                autoFocus
              />
              <Button size="sm" onClick={createFolder}>
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowCreateFolder(false);
                  setNewFolderName("");
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Detailed Task Creation Form */}
          {showDetailedTaskForm && (
            <div className="mb-4 p-4 border rounded-lg bg-gray-50 space-y-3">
              <Input
                placeholder="Task title..."
                value={newTaskDetails.title}
                onChange={(e) => setNewTaskDetails({ ...newTaskDetails, title: e.target.value })}
                className="text-sm"
                autoFocus
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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
                <Input
                  placeholder="Category"
                  value={newTaskDetails.category}
                  onChange={(e) => setNewTaskDetails({ ...newTaskDetails, category: e.target.value })}
                  className="text-sm"
                />
              </div>
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

          {/* Add task input */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Add a new task..."
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTask()}
                  className="flex-grow"
                />
                <Button onClick={addTask}>
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Folders and Tasks List */}
          <div className="mb-6">
            <Card>
              <CardContent className="p-0">
                {filteredFolders.length === 0 && filteredTasks.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                    {currentFolder ? "This folder is empty" : "No tasks found"}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {/* Folders */}
                    {filteredFolders.map((folder) => (
                      <div
                        key={folder.id}
                        className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 group flex items-center justify-between"
                        onClick={() => setCurrentFolder(folder)}
                      >
                        <div className="flex items-center flex-grow">
                          <Folder className="h-5 w-5 text-yellow-600 mr-3 flex-shrink-0" />
                          <div className="flex-grow min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {folder.name}
                            </h3>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Folder • Created {folder.createdAt}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0 text-destructive hover:text-destructive flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (
                              confirm(
                                `Are you sure you want to delete the folder "${folder.name}"? Tasks inside will be moved to the parent folder.`,
                              )
                            ) {
                              deleteFolder(folder.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    {/* Tasks */}
                    {filteredTasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-4 flex items-center justify-between group"
                      >
                        <div className="flex items-start gap-3 flex-grow">
                          <Checkbox
                            id={`task-${task.id}`}
                            checked={task.completed}
                            onCheckedChange={() => toggleTask(task.id)}
                          />
                          <div className="flex-grow min-w-0">
                            <label
                              htmlFor={`task-${task.id}`}
                              className={`text-sm font-medium cursor-pointer ${
                                task.completed
                                  ? "line-through text-gray-500 dark:text-gray-500"
                                  : "text-gray-900 dark:text-gray-200"
                              }`}
                            >
                              {task.title}
                            </label>
                            <div className="flex gap-2 mt-1 flex-wrap">
                              {task.dueDate && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {task.dueDate}
                                </span>
                              )}
                              {task.category && (
                                <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 rounded-full">
                                  {task.category}
                                </span>
                              )}
                              {task.priority && (
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full ${getPriorityClass(task.priority)}`}
                                >
                                  {task.priority.charAt(0).toUpperCase() +
                                    task.priority.slice(1)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0 text-destructive hover:text-destructive"
                          onClick={() => {
                            if (
                              confirm(
                                `Are you sure you want to delete "${task.title}"?`,
                              )
                            ) {
                              deleteTask(task.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Task Categories */}
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              <TabsTrigger value="work">Work</TabsTrigger>
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <Card>
                <CardContent className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredTasks.length === 0 ? (
                    <div className="py-4 text-center text-gray-500 dark:text-gray-400">
                      No tasks found
                    </div>
                  ) : (
                    filteredTasks.map((task) => (
                      <div
                        key={task.id}
                        className="py-3 px-2 flex items-center justify-between group"
                      >
                        <div className="flex items-start gap-3 flex-grow">
                          <Checkbox
                            id={`task-all-${task.id}`}
                            checked={task.completed}
                            onCheckedChange={() => toggleTask(task.id)}
                          />
                          <div className="flex-grow">
                            <label
                              htmlFor={`task-all-${task.id}`}
                              className={`text-sm font-medium cursor-pointer ${
                                task.completed
                                  ? "line-through text-gray-500 dark:text-gray-500"
                                  : "text-gray-900 dark:text-gray-200"
                              }`}
                            >
                              {task.title}
                            </label>
                            <div className="flex gap-2 mt-1">
                              {task.dueDate && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {task.dueDate}
                                </span>
                              )}
                              {task.category && (
                                <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 rounded-full">
                                  {task.category}
                                </span>
                              )}
                              {task.priority && (
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full ${getPriorityClass(task.priority)}`}
                                >
                                  {task.priority.charAt(0).toUpperCase() +
                                    task.priority.slice(1)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-destructive hover:text-destructive"
                          onClick={() => {
                            if (
                              confirm(
                                `Are you sure you want to delete "${task.title}"?`,
                              )
                            ) {
                              deleteTask(task.id);
                            }
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="work">
              <Card>
                <CardContent className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filterTasksByCategory("Work").length === 0 ? (
                    <div className="py-4 text-center text-gray-500 dark:text-gray-400">
                      No work tasks found
                    </div>
                  ) : (
                    filterTasksByCategory("Work").map((task) => (
                      <div
                        key={task.id}
                        className="py-3 px-2 flex items-center justify-between group"
                      >
                        <div className="flex items-start gap-3 flex-grow">
                          <Checkbox
                            id={`task-work-${task.id}`}
                            checked={task.completed}
                            onCheckedChange={() => toggleTask(task.id)}
                          />
                          <div className="flex-grow">
                            <label
                              htmlFor={`task-work-${task.id}`}
                              className={`text-sm font-medium cursor-pointer ${
                                task.completed
                                  ? "line-through text-gray-500 dark:text-gray-500"
                                  : "text-gray-900 dark:text-gray-200"
                              }`}
                            >
                              {task.title}
                            </label>
                            <div className="flex gap-2 mt-1">
                              {task.dueDate && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {task.dueDate}
                                </span>
                              )}
                              {task.dueTime && (
                                <span className="text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {task.dueTime}
                                </span>
                              )}
                              {task.priority && (
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full ${getPriorityClass(task.priority)}`}
                                >
                                  {task.priority.charAt(0).toUpperCase() +
                                    task.priority.slice(1)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-destructive hover:text-destructive"
                          onClick={() => {
                            if (
                              confirm(
                                `Are you sure you want to delete "${task.title}"?`,
                              )
                            ) {
                              deleteTask(task.id);
                            }
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="personal">
              <Card>
                <CardContent className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filterTasksByCategory("Personal").length === 0 ? (
                    <div className="py-4 text-center text-gray-500 dark:text-gray-400">
                      No personal tasks found
                    </div>
                  ) : (
                    filterTasksByCategory("Personal").map((task) => (
                      <div
                        key={task.id}
                        className="py-3 px-2 flex items-center justify-between group"
                      >
                        <div className="flex items-start gap-3 flex-grow">
                          <Checkbox
                            id={`task-personal-${task.id}`}
                            checked={task.completed}
                            onCheckedChange={() => toggleTask(task.id)}
                          />
                          <div className="flex-grow">
                            <label
                              htmlFor={`task-personal-${task.id}`}
                              className={`text-sm font-medium cursor-pointer ${
                                task.completed
                                  ? "line-through text-gray-500 dark:text-gray-500"
                                  : "text-gray-900 dark:text-gray-200"
                              }`}
                            >
                              {task.title}
                            </label>
                            <div className="flex gap-2 mt-1">
                              {task.dueDate && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {task.dueDate}
                                </span>
                              )}
                              {task.dueTime && (
                                <span className="text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {task.dueTime}
                                </span>
                              )}
                              {task.priority && (
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full ${getPriorityClass(task.priority)}`}
                                >
                                  {task.priority.charAt(0).toUpperCase() +
                                    task.priority.slice(1)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-destructive hover:text-destructive"
                          onClick={() => {
                            if (
                              confirm(
                                `Are you sure you want to delete "${task.title}"?`,
                              )
                            ) {
                              deleteTask(task.id);
                            }
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="education">
              <Card>
                <CardContent className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filterTasksByCategory("Education").length === 0 ? (
                    <div className="py-4 text-center text-gray-500 dark:text-gray-400">
                      No education tasks found
                    </div>
                  ) : (
                    filterTasksByCategory("Education").map((task) => (
                      <div
                        key={task.id}
                        className="py-3 px-2 flex items-center justify-between group"
                      >
                        <div className="flex items-start gap-3 flex-grow">
                          <Checkbox
                            id={`task-education-${task.id}`}
                            checked={task.completed}
                            onCheckedChange={() => toggleTask(task.id)}
                          />
                          <div className="flex-grow">
                            <label
                              htmlFor={`task-education-${task.id}`}
                              className={`text-sm font-medium cursor-pointer ${
                                task.completed
                                  ? "line-through text-gray-500 dark:text-gray-500"
                                  : "text-gray-900 dark:text-gray-200"
                              }`}
                            >
                              {task.title}
                            </label>
                            <div className="flex gap-2 mt-1">
                              {task.dueDate && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {task.dueDate}
                                </span>
                              )}
                              {task.dueTime && (
                                <span className="text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {task.dueTime}
                                </span>
                              )}
                              {task.priority && (
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full ${getPriorityClass(task.priority)}`}
                                >
                                  {task.priority.charAt(0).toUpperCase() +
                                    task.priority.slice(1)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-destructive hover:text-destructive"
                          onClick={() => {
                            if (
                              confirm(
                                `Are you sure you want to delete "${task.title}"?`,
                              )
                            ) {
                              deleteTask(task.id);
                            }
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}