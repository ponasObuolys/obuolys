import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  User,
  LogOut,
  Settings,
  Heart,
  ChevronDown,
  Youtube,
  Briefcase,
  Calculator,
  BookOpen,
  Phone,
  LayoutGrid,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { GlobalSearch } from "@/components/search/global-search";
import { useAuth } from "@/context/AuthContext";
import { useUnreadMessages } from "@/hooks/use-unread-messages";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileData, setProfileData] = useState<{ username?: string; avatarUrl?: string } | null>(
    null
  );
  const [isBusinessOpen, setIsBusinessOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
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
    { to: "/publikacijos", label: "Publikacijos", icon: BookOpen },
    { to: "/youtube", label: "YouTube", icon: Youtube },
    { to: "/kursai", label: "Kursai", icon: LayoutGrid },
    { to: "/verslo-sprendimai", label: "Verslo Sprendimai", primary: true, icon: Briefcase },
    { to: "/skaiciuokle", label: "Skaičiuoklė", highlight: true, icon: Calculator },
    { to: "/kontaktai", label: "Kontaktai", icon: Phone },
  ];

  const isActive = (to: string) => location.pathname === to;

  return (
    <header className="border-b border-border sticky top-0 z-50 w-full backdrop-blur-xl bg-background/80">
      <div className="container mx-auto py-3 px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="xl:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Atidaryti meniu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0 flex flex-col h-full">
                <SheetHeader className="p-4 border-b text-left">
                  <SheetTitle className="flex items-center gap-2">
                    <img
                      src="/obuolys-logo.png"
                      alt="ponas Obuolys logo"
                      className="w-8 h-8 object-contain"
                    />
                    <span>ponas Obuolys</span>
                  </SheetTitle>
                </SheetHeader>
                <ScrollArea className="flex-1">
                  <div className="flex flex-col gap-2 p-4">
                    <div className="pb-2">
                      <GlobalSearch
                        trigger={
                          <Button
                            variant="outline"
                            className="w-full justify-start text-muted-foreground hover:text-foreground"
                          >
                            <Search className="mr-2 h-4 w-4" />
                            Ieškoti...
                          </Button>
                        }
                      />
                    </div>
                    {navLinks.map(({ to, label, highlight, primary, icon: Icon }) => {
                      if (primary) {
                        return (
                          <Collapsible
                            key={to}
                            open={isBusinessOpen}
                            onOpenChange={setIsBusinessOpen}
                            className="w-full"
                          >
                            <CollapsibleTrigger asChild>
                              <Button
                                variant="ghost"
                                className="w-full justify-between font-semibold"
                              >
                                <span className="flex items-center gap-2">
                                  <Icon className="h-4 w-4" />
                                  {label}
                                </span>
                                <ChevronDown
                                  className={`h-4 w-4 transition-transform duration-200 ${
                                    isBusinessOpen ? "rotate-180" : ""
                                  }`}
                                />
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-1 pt-1 pl-4">
                              <Button
                                variant="ghost"
                                className="w-full justify-start text-muted-foreground hover:text-foreground"
                                onClick={() => {
                                  setMobileMenuOpen(false);
                                  navigate("/verslo-sprendimai");
                                }}
                              >
                                Pagrindinis
                              </Button>
                              <Button
                                variant="ghost"
                                className="w-full justify-start text-muted-foreground hover:text-foreground"
                                onClick={() => {
                                  setMobileMenuOpen(false);
                                  navigate("/verslo-sprendimai#portfolio");
                                  setTimeout(() => {
                                    document
                                      .getElementById("portfolio")
                                      ?.scrollIntoView({ behavior: "smooth" });
                                  }, 300);
                                }}
                              >
                                Portfolio
                              </Button>
                              <Button
                                variant="ghost"
                                className="w-full justify-start text-muted-foreground hover:text-foreground"
                                onClick={() => {
                                  setMobileMenuOpen(false);
                                  navigate("/verslo-sprendimai#tech-stack");
                                  setTimeout(() => {
                                    document
                                      .getElementById("tech-stack")
                                      ?.scrollIntoView({ behavior: "smooth" });
                                  }, 300);
                                }}
                              >
                                Tech Stack
                              </Button>
                            </CollapsibleContent>
                          </Collapsible>
                        );
                      }

                      return (
                        <Button
                          key={to}
                          variant={isActive(to) ? "secondary" : "ghost"}
                          className={`w-full justify-start ${
                            highlight ? "text-primary font-semibold" : ""
                          }`}
                          asChild
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Link to={to} className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            <span>{label}</span>
                            {to === "/kontaktai" && isAdmin && unreadCount > 0 && (
                              <Badge
                                variant="destructive"
                                className="ml-auto h-5 min-w-5 flex items-center justify-center px-1.5 text-xs"
                              >
                                {unreadCount}
                              </Badge>
                            )}
                          </Link>
                        </Button>
                      );
                    })}
                  </div>

                  <div className="px-4 py-2">
                    <div className="h-px bg-border my-2" />
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Tema</span>
                        <ThemeToggle />
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground px-2">
                          Paremti projektą
                        </p>
                        <Button variant="outline" className="w-full justify-start gap-2" asChild>
                          <a
                            href="https://www.youtube.com/@ponasObuolys/join"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Youtube className="h-4 w-4 text-red-600" />
                            YouTube Members
                          </a>
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-2" asChild>
                          <a
                            href="https://www.patreon.com/ponasObuolys"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Heart className="h-4 w-4 text-pink-600" />
                            Patreon
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </ScrollArea>

                <div className="border-t p-4 bg-muted/40">
                  {user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start gap-2 px-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={profileData?.avatarUrl || ""}
                              alt={profileData?.username || "User"}
                            />
                            <AvatarFallback>
                              {profileData?.username?.charAt(0).toUpperCase() || (
                                <User className="h-4 w-4" />
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col items-start text-sm">
                            <span className="font-medium">
                              {profileData?.username || "Vartotojas"}
                            </span>
                            <span className="text-xs text-muted-foreground">Tvarkyti profilį</span>
                          </div>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
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
                                <Badge
                                  variant="destructive"
                                  className="ml-2 h-5 min-w-5 flex items-center justify-center px-1.5"
                                >
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
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" asChild>
                        <Link to="/auth">Prisijungti</Link>
                      </Button>
                      <Button className="button-primary" asChild>
                        <Link to="/kontaktai?type=KONSULTACIJA">Konsultuotis</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <Link to="/" className="flex items-center space-x-3">
              <img
                src="/obuolys-logo.png"
                alt="ponas Obuolys logo"
                className="w-9 h-9 object-contain"
              />
              <span className="text-foreground font-bold text-lg xl:text-xl hidden sm:inline-block">
                ponas Obuolys
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navLinks.map(({ to, label, highlight }) => {
              // Regular links (including Verslo Sprendimai on desktop)
              return (
                <Button
                  key={to}
                  variant="ghost"
                  asChild
                  className={
                    highlight
                      ? "text-primary font-semibold hover:text-primary/80 hover:bg-primary/10"
                      : isActive(to)
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground/60 hover:text-foreground"
                  }
                >
                  <Link to={to}>
                    {label}
                    {to === "/kontaktai" && isAdmin && unreadCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="ml-2 h-5 min-w-5 flex items-center justify-center px-1.5 text-xs"
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </Link>
                </Button>
              );
            })}
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Global search */}
            <GlobalSearch />

            {/* Theme toggle */}
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            {/* Paremti mygtukas */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="default"
                  size="sm"
                  className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  <Heart className="h-3.5 w-3.5" />
                  <span className="text-sm">Paremti</span>
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
                    <Youtube className="h-4 w-4 text-red-600" />
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
                    <Heart className="h-4 w-4 text-pink-600" />
                    <span>Patreon</span>
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hidden sm:flex rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={profileData?.avatarUrl || ""}
                        alt={profileData?.username || "User"}
                      />
                      <AvatarFallback>
                        {profileData?.username?.charAt(0).toUpperCase() || (
                          <User className="h-4 w-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
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
                          <Badge
                            variant="destructive"
                            className="ml-2 h-5 min-w-5 flex items-center justify-center px-1.5"
                          >
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
              <div className="hidden sm:flex items-center gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link to="/auth" className="text-sm">
                    Prisijungti
                  </Link>
                </Button>
                <Button asChild size="sm" className="button-primary text-sm">
                  <Link to="/kontaktai?type=KONSULTACIJA">Konsultuotis</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
