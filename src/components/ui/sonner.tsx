import { Toaster as Sonner } from "sonner";
import { CheckCircle, AlertTriangle, XCircle, Info, Loader2 } from "lucide-react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="bottom-right"
      gap={12}
      offset={24}
      duration={4500}
      icons={{
        success: <CheckCircle className="size-[18px]" />,
        error: <XCircle className="size-[18px]" />,
        warning: <AlertTriangle className="size-[18px]" />,
        info: <Info className="size-[18px]" />,
        loading: <Loader2 className="size-[18px] animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "toast-wasomi group toast",
          title: "toast-wasomi__title",
          description: "toast-wasomi__description",
          actionButton: "toast-wasomi__action",
          cancelButton: "toast-wasomi__cancel",
          closeButton: "toast-wasomi__close",
          icon: "toast-wasomi__icon",
          success: "toast-wasomi--success",
          error: "toast-wasomi--error",
          warning: "toast-wasomi--warning",
          info: "toast-wasomi--info",
          loading: "toast-wasomi--loading",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
