import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
//import App from "./App.jsx";
//import { BrowserRouter } from "react-router-dom";
import { router } from "./router";
import { RouterProvider } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
   <RouterProvider router={router} />     
  </StrictMode>
);
