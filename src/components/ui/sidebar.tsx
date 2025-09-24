// Per-eksportuojame tik sidebar komponentus ir hook'us iš modulio struktūros
// Tai išlaiko API suderinamumą su importais iš "./ui/sidebar"
export {
  // Core komponentai
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  // Meniu komponentai
  SidebarGroupLabel,
  SidebarHeader,
  // Turinys
  SidebarInput,
  SidebarInset,
  SidebarLink,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  // Teikėjas ir kontekstas
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "./sidebar/index";
