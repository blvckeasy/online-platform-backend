import config from "./config"

export class ConfigService {
    static get <T> (name: string): T {
        const names = name.split(".")
        let data = config();

        names.forEach((element) => {
            data = data[element];
            if (!data) throw new TypeError(`Cannot read properties of undefined (reading '${element}')`);
        })

        return data as T;
    }
}