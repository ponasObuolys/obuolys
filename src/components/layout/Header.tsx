import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useUnreadMessages } from '@/hooks/use-unread-messages';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';


const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();
  const unreadCount = useUnreadMessages();

  // Navigacijos meniu punktai
  const navLinks = [
    { to: '/publikacijos', label: 'AI Naujienos' },
    { to: '/kursai', label: 'Kursai' },
    { to: '/irankiai', label: 'Įrankiai' },
    { to: '/kontaktai', label: 'Kontaktai' },
  ];

  const isActive = (to: string) => location.pathname === to;

  return (
    <header className="border-b border-border sticky top-0 z-50 w-full backdrop-blur-xl bg-background/80">
      <div className="container mx-auto py-4 px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <span className="text-primary font-bold text-lg">🍎</span>
            </div>
            <span className="text-foreground font-bold text-xl">ponas Obuolys</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`nav-link transition-colors duration-300 flex items-center gap-2 ${
                  isActive(to)
                    ? 'text-foreground'
                    : 'text-foreground/60 hover:text-foreground'
                }`}
              >
                {label}
                {to === '/kontaktai' && isAdmin && unreadCount > 0 && (
                  <Badge variant="destructive" className="h-5 min-w-5 flex items-center justify-center px-1.5 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Profilis</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/profilis" className="flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>Nustatymai</span>
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-2">
                          <Settings className="h-4 w-4" />
                          <span>Administravimas</span>
                        </div>
                        {unreadCount > 0 && (
                          <Badge variant="destructive" className="ml-2 h-5 min-w-5 flex items-center justify-center px-1.5">
                            {unreadCount}
                          </Badge>
                        )}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="flex items-center space-x-2">
                    <LogOut className="h-4 w-4" />
                    <span>Atsijungti</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link to="/auth">Prisijungti</Link>
                </Button>
                <Button className="button-primary">Konsultuotis</Button>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-foreground/60 hover:text-foreground transition-colors duration-300"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-background border-t border-border">
          <div className="container mx-auto py-4 px-4 space-y-2">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="block px-4 py-3 text-foreground/80 hover:text-foreground hover:bg-card rounded-lg transition-colors duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center justify-between">
                  <span>{label}</span>
                  {to === '/kontaktai' && isAdmin && unreadCount > 0 && (
                    <Badge variant="destructive" className="h-5 min-w-5 flex items-center justify-center px-1.5 text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </div>
              </Link>
            ))}

            <div className="border-t border-border pt-4 mt-4 space-y-2">
              {user ? (
                <>
                  <Link
                    to="/profilis"
                    className="block px-4 py-3 text-foreground/80 hover:text-foreground hover:bg-card rounded-lg transition-colors duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>Profilio nustatymai</span>
                    </div>
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="block px-4 py-3 text-foreground/80 hover:text-foreground hover:bg-card rounded-lg transition-colors duration-300"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Settings className="h-4 w-4" />
                          <span>Administravimas</span>
                        </div>
                        {unreadCount > 0 && (
                          <Badge variant="destructive" className="h-5 min-w-5 flex items-center justify-center px-1.5">
                            {unreadCount}
                          </Badge>
                        )}
                      </div>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-foreground/80 hover:text-foreground hover:bg-card rounded-lg transition-colors duration-300"
                  >
                    <div className="flex items-center space-x-2">
                      <LogOut className="h-4 w-4" />
                      <span>Atsijungti</span>
                    </div>
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="block px-4 py-3 text-foreground/80 hover:text-foreground hover:bg-card rounded-lg transition-colors duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Prisijungti</span>
                  </div>
                </Link>
              )}
              <Button className="w-full button-primary" onClick={() => setMobileMenuOpen(false)}>
                Konsultuotis
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
