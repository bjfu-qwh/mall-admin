import axios from 'axios';

/**
 * 这个接口和后端传递的数据格式一致
 */
export interface JSONResult<T> {
    /**
     * code表示代码，目前的设计较为简单：200和500
     */
    code: number,
    /**
     * message是后端传递的信息，一般用于错误展示
     */
    message: string,
    /**
     * data则是具体数据，请仔细替代
     */
    data: T
}

export interface PagedResult<T> {
    total: number,
    pageCount: number,
    pageID: number,
    data: T
}

const request = axios.create({
    baseURL: 'http://localhost:8080/'
});

export default request;

