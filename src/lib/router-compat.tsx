"use client";

/**
 * Router Compatibility Layer
 * 
 * Maps react-router-dom APIs to Next.js equivalents.
 * This allows existing components to work with minimal changes —
 * just update the import path from 'react-router-dom' to '@/lib/router-compat'.
 */

import NextLink from "next/link";
import { usePathname, useRouter, useParams as useNextParams } from "next/navigation";
import React, { forwardRef, createContext, useContext } from "react";

// ─── Link ────────────────────────────────────────────────────
// react-router-dom's Link uses `to` prop, Next.js uses `href`
interface LinkProps extends Omit<React.ComponentProps<typeof NextLink>, "href"> {
  to?: string;
  href?: React.ComponentProps<typeof NextLink>["href"];
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  function LinkCompat({ to, href, ...props }, ref) {
    const resolvedHref = to || href || "/";
    return <NextLink ref={ref} href={resolvedHref} {...props} />;
  }
);

// ─── NavLink ─────────────────────────────────────────────────
// react-router-dom's NavLink passes `isActive` to className function
interface NavLinkProps extends Omit<React.ComponentProps<typeof NextLink>, "className" | "href" | "children"> {
  to?: string;
  href?: React.ComponentProps<typeof NextLink>["href"];
  end?: boolean;
  className?: string | ((props: { isActive: boolean }) => string);
  children?: React.ReactNode | ((props: { isActive: boolean }) => React.ReactNode);
}

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  function NavLinkCompat({ to, href, end, className, children, ...props }, ref) {
    const pathname = usePathname();
    const resolvedHref = to || href || "/";
    const resolvedPath = typeof resolvedHref === "string" ? resolvedHref : "/";

    const isActive = end
      ? pathname === resolvedPath
      : pathname.startsWith(resolvedPath);

    const computedClassName =
      typeof className === "function" ? className({ isActive }) : className;

    const computedChildren =
      typeof children === "function" ? children({ isActive }) : children;

    return (
      <NextLink
        ref={ref}
        href={resolvedPath}
        className={computedClassName}
        {...props}
      >
        {computedChildren}
      </NextLink>
    );
  }
);

// ─── Outlet ──────────────────────────────────────────────────
// In Next.js App Router, `children` replaces Outlet
const OutletContext = createContext<React.ReactNode>(null);

export function OutletProvider({ children, content }: { children: React.ReactNode; content: React.ReactNode }) {
  return <OutletContext.Provider value={content}>{children}</OutletContext.Provider>;
}

export function Outlet() {
  const content = useContext(OutletContext);
  return <>{content}</>;
}

// ─── Hooks ───────────────────────────────────────────────────
export function useLocation() {
  const pathname = usePathname();
  return { pathname, search: "", hash: "", state: null, key: "default" };
}

export function useNavigate() {
  const router = useRouter();
  return (to: string | number) => {
    if (typeof to === "number") {
      if (to === -1) router.back();
      else router.forward();
    } else {
      router.push(to);
    }
  };
}

export function useParams<T extends Record<string, string | undefined> = Record<string, string | undefined>>(): T {
  const params = useNextParams();
  if (!params) return {} as T;
  const result: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(params)) {
    result[key] = Array.isArray(value) ? value[0] : value;
  }
  return result as T;
}
