
import { BrowserRouter, Routes, Route } from "react-router-dom"
import "./App.css"
import { VotingSystemProvider } from "./contexts/VotingSystemContext"
import { BetaAccessProvider } from "./contexts/BetaAccessContext"
import { AuthProvider } from "./contexts/AuthContext"
import BetaGate from "./components/BetaGate"
import ProtectedRoute from "./components/ProtectedRoute"
import MandateWallet from "./pages/MandateWallet"
import Results from "./pages/Results"
import AIAssistant from "./pages/AIAssistant"
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BetaAccessProvider>
          <VotingSystemProvider>
            <BetaGate />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <MandateWallet />
                </ProtectedRoute>
              } />
              <Route path="/results" element={
                <ProtectedRoute>
                  <Results />
                </ProtectedRoute>
              } />
              <Route path="/ai-assistant" element={
                <ProtectedRoute>
                  <AIAssistant />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </VotingSystemProvider>
        </BetaAccessProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
