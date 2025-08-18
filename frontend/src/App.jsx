import { BrowserRouter, Routes, Route } from "react-router";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
//dashboard2 for revamping ui,
import Dashboard2 from "./pages/Dashboard2.jsx";
import { AuthProvider } from "./context/AuthContext";
import NotFound from "./pages/NotFound";
import Loader from "./pages/Loader";
import ProfilePage from "./pages/ProfilePage";
import AddEntry from "./pages/AddEntry";
import OauthSuccess from "./pages/OauthSuccess";
import { ErrorProvider } from "./context/errorContext";
import { Others } from "./pages/Others.jsx";
import OtherUserProfile from "./pages/OtherUserProfile.jsx";

const AppContent = () => {
  const { loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard2 />} />
      <Route path="/profile/:userId" element={<ProfilePage />} />
      <Route path="/otherProfile/:userId" element={<OtherUserProfile />} />
      <Route path="/add-entry" element={<AddEntry />} />
      <Route path="/oauth-success" element={<OauthSuccess />} />
      <Route path="/view-others" element={<Others />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <ErrorProvider>
        <AppContent />
      </ErrorProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
