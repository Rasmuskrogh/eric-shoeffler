export interface NavItem {
  label: string;
  href: string;
}

export interface NavbarProps {
  type: "blue" | "red" | "white";
  items: NavItem[];
  show: boolean;
  onItemClick?: () => void;
}

export interface RequestButtonProps {
  active: boolean;
  pathname: string;
  onRequest: () => void;
  onBack: () => void;
}

export interface Event {
  id: string;
  title: string;
  location: string;
  time: string;
  description?: string;
  startDate: {
    day: number;
    month: string;
    year: number;
  };
  endDate?: {
    day: number;
    month: string;
    year: number;
  };
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
}

export interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  bytes: number;
  width: number;
  height: number;
  context?: {
    alt?: string;
  };
}

export interface ActiveContextType {
  active: boolean;
  setActive: (active: boolean) => void;
}

export interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export interface MobileMenuProps {
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  items: NavItem[];
}
