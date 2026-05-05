"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/lib/data/navigation";

function isItemActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarNav({ items }: Readonly<{ items: NavItem[] }>) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1.5">
      {items.map((item, index) => {
        const active = isItemActive(pathname, item.href);
        return (
          <Link key={item.href} href={item.href} data-active={active} className="nav-row">
            <span className="nav-index">{String(index + 1).padStart(2, "0")}</span>
            <div className="min-w-0 flex-1">
              <span className="block font-display text-xl leading-[1.05] tracking-tight text-inherit">{item.label}</span>
              <p className="mt-1 text-[0.78rem] leading-5 opacity-70">{item.description}</p>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
