import type { User } from "@/types/User";
import useAuthAxios from "@/utils/authAxios";
import axios from "axios";
import React, { createContext, useState, useContext, type ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

interface AppContextType {
  user: User | null;
  accessToken: string | null;
  coreAPI: string;
  authAPI: string;
  userAPI: string;
  shelterAPI: string;
  donationAPI: string;
  blogAPI: string;
  reportAPI: string;
  breedAPI: string;
  speciesAPI: string;
  userProfile: User | null;
  login: (accessToken: string, userData: User) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType>({
  user: null,
  accessToken: null,
  coreAPI: "",
  authAPI: "",
  userAPI: "",
  shelterAPI: "",
  donationAPI: "",
  blogAPI: "",
  reportAPI: "",
  breedAPI: "string",
  speciesAPI: "string",
  userProfile: null,
  login: () => {},
  logout: () => {},
});

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const accessToken = localStorage.getItem("accessToken");
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const location = useLocation();
  const authAxios = useAuthAxios();

  const base_API = import.meta.env.VITE_BE_API;

  // APIs
  const coreAPI = base_API;
  const authAPI = `${base_API}/auth`;
  const userAPI = `${base_API}/users/admin`;
  const shelterAPI = `${base_API}/shelters/admin`;
  const donationAPI = `${base_API}/donations/admin`;
  const blogAPI = `${base_API}/blogs/admin`;
  const reportAPI = `${base_API}/reports/admin`;
  const breedAPI = `${base_API}/breeds/admin`;
  const speciesAPI = `${base_API}/species/admin`;


  const login = (accessToken: string, userData: User) => {
    setUser(userData);
    localStorage.setItem("accessToken", accessToken);
  };

  const logout = () => {
    axios.post(`${authAPI}/logout`,{id: user?.id})
    .then(() => {
      toast.success("Thoát đăng nhập thành công");
      setUser(null);
      localStorage.clear();
    })
    .catch(() => {
      toast.error("Lỗi thoát đăng nhập!")
      setUser(null);
      localStorage.removeItem("accessToken");
    })
  };

  // Check trạng thái login và access token mỗi khi chuyển trang
  useEffect(() => {
      authAxios
        .get(`${coreAPI}/users/get-user`)
          .then((res) => {
            setUserProfile(res?.data);
            setUser(res?.data);
                })
          .catch((error) => {
            console.log(error.response?.data?.message);
        });
  }, [location.pathname]);


  return (
    <AppContext.Provider
      value={{
        user,
        accessToken,
        coreAPI,
        authAPI,
        userAPI,
        shelterAPI,
        donationAPI,
        blogAPI,
        reportAPI,
        breedAPI,
        speciesAPI,
        userProfile,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

export default AppContext;
