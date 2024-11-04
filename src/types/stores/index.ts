interface IAuthenticationStoreUser {
    id: number,
    username: string,
    email?: string,
    avatar?: string,
    timezone?: string,
    is2faEnabled?: boolean
}

interface IAuthenticationStoreState {
    user: IAuthenticationStoreUser,
    sessionKey?: string,
    isAuth: boolean,
    token: string,
    availibleTimezones: Array<string>
}

interface IUserPublicData {
    username: string,
    avatar?: string
}

interface IUserSettingsUpdates {
    email?: string,
    avatar?: File,
    is2faEnabled?: boolean,
    timezone?: string
}

interface IPostCreate {
    images: Array<File>,
    signature?: string
}

interface IRouteStoreState {
    activeLink: string
}

export {
    IAuthenticationStoreUser,
    IAuthenticationStoreState,
    IUserPublicData,
    IUserSettingsUpdates,
    IPostCreate,
    IRouteStoreState
}