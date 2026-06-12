import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import TasksPage from './pages/TasksPage';
import TutorialPage from './pages/TutorialPage';
import ChatPage from './pages/ChatPage';
import ProgressPage from './pages/ProgressPage';
import styles from './App.module.css';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <div className={styles.app}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="task/:taskId" element={<TutorialPage />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="chat/:taskId" element={<ChatPage />} />
              <Route path="progress" element={<ProgressPage />} />
            </Route>
          </Routes>
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}
