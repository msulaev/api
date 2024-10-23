import axios from "axios";

let URL = 'https://apichallenges.herokuapp.com/';

export class ChallengesService {
    options: any;
    constructor (options){
        this.options = options;
        // axios.interceptors.request.use(request => {
        //     console.log('Starting Request', request);
        //     return request;
        // });
    }

    async get(headers){
        const response = await axios.get(`${URL}challenges`, {headers: headers});
        return response;
    }

    async getTodos(headers, qs = ''){
        const response = await axios.get(`${URL}todos${qs}`, {headers: headers});
        return response;
    }

    async getTodo(headers){
        const response = await axios.get(`${URL}todo`, {headers: headers});
        return response;
    }

    async getTodoById(headers, id, qs = ''){
        const response = await axios.get(`${URL}todos/${id}${qs}`, {headers: headers});
        return response;
    }

    async headTodos(headers){
        const response = await axios.head(`${URL}todos`, {headers: headers});
        return response;
    }

    async postTodos(headers, data){
        const response = await axios.post(`${URL}todos`, data, {headers: headers});
        return response;
    }
    async postTodosId(headers, data, id){
        const response = await axios.post(`${URL}todos/${id}`, data, {headers: headers});
        return response;
    }

    async putTodos(headers, id, data){
        const response = await axios.put(`${URL}todos/${id}`, data, {headers: headers});
        return response;
    }

    async deleteTodos(headers, id){
        const response = await axios.delete(`${URL}todos/${id}`, {headers: headers});
        return response;
    }

    async optionsTodos(headers){
        const response = await axios.options(`${URL}todos`, {headers: headers});
        return response;
    }

    async postTodoXml(headers, xmlData) {
        const response = await axios.post(`${URL}todos`, xmlData, {
            headers: {
                ...headers,
                'Content-Type': 'application/xml',
                'Accept': 'application/json'
            }
        });
        return response;
    }

    async postTodoJSON(headers, JSONData){
        const response = await axios.post(`${URL}todos`, JSONData, {
            headers: {
                ...headers,
                'Content-Type': 'application/json',
                'Accept': 'application/xml'
            }
        });
        return response;
    }

    async deleteHeartbeat(headers){
        const response = await axios.delete(`${URL}heartbeat`, {headers: headers});
        return response;
    }

    async patchHeartbeat(headers){
        const response = await axios.patch(`${URL}heartbeat`, {}, {headers: headers});
        return response;
    }

    async traceHeartbeat(headers) {
        const response = await axios.request({
            url: `${URL}heartbeat`,
            method: 'trace',
            headers: headers
        });
        return response;
    }

    async getHeartbeat(headers){
        const response = await axios.get(`${URL}heartbeat`, {headers: headers});
        return response;
    }

    async postHeartbeatOverride(headers) {
        const response = await axios.post(`${URL}heartbeat`, null, {
            headers: {...headers}
        });
        return response;
    }

    async postSecretToken(headers, auth='' , data = {}){
        const response = await axios.post(`${URL}secret/token`, data, {
            headers: {
                ...headers,
                'Authorization': `Basic ${auth}`
            }
        });
        return response;
    }

    async getSecretNote(headers) {
        const response = await axios.get(`${URL}secret/note`, { headers: headers });
        return response;
    }

    async postSecretNote(headers, data) {
        const response = await axios.post(`${URL}secret/note`, data, { headers: headers });
        return response;
    }
}