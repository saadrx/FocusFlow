
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./components/layout/ThemeProvider";

createRoot(document.getElementById("root")).render(
  <ThemeProvider defaultTheme="light" storageKey="focusflow-theme">
    <App />
  </ThemeProvider>
);
