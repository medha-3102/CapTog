import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import EventPage from "./EventPage";
import PhotoGallery from "./components/PhotoGallery";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/event/:eventCode" element={<EventPage />} />
      </Routes>
    </Router>
  );
};

export default App;
