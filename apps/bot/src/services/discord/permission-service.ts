import { OverwriteResolvable, PermissionsBitField, OverwriteType } from 'discord.js';

/**
 * Service für die Verwaltung von Discord-Berechtigungen
 */
export class PermissionService {
  /**
   * Erstellt Berechtigungsüberschreibungen für einen Channel
   * @param allowedRoles Die erlaubten Rollen
   * @param isVisible Ob der Channel für alle sichtbar sein soll
   * @returns Die Berechtigungsüberschreibungen
   */
  createOverrides(allowedRoles: string[] = [], isVisible: boolean = true): OverwriteResolvable[] {
    const overrides: OverwriteResolvable[] = [];
    
    // Standard-Berechtigungen für @everyone
    overrides.push({
      id: '0', // @everyone
      type: OverwriteType.Role,
      deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.SendMessages],
      allow: isVisible ? [PermissionsBitField.Flags.ViewChannel] : []
    });
    
    // Wenn der Channel nicht sichtbar sein soll, verweigere die Sichtbarkeit für @everyone
    if (!isVisible) {
      overrides.push({
        id: '0', // @everyone
        type: OverwriteType.Role,
        deny: [PermissionsBitField.Flags.ViewChannel]
      });
    }
    
    // Berechtigungen für erlaubte Rollen
    for (const roleId of allowedRoles) {
      if (roleId) {
        overrides.push({
          id: roleId,
          type: OverwriteType.Role,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.Connect,
            PermissionsBitField.Flags.SendMessages
          ]
        });
      }
    }
    
    return overrides;
  }
}
