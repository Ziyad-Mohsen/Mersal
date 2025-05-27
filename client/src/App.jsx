// React & routing
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

// Pages & Layouts
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Signup from "./pages/SignupPage";
import ProfileLayout from "./layouts/ProfileLayout";
import UserLayout from "./layouts/UserLayout";
import SearchLayout from "./layouts/SearchLayout";

// Components
import Timeline from "./components/Timeline";
import BottomBar from "./components/BottomBar";

// State management
import { useAuthStore } from "./store/useAuthStore";

// Notifications
import { Toaster } from "react-hot-toast";
import LoadingPage from "./pages/Loading";
import NotFound from "./pages/NotFound";
import UsersSection from "./layouts/UsersSection";
import MobileOnlyRoute from "./components/utils/MobileOnlyRoute";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { pathname } = useLocation();

  // Check authentication status on initial load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Show loading screen while checking authentication
  if (isCheckingAuth) return <LoadingPage />;

  return (
    <>
      <Routes>
        {/* Main route structure */}
        <Route path="/" element={<HomePage />}>
          <Route index element={<Timeline />} />

          {/* Protected routes: Require user to be logged in */}
          <Route
            path="post/:id"
            element={authUser ? <></> : <Navigate to="/login" />}
          />
          <Route
            path="profile"
            element={authUser ? <ProfileLayout /> : <Navigate to="/login" />}
          />
          <Route
            path="user/:id"
            element={authUser ? <UserLayout /> : <Navigate to="/login" />}
          />

          {/* Public routes */}
          <Route path="search" element={<SearchLayout />} />
          <Route
            path="popular"
            element={
              <MobileOnlyRoute>
                <UsersSection />
              </MobileOnlyRoute>
            }
          />
        </Route>

        {/* Auth pages */}
        <Route
          path="/login"
          element={authUser ? <Navigate to="/" /> : <LoginPage />}
        />
        <Route
          path="/signup"
          element={authUser ? <Navigate to="/" /> : <Signup />}
        />

        {/* Fallback for unmatched routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Toast notifications */}
      <Toaster />

      {/* Mobile navigation */}
      <BottomBar />
    </>
  );
}

export default App;
