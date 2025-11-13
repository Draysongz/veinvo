import Sidebar from '@/components/sidebar/sidebar';
import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div className='w-full h-screen flex gap-5 px-2'>
      <Sidebar/>
      <main>
        <Outlet />
      </main>
    </div>
  );
}