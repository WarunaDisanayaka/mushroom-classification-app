import logo from "./logo.svg";
import { BrowserRouter as Router, Link, Routes, Route } from "react-router-dom";

import "./App.css";
import Prediction from "./prediction";
import Home from "./home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/predict-page" element={<Prediction />} />
      </Routes>
    </Router>
  );
}

export default App;
