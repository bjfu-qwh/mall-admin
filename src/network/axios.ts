import axios, {AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios'
import {ElMessage} from 'element-plus'


interface Result {
    code: number;
    msg: string
}

/**
 * 基于Result类附带数据
 */
interface ResultData<T = any> extends Result {
    data?: T;
}

const URL: string = ''

enum RequestEnums {
    TIMEOUT = 20000,
    OVERDUE = 600, // 登录失效
    SUCCESS = 200, // 请求成功
}

const config = {
    baseURL: URL as string,
    timeout: RequestEnums.TIMEOUT as number,
    withCredentials: true
}

class RequestHttp {
    // 定义成员变量并指定类型
    service: AxiosInstance;

    public constructor(config: AxiosRequestConfig) {
        // 实例化axios
        this.service = axios.create(config);

        this.service.interceptors.request.use(
            (config: AxiosRequestConfig) => {
                const token = localStorage.getItem('token') || '';
                return {
                    ...config,
                    headers: {
                        'x-access-token': token, // 请求头中携带token信息
                    }
                }
            },
            (error: AxiosError) => {
                // 请求报错
                Promise.reject(error).then(r => {
                })
            }
        )


        this.service.interceptors.response.use(
            (response: AxiosResponse) => {
                const {data, config} = response; // 解构
                if (data.code === RequestEnums.OVERDUE) {
                    localStorage.setItem('token', '');
                    return Promise.reject(data);
                }
                if (data.code && data.code !== RequestEnums.SUCCESS) {
                    ElMessage.error(data); // 此处也可以使用组件提示报错信息
                    return Promise.reject(data)
                }
                return data;
            },
            (error: AxiosError) => {
                const {response} = error;
                if (response) {
                    this.handleCode(response.status)
                }
                if (!window.navigator.onLine) {
                    ElMessage.error('网络连接失败');
                }
            }
        )
    }

    handleCode(code: number): void {
        switch (code) {
            case 401:
                ElMessage.error('登录失败，请重新登录');
                break;
            default:
                ElMessage.error('请求失败');
                break;
        }
    }

    get<T>(url: string, params?: object): Promise<ResultData<T>> {
        return this.service.get(url, {params});
    }

    post<T>(url: string, params?: object): Promise<ResultData<T>> {
        return this.service.post(url, params);
    }
}

// 导出一个实例对象
export default new RequestHttp(config);