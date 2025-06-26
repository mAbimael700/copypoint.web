

import { PageResponse } from "@/api/HttpResponse.type";
import ApiClient from "@/config/ApiHttpClient";
import { PaymentMethod } from "../PaymentMethod.type";

class PaymentMethodService {
    private static instance: PaymentMethodService;
    private readonly endpoint = '/payment-methods'

    private constructor() { }

    public static getInstance(): PaymentMethodService {
        if (!PaymentMethodService.instance) {
            PaymentMethodService.instance = new PaymentMethodService();
        }
        return PaymentMethodService.instance;
    }


    async getAll(): Promise<PageResponse<PaymentMethod>> {
        const response = await ApiClient.get<PageResponse<PaymentMethod>>(this.endpoint);
        return response.data;
    }

}

export default PaymentMethodService.getInstance();
