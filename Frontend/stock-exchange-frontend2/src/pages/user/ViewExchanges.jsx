import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import ExchangesPage from "../../components/ExchangesPage";
import "../../../src/index.css"; // <-- this line is required!

export default function ViewExchanges() {
return (
<DashboardLayout>
<ExchangesPage isAdmin={false} />
</DashboardLayout>
);
}