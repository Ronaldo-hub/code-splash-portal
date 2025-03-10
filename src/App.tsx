
import { BrowserRouter, Routes, Route } from "react-router-dom"
import "./App.css"
import { VotingSystemProvider } from "./contexts/VotingSystemContext"
import Register from "./pages/Register"
import CreateElection from "./pages/CreateElection"
import CastVote from "./pages/CastVote"
import OfflineVote from "./pages/OfflineVote"
import Results from "./pages/Results"
import Home from "./pages/Home"
import { Toaster } from "@/components/ui/sonner"
import Index from "./pages/Index"
import NotFound from "./pages/NotFound"

function App() {
  return (
    <BrowserRouter>
      <VotingSystemProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/index" element={<Index />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-election" element={<CreateElection />} />
          <Route path="/cast-vote" element={<CastVote />} />
          <Route path="/offline-vote" element={<OfflineVote />} />
          <Route path="/results" element={<Results />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </VotingSystemProvider>
    </BrowserRouter>
  )
}

export default App
