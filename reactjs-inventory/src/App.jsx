import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Inventory from "./pages/Inventory";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/inventory/:id" element={<Inventory />} />
    </Routes>
  );
}

export default App;
