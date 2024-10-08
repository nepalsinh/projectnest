import { LoginFormType, RegisterFormType, User } from "../types/auth";
import api from "../utils/api";
import { apiRoutes } from "../utils/apiRoutes";
import useLoom from "../utils/context";
import { errorHandler } from "../utils/handler";

export class AuthService {
    static login = errorHandler(async (body: LoginFormType) => {
        const { data } = await api.post(apiRoutes.auth.login, body);
        return data as {
            token: string,
            user: User,
        }
    });
    static register = errorHandler(async (body: RegisterFormType) => {
        const { data } = await api.post(apiRoutes.auth.register, body);
        return data as {
            token: string;
            user: User;
        };
    });
    static verifyEmail = errorHandler(async (token: string) => {
        const { data } = await api.get(apiRoutes.auth.verifyEmail(token));
        return data as {
            message: string;
        };
    });
    static logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        useLoom.getState().setProjects([]);
        useLoom.getState().setUser(null);
    };
}