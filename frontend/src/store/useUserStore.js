import { create } from 'zustand'
import toast from 'react-hot-toast';

import { axiosInstance } from '../lib/axios.js'

export const useUserStore = create((set) => ({
    loading: false,

    updateProfile: async (data) => {
        try {
            set({ loading: true });

            const res = await axiosInstance.put('/users/update', data);

            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(error.response.data.message || "Something went wrong");
        } finally {
            set({ loading: false });
        }
    }
}))

