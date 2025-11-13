import HeaderNavigation from "@/components/navigation/header-nav";
import SidebarNavigation from "@/components/sidebar/sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="w-full h-screen flex gap-5 px-2 items-center">
      <SidebarNavigation />
      <div className="flex-1 h-screen flex flex-col gap-5">
        <HeaderNavigation />
        <main className="overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
