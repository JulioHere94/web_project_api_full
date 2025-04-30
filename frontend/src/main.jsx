import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AuthRoutes from "./auth.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthRoutes />
  </StrictMode>
);
