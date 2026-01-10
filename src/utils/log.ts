import chalk from "chalk";
const doLogging: boolean = !(process.env.WME_DISABLE_LOG === "true");

const infoTag = chalk.gray("[") + chalk.blue("INFO") + chalk.gray("]") + chalk.reset(" ");
const warnTag = chalk.gray("[") + chalk.yellow("WARN") + chalk.gray("]") + chalk.reset(" ");
const errorTag = chalk.gray("[") + chalk.red("FAIL") + chalk.gray("]") + chalk.reset(" ");
const successTag = chalk.gray("[") + chalk.green(" OK ") + chalk.gray("]") + chalk.reset(" ");

export class wme_log {

    static info(message: string) {
        if ( doLogging ) { console.info(infoTag + message); }
    }

    static warn(message: string) {
        if ( doLogging ) { console.warn(warnTag + message); }
    }

    static error(message: string) {
        if ( doLogging ) { console.error(errorTag + message); }
    }

    static success(message: string) {
        if ( doLogging ) { console.log(successTag + message); }
    }
    
}