import axios from "axios";

let URL = 'https://apichallenges.herokuapp.com/';

axios.defaults.validateStatus = function () {
    return true;
};

export class ChallengerService {
    options: any;
    constructor(options: any) {
        this.options = options;
    }
    async post() {
        const response = await axios.post(`${URL}challenger`);
        return response;
    }

    async getGuild(guid: string, header: any) {
        const response = await axios.get(`${URL}challenger/${guid}`, { headers: header });
        return response;
    }

    async putGuild(guid: string, headers: any, data: any) {
        const response = await axios.put(`${URL}challenger/${guid}`, data, { headers: headers });
        return response;
    }

    async getDatabase(guid: string, headers: any) {
        const response = await axios.get(`${URL}challenger/database/${guid}`, { headers: headers });
        return response;
    }

    async putDatabase(guid: string, headers: any, data: any) {
        const response = await axios.put(`${URL}challenger/database/${guid}`, data, { headers: headers });
        return response;
    }
}