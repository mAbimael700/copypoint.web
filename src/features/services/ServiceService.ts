import { PageResponse } from "@/api/HttpResponse.type";
import ApiHttpClient from "@/config/ApiHttpClient";
import { Service, ServiceCreationDTO } from "./Service.type";

class ServiceService {
    private static instance: ServiceService;

    private constructor() { }

    public static getInstance(): ServiceService {
        if (!ServiceService.instance) {
            ServiceService.instance = new ServiceService();
        }
        return ServiceService.instance;
    }

    private getEndpoint(storeId: number | string): string {
        return `/stores/${storeId}/services`;
    }

    async getAll(storeId: number | string, accessToken: string): Promise<PageResponse<Service>> {
        const response = await ApiHttpClient.get<PageResponse<Service>>(
            this.getEndpoint(storeId),
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data;
    }

    async create(
        storeId: number | string,
        accessToken: string,
        data: ServiceCreationDTO
    ): Promise<Service> {
        const response = await ApiHttpClient.post<Service>(
            this.getEndpoint(storeId),
            data,
            { headers: { Authorization: `Bearer ${accessToken}` }, }
        );
        return response.data;
    }
}

export default ServiceService.getInstance();
