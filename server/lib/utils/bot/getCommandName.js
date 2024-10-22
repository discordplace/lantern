function getCommandName(interaction) {
  let name = interaction.commandName;
  let subcommand;
  let group;

  try { subcommand = interaction.options.getSubcommand(); } catch (error) { subcommand = null; }
  try { group = interaction.options.getSubcommandGroup(); } catch (error) { group = null; }

  if (group) name += ` ${group}`;
  if (subcommand) name += ` ${subcommand}`;

  return {
    name,
    subcommand,
    group
  };
}

module.exports = getCommandName;