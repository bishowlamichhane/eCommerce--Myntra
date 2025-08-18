import { useDispatch } from "react-redux";
import { toastActions } from "../store/toastSlice";

export const useToast = () => {
    const dispatch = useDispatch();

    const showToast = (message, type = "info") => {
        dispatch(toastActions.showToast({ message, type }));
    };

    const showSuccess = (message) => {
        showToast(message, "success");
    };

    const showError = (message) => {
        showToast(message, "error");
    };

    const showWarning = (message) => {
        showToast(message, "warning");
    };

    const showInfo = (message) => {
        showToast(message, "info");
    };

    return {
        showToast,
        showSuccess,
        showError,
        showWarning,
        showInfo
    };
};
