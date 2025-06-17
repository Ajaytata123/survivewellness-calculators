
import { toast } from "sonner";

// Function to show success toast notification
export const showSuccessToast = (message: string): void => {
  toast.success(message, {
    duration: 3000,
    position: "top-center",
  });
};

// Function to show error toast notification
export const showErrorToast = (message: string): void => {
  toast.error(message, {
    duration: 4000,
    position: "top-center",
  });
};

// Function to show info toast notification
export const showInfoToast = (message: string): void => {
  toast.info(message, {
    duration: 3000,
    position: "top-center",
  });
};

// Function to show warning toast notification
export const showWarningToast = (message: string): void => {
  toast.warning(message, {
    duration: 4000,
    position: "top-center",
  });
};

// Function for copy confirmation toast
export const showCopyToast = (): void => {
  toast.success("Results copied to clipboard!", {
    duration: 2000,
    position: "top-center",
  });
};

// Function for download confirmation toast
export const showDownloadToast = (): void => {
  toast.success("Results downloaded successfully!", {
    duration: 2000,
    position: "top-center",
  });
};

// Function for share confirmation toast
export const showShareToast = (): void => {
  toast.success("Results shared successfully!", {
    duration: 2000,
    position: "top-center",
  });
};
