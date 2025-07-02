import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface PersonalInfo {
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    // Agrega más campos según necesites
}

export interface AuthData {
    email: string;
    password: string;
    confirmPassword: string;
}

export interface MultiStepFormState {
    // Estado del formulario
    currentStep: number;
    totalSteps: number;

    // Datos del formulario
    authData: AuthData;
    personalInfo: PersonalInfo;

    // Acciones
    nextStep: () => void;
    prevStep: () => void;
    goToStep: (step: number) => void;
    updateAuthData: (data: Partial<AuthData>) => void;
    updatePersonalInfo: (data: Partial<PersonalInfo>) => void;
    resetForm: () => void;

    // Validaciones
    isStepValid: (step: number) => boolean;
    canGoNext: () => boolean;
    canGoPrev: () => boolean;
}

const initialAuthData: AuthData = {
    email: '',
    password: '',
    confirmPassword: '',
};

const initialPersonalInfo: PersonalInfo = {
    firstName: '',
    lastName: '',
    phoneNumber: ''
};

export const useMultiStepForm = create<MultiStepFormState>()(
    devtools(
        (set, get) => ({
            // Estado inicial
            currentStep: 1,
            totalSteps: 2,
            authData: initialAuthData,
            personalInfo: initialPersonalInfo,

            // Navegación entre steps
            nextStep: () => {
                const { currentStep, totalSteps, canGoNext } = get();
                if (canGoNext() && currentStep < totalSteps) {
                    set({ currentStep: currentStep + 1 });
                }
            },

            prevStep: () => {
                const { currentStep, canGoPrev } = get();
                if (canGoPrev() && currentStep > 1) {
                    set({ currentStep: currentStep - 1 });
                }
            },

            goToStep: (step: number) => {
                const { totalSteps } = get();
                if (step >= 1 && step <= totalSteps) {
                    set({ currentStep: step });
                }
            },

            // Actualización de datos
            updateAuthData: (data) => {
                set((state) => ({
                    authData: { ...state.authData, ...data }
                }));
            },

            updatePersonalInfo: (data) => {
                set((state) => ({
                    personalInfo: { ...state.personalInfo, ...data }
                }));
            },

            resetForm: () => {
                set({
                    currentStep: 1,
                    authData: initialAuthData,
                    personalInfo: initialPersonalInfo,
                });
            },

            // Validaciones
            isStepValid: (step: number) => {
                const { authData, personalInfo } = get();

                switch (step) {
                    case 1: // Validación para email y password
                        return (
                            authData.email.length > 0 &&
                            authData.email.includes('@') &&
                            authData.password.length >= 8 &&
                            authData.password === authData.confirmPassword
                        );

                    case 2: // Validación para información personal
                        return (
                            personalInfo.firstName.length > 0 &&
                            personalInfo.lastName.length > 0
                        );

                    default:
                        return false;
                }
            },

            canGoNext: () => {
                const { currentStep, isStepValid } = get();
                return isStepValid(currentStep);
            },

            canGoPrev: () => {
                const { currentStep } = get();
                return currentStep > 1;
            },
        }),
        {
            name: 'multi-step-form-store',
        }
    )
);