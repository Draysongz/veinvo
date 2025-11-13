import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/auth/login";
import DashboardLayout from "./layouts/dashboard";
import DashBoard from "./pages/dashboard/dashboard";


const router = createBrowserRouter([
  { path: "login", element: <LoginPage /> },
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { path: "dashboard", element: <DashBoard/> },
      { path: "invoices", element: <div>Invoice</div> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
