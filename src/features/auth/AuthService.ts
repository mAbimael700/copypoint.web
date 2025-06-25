import { LoginCredentials } from "./LoginCredentials.type";
import { AuthUser } from "@/features/auth/AuthUser.type";
import ApiClient from "@/config/ConfigAPI";
import { SignInResponse } from "./sign-in/SignInResponse";

export default class AuthService {
    private static readonly endpoint = '/auth'

    static async login(credentials: LoginCredentials) {
        try {
            const response = await ApiClient.post<SignInResponse>(`${this.endpoint}/login`, credentials);
            return response.data
        } catch (error) {
            console.error('Error en login:', error);
            throw new Error('Error al iniciar sesión. Verifica tus credenciales.');
        }
    }

    /**
   * Obtiene el perfil del usuario autenticado
   */
    static async getUserProfile(accessToken: string): Promise<AuthUser> {
        try {
            const response = await ApiClient.get<AuthUser>(`${this.endpoint}/my-profile`,
                { headers: { 'Authorization': `Bearer ${accessToken}` } });

            return response.data;

        } catch (error: any) {
            console.error('Error obteniendo perfil:', error);

            if (error.response?.status === 401) {
                throw new Error('Token inválido o expirado');
            }
            if (error.response?.status === 403) {
                throw new Error('No tienes permisos para acceder a esta información');
            }

            throw new Error('Error al obtener el perfil del usuario');
        }
    }

    /**
    * Cierra la sesión del usuario
    */
    static async logout(accessToken: string): Promise<void> {
        try {
            await ApiClient.post(
                `${this.endpoint}/logout`, {},
                { headers: { 'Authorization': `Bearer ${accessToken}` } });

        } catch (error) {
            // No lanzamos error aquí porque el logout local debe funcionar
            // incluso si el logout del servidor falla
            console.warn('Error en logout del servidor:', error);
        }
    }

}