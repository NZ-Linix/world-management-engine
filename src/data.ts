import DotDB from "dotdatabase";

const database = {
    engines: new DotDB("./data/wme/engines.json")
};

export { database };