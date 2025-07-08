"use client"
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Homepage from '../app/Homepage';
import ProjectManagement from '../app/ProjectManagement';
import ApiTesting from '../app/ApiTesting';
import Chat from '../app/Chat';
import GitHubIntegration from '../app/GitHubIntegration';
import ProjectDeployment from '../app/ProjectDeployment';
import Integrations from '../app/Integrations';
import DesignArchitecture from '../app/DesignArchitecture';
import Dashboard from '../app/Dashboard';
import EmailApp from '../app/Email';
import AIAgent from '../app/AIAgent';
import Workflow from '../app/Workflow'
import FeaturesPage from '../app/Features';
import Pricing from '../app/Pricing';
import Resources from '../app/Resources';
import IntegrationsPage from '../app/Integrations';
import DesignArchitecute from '../app/DesignArchitecture';
import Careers from '../app/Careers'

function Home() {
  const isAuthenticated = false; // Replace with your actual auth logic

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
              <Route path="/projects" element={<ProjectManagement />} />
              <Route path="/" element={<Navigate to="/projects" replace />} />
              <Route path="/ai-agent" element={<AIAgent />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/email" element={<EmailApp />} />
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

export default Home;