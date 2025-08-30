import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { AuthProvider,useAuth } from "./context/AuthContext.tsx";
import PrivateAdminRoute from "./components/PrivateAdminRoute.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import AudiencePage from "./pages/AudiencePage.tsx";
import CampaignPage from "./pages/CampaignPage.tsx";
import CampaignsPage from "./pages/CampaignsPage.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import ReportPhishingPage from "./pages/ReportPhsihing.tsx";
import Layout from "./components/common/Layout.tsx";
import CreateCampaignPage from "./pages/CreateCampaignPage.tsx";
import AudienceDetailsPage from "./pages/AudienceDetailsPage.tsx";
import TemplateManagement from "./pages/TemplateManagement.tsx";
import AdminDashboard from "./components/AdminDashboard.tsx";
import UserManagement from "./pages/UserManagement.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import { NotificationProvider } from "./context/NotificationContext.tsx";

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ThemeProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage/>} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/"
                element={
                  <PrivatePage>
                    <Layout>
                      <DashboardPage />
                    </Layout>
                  </PrivatePage>
                }
              />
              <Route
                path="/audiences"
                element={
                  <PrivatePage>
                    <Layout>
                      <AudiencePage />
                    </Layout>
                  </PrivatePage>
                }
              />
              <Route
                path="/campaigns"
                element={
                  <PrivatePage>
                    <Layout>
                      <CampaignsPage />
                    </Layout>
                  </PrivatePage>
                }
              />
              <Route
                path="/campaigns/:id"
                element={
                  <PrivatePage>
                    <Layout>
                      <CampaignPage />
                    </Layout>
                  </PrivatePage>
                }
              />
              <Route
                path="/campaigns/new"
                element={
                  <PrivatePage>
                    <Layout>
                      <CreateCampaignPage />
                    </Layout>
                  </PrivatePage>
                }
              />
              <Route
                path="/audiences/:id"
                element={
                  <PrivatePage>
                    <Layout>
                      <AudienceDetailsPage />
                    </Layout>
                  </PrivatePage>
                }
              />
              <Route path="/landing/:id" element={<LandingPage />} />
              <Route path="/reportPhishing/:id" element={<ReportPhishingPage />} />
              <Route path="/admin" element={<PrivateAdminRoute />}>
              <Route
                element={
                  <Layout>
                    <Outlet />
                  </Layout>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="templates" element={<TemplateManagement />} />
                <Route path="users" element={<UserManagement />} />
              </Route>
            </Route>
            </Routes>
          </Router>
        </ThemeProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

function PrivatePage({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}
