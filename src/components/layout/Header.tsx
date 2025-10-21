import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { GlobalSearch } from '@/components/search/global-search';
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
  const [profileData, setProfileData] = useState<{ username?: string; avatarUrl?: string } | null>(null);
  const location = useLocation();
  const { user, isAdmin, signOut, getUserProfile } = useAuth();
  const unreadCount = useUnreadMessages();

  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        const profile = await getUserProfile();
        setProfileData(profile);
      }
    };
    loadProfile();
  }, [user, getUserProfile]);

  // Navigacijos meniu punktai
  const navLinks = [
    { to: '/publikacijos', label: 'AI Naujienos' },
    { to: '/kursai', label: 'Kursai' },
    { to: '/irankiai', label: 'Įrankiai' },
    { to: '/verslo-sprendimai', label: 'Verslo Sprendimai' },
    { to: '/kontaktai', label: 'Kontaktai' },
  ];

  const isActive = (to: string) => location.pathname === to;

  return (
    <header className="border-b border-border sticky top-0 z-50 w-full backdrop-blur-xl bg-background/80">
      <div className="container mx-auto py-4 px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/obuolys-logo.png" 
              alt="ponas Obuolys logo" 
              className="w-10 h-10 object-contain"
            />
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
            {/* Global search */}
            <GlobalSearch />

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Paremti mygtukas */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                  <Heart className="h-4 w-4" />
                  <span>Paremti</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <a 
                    href="https://www.youtube.com/@ponasObuolys/join" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    <span>YouTube Members</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a 
                    href="https://www.patreon.com/ponasObuolys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15.386.524c-4.764 0-8.64 3.876-8.64 8.64 0 4.75 3.876 8.613 8.64 8.613 4.75 0 8.614-3.864 8.614-8.613C24 4.4 20.136.524 15.386.524M.003 23.537h4.22V.524H.003"/>
                    </svg>
                    <span>Patreon</span>
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={profileData?.avatarUrl || ''} alt={profileData?.username || 'User'} />
                      <AvatarFallback>
                        {profileData?.username?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
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
                <Button asChild className="button-primary">
                  <Link to="/kontaktai?type=KONSULTACIJA">Konsultuotis</Link>
                </Button>
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

            {/* Search mobile */}
            <div className="border-t border-border pt-4 mt-4">
              <div className="px-4 py-3">
                <GlobalSearch />
              </div>
            </div>

            {/* Theme toggle mobile */}
            <div className="border-t border-border pt-4 mt-4">
              <div className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-foreground/80">Tema</span>
                  <ThemeToggle />
                </div>
              </div>
            </div>

            {/* Paremti mygtukas mobile */}
            <div className="border-t border-border pt-4 mt-4 space-y-2">
              <a
                href="https://www.youtube.com/@ponasObuolys/join"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-3 text-foreground/80 hover:text-foreground hover:bg-card rounded-lg transition-colors duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4" />
                  <span>Paremti per YouTube</span>
                </div>
              </a>
              <a
                href="https://www.patreon.com/ponasObuolys"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-3 text-foreground/80 hover:text-foreground hover:bg-card rounded-lg transition-colors duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4" />
                  <span>Paremti per Patreon</span>
                </div>
              </a>

              {user ? (
                <>
                  <Link
                    to="/profilis"
                    className="block px-4 py-3 text-foreground/80 hover:text-foreground hover:bg-card rounded-lg transition-colors duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={profileData?.avatarUrl || ''} alt={profileData?.username || 'User'} />
                        <AvatarFallback>
                          {profileData?.username?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
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
              <Button asChild className="w-full button-primary">
                <Link to="/kontaktai?type=KONSULTACIJA" onClick={() => setMobileMenuOpen(false)}>
                  Konsultuotis
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
