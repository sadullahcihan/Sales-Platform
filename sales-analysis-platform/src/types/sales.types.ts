export interface ChartDataPoint {
  date: string;
  totalSales: number;
  shipping: number;
  profit: number;
  fbaSales: number;
  fbmSales: number;
}

export interface SalesOverviewRequest {
  marketplace: string;
  sellerId: string;
  requestStatus: number;
  day: number;
  excludeYoYData: boolean;
}

export interface SalesApiResponse {
  ApiStatus: boolean;
  ApiStatusCode: number;
  ApiStatusMessage: string;
  Data: {
    item: Array<{
      date: string;
      fbaAmount: number;
      fbmAmount: number;
      fbaShippingAmount: number;
      profit: number;
    }>;
  };
}

export interface SalesState {
  dailySalesOverview: SalesApiResponse['Data'] | null;
  isLoading: boolean;
  error: string | null;
}

export interface SkuListRequest {
  marketplace?: string;
  sellerId?: string;
  salesDate: string;
  salesDate2: string;
  pageSize: number;
  pageNumber: number;
  isDaysCompare: number;
}

export interface SkuItem {
  asin: string;
  sku: string;
  productName: string;
  qty: number;
  amount: number;
  shippingAmount: number;
  qty2: number;
  amount2: number;
  shippingAmount2: number;
  sortingAmount: number;
  imageUrl: string;
  refundPercantage: number;
}

export interface SkuListResponse {
  ApiStatus: boolean;
  ApiStatusCode: number;
  ApiStatusMessage: string;
  Data: {
    item: {
      selectedDate: string;
      totalSale: number;
      totalShippingAmount: number;
      skuList: SkuItem[];
    };
  };
}