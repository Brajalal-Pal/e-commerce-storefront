interface ISalesData {
  index: number;
  orderId: string;
  date: string;
  status: string;
  fulfilment: string;
  salesChannel: string;
  shipServiceLevel: string;
  style: string;
  sku: string;
  category: string;
  size: string;
  asin: string;
  courierStatus: string;
  qty: string;
  currency: string;
  amount: string;
  shipCity: string;
  shipState: string;
  shipPostalCode: number;
  shipCountry: string;
  promotionIds: string;
  b2b: boolean;
  fulfilledBy: string;
}

interface IDailySaleData {
  date: string;
  transactions: number;
  totalRevenue: number;
  averageOrderValue: number;
}

interface IMonthlySalesSummary {
  month: string;
  totalTransactions: number;
  totalRevenue: number;
}

export { IDailySaleData, ISalesData, IMonthlySalesSummary };
