
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import CardDetailsPage from './pages/CardSearchPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import MyFavoritesPage from './pages/MyFavoritesPage.jsx';
import SharedFavoritesPage from './pages/SharedFavoritesPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/carddetails" element={<CardDetailsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/favorites" element={<MyFavoritesPage />} />
          <Route path="/favorites/:uid" element={<SharedFavoritesPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App
