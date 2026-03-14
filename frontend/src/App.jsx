// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // IMPORT NAVBAR INSTEAD OF SIDEBAR
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Settings from './pages/Settings';
import Operations from './pages/Operations'
import styles from './components/Layout.module.css';
import MoveHistory from './pages/MoveHistory';

function App() {
  return (
      <Router>
        <div className={styles.appWrapper}>
          <Navbar /> {/* RENDER NAVBAR HERE */}
          <main className={styles.mainContent}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
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