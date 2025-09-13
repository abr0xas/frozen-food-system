export interface NavigationItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
  children?: NavigationItem[];
}

export interface UserInfo {
  email: string;
  role: string;
}

export interface LayoutState {
  sidebarOpen: boolean;
  isMobile: boolean;
  currentTheme: 'light' | 'dark' | 'auto';
  user: UserInfo | null;
  isAuthenticated: boolean;
}
