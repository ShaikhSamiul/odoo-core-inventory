// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar'; // IMPORT NAVBAR INSTEAD OF SIDEBAR
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Settings from './pages/Settings';
import Operations from './pages/Operations'
import styles from './components/Layout.module.css';
import MoveHistory from './pages/MoveHistory';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem('token');
    
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

const PublicRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem('token');
    
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }
    return children;
};

function App() {
  return (
      <Router>
        <div className={styles.appWrapper}>
          <Navbar /> {/* RENDER NAVBAR HERE */}
          <main className={styles.mainContent}>
            <Routes>
              <Route path="/login" element={
                <PublicRoute><Login /></PublicRoute>
              } />
              <Route path="/signup" element={
                <PublicRoute><Signup /></PublicRoute>
              } />
              <Route path="/" element={<Dashboard />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/products" element={<Products />} />
              <Route path="/Operations" element={<Operations />} />
              <Route path="/history" element={<MoveHistory />} />
              {<Route path="/settings" element={<Settings />} /> }
              {/* You will add Operations and MoveHistory routes here later */}
            </Routes>
          </main>
        </div>
      </Router>
  );
}

export default App;