import type { Route } from "next";

export type NavItem = {
  href: Route;
  label: string;
  description: string;
};

export const appNav: NavItem[] = [
  {
    href: "/" as Route,
    label: "Home",
    description: "Operations overview and the next step."
  },
  {
    href: "/import" as Route,
    label: "Intake",
    description: "Versioned CSV templates with preview."
  },
  {
    href: "/products" as Route,
    label: "Catalog",
    description: "Products, yields, and material formulas."
  },
  {
    href: "/contacts" as Route,
    label: "Contacts",
    description: "Customers and supplier sources."
  },
  {
    href: "/orders" as Route,
    label: "Orders",
    description: "Open demand and the production queue."
  },
  {
    href: "/purchasing" as Route,
    label: "Purchasing",
    description: "Material plan from open demand."
  }
];
