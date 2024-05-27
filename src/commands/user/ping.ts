import { type CommandContext, Declare, Embed, LocalesT } from "seyfert";
import { StelleCommand } from "#stelle/classes";

import { StelleOptions } from "#stelle/decorators";

@Declare({
    name: "ping",
    description: "Get the Stelle ping.",
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
})
@StelleOptions({ cooldown: 5 })
@LocalesT("locales.ping.name", "locales.ping.description")
export default class PingCommand extends StelleCommand {
    async run(ctx: CommandContext): Promise<void> {
        const { client } = ctx;
        const { messages } = ctx.t.get();

        const embed = new Embed().setColor(client.config.color.extra).setDescription(messages.commands.ping.message).setTimestamp();

        await ctx.editOrReply({ embeds: [embed] });

        const wsPing = Math.floor(client.gateway.latency);
        const clientPing = Math.floor(Date.now() - (ctx.message ?? ctx.interaction)!.createdTimestamp);

        embed.setColor(client.config.color.success).setDescription(messages.commands.ping.response({ clientPing, wsPing }));

        await ctx.editOrReply({ embeds: [embed] });
    }
}
