import { defineStore } from "pinia";
import axios from "axios";
import { Methods, initSocketConnection, request } from "../helpers";
import { IAuthenticationStoreState, IUserPublicData } from "../types/stores";
import { IResponse } from "../types/helpers";
import { useAccountStore } from "../stores/accountStore.ts";
import { useMessengerStore } from "../stores/messengerStore.ts";

export const useAuthenticationStore = defineStore("authentication", {
  state(): IAuthenticationStoreState {
    return {
      user: {
        id: Number(localStorage.getItem("user_id") ?? 0),
        name: "",
        email: "",
        timezone: "",
        desc: "",
        is2faEnabled: undefined,
        username: "",
        avatar: undefined,
      },
      sessionKey: undefined,
      socket: undefined,
      isAuth: !!localStorage.getItem("token"),
      token: localStorage.getItem("token") ?? "",
      availibleTimezones: [],
    };
  },
  actions: {
    async login(username: string, password: string): Promise<IResponse> {
      return await request(
        Methods.POST,
        "/api/v1/account/account/login/",
        {
          username,
          password,
        },
        undefined,
        axios.HttpStatusCode.Ok,
        axios.HttpStatusCode.Accepted
      );
    },
    async twoFactorAuthentication(code: string): Promise<IResponse> {
      const { success, data } = await request(
        Methods.POST,
        "/api/v1/account/account/two-factor-authentication/",
        {
          auth_code: code,
          session_key: this.sessionKey,
        }
      );
      if (success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", data.user_id);
        this.token = data.token;
        this.user.id = data.user_id;
        this.isAuth = true;
        initSocketConnection();
        const messengerStore = useMessengerStore();
        messengerStore.initMessenger();
      }
      return { success, data };
    },
    async singUp(
      username: string,
      password: string,
      email: string | null
    ): Promise<IResponse> {
      return await request(
        Methods.POST,
        "/api/v1/account/account/",
        {
          username,
          password,
          email,
        },
        undefined,
        axios.HttpStatusCode.Created
      );
    },
    async logout(): Promise<void> {
      await request(
        Methods.GET,
        "/api/v1/account/account/logout/",
        undefined,
        undefined,
        axios.HttpStatusCode.NoContent
      );
      this.token = "";
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      this.isAuth = false;
      this.socket!.close(1000);
      this.socket = undefined;
      const messengerStore = useMessengerStore();
      messengerStore.closeAndClear();
      const accountStore = useAccountStore();
      accountStore.notifications = [];
      this.user.id = 0;
      this.user.username = "";
      this.user.avatar = undefined;
    },
    async getMe(permanent: boolean = false): Promise<IUserPublicData> {
      if (!this.user.username || permanent) {
        const { data } = await request(
          Methods.GET,
          "/api/v1/account/account/me/"
        );
        this.user.id = data.user.id;
        this.user.name = data.user.name;
        this.user.email = data.user.email;
        this.user.timezone = data.user.timezone;
        this.user.desc = data.user.description;
        this.user.is2faEnabled = data.user.is_2fa_enabled;
        this.user.username = data.user.username;
        this.user.avatar = data.user.avatar;
        this.availibleTimezones = data.availible_timezones;
      }
      return { username: this.user.username, avatar: this.user.avatar };
    },
  },
});
