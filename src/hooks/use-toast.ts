import { Toast, toast } from "@/components/ui/toast";

export function useToast() {
  return {
    toast: (props: Toast) => {
      toast(props);
    },
  };
}