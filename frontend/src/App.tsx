import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { PrivateRoute } from "./components/auth/PrivateRoute";
import { Profile } from "./pages/Profile";
import { Candidates } from "./pages/Candidates";
import { CandidateDetail } from "./pages/CandidateDetail";
import { ComingSoon } from "./pages/ComingSoon";
import { NotFound } from "./pages/NotFound";
import { TrainingList } from "./pages/TrainingList";
import { TrainingDetail } from "./pages/TrainingDetail";
import { TrainingForm } from "./pages/TrainingForm";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes rendered inside shared Layout */}
          <Route
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/candidates/:candidate_id" element={<CandidateDetail />} />
            {/* Training module */}
            <Route path="/training/create" element={<TrainingForm />} />
            <Route path="/training/:programme_id/edit" element={<TrainingForm />} />
            <Route path="/training" element={<TrainingList />} />
            <Route path="/training/:programme_id" element={<TrainingDetail />} />
            {/* Coming Soon modules */}
            <Route path="/employment" element={<ComingSoon module="Employment" />} />
            <Route path="/followups" element={<ComingSoon module="Follow‑ups" />} />
            <Route path="/interventions" element={<ComingSoon module="Interventions" />} />
            <Route path="/jobs" element={<ComingSoon module="Jobs" />} />
            <Route path="/employers" element={<ComingSoon module="Employers" />} />
            <Route path="/analytics" element={<ComingSoon module="Analytics" />} />
            <Route path="/reports" element={<ComingSoon module="Reports" />} />
            {/* Catch-all for undefined routes */}
            <Route path="*" element={<NotFound />} />
            {/* Add more protected routes as needed */}
          </Route>
        </Routes>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;