import { useMutation } from '@tanstack/react-query';
import AuthService from '../AuthService';
import { UserCreationDto, SignUpResponse } from '../LoginCredentials.type';

export const useSignUp = () => {
    return useMutation<SignUpResponse, Error, UserCreationDto>({
        mutationFn: (userData: UserCreationDto) => AuthService.signup(userData),
        onSuccess: (data) => {
            console.log('Usuario creado exitosamente:', data);
        },
        onError: (error) => {
            console.error('Error al crear usuario:', error.message);
        }
    });
};