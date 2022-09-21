import React from "react";
import ReactDOM from "react-dom";
import Router from "./ui/pages/router";
import "./index.css";
import { RecoilRoot } from "recoil";

const App = () => {
  return (
    <React.StrictMode>
      <RecoilRoot>
        <Router />
      </RecoilRoot>
    </React.StrictMode>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
