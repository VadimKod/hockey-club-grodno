import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Team from "./pages/Team/Team";
import News from "./pages/News/News";
import Schedule from "./pages/Schedule/Schedule";
import About from "./pages/About/About";
import GalleryPage from "./pages/Gallery/Gallery";
import Login from "./pages/Login/Login";
import Admin from "./pages/Admin/Admin";
import NewsDetail from "./pages/NewsDetail/NewsDetail";
import PlayerDetail from "./pages/PlayerDetail/PlayerDetail";
import MatchDetail from "./pages/MatchDetail/MatchDetail";
import Profile from "./pages/Profile/Profile";
import Tournaments from "./pages/Tournaments/Tournaments";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-brand-950 text-white flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/team" element={<Team />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/player/:id" element={<PlayerDetail />} />
            <Route path="/match/:id" element={<MatchDetail />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/about" element={<About />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/tournaments" element={<Tournaments />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;