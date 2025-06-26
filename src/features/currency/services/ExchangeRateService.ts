
import { ExChangeRateCodesResponse, ExchangeRateLatestResponse } from "../http/ExchangeRate.type";
import ExchangeApiClient from "../http/ExchangeRateClient";

class ExchangeRateService {
    private static instance: ExchangeRateService;

    private constructor() { }

    public static getInstance(): ExchangeRateService {
        if (!ExchangeRateService.instance) {
            ExchangeRateService.instance = new ExchangeRateService();
        }
        return ExchangeRateService.instance;
    }


    async getAllCodes(): Promise<ExChangeRateCodesResponse> {
        const response = await ExchangeApiClient.get<ExChangeRateCodesResponse>("/codes");
        return response.data;
    }
    async getLastestByCurrency(currencyIso: string): Promise<ExchangeRateLatestResponse> {
        const response = await ExchangeApiClient.get<ExchangeRateLatestResponse>("/latest/" + currencyIso);
        return response.data;
    }

}

export default ExchangeRateService.getInstance();
