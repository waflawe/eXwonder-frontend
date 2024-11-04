import axios, {AxiosRequestConfig} from 'axios'
import client from '../client/index.js'
import {IResponse} from "@/types/helpers";

enum Methods {
    GET = 'get',
    POST = 'post',
    PATCH = 'patch',
    DELETE = 'delete'
}

async function request(
    method: Methods,
    url: string,
    data?: object,
    config?: AxiosRequestConfig,
    ...expectedStatuses: Array<number>
): Promise<IResponse> {
    if (expectedStatuses.length === 0) {
        expectedStatuses = [axios.HttpStatusCode.Ok]
    }

    const args: [string, object?, AxiosRequestConfig?] = data ? [url, data, config] : [url, config]
    const response = await client[method](...args).catch(error => error)

    if (expectedStatuses.includes(response.status)) {
        return {
            success: true,
            data: response.data
        }
    } else {
        return {
            success: false,
            data: response.response.data
        }
    }
}

export {request, Methods}