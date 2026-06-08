import API from "./api";
import type { CartItem } from "@/context/CartContext";

export interface InquiryPayload {
    buyerName: string;
    buyerEmail: string;
    buyerPhone: string;
    company?: string;
    message?: string;
    items: CartItem[];
}

export const createInquiry = async (payload: InquiryPayload) => {
    const { data } = await API.post("/inquiries", payload);
    return data;
};

export const getAllInquiries = async () => {
    const { data } = await API.get("/admin/inquiries");
    return data;
};

export const getMyInquiries = async () => {
    const { data } = await API.get("/my/inquiries");
    return data;
};
