// hooks/useCustomToast.js
import { useToast } from "@/context/ToastContext";
import { v4 as uuidv4 } from 'uuid';

export function useCustomToast() {
  const { addToast } = useToast();

  const showToast = (title, description, variant = "default") => {
    const id = uuidv4();
    addToast({ id, title, description, variant });
  };

  return { showToast };
}
