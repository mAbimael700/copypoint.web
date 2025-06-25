import { PageResponse } from "@/api/HttpResponse.type";
import ApiClient from "@/config/ConfigAPI";
import { StoreCreationDTO, StoreResponse } from "./Store.type";

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
        const response = await ApiClient.get<PageResponse<StoreResponse>>(this.endpoint,
            { headers: { 'Authorization': `Bearer ${accessToken}` } }
        );
        return response.data;
    }

    async create(accessToken: string, data: StoreCreationDTO) {
        const response = await ApiClient.post<StoreResponse>(this.endpoint,
            data,
            { headers: { 'Authorization': `Bearer ${accessToken}` } }
        );
        return response.data;
    }
}

export default StoreService.getInstance();