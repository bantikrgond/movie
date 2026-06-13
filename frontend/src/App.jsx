import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard.jsx';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Navbar will go here */}
        <Routes>
          <Route path="/" element={<h1 style={{color: 'white', textAlign: 'center', marginTop: '20vh'}}>TICKETY React App is Running! Go to /admin for Dashboard</h1>} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
