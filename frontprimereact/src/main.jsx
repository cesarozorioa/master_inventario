import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { router } from "./router/index";
import { RouterProvider } from "react-router-dom";
import "primereact/resources/themes/md-dark-indigo/theme.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import UserProvider from "./utils/UserContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>
);
