import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import OrganizerDashboard from './pages/OrganizerDashboard';
import AttendeeDashboard from './pages/AttendeeDashboard';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
        <Route path="/attendee/dashboard" element={<AttendeeDashboard />} />
      </Routes>
      {/* <ToastContainer /> */}
    </Router>
  );
}

export default App;
