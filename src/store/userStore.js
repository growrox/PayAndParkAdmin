import { create } from "zustand";
const userStore = create((set) => {
  return {
    user: {},
    isLoggedIn: false,
    setUser: (user) => set({ user }),
    setIsLoggedIn: (islogged) => set({ isLoggedIn: islogged }),
  };
});

export default userStore;
