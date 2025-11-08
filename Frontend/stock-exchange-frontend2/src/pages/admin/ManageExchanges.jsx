import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import ExchangesPage from "../../components/ExchangesPage";
export default function ManageExchanges() {
return (
<DashboardLayout>
<ExchangesPage isAdmin={true} />
</DashboardLayout>
);
}