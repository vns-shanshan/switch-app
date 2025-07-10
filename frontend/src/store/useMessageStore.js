import { create } from "zustand";
import toast from "react-hot-toast";

import { getSocket } from "../socket/socket.client.js";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";

export const useMessageStore = create((set) => ({
    messages: [],
    loading: true,

    sendMessage: async (receiverId, content) => {
        try {
            // mockup a message, show it in the UI immediately
            set((state) => ({
                messages: [...state.messages, { _id: Date.now(), sender: useAuthStore.getState().authUser._id, content }]
            }))

            const res = await axiosInstance.post(`/messages/send`, { receiverId, content });
            console.log("Message sent: ", res.data);
        } catch (error) {
            toast.error(error.response.data.message || "Something went wrong");
        }
    },

    getMessages: async (userId) => {
        try {
            set({ loading: true });

            const res = await axiosInstance.get(`/messages/conversation/${userId}`);

            set({ messages: res.data.messages });
        } catch (error) {
            console.log(error);
            set({ messages: [] });
        } finally {
            set({ loading: false });
        }
    },

    subscribeToMessages: () => {
        const socket = getSocket();
        socket.on("newMessage", ({ message }) => {
            set((state) => ({ messages: [...state.messages, message] }))
        })
    },

    unsubscribeFromMessages: () => {
        const socket = getSocket();
        socket.off("newMessage");
    }
}))