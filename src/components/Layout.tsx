
import React, { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, LogOut, Bot, PieChart, User } from "lucide-react";
import { useBetaAccess } from "@/contexts/BetaAccessContext";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;
  const { revokeBetaAccess } = useBetaAccess();
  const { user, logout } = useAuth();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [betaDialogOpen, setBetaDialogOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setLogoutDialogOpen(false);
    navigate("/login");
  };

  const handleExitBeta = () => {
    revokeBetaAccess();
    setBetaDialogOpen(false);
    toast.success("Beta access revoked");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Quantum Mandate</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`text-sm ${isActive('/') ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Mandate Wallet
            </Link>
            <Link 
              to="/results" 
              className={`text-sm flex items-center gap-1 ${isActive('/results') ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <PieChart className="h-4 w-4" />
              Results
            </Link>
            <Link 
              to="/ai-assistant" 
              className={`text-sm flex items-center gap-1 ${isActive('/ai-assistant') ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Bot className="h-4 w-4" />
              AI Assistant
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{user?.name || 'Account'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLogoutDialogOpen(true)}>
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setBetaDialogOpen(true)}>
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  <span>Exit Beta</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
          
          <div className="md:hidden">
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
              Quantum-Resistant Mandate Wallet
            </p>
            <p className="text-sm text-muted-foreground mt-2 md:mt-0">
              Built with quantum-resistant cryptography for secure token transfers
            </p>
          </div>
        </div>
      </footer>

      {/* Logout Dialog */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout? You'll need to enter your credentials again to access the application.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLogoutDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleLogout}>Logout</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Exit Beta Dialog */}
      <Dialog open={betaDialogOpen} onOpenChange={setBetaDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exit Beta Testing</DialogTitle>
            <DialogDescription>
              Are you sure you want to exit beta testing? You'll need to enter the password again to regain access.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBetaDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleExitBeta}>Exit Beta</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Layout;
