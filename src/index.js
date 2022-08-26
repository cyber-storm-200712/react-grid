import { StrictMode } from "react";
import ReactDOM from "react-dom";

import "./styles/react-grid-layout.css";
import "./styles/react-resizable.css";

import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  rootElement
);
