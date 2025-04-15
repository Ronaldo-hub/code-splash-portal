
import { BrowserRouter, Routes, Route } from "react-router-dom"
import "./App.css"
import { VotingSystemProvider } from "./contexts/VotingSystemContext"
import { BetaAccessProvider } from "./contexts/BetaAccessContext"
import BetaGate from "./components/BetaGate"
import MandateWallet from "./pages/MandateWallet"
import Results from "./pages/Results"
import AIAssistant from "./pages/AIAssistant"
import NotFound from "./pages/NotFound"
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <BrowserRouter>
      <BetaAccessProvider>
        <VotingSystemProvider>
          <BetaGate />
          <Routes>
            <Route path="/" element={<MandateWallet />} />
            <Route path="/results" element={<Results />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </VotingSystemProvider>
      </BetaAccessProvider>
    </BrowserRouter>
  )
}

export default App
