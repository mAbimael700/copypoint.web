import { PageResponse } from "@/api/HttpResponse.type";
import ApiClient from "@/config/ConfigAPI";
import { ProfileResponse, ProfileCreationDTO } from "../Profile.type";

class ProfileService {
    private static instance: ProfileService;

    private constructor() { }

    public static getInstance(): ProfileService {
        if (!ProfileService.instance) {
            ProfileService.instance = new ProfileService();
        }
        return ProfileService.instance;
    }

    private getEndpoint(storeId: number | string): string {
        return `/stores/${storeId}/profiles`;
    }

    async getAllByServiceId(storeId: number | string, serviceId: number | string, accessToken: string): Promise<PageResponse<ProfileResponse>> {
        const response = await ApiClient.get<PageResponse<ProfileResponse>>(
            this.getEndpoint(storeId) + "?serviceId=" + serviceId,
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
        data: ProfileCreationDTO
    ): Promise<ProfileResponse> {
        const response = await ApiClient.post<ProfileResponse>(
            this.getEndpoint(storeId),
            data,
            { headers: { Authorization: `Bearer ${accessToken}` }, }
        );
        return response.data;
    }
}

export default ProfileService.getInstance();
