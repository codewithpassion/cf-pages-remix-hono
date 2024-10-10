import React, {
  ForwardRefExoticComponent,
  RefAttributes,
  useEffect,
} from "react";
import { Outlet, Link, NavLink, useLocation } from "@remix-run/react";
import {
  CircleUser,
  Menu,
  Package2,
  MicVocal,
  LucideProps,
  Moon,
  Sun,
} from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { APP_NAME } from "~/lib/data/constants";
import { SearchBox } from "./search-box";
import { useTheme } from "~/hooks/useTheme";
// import { useAuth } from "./AuthProvider";

type IconType = ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
>;

function NavigationItems({
  className,
}: {
  className: (isActive: boolean) => string;
}) {
  const location = useLocation();
  const navigationItems = [
    { path: "/dashboard", label: "Dashboard", icon: Package2 },
    // Add more navigation items as needed
  ];

  return navigationItems.map((item) => {
    const isActive = location.pathname === item.path;
    return (
      <NavLink
        key={item.path}
        to={item.path}
        className={className(isActive)}
      >
        <item.icon className="h-4 w-4" />
        {item.label}
      </NavLink>
    );
  });
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, gotoLogin } = { isAuthenticated: true, loading: false, gotoLogin: ()=> {}} //useAuth();
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      gotoLogin();
    }
  }, [gotoLogin, isAuthenticated, loading]);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {isAuthenticated && (
        <>
          <Sidebar />
          <div className="flex flex-col">
            <Header />
            <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
              {children}
            </main>
          </div>
        </>
      )}
    </div>
  );
}

export function Sidebar() {
  const { refreshToken } = { refreshToken: () => {} } //useAuth();
  const { theme } = useTheme();
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold text-black dark:text-white">
            <MicVocal className="h-6 w-6 "/>
            <span className="">{APP_NAME}</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <NavigationItems
              className={(isActive) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  isActive ? "bg-muted text-primary" : "text-muted-foreground"
                }`
              }
            />
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Button
            variant="default"
            size="sm"
            className="w-full color-secondary-foreground"
            onClick={refreshToken}
          >
            refresh token
          </Button>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const { logout, authenticatedUser } = { logout: () => {}, authenticatedUser: { email: 'unknown' } } //useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Link
              to="/"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Package2 className="h-6 w-6" />
              <span>{APP_NAME}</span>
            </Link>
            <NavigationItems
              className={(isActive) =>
                `mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`
              }
            />
          </nav>
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        <SearchBox />
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="mr-2"
      >
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" color="black" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="font-light">
            {authenticatedUser.email}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
