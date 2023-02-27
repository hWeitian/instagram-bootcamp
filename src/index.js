import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MessageBox from "./Component/MessageBox";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <CssBaseline />
    <App />
  </>
);
