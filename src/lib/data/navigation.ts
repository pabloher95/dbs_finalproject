import type { Route } from "next";

export const appNav = [
  {
    href: "/import" as Route,
    label: "Data intake",
    description: "Versioned CSV templates and validation preview."
  },
  {
    href: "/products" as Route,
    label: "Products",
    description: "Review products, yields, and material bills."
  },
  {
    href: "/contacts" as Route,
    label: "Contacts",
    description: "Keep customer and supplier details close to daily work."
  },
  {
    href: "/orders" as Route,
    label: "Orders",
    description: "Open demand by order and product."
  },
  {
    href: "/purchasing" as Route,
    label: "Purchasing",
    description: "Material plan generated from open orders."
  }
] as const;
