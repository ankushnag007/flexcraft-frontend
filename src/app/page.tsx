"use client"
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Homepage from './(public)/Homepage';
import ProjectManagement from './(auth)/projectManagement/page';
import ApiTesting from './(auth)/apiworkspace/page';
import Chat from './(auth)/chat/page';
import GitHubIntegration from './(auth)/github/page';
import ProjectDeployment from './(auth)/deployment/ProjectDeployment';
import Integrations from './(auth)/integrationsapp/page';
import DesignArchitecture from './(auth)/flowCharts/page';
import Dashboard from './(auth)/dashboard/page';
import EmailApp from './(auth)/email/page';
import AIAgent from './(auth)/AIAgent/page';
import Workflow from './(auth)/automation/page'
import FeaturesPage from './(public)/Features';
import Pricing from './(public)/Pricing';
import Resources from './(public)/Resources';
import IntegrationsPage from './(auth)/integrationsapp/page';
import DesignArchitecute from './(auth)/flowCharts/page';
import Careers from './(public)/Careers'

function Home() {
  const isAuthenticated = true; // Replace with your actual auth logic

  return (
    <Router>
      <main className="flex-1 overflow-hidden">
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
              <Route path="/manageprojects" element={<ProjectManagement />} />
              <Route path="/" element={<Navigate to="/manageprojects" replace />} />
              <Route path="/ai-agent" element={<AIAgent />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/email" element={<EmailApp />} />
              <Route path="/api-testing" element={<ApiTesting />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/github" element={<GitHubIntegration />} />
              <Route path="/deployment" element={<ProjectDeployment />} />
              <Route path="/integrations" element={<Integrations />} />
              {/* <Route path="/designArchitecture" element={<DesignArchitecute />} /> */}
              <Route path="/workflow-automation" element={<Workflow />} />
              <Route path="/features" element={<FeaturesPage />} />
              
              {/* Redirect any unknown routes to Flexcraft-AI */}
              {/* <Route path="*" element={<Navigate to="/designArc hitecture" replace />} /> */}
            </>
          )}
        </Routes>
      </main>
    </Router>
  );
}

export default Home;