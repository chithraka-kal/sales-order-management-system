import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SalesOrder from './pages/SalesOrder';

// --- 1. Import Toastify & CSS ---
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-700">
        
        {/* --- 2. Add the Container Here --- */}
        <ToastContainer position="top-right" autoClose={3000} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/order" element={<SalesOrder />} />
          <Route path="/order/:id" element={<SalesOrder />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;