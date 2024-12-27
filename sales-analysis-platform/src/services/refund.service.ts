import api from "./api";
import type {
  RefundRateRequest,
  RefundRateResponse,
} from "@/types/refund.types";

export const refundService = {
  async getSkuRefundRate(
    params: RefundRateRequest
  ): Promise<RefundRateResponse> {
    const { data } = await api.post("/data/get-sku-refund-rate", params);
    return data;
  },
};
