import { PageResponse } from "@/api/HttpResponse.type";
import ApiHttpClient from "@/config/ApiHttpClient";
import { CopypointResponse, CopypointCreationDTO } from "./Copypoint.type";

class CopypointService {
    private static instance: CopypointService;
    private static readonly endpoint: "/copypoints"
    private constructor() { }

    public static getInstance(): CopypointService {
        if (!CopypointService.instance) {
            CopypointService.instance = new CopypointService();
        }
        return CopypointService.instance;
    }


    async getAllByStore(storeId: number | string, accessToken: string): Promise<PageResponse<CopypointResponse>> {
        const response = await ApiHttpClient.get<PageResponse<CopypointResponse>>(
            `/stores/${storeId}/copypoints`,
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
            `/stores/${storeId}/copypoints`,
            data,
            { headers: { Authorization: `Bearer ${accessToken}` }, }
        );
        return response.data;
    }

}

export default CopypointService.getInstance();
