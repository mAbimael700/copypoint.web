import { PageResponse } from "@/api/HttpResponse.type";
import ApiHttpClient from "@/config/ApiHttpClient";
import { CopypointResponse, CopypointCreationDTO } from "./Copypoint.type";

class CopypointService {
    private static instance: CopypointService;

    private constructor() { }

    public static getInstance(): CopypointService {
        if (!CopypointService.instance) {
            CopypointService.instance = new CopypointService();
        }
        return CopypointService.instance;
    }

    private getEndpoint(storeId: number | string): string {
        return `/stores/${storeId}/copypoints`;
    }

    async getAll(storeId: number | string, accessToken: string): Promise<PageResponse<CopypointResponse>> {
        const response = await ApiHttpClient.get<PageResponse<CopypointResponse>>(
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
        data: CopypointCreationDTO
    ): Promise<CopypointResponse> {
        const response = await ApiHttpClient.post<CopypointResponse>(
            this.getEndpoint(storeId),
            data,
            { headers: { Authorization: `Bearer ${accessToken}` }, }
        );
        return response.data;
    }
}

export default CopypointService.getInstance();
