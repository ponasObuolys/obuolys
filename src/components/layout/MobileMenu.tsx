import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Settings, Heart, ChevronDown, Youtube, Search, Menu, User } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { GlobalSearch } from "@/components/search/global-search";
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

interface NavLink {
  to: string;
  label: string;
  icon: LucideIcon;
  primary?: boolean;
  highlight?: boolean;
}

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileData: { username?: string; avatarUrl?: string } | null;
  user: SupabaseUser | null;

  isAdmin: boolean;

  signOut: () => Promise<void>;
  unreadCount: number;
  navLinks: NavLink[];
}

export function MobileMenu({
  open,
  onOpenChange,
  profileData,
  user,
  isAdmin,
  signOut,
  unreadCount,
  navLinks,
}: MobileMenuProps) {
  const [isBusinessOpen, setIsBusinessOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (to: string) => location.pathname === to;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
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
                      <Button variant="ghost" className="w-full justify-between font-semibold">
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
                          onOpenChange(false);
                          navigate("/verslo-sprendimai");
                        }}
                      >
                        Pagrindinis
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          onOpenChange(false);
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
                          onOpenChange(false);
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
                  onClick={() => onOpenChange(false)}
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
                <p className="text-sm font-medium text-muted-foreground px-2">Paremti projektą</p>
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
                    <span className="font-medium">{profileData?.username || "Vartotojas"}</span>
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
  );
}
