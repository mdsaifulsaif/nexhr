import { ReactNode } from "react";

export interface SubItem {
  name: string;
  icon: ReactNode;
  link: string;
}

export interface NavItem {
  name: string;
  icon: ReactNode;
  link?: string;
  subItems?: SubItem[];
  roles?: string[];
}