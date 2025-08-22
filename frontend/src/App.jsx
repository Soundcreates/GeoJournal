// App.jsx
import { BrowserRouter, Routes, Route } from "react-router";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
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
import ProtectedRoutes from "./context/ProtectedRoutes.jsx";
import { MessageProvider, useMessage } from "./context/messageContext.jsx";
import MessageModal from "./comps/MessageModal.jsx";
import { MessageCircle } from "lucide-react"; // chat icon
import { motion, AnimatePresence } from "framer-motion";

const AppContent = () => {
  const { loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/oauth-success" element={<OauthSuccess />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/dashboard" element={<Dashboard2 />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/otherProfile/:userId" element={<OtherUserProfile />} />
        <Route path="/add-entry" element={<AddEntry />} />
        <Route path="/view-others" element={<Others />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Floating Chat Button + Modal (Global)

const GlobalChat = () => {
  const { openMessageModal, setOpenMessageModal } = useMessage();

  return (
    <>
      <button
        onClick={() => setOpenMessageModal(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700  hover:scale-105 text-white p-4 rounded-full shadow-lg transition-all duration-300 cursor-pointer "
      >
        <MessageCircle />
      </button>

      <AnimatePresence>
        {openMessageModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-2xl shadow-lg border "
          >
            <MessageModal />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <ErrorProvider>
        <MessageProvider>
          <AppContent />
          <GlobalChat /> {/* 🔹 Always available */}
        </MessageProvider>
      </ErrorProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
