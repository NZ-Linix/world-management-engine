import { wme_log } from '../../utils/log';
import { database } from '../../data';
import { Engine } from '../engine/Engine';
import OpenAI from 'openai';

export class Scenario {
    private apiKey: string;
    private baseURL: string;
    private OpenAIClient: OpenAI;

    private constructor(apiKey: string, baseURL: string) {
        wme_log.info("Creating new scenario...")
        this.apiKey = apiKey;
        this.baseURL = baseURL;
        this.OpenAIClient = new OpenAI({ apiKey: apiKey, baseURL: baseURL })
        wme_log.success("Created new scenario!")
    }

    static async using(engine: Engine) {
        return await new Scenario(engine.apiKey, engine.baseURL);
    }

}