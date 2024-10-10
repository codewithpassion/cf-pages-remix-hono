import React, {
  ForwardRefExoticComponent,
  RefAttributes,
  useEffect,
} from "react";
import { Outlet, Link, NavLink, useLocation } from "react-router-dom";
import {
  CircleUser,
  Menu,
  Package2,
  MicVocal,
  LucideProps,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { router } from "@/routes";
import { APP_NAME } from "@/data/constants";
import { SearchBox } from "./search-box";
import { useAuth } from "./AuthProvider";

type IconType = ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
>;

function NavigationItems({
  className,
}: {
  className: (isActive: boolean) => string;
}) {
  const location = useLocation();
  const navigationItems = router?.routes[0].children?.filter(
    (route) => route.handle
  );

  return navigationItems?.map((route) => {
    const Icon = route.handle?.icon as IconType; // iconMapping[route.handle.icon as keyof typeof iconMapping];
    const isActive =
      location.pathname === route.path ||
      (route.index && location.pathname === "/");
    return (
      <NavLink
        key={route.path || "index"}
        to={route.path || "/"}
        className={className(isActive || false)}
      >
        <Icon className="h-4 w-4" />
        {route.handle.label}
        {route.handle.badge && (
          <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
            {route.handle.badge}
          </Badge>
        )}
      </NavLink>
    );
  });
}
export function DashboardLayout() {
  const { isAuthenticated, loading, gotoLogin } = useAuth();
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
              <Outlet />
            </main>
          </div>
        </>
      )}
    </div>
  );
}

export function Sidebar() {
  const { refreshToken } = useAuth();
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <MicVocal className="h-6 w-6" />
            <span className="">{APP_NAME}</span>
          </Link>
          {/* <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button> */}
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
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={refreshToken}
          >
            refresh token
          </Button>
          {/* <Card>
            <CardHeader className="p-2 pt-0 md:p-4">
              <CardTitle>Upgrade to Pro</CardTitle>
              <CardDescription>
                Unlock all features and get unlimited access to our support
                team.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
              <Button size="sm" className="w-full">
                Upgrade
              </Button>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const { logout, authenticatedUser } = useAuth();
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
          {/* <div className="mt-auto">
            <Card>
              <CardHeader>
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support
                  team.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="sm" className="w-full">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div> */}
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        <SearchBox />
      </div>
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
            {authenticatedUser?.email || "unknown"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {/* <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator /> */}
          <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
