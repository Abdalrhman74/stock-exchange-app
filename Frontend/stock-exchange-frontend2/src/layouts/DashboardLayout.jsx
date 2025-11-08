import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ children }) {
return (
<div className="min-h-screen flex flex-col bg-gray-100">
<Navbar />
<div className="flex flex-1">
<Sidebar />
<main className="flex-1 p-6 overflow-y-auto">{children}</main>
</div>
</div>
);
}
