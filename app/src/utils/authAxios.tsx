import axios,{
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  AxiosError,
} from 'axios';
import {jwtDecode} from 'jwt-decode';
import dayjs from 'dayjs';
import { useContext } from 'react';
import AppContext from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';


interface tokenData{
    id: string,
    exp: number,
    iat: number
}

// custom hook danh cho authAxios
const useAuthAxios = () => {
  let accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const { logout } = useContext(AppContext);

  const authAxios = axios.create({
    timeout: 7000,
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  // Xử lý trước khi gửi request
  authAxios.interceptors.request.use(
    async function (
      config: InternalAxiosRequestConfig
    ): Promise<InternalAxiosRequestConfig<any>> {
      if (accessToken != null) {
        const tokenData: tokenData = jwtDecode(accessToken);
        const tokenExpirationDate = tokenData.exp;
        if (tokenExpirationDate !== undefined) {
          const isExpired = dayjs.unix(tokenExpirationDate).diff(dayjs()) < 1; // chênh lệch 1 giây sau thời điểm hiện tại
          if (!isExpired) {
            return config;
          } else {
            console.log(
              "Access token không còn hợp lệ! Lấy access token mới..."
            );
            try {
                // Lấy refresh token trước khi tạo access token mới
                const refreshTokenRes = await axios.post(
                  "http://localhost:9999/auth/getRefreshToken",
                  { id: tokenData.id }
                );
                if (refreshTokenRes.data.length > 1) {
                  try {
                    // Lấy access token mới từ backend
                    const newAccessToken = await axios.post(
                      "http://localhost:9999/auth/refresh",
                      { refreshToken: refreshTokenRes.data, id: tokenData.id }
                    );

                    localStorage.setItem(
                      "accessToken",
                      newAccessToken.data.accessToken
                    );
                    config.headers.Authorization = `Bearer ${newAccessToken.data.accessToken}`;
                    return config;
                  } catch (error) {
                    console.log("Lỗi tạo access token mới! Đăng xuất");
                    logout();
                    navigate("/login");
                    return Promise.reject();
                  }
                }else{
                    console.log("Lỗi lấy refresh token!")
                    logout();
                    navigate("/login");
                    return Promise.reject();
                }

            } catch (error) {
                console.log("Refresh token không tồn tại hoặc đã hết hạn! Vui lòng đăng nhập lại")
                localStorage.clear();
                navigate("/login");
                return Promise.reject();
            }
          }
        }else{
            console.log("Access token không hợp lệ! Đăng xuất...")
            localStorage.clear();
            navigate("/login")
            return Promise.reject();
        }
      }else{
        console.log("Không tìm thấy access token! Đăng xuất...")
        localStorage.clear();
        navigate("/login")
        return Promise.reject();
      }

      return config;
    },
    function (error: AxiosError): Promise<AxiosError> {
      // Do something with request error
      return Promise.reject(error);
    }
  );


  return authAxios;
}

export default useAuthAxios
