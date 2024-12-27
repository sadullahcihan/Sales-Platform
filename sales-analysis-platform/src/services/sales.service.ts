import api from "./api";
import type {
  SalesOverviewRequest,
  SalesApiResponse,
} from "@/types/sales.types";

export const salesService = {
  async getDailySalesOverview(
    params: SalesOverviewRequest
  ): Promise<SalesApiResponse> {
    const { data } = await api.post("/data/daily-sales-overview", params);
    return data;
  },
};
