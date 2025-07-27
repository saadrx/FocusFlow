
import { Switch, Route } from "wouter";

import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import QuickNote from "./components/QuickNote";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import Tasks from "./pages/Tasks";
import Goals from "./pages/Goals";
import Notes from "./pages/Notes";
import Files from "./pages/Files";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Settings from "./pages/Settings";
import UserProfilePage from "./pages/UserProfilePage";
import NotFound from "./pages/not-found";
import { useState } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/calendar">
        <ProtectedRoute>
          <Calendar />
        </ProtectedRoute>
      </Route>
      <Route path="/tasks">
        <ProtectedRoute>
          <Tasks />
        </ProtectedRoute>
      </Route>
      <Route path="/goals">
        <ProtectedRoute>
          <Goals />
        </ProtectedRoute>
      </Route>
      <Route path="/notes">
        <ProtectedRoute>
          <Notes />
        </ProtectedRoute>
      </Route>
      <Route path="/files">
        <ProtectedRoute>
          <Files />
        </ProtectedRoute>
      </Route>
      <Route path="/analytics">
        <ProtectedRoute>
          <Analytics />
        </ProtectedRoute>
      </Route>
      <Route path="/settings">
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      </Route>
      <Route path="/profile">
        <ProtectedRoute>
          <UserProfilePage />
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-screen flex flex-col">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar open={sidebarOpen} />
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <Router />
        </main>
      </div>
      <QuickNote />
    </div>
  );
}

export default App;
