import axios from "axios";

let URL = 'https://apichallenges.herokuapp.com/';

axios.defaults.validateStatus = function () {
    return true;
};

export class ChallengesService {
    options: any;
    constructor(options) {
        this.options = options;
    }

    async get(headers: any) {
        const response = await axios.get(`${URL}challenges`, { headers: headers });
        return response;
    }

    async getTodos(headers: any, qs: string = '') {
        const response = await axios.get(`${URL}todos${qs}`, { headers: headers });
        return response;
    }

    async getTodo(headers: any) {
        const response = await axios.get(`${URL}todo`, { headers: headers });
        return response;
    }

    async getTodoById(headers: any, id: string, qs: string = '') {
        const response = await axios.get(`${URL}todos/${id}${qs}`, { headers: headers });
        return response;
    }

    async headTodos(headers: any) {
        const response = await axios.head(`${URL}todos`, { headers: headers });
        return response;
    }

    async postTodos(headers: any, data: any) {
        const response = await axios.post(`${URL}todos`, data, { headers: headers });
        return response;
    }
    async postTodosId(headers: any, data: any, id: string) {
        const response = await axios.post(`${URL}todos/${id}`, data, { headers: headers });
        return response;
    }

    async putTodos(headers: any, id: string, data: any) {
        const response = await axios.put(`${URL}todos/${id}`, data, { headers: headers });
        return response;
    }

    async deleteTodos(headers: any, id: string) {
        const response = await axios.delete(`${URL}todos/${id}`, { headers: headers });
        return response;
    }

    async optionsTodos(headers: any) {
        const response = await axios.options(`${URL}todos`, { headers: headers });
        return response;
    }

    async postTodoXml(headers: any, xmlData: any) {
        const response = await axios.post(`${URL}todos`, xmlData, {
            headers: {
                ...headers,
                'Content-Type': 'application/xml',
                'Accept': 'application/json'
            }
        });
        return response;
    }

    async postTodoJSON(headers: any, JSONData: any) {
        const response = await axios.post(`${URL}todos`, JSONData, {
            headers: {
                ...headers,
                'Content-Type': 'application/json',
                'Accept': 'application/xml'
            }
        });
        return response;
    }

    async deleteHeartbeat(headers: any) {
        const response = await axios.delete(`${URL}heartbeat`, { headers: headers });
        return response;
    }

    async patchHeartbeat(headers: any) {
        const response = await axios.patch(`${URL}heartbeat`, {}, { headers: headers });
        return response;
    }

    async traceHeartbeat(headers: any) {
        const response = await axios.request({
            url: `${URL}heartbeat`,
            method: 'trace',
            headers: headers
        });
        return response;
    }

    async getHeartbeat(headers: any) {
        const response = await axios.get(`${URL}heartbeat`, { headers: headers });
        return response;
    }

    async postHeartbeatOverride(headers: any) {
        const response = await axios.post(`${URL}heartbeat`, null, {
            headers: { ...headers }
        });
        return response;
    }

    async postSecretToken(headers: any, auth = '', data = {}) {
        const response = await axios.post(`${URL}secret/token`, data, {
            headers: {
                ...headers,
                'Authorization': `Basic ${auth}`
            }
        });
        return response;
    }

    async getSecretNote(headers: any) {
        const response = await axios.get(`${URL}secret/note`, { headers: headers });
        return response;
    }

    async postSecretNote(headers: any, data: any) {
        const response = await axios.post(`${URL}secret/note`, data, { headers: headers });
        return response;
    }
}