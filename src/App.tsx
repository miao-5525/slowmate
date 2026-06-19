import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import TasksPage from './pages/TasksPage';
import TutorialPage from './pages/TutorialPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import MemberPage from './pages/MemberPage';
import HelpBookPage from './pages/HelpBookPage';
import TaskBuilderPage from './pages/TaskBuilderPage';
import styles from './App.module.css';

export default function App() {
  return (
    <HashRouter>
      <AppProvider>
        <div className={styles.app}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="task/:taskId" element={<TutorialPage />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="chat/:taskId" element={<ChatPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="member" element={<MemberPage />} />
              <Route path="help-book" element={<HelpBookPage />} />
              <Route path="task-builder" element={<TaskBuilderPage />} />
            </Route>
          </Routes>
        </div>
      </AppProvider>
    </HashRouter>
  );
}
