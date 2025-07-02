import { PageResponse } from "@/api/HttpResponse.type";
import ApiHttpClient from "@/config/ApiHttpClient";
import { StoreCreationDTO, StoreResponse } from "./Store.type";
import { Service, ServiceCreationDTO } from "../services/Service.type";

class StoreService {
    private static instance: StoreService;
    private readonly endpoint = '/stores'

    private constructor() { }

    public static getInstance(): StoreService {
        if (!StoreService.instance) {
            StoreService.instance = new StoreService();
        }
        return StoreService.instance;
    }

    async getAll(accessToken: string): Promise<PageResponse<StoreResponse>> {
        const response = await ApiHttpClient.get<PageResponse<StoreResponse>>(this.endpoint,
            { headers: { 'Authorization': `Bearer ${accessToken}` } }
        );
        return response.data;
    }

    async create(accessToken: string, data: StoreCreationDTO) {
        const response = await ApiHttpClient.post<StoreResponse>(this.endpoint,
            data,
            { headers: { 'Authorization': `Bearer ${accessToken}` } }
        );
        return response.data;
    }


    async getServicesAll(storeId: number | string, accessToken: string): Promise<PageResponse<Service>> {
        const response = await ApiHttpClient.get<PageResponse<Service>>(
            `${this.endpoint}/${storeId}/services`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data;
    }

    async createServices(
        storeId: number | string,
        accessToken: string,
        data: ServiceCreationDTO
    ): Promise<Service> {
        const response = await ApiHttpClient.post<Service>(
            `${this.endpoint}/${storeId}/services`,
            data,
            { headers: { Authorization: `Bearer ${accessToken}` }, }
        );
        return response.data;
    }
}

export default StoreService.getInstance();