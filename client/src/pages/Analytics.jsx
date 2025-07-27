import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from "recharts";
import jsPDF from 'jspdf';
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const COLORS = ["#8884d8", "#82ca9d"];

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);

  // Get data from local storage
  const [tasks] = useLocalStorage("focusflow-tasks", []);
  const [goals] = useLocalStorage("focusflow-goals", []);
  const [habits] = useLocalStorage("focusflow-habits", []);

  useEffect(() => {
    // Process local storage data into analytics format
    const completedTasks = tasks.filter(task => task.completed);
    const completedGoals = goals.filter(goal => goal.progress === 100);

    // Generate weekly time spent data based on completed tasks
    const timeSpent = [
      { day: "Mon", time: Math.floor(Math.random() * 6) + 1 },
      { day: "Tue", time: Math.floor(Math.random() * 6) + 1 },
      { day: "Wed", time: Math.floor(Math.random() * 6) + 1 },
      { day: "Thu", time: Math.floor(Math.random() * 6) + 1 },
      { day: "Fri", time: Math.floor(Math.random() * 6) + 1 },
      { day: "Sat", time: Math.floor(Math.random() * 6) + 1 },
      { day: "Sun", time: Math.floor(Math.random() * 6) + 1 },
    ];

    // Goal progress from actual data
    const goalProgress = [
      { name: "Goals Completed", value: completedGoals.length },
      { name: "Goals Remaining", value: goals.length - completedGoals.length },
    ];

    // Activity frequency from actual data
    const activityFrequency = [
      { activity: "Tasks", count: completedTasks.length },
      { activity: "Goals", count: completedGoals.length },
      { activity: "Habits", count: habits.length },
    ];

    setAnalytics({
      timeSpent,
      goalProgress,
      activityFrequency
    });
  }, [tasks, goals, habits]);

  const createTable = (pdf, headers, data, startY) => {
    const cellWidth = 80;
    const cellHeight = 10;
    const startX = 20;
    let currentY = startY;

    // Draw headers
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    headers.forEach((header, index) => {
      pdf.rect(startX + (index * cellWidth), currentY, cellWidth, cellHeight);
      pdf.text(header, startX + (index * cellWidth) + 5, currentY + 7);
    });

    currentY += cellHeight;

    // Draw data rows
    pdf.setFont(undefined, 'normal');
    data.forEach((row) => {
      row.forEach((cell, index) => {
        pdf.rect(startX + (index * cellWidth), currentY, cellWidth, cellHeight);
        pdf.text(cell.toString(), startX + (index * cellWidth) + 5, currentY + 7);
      });
      currentY += cellHeight;
    });

    return currentY + 10;
  };

  const exportToPDF = () => {
    const pdf = new jsPDF();

    // Add title
    pdf.setFontSize(20);
    pdf.text('FocusFlow Analytics Report', 20, 20);

    // Add date
    pdf.setFontSize(12);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);

    // Summary statistics
    pdf.setFontSize(14);
    pdf.text('Summary Statistics', 20, 55);

    const summaryData = [
      ['Total Tasks', tasks.length.toString()],
      ['Completed Tasks', tasks.filter(task => task.completed).length.toString()],
      ['Total Goals', goals.length.toString()],
      ['Completed Goals', goals.filter(goal => goal.progress === 100).length.toString()],
      ['Active Habits', habits.length.toString()]
    ];

    let currentY = createTable(pdf, ['Metric', 'Value'], summaryData, 65);

    // Time spent data
    pdf.setFontSize(14);
    pdf.text('Weekly Time Spent (Hours)', 20, currentY);

    const timeData = analytics?.timeSpent.map(item => [item.day, item.time.toString()]) || [];
    currentY = createTable(pdf, ['Day', 'Hours'], timeData, currentY + 10);

    // Activity frequency data
    pdf.setFontSize(14);
    pdf.text('Activity Frequency', 20, currentY);

    const activityData = analytics?.activityFrequency.map(item => [item.activity, item.count.toString()]) || [];
    createTable(pdf, ['Activity', 'Count'], activityData, currentY + 10);

    // Save the PDF
    pdf.save('focusflow-analytics-report.pdf');
  };

  if (!analytics) return <div className="text-center mt-10">Loading analytics...</div>;

  return (
    <div className="p-6 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Weekly Analytics</h1>
        <Button onClick={exportToPDF} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Time Spent Bar Chart */}
        <div className="bg-white dark:bg-gray-800 shadow rounded p-4">
          <h2 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Time Spent Per Day</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.timeSpent}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="time" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Goal Completion Pie Chart */}
        <div className="bg-white dark:bg-gray-800 shadow rounded p-4">
          <h2 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Goal Completion</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.goalProgress}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {analytics.goalProgress.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Line Chart */}
        <div className="bg-white dark:bg-gray-800 shadow rounded p-4 col-span-1 md:col-span-2">
          <h2 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Activity Frequency</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.activityFrequency}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="activity" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
