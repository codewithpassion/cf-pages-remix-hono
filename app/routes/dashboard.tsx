import { Outlet } from "@remix-run/react";
import { DashboardLayout } from "~/components/dashboard/dashboard.layout";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
