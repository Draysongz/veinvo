import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/auth/login";
import DashboardLayout from "./layouts/dashboard";


const router = createBrowserRouter([
  { path: "login", element: <LoginPage /> },
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { path: "dashboard", element: <div>dashboard</div> },
      { path: "invoices", element: <div>Invoice</div> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
