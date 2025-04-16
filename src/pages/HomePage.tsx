import DailySalesChart from "@/components/DailySalesChart";
import MonthlySalesChart from "@/components/MonthlySalesChart";
import { useEffect, useState } from "react";

import {
  ISalesData,
  IDailySaleData,
  IMonthlySalesSummary,
} from "@/types/types";

export default function HomePage() {
  const [salesData, setSalesData] = useState<ISalesData[]>([]);
  const [dailySalesData, setDailySalesData] = useState<IDailySaleData[]>([]);

  useEffect(() => {
    fetch("/data/sales_data.json")
      .then((res) => res.json())
      .then((data) => {
        
        const sortedDataSet = data.sort((a: ISalesData, b: ISalesData) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA.getTime() - dateB.getTime();
        });

        setSalesData(sortedDataSet);
      });
  }, []);

  
  useEffect(() => {
    if (salesData.length <= 0) return;
  
    const data: IDailySaleData[] = [];
    let amount;
    let qantity;
    let revenue = 0;

    for (let i = 0; i < salesData.length; i++) {
      let r = data.filter((r) => r.date == salesData[i].date);

      if (salesData[i].amount.trim() === "") {
        amount = 0;
      } else {
        amount = parseFloat(salesData[i].amount);
      }

      if (salesData[i].qty.trim() === "") {
        qantity = 0;
      } else {
        qantity = parseFloat(salesData[i].qty);
      }
      revenue = qantity * amount;

      if (r.length === 0) {
        data.push({
          date: salesData[i].date,
          transactions: 1,
          totalRevenue: revenue,
          averageOrderValue: revenue,
        });
      } else {
        if (r && r.length > 0) {
          r[0].transactions = r[0].transactions + 1;
          r[0].totalRevenue += revenue;
          r[0].averageOrderValue += revenue / r[0].transactions;
        }
      }
    }

    setDailySalesData(data);
  }, [salesData]);

  
  const monthlyData = dailySalesData.reduce((acc, item) => {
    const date = new Date(item.date);
    const monthKey = `${date.getMonth() + 1}/${date.getFullYear()}`; 

    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthKey,
        totalTransactions: 0,
        totalRevenue: 0,
      };
    }

    acc[monthKey].totalTransactions += item.transactions;
    acc[monthKey].totalRevenue += item.totalRevenue;

    return acc;
  }, {} as Record<string, IMonthlySalesSummary>);
  
  const monthlySummary = Object.values(monthlyData);

  return (
    <div style={{ width: "90%", margin: "auto", marginTop: "20px"}}>
      <h1 style={{ color: "darkblue", padding: "10px 0" }}>Amazon Sales Report</h1>
      <div style={{ display : "flex", flexDirection: "column-reverse"}}>
        <div>
          <h2 style={{ color: "darkblue", padding: "10px 0", marginTop: "15px" }}>
            Daily Sales Report
          </h2>
          <DailySalesChart dailyData={dailySalesData} />
        </div>

        <div style={{border: "1px solid #ddd", paddingLeft: "30px", paddingBottom: "20px"}}>          
          <MonthlySalesChart data={monthlySummary} />
        </div>
      </div>
    </div>
  );
}
