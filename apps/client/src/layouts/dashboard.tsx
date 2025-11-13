import HeaderNavigation from "@/components/navigation/header-nav";
import SidebarNavigation from "@/components/sidebar/sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="w-full h-screen flex gap-5 px-2">
      <SidebarNavigation />
      <div className="flex flex-col w-full gap-6">
        <HeaderNavigation />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
