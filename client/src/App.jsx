import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Navbar } from "./components/Navbar";
import { About, Home, PromptLibrary, PromptTemplate, PromptAnalyzer } from "./components";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/PromptLibrary" element={<PromptLibrary />} />
        <Route path="/PromptTemplate" element={<PromptTemplate />} />
        <Route path="/PromptAnalyzer" element={<PromptAnalyzer />} />
      </Routes>
    </div>
  );
}

export default App;