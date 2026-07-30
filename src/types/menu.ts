// ============================================================
// WordPress Menu Types (WPGraphQL)
// ============================================================

export interface MenuItem {
  id: string;
  databaseId: number;
  label: string;
  url: string;
  target: string;
  title: string;
  cssClasses: string[];
  parentId: string | null;
  childItems?: {
    nodes: MenuItem[];
  };
  connectedNode?: {
    node: {
      slug?: string;
      uri?: string;
    };
  };
}

export interface Menu {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  locations: string[];
  menuItems: {
    nodes: MenuItem[];
  };
}

export interface NavigationMenu {
  primary: MenuItem[];
  footer: MenuItem[];
  mobile: MenuItem[];
}

// Hierarchical menu item (after building tree)
export interface NavItem {
  id: string;
  label: string;
  url: string;
  slug?: string;
  children?: NavItem[];
  cssClasses?: string[];
  megaMenu?: boolean;
}
