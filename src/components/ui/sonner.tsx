import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {

  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-purple-700 group-[.toaster]:text-white group-[.toaster]:border-purple-900 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-purple-300",
          actionButton:
            "group-[.toast]:bg-purple-500 group-[.toast]:text-white group-[.toast]:hover:bg-purple-600",
          cancelButton:
            "group-[.toast]:bg-gray-700 group-[.toast]:text-white group-[.toast]:hover:bg-gray-800",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
