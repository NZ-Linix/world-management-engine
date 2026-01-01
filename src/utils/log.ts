import chalk from "chalk";

export class wme_log {

    static info(message: string) {
        const infoTag = chalk.gray("[") + chalk.blue("INFO") + chalk.gray("]") + chalk.reset(" ");
        console.log(infoTag + message);
    }

    static warn(message: string) {
        const warnTag = chalk.gray("[") + chalk.yellow("WARN") + chalk.gray("]") + chalk.reset(" ");
        console.log(warnTag + message);
    }

    static error(message: string) {
        const errorTag = chalk.gray("[") + chalk.red("FAIL") + chalk.gray("]") + chalk.reset(" ");
        console.log(errorTag + message);
    }

    static success(message: string) {
        const successTag = chalk.gray("[") + chalk.green(" OK ") + chalk.gray("]") + chalk.reset(" ");
        console.log(successTag + message);
    }
    
}