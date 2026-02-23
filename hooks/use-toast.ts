"use client";

import * as React from "react";

export type ToastVariant = "default" | "destructive";

export type ToastItem = {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  open?: boolean;
};

type ToastInput = Omit<ToastItem, "id" | "open">;

type ToastState = {
  toasts: ToastItem[];
};

type Action =
  | { type: "ADD_TOAST"; toast: ToastItem }
  | { type: "DISMISS_TOAST"; toastId?: string }
  | { type: "REMOVE_TOAST"; toastId?: string };

const TOAST_LIMIT = 3;
const TOAST_REMOVE_DELAY = 3000;

let count = 0;
const genId = () => {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
};

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) return;

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({ type: "REMOVE_TOAST", toastId });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

const reducer = (state: ToastState, action: Action): ToastState => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      if (toastId) addToRemoveQueue(toastId);
      else state.toasts.forEach((toast) => addToRemoveQueue(toast.id));

      return {
        ...state,
        toasts: state.toasts.map((toast) =>
          toastId ? (toast.id === toastId ? { ...toast, open: false } : toast) : { ...toast, open: false }
        ),
      };
    }

    case "REMOVE_TOAST":
      if (!action.toastId) return { ...state, toasts: [] };
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.toastId),
      };

    default:
      return state;
  }
};

const listeners: Array<(state: ToastState) => void> = [];
let memoryState: ToastState = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

export function toast(input: ToastInput) {
  const id = genId();

  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });
    
  dispatch({
    type: "ADD_TOAST",
    toast: { ...input, id, open: true },
  });

  return { id, dismiss };
}

export function useToast() {
  const [state, setState] = React.useState<ToastState>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}
