import { BrowserRouter, Routes, Route } from "react-router";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import NotFound from "./pages/NotFound";
import Loader from "./pages/Loader";
import ProfilePage from "./pages/ProfilePage";
import AddEntry from "./pages/AddEntry";
import OauthSuccess from "./pages/OauthSuccess";

const AppContent = () => {
  const { loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/add-entry" element={<AddEntry />} />
      <Route path="/oauth-success" element={<OauthSuccess />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
