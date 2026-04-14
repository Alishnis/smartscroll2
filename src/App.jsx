import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import Navbar from './components/Navbar/Navbar';
import GamificationTracker from './components/GamificationTracker/GamificationTracker';
import About from './pages/About/About';
import Feed from './pages/Feed/Feed';
import Posts from './pages/Posts/Posts';
import Groups from './pages/Groups/Groups';
import GroupDetails from './pages/GroupDetails/GroupDetails';
import Facts from './pages/Facts/Facts';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';
import Conference from './pages/Conference/Conference';
import ExplainBack from './pages/ExplainBack/ExplainBack';
import MemoryRefresh from './pages/MemoryRefresh/MemoryRefresh';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';

const App = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <div className="app-layout">
            <GamificationTracker />
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<About />} />
                <Route path="/feed" element={<Feed />} />
                <Route path="/posts" element={<Posts />} />
                <Route path="/groups" element={<Groups />} />
                <Route path="/groups/:groupId" element={<GroupDetails />} />
                <Route path="/facts" element={<Facts />} />
                <Route path="/conference" element={<Conference />} />
                <Route path="/explain-back" element={<ExplainBack />} />
                <Route path="/memory-refresh" element={<MemoryRefresh />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
            <Navbar />
          </div>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
