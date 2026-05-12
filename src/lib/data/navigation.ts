import type { Route } from "next";

export type NavItem = {
  href: Route;
  label: string;
  description: string;
};

export const appNav: NavItem[] = [
  {
    href: "/dashboard" as Route,
    label: "Studio",
    description: "Current operating and sales signals."
  },
  {
    href: "/import" as Route,
    label: "Intake",
    description: "Create products with formulas."
  },
  {
    href: "/products" as Route,
    label: "Catalog",
    description: "Maintain products and their formulas."
  },
  {
    href: "/contacts" as Route,
    label: "Contacts",
    description: "Customers and suppliers."
  },
  {
    href: "/orders" as Route,
    label: "Orders",
    description: "Open orders and line items."
  },
  {
    href: "/purchasing" as Route,
    label: "Purchasing",
    description: "Buy list from open demand."
  }
];
