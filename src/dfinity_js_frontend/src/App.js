import React, { useEffect, useCallback, useState } from "react";
import "./App.css";
import "./styles/tailwind.css";
import "./styles/font.css";
import "./index.css";

// src/dfinity_js_frontend/src/index.css
// import "./styles/font.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Worker from "./pages/Worker/Worker";
import Farmer from "./pages/Farmer/Farmer";



const App = function AppWrapper() {


  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/worker" element={<Worker />} />
          <Route path="/farmer" element={<Farmer />} />
        </Routes>
      </Router>
 
 
    </>
  );
};

export default App;
