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
