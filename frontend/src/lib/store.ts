import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    user: any | null;
    token: string | null;
    setAuth: (user: any, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            setAuth: (user, token) => set({ user, token }),
            logout: () => set({ user: null, token: null }),

        }),
        {
            name: 'auth-storage',
        }
    )
);

interface UIState {
    sidebarOpen: boolean;
    toggleSidebar: () => void;
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

export const useUIStore = create<UIState>()(
    persist(
        (set) => ({
            sidebarOpen: true,
            toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
            isDarkMode: false,
            toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
        }),
        {
            name: 'ui-storage',
        }
    )
);
