import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Homepage from './pages/Homepage';
import ProjectManagement from './pages/ProjectManagement';
import ApiTesting from './pages/ApiTesting';
import Chat from './pages/Chat';
import GitHubIntegration from './pages/GitHubIntegration';
import ProjectDeployment from './pages/ProjectDeployment';
import Integrations from './pages/Integrations';
import DesignArchitecture from './pages/DesignArchitecture';
import Dashboard from './pages/Dashboard';
import EmailApp from './pages/Email';
import AIAgent from './pages/AIAgent';
import Workflow from './pages/Workflow'
import FeaturesPage from './pages/Features';
import Pricing from './pages/Pricing';
import Resources from './pages/Resources';
import IntegrationsPage from './pages/Integrations';
import DesignArchitecute from './pages/DesignArchitecture';
import Careers from './pages/Careers'

function App() {
  const isAuthenticated = true; // Replace with your actual auth logic

  return (
    <Router>
      <main className="flex-1 overflow-x-hidden">
        {isAuthenticated && <Sidebar />}
        <Routes>
          {!isAuthenticated ? (
            <>
              <Route path="/" element={<Homepage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/integrationsPage" element={<IntegrationsPage />} />
              <Route path="/designArchitecture" element={<DesignArchitecture />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            <>
              {/* Default authenticated route now goes to Flexcraft-AI */}
              <Route path="/" element={<Navigate to="/designArchitecture" replace />} />
              <Route path="/ai-agent" element={<AIAgent />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/email" element={<EmailApp />} />
              <Route path="/projects" element={<ProjectManagement />} />
              <Route path="/api-testing" element={<ApiTesting />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/github" element={<GitHubIntegration />} />
              <Route path="/deployment" element={<ProjectDeployment />} />
              <Route path="/integrations" element={<Integrations />} />
              <Route path="/designArchitecture" element={<DesignArchitecute />} />
              <Route path="/workflow-automation" element={<Workflow />} />
              <Route path="/features" element={<FeaturesPage />} />
              
              {/* Redirect any unknown routes to Flexcraft-AI */}
              <Route path="*" element={<Navigate to="/designArchitecture" replace />} />
            </>
          )}
        </Routes>
      </main>
    </Router>
  );
}

export default App;