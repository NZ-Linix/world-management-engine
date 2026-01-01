
import { wme_log } from '../../utils/log';
import { database } from '../../data';
import OpenAI from 'openai';

export class OpenAIEngine {
    private isReadyVariable = false;

    constructor(private apiKey: string, private baseURL: string, private name: string) {

        wme_log.info("Creating new OpenAI Engine (" + this.baseURL + ") ...");

        (async () => {
            const client = new OpenAI({ apiKey: this.apiKey, baseURL: this.baseURL });

            try {
                await client.models.list();
            } catch (error) {
                wme_log.error("Failed to create new OpenAI Engine (" + this.baseURL + ")!");
                if (error instanceof Error) {
                    return {message: error.message}
                } else {
                    return {message: error}
                }
            }

            await database.engines.set(this.name, {apiKey: this.apiKey, baseURL: this.baseURL});
            const names: string[] = await database.engines.get("names") || []
            names.push(name)
            await database.engines.set("names", names)

            this.isReadyVariable = true;

            wme_log.success("Created new OpenAI Engine (" + this.baseURL + ")!");

        })();

    }

    public isReady(): boolean {
        return this.isReadyVariable;
    }

}