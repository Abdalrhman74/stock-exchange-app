import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import StocksPage from "../../components/StocksPage";
export default function ManageStocks() {
return (
<DashboardLayout>
<StocksPage isAdmin={true} />
</DashboardLayout>
);
}