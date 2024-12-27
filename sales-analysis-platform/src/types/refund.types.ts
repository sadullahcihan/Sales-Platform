export interface RefundRateRequest {
    marketplace?: string;
    sellerId?: string;
    skuList: string[];
    requestedDay: number;
  }
  
  export interface RefundRateResponse {
    ApiStatus: boolean;
    ApiStatusCode: number;
    ApiStatusMessage: string;
    Data: {
      sku: string;
      refundAmount: number;
      refundQuantity: number;
      refundRate: number;
      totalOrderCount: number;
    }[];
  }