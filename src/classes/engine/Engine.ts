import { wme_log } from '../../utils/log';
import { database } from '../../data';
import OpenAI from 'openai';

import { EventEmitter } from 'events';

export class Engine {
    private isReadyVariable = false;
    private eventEmitter = new EventEmitter();
    public apiKey: string;
    public baseURL: string;
    public name: string;

    constructor(apiKey: string, baseURL: string, name: string) {
        this.apiKey = apiKey;
        this.baseURL = baseURL;
        this.name = name;
        this.init(apiKey, baseURL, name);
    }

    private async init(apiKey: string, baseURL: string, name: string) {

        let disableLogs = false;

        if ( name.endsWith("_DISABLE_LOGS") ) {
            disableLogs = true;
            name = name.slice(0, -13);
        }

        if ( !disableLogs ) { wme_log.info("Creating new Engine (" + this.baseURL + ") ..."); }

        if ( !(/^[a-zA-Z0-9]+$/.test(name)) ) {
            throw new Error("Engine name may only be letters and numbers and not empty.");
        }

        const client = new OpenAI({ apiKey: apiKey, baseURL: baseURL });

        try {
            await client.models.list();
        } catch (error) {
            wme_log.error("Failed to create new Engine (" + baseURL + ")!");
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error(String(error));
            }
        }

        let modified_engine: boolean = false;

        try {
            const names: string[] = await database.engines.get("names") || []

            if ( names.includes(name) ) { 
                modified_engine = true;
                const indexOfName = names.indexOf(name);
                names.splice(indexOfName, 1);
            }

            names.push(name)

            await database.engines.set(name, {apiKey: apiKey, baseURL: baseURL});
            await database.engines.set("names", names)
        } catch (error) {
            wme_log.error("Failed to create new Engine (" + baseURL + ")!");
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error(String(error));
            }
        }

        this.isReadyVariable = true;
        this.eventEmitter.emit("ready");

        if ( !modified_engine ) { 
            if ( !disableLogs ) { wme_log.success("Created new Engine (" + baseURL + ")!"); }
        } else { 
            if ( !disableLogs ) { wme_log.success("Modified engine (" + baseURL + ")!"); }
        }

    }

    static async load(name: string): Promise<Engine> {
        wme_log.info("Trying to load Engine: " + name)
        const data: {apiKey: string, baseURL: string} = await database.engines.get(name);
        if ( !data ) { wme_log.error("Failed to load Engine."); throw new Error("Failed to load Engine: Engine not found.") }
        const engine = new Engine(data.apiKey, data.baseURL, name + "_DISABLE_LOGS");
        wme_log.success("Loaded Engine: " + data.baseURL);
        return engine;
    }

    static async delete(name: string) {
        wme_log.info("Trying to delete Engine: " + name)
        const data: {apiKey: string, baseURL: string} = await database.engines.get(name);
        if ( !data ) { wme_log.error("Failed to delete Engine.") ;throw new Error("Failed to delete Engine: Engine not found.") }
        await database.engines.delete(name);
        wme_log.success("Deleted Engine: " + data.baseURL);
    }

    static async list(): Promise<{name: string, apiKey: string, baseURL: string}[]> {
        const engines_db = await database.engines.all();
        const engineNames = await database.engines.get("names") || [];

        let final_data = [];

        for (const engineName of engineNames) {
            const data: { apiKey: string, baseURL: string } = await database.engines.get(engineName);
            final_data.push({ name: engineName, apiKey: data.apiKey, baseURL: data.baseURL })
        }

        return final_data;

    }

    public async delete() {
        wme_log.info("Trying to delete Engine: " + this.name)
        const data: {apiKey: string, baseURL: string} = await database.engines.get(this.name);
        if ( !data ) { wme_log.error("Failed to delete Engine.") ;throw new Error("Failed to delete Engine: Engine not found.") }
        await database.engines.delete(this.name);
        wme_log.success("Deleted Engine: " + data.baseURL);
    }

    public onReady(callback: () => void) {
        if ( this.isReady() ) {
            callback();
        } else {
            this.eventEmitter.once("ready", callback);
        }
    }

    public isReady(): boolean {
        return this.isReadyVariable;
    }

}