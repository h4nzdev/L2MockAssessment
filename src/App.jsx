import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import HomePage from './pages/HomePage';
import AssessmentPage from './pages/AssessmentPage';
import DocumentationPage from './pages/DocumentationPage';
import CustomBuilderPage from './pages/CustomBuilderPage';
import SimulatorPage from './pages/SimulatorPage';
import GlobalAiChatbot from './components/GlobalAiChatbot';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="/documentation" element={<DocumentationPage />} />
          <Route path="/builder" element={<CustomBuilderPage />} />
          <Route path="/simulator" element={<SimulatorPage />} />
          <Route path="/custom-builder" element={<Navigate to="/builder" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <GlobalAiChatbot />
      </BrowserRouter>
    </ThemeProvider>
  );
}
