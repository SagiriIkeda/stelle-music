import { BaseHandler } from "seyfert/lib/common/index.js";
import { Lavalink } from "./Lavalink.js";

import type { Stelle } from "#stelle/client";

/**
 * Main Stelle music handler.
 */
export class StelleHandler extends BaseHandler {
    readonly client: Stelle;

    /**
     *
     * Create a new instance of the handler.
     * @param client
     */
    constructor(client: Stelle) {
        super(client.logger);
        this.client = client;
    }

    /**
     * Load the handler.
     */
    public async load() {
        const files = await this.loadFilesK<Lavalink>(await this.getFiles(await this.client.getRC().then((x) => x.lavalink)));

        for await (const file of files) {
            const path = file.path.split(process.cwd()).slice(1).join(process.cwd());
            const event: Lavalink = file.file;

            if (!(event && event instanceof Lavalink)) {
                this.logger.warn(`${path} doesn't export by \`export default new Lavaink({ ... })\``);
                continue;
            }

            if (!event.name) {
                this.logger.warn(`${path} doesn't have a \`name\``);
                continue;
            }

            const run = (...args: any) => event.run(this.client, ...args);

            if (event.isShoukaku()) this.client.manager.shoukaku.on(event.name, run);
            else if (event.isKazagumo()) this.client.manager.on(event.name, run);
        }
    }

    /**
     *
     * Reload all `shoukaku` & `kazagumo` events.
     * @returns
     */
    //well,.. this is weird, but works.
    reloadAll(): Promise<void> {
        this.client.manager.removeAllListeners();
        this.client.manager.shoukaku.removeAllListeners();
        return this.load();
    }
}
