// Contextos
export { useCustomerServicePhoneContext } from '../context/useCustomerServicePhoneContext';
export { useConversationContext } from '../context/useConversationContext';
export { useMessageContext } from '../context/useMessageContext';

// Hooks básicos
export { default as useCustomerServicePhone } from './useCustomerServicePhone';
export { default as useConversation } from './useConversation';
export { default as useMessage } from './useMessage';

// Hooks combinados con operaciones
export { useCustomerServicePhoneOperations, useCustomerServicePhoneOperationsWithId } from './useCustomerServicePhoneOperations';
export { useConversationOperations, useConversationOperationsWithPhoneId } from './useConversationOperations';
export { useMessageOperations, useMessageOperationsWithConversationId } from './useMessageOperations';

// También exportamos hooks con IDs específicos
export { useCustomerServicePhoneWithId } from './useCustomerServicePhone';
export { useConversationWithPhoneId } from './useConversation';
export { useMessageWithConversationId } from './useMessage';
