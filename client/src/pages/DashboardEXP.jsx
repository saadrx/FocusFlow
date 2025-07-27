
import { useState } from "react";
import Notepad from "@/components/dashboard/Notepad";
import MiniCalendar from "@/components/dashboard/MiniCalendar";
import TodoList from "@/components/dashboard/TodoList";
import GoalProgress from "@/components/dashboard/GoalProgress";
import HabitTracker from "@/components/dashboard/HabitTracker";
import RecentFiles from "@/components/dashboard/RecentFiles";
import Whiteboard from "@/components/dashboard/Whiteboard";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { GripVertical, Maximize2, Minimize2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [widgetOrder, setWidgetOrder] = useLocalStorage("focusflow-widget-order", [
    "notepad",
    "calendar",
    "todo",
    "goals",
    "habits",
    "files",
    "whiteboard"
  ]);

  const [widgetSizes, setWidgetSizes] = useLocalStorage("focusflow-widget-sizes", {});
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);

  const getSizeClass = (widgetId, defaultClass = "") => {
    const size = widgetSizes[widgetId] || 'normal';
    const baseClasses = {
      small: "scale-75 origin-top-left",
      normal: "",
      large: "scale-110 origin-top-left"
    };
    
    let sizeClass = "";
    if (widgetId === 'notepad') {
      sizeClass = size === 'small' ? "md:col-span-1" : size === 'large' ? "md:col-span-3" : "md:col-span-2";
    } else if (widgetId === 'whiteboard') {
      sizeClass = size === 'small' ? "md:col-span-2" : size === 'large' ? "md:col-span-4" : "md:col-span-3";
    } else {
      sizeClass = defaultClass;
    }
    
    return `${sizeClass} ${baseClasses[size]} transition-transform duration-200`;
  };

  const widgets = {
    notepad: {
      id: "notepad",
      component: <Notepad />,
      className: getSizeClass("notepad"),
      title: "Notepad"
    },
    calendar: {
      id: "calendar",
      component: <MiniCalendar />,
      className: getSizeClass("calendar"),
      title: "Calendar"
    },
    todo: {
      id: "todo",
      component: <TodoList />,
      className: getSizeClass("todo"),
      title: "Tasks"
    },
    goals: {
      id: "goals",
      component: <GoalProgress />,
      className: getSizeClass("goals"),
      title: "Goals"
    },
    habits: {
      id: "habits",
      component: <HabitTracker />,
      className: getSizeClass("habits"),
      title: "Habits"
    },
    files: {
      id: "files",
      component: <RecentFiles />,
      className: getSizeClass("files"),
      title: "Recent Files"
    },
    whiteboard: {
      id: "whiteboard",
      component: (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Whiteboard</h2>
          <Whiteboard />
        </div>
      ),
      className: getSizeClass("whiteboard"),
      title: "Whiteboard"
    }
  };

  const handleDragStart = (e, widgetId) => {
    setDraggedItem(widgetId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, widgetId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverItem(widgetId);
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = (e, targetWidgetId) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetWidgetId) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    const newOrder = [...widgetOrder];
    const draggedIndex = newOrder.indexOf(draggedItem);
    const targetIndex = newOrder.indexOf(targetWidgetId);

    // Remove dragged item and insert at target position
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedItem);

    setWidgetOrder(newOrder);
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const resizeWidget = (widgetId, size) => {
    setWidgetSizes(prev => ({
      ...prev,
      [widgetId]: size
    }));
  };

  const resetWidgetSize = (widgetId) => {
    setWidgetSizes(prev => {
      const newSizes = { ...prev };
      delete newSizes[widgetId];
      return newSizes;
    });
  };

  const renderWidget = (widgetId) => {
    const widget = widgets[widgetId];
    if (!widget) return null;

    const isDragging = draggedItem === widgetId;
    const isDragOver = dragOverItem === widgetId;
    const currentSize = widgetSizes[widgetId] || 'normal';

    return (
      <div
        key={widgetId}
        className={`${widget.className} ${isDragging ? 'opacity-50' : ''} ${
          isDragOver ? 'ring-2 ring-blue-400 ring-opacity-50' : ''
        } transition-all duration-200`}
        draggable
        onDragStart={(e) => handleDragStart(e, widgetId)}
        onDragOver={(e) => handleDragOver(e, widgetId)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, widgetId)}
      >
        <div className="relative group">
          {/* Control panel */}
          <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1 bg-white dark:bg-gray-800 rounded-md shadow-sm border p-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => resizeWidget(widgetId, 'small')}
              title="Make smaller"
              disabled={currentSize === 'small'}
            >
              <Minimize2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => resetWidgetSize(widgetId)}
              title="Reset size"
              disabled={currentSize === 'normal'}
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => resizeWidget(widgetId, 'large')}
              title="Make larger"
              disabled={currentSize === 'large'}
            >
              <Maximize2 className="h-3 w-3" />
            </Button>
            <div
              className="cursor-grab active:cursor-grabbing flex items-center justify-center h-6 w-6"
              title="Drag to rearrange"
            >
              <GripVertical className="h-3 w-3 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
          {widget.component}
        </div>
      </div>
    );
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Dashboard</h1>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Hover over widgets to resize, reset, or rearrange
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4 space-y-6">
          {/* Render all widgets in a flexible grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {widgetOrder.map((widgetId) => {
              // Skip widgets that don't exist
              if (!widgets[widgetId]) return null;
              
              // Apply specific grid layouts for each widget type
              const widget = widgets[widgetId];
              let gridClassName = "";
              
              switch(widgetId) {
                case 'notepad':
                  gridClassName = "md:col-span-8";
                  break;
                case 'calendar':
                  gridClassName = "md:col-span-4";
                  break;
                case 'todo':
                  gridClassName = "md:col-span-4";
                  break;
                case 'goals':
                  gridClassName = "md:col-span-4";
                  break;
                case 'habits':
                  gridClassName = "md:col-span-4";
                  break;
                case 'files':
                  gridClassName = "md:col-span-4";
                  break;
                case 'whiteboard':
                  gridClassName = "md:col-span-12";
                  break;
                default:
                  gridClassName = "md:col-span-4";
              }

              const isDragging = draggedItem === widgetId;
              const isDragOver = dragOverItem === widgetId;
              const currentSize = widgetSizes[widgetId] || 'normal';

              return (
                <div
                  key={widgetId}
                  className={`${gridClassName} ${getSizeClass(widgetId)} ${isDragging ? 'opacity-50' : ''} ${
                    isDragOver ? 'ring-2 ring-blue-400 ring-opacity-50' : ''
                  } transition-all duration-200`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, widgetId)}
                  onDragOver={(e) => handleDragOver(e, widgetId)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, widgetId)}
                >
                  <div className="relative group">
                    {/* Control panel */}
                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1 bg-white dark:bg-gray-800 rounded-md shadow-sm border p-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => resizeWidget(widgetId, 'small')}
                        title="Make smaller"
                        disabled={currentSize === 'small'}
                      >
                        <Minimize2 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => resetWidgetSize(widgetId)}
                        title="Reset size"
                        disabled={currentSize === 'normal'}
                      >
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => resizeWidget(widgetId, 'large')}
                        title="Make larger"
                        disabled={currentSize === 'large'}
                      >
                        <Maximize2 className="h-3 w-3" />
                      </Button>
                      <div
                        className="cursor-grab active:cursor-grabbing flex items-center justify-center h-6 w-6"
                        title="Drag to rearrange"
                      >
                        <GripVertical className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                      </div>
                    </div>
                    {widget.component}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
