import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import StocksPage from "../../components/StocksPage";
import "../../../src/index.css"; // <-- this line is required!

export default function ViewStocks() {
return (
<DashboardLayout>
<StocksPage isAdmin={false} />
</DashboardLayout>
);
}