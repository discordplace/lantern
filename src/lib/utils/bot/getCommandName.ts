import type { BaseInteraction } from 'discord.js';

/**
 * Extracts the command name, subcommand, and subcommand group from a given interaction.
 *
 * @param interaction - The interaction object from which to extract the command details.
 * @returns An object containing the command name, subcommand, and subcommand group, or null if the interaction is not a chat input command or autocomplete.
 */
function getCommandName(interaction: BaseInteraction): { name: string, subcommand: string | null, group: string | null } | null {
  if (!interaction.isChatInputCommand() && !interaction.isAutocomplete()) {
    if (interaction.isContextMenuCommand()) return {
      name: interaction.commandName,
      subcommand: null,
      group: null
    };

    return null;
  }

  let name = interaction.commandName;
  const subcommand = interaction.options.getSubcommand(false);
  const group = interaction.options.getSubcommandGroup(false);

  if (group) name += ` ${group}`;
  if (subcommand) name += ` ${subcommand}`;

  return {
    name,
    subcommand,
    group
  };
}

export default getCommandName;