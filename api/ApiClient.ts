import { ChallengerService } from "./ChallengerService";
import { ChallengesService } from "./ChallengesService";

export class ApiClient {
    challenger: ChallengerService;
    challenges: ChallengesService;
    options: { token: any; };
    constructor (options = {}) {
        const defaultOptions = {
            URL: "https://apichallenges.herokuapp.com/",
        }
        const mergeOptions = {
            ...defaultOptions,
            ...options,
        }
        this.challenger = new ChallengerService(mergeOptions);
        this.challenges = new ChallengesService(mergeOptions);
    };
    
    static async loginAs(){
        const client = this.unauthorized();    
        //Авторизация
        //todo
        const { headers } = await client.challenger.post();
        //todo r?.body
        const token = headers["x-challenger"]
        return new ApiClient({token});
    }
    
    static unauthorized(){
        return new ApiClient();
    }
};
