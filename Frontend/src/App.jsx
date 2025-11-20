import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SalesOrder from './pages/SalesOrder';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-700">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/order" element={<SalesOrder />} />
          <Route path="/order/:id" element={<SalesOrder />} /> {/* For editing */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;