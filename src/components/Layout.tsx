
import React, { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShieldCheck, LogOut, Bot, Wallet } from "lucide-react";
import { useBetaAccess } from "@/contexts/BetaAccessContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const { revokeBetaAccess } = useBetaAccess();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleLogout = () => {
    revokeBetaAccess();
    setLogoutDialogOpen(false);
    toast.success("Beta access revoked");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Quantum Voting</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`text-sm ${isActive('/') ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Home
            </Link>
            <Link 
              to="/register" 
              className={`text-sm ${isActive('/register') ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Register
            </Link>
            <Link 
              to="/create-election" 
              className={`text-sm ${isActive('/create-election') ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Create Election
            </Link>
            <Link 
              to="/cast-vote" 
              className={`text-sm ${isActive('/cast-vote') ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Cast Vote
            </Link>
            <Link 
              to="/offline-vote" 
              className={`text-sm ${isActive('/offline-vote') ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Offline Vote
            </Link>
            <Link 
              to="/results" 
              className={`text-sm ${isActive('/results') ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Results
            </Link>
            <Link 
              to="/mandate-wallet" 
              className={`text-sm ${isActive('/mandate-wallet') ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Wallet className="h-4 w-4 inline mr-1" />
              Mandate Wallet
            </Link>
            <Link 
              to="/ai-assistant" 
              className={`text-sm ${isActive('/ai-assistant') ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Bot className="h-4 w-4 inline mr-1" />
              AI Assistant
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setLogoutDialogOpen(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4 mr-1" />
              <span className="text-sm">Exit Beta</span>
            </Button>
          </nav>
          
          <div className="md:hidden">
            {/* Mobile menu button - would typically toggle a dropdown */}
            <button className="p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="border-t py-6 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Enhanced Quantum-Resistant Voting System
            </p>
            <p className="text-sm text-muted-foreground mt-2 md:mt-0">
              Built with quantum-resistant cryptography for secure elections
            </p>
          </div>
        </div>
      </footer>

      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exit Beta Testing</DialogTitle>
            <DialogDescription>
              Are you sure you want to exit beta testing? You'll need to enter the password again to regain access.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLogoutDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleLogout}>Exit Beta</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Layout;
