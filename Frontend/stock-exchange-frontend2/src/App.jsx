import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageStocks from "./pages/admin/ManageStocks";
import ManageExchanges from "./pages/admin/ManageExchanges";
import UserDashboard from "./pages/user/UserDashboard";
import ViewStocks from "./pages/user/ViewStocks";
import ViewExchanges from "./pages/user/ViewExchanges";
import AdminRegister from "./pages/auth/AdminRegister";

import "./index.css"
export default function App() {
return (
<BrowserRouter>
<Routes>
<Route path="/login" element={<LoginPage />} />
<Route path="/register" element={<RegisterPage />} />
{/* Admin Routes */}
<Route
path="/admin"
element={
<ProtectedRoute allowedRoles={["ADMIN", "ROLE_ADMIN"]}>
<AdminDashboard />
</ProtectedRoute>
}
/>
<Route
path="/admin/stocks"
element={
<ProtectedRoute allowedRoles={["ADMIN", "ROLE_ADMIN"]}>
<ManageStocks />
</ProtectedRoute>
}
/>
<Route
path="/admin/exchanges"
element={
<ProtectedRoute allowedRoles={["ADMIN", "ROLE_ADMIN"]}>
<ManageExchanges />
</ProtectedRoute>
}
/>
{/* User Routes */}
<Route
path="/user"
element={
<ProtectedRoute allowedRoles={["USER", "ROLE_USER", "ADMIN",
"ROLE_ADMIN"]}>
<UserDashboard />
</ProtectedRoute>
}
/>
<Route
path="/user/stocks"
element={
<ProtectedRoute allowedRoles={["USER", "ROLE_USER", "ADMIN",
"ROLE_ADMIN"]}>
<ViewStocks />
</ProtectedRoute>
}
/>
<Route
path="/user/exchanges"
element={
<ProtectedRoute allowedRoles={["USER", "ROLE_USER", "ADMIN",
"ROLE_ADMIN"]}>
<ViewExchanges />
</ProtectedRoute>
}
/>
<Route
  path="/admin/register"
  element={
    <ProtectedRoute allowedRoles={["ADMIN", "ROLE_ADMIN"]}>
      <AdminRegister />
    </ProtectedRoute>
  }
/>

<Route path="*" element={<LoginPage />} />
</Routes>
</BrowserRouter>
);
}