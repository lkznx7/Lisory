import { api } from "@/lib/api";
import { ShippingOption, FreightCalculationRequest } from "@/types";

export const shippingService = {
  async calculateFreight(request: FreightCalculationRequest): Promise<ShippingOption[]> {
    const response = await api.post<{ options: ShippingOption[] }>("/api/shipping/calculate", request);
    return response.options;
  },

  async getShipmentByOrder(orderId: string) {
    return api.get(`/api/shipments/order/${orderId}`);
  },
};
