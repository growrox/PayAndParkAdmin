import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const userStore = create(
  persist(
    (set, get) => ({
      user: {},
      isLoggedIn: false,
      setUser: (user) => set({ user }),
      setIsLoggedIn: (islogged) => set({ isLoggedIn: islogged }),
      logout: () => {
        set(() => ({ user: null, isLoggedIn: false }));
        console.log("loggint out")
        localStorage.removeItem("user");
      },
    }),
    {
      name: "user", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);

export default userStore;
