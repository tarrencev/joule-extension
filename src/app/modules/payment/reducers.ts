import { SendPaymentResponse } from 'lib/lnd-http';
import types, { PaymentRequestState } from './types';

export interface PaymentState {
  sendReceipt: SendPaymentResponse | null;
  paymentRequests: { [req: string]: PaymentRequestState };
  invoice: any | null;
  sendError: Error | null;
  isSending: boolean;
  invoiceError: Error | null;
  isCreatingInvoice: boolean;
}

export const INITIAL_STATE: PaymentState = {
  sendReceipt: null,
  invoice: null,
  paymentRequests: {},
  sendError: null,
  isSending: false,
  invoiceError: null,
  isCreatingInvoice: false,
};

export default function channelsReducers(
  state: PaymentState = INITIAL_STATE,
  action: any,
): PaymentState {
  switch (action.type) {
    case types.SEND_PAYMENT:
      return {
        ...state,
        sendReceipt: null,
        sendError: null,
        isSending: true,
      };
    case types.SEND_PAYMENT_SUCCESS:
      return {
        ...state,
        sendReceipt: action.payload,
        isSending: false,
      };
    case types.SEND_PAYMENT_FAILURE:
      return {
        ...state,
        sendError: action.payload,
        isSending: false,
      };
    
    case types.RESET_SEND_PAYMENT:
      return {
        ...state,
        sendReceipt: null,
        sendError: null,
        isSending: false,
      };

    case types.CHECK_PAYMENT_REQUEST:
      return {
        ...state,
        paymentRequests: {
          ...state.paymentRequests,
          [action.payload]: {
            data: null,
            error: null,
            isLoading: true,
          },
        },
      };
    case types.CHECK_PAYMENT_REQUEST_SUCCESS:
      return {
        ...state,
        paymentRequests: {
          ...state.paymentRequests,
          [action.payload.paymentRequest]: {
            data: action.payload,
            error: null,
            isLoading: false,
          },
        },
      };
    case types.CHECK_PAYMENT_REQUEST_FAILURE:
      return {
        ...state,
        paymentRequests: {
          ...state.paymentRequests,
          [action.payload.paymentRequest]: {
            error: action.payload.error,
            data: null,
            isLoading: false,
          },
        },
      };
  }
  
  return state;
}