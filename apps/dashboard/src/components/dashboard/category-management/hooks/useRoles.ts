// apps/dashboard/src/components/dashboard/category-management/hooks/useRoles.ts

'use client';

import { useQuery } from '@apollo/client';
import { GET_ROLES } from '../../../../graphql/queries';
import { GetRolesQuery, GetRolesQueryVariables } from '@pyro/types';

// Erweiterte Typdefinition für Discord-Rollen
interface DiscordRole {
  id: string;
  name: string;
  color: number;
  colorHex?: string;
  position: number;
}
import { useGuild } from '../../../../context/guild-context';

/**
 * Hook zum Laden der Rollen für eine bestimmte Gilde.
 *
 * @param guildId Die ID der Gilde, für die die Rollen geladen werden sollen. Default ist 'default_guild'.
 * @returns Ein Objekt mit den Rollen, einem Lade-Status und einem Fehler-Status.
 */
export const useRoles = (guildId?: string) => {
  const { currentGuild } = useGuild();

  // Verwende die übergebene guildId oder die ID der aktuellen Guild
  const effectiveGuildId = guildId || currentGuild?.id || 'default_guild';

  console.log('Loading roles for guild:', effectiveGuildId);

  const {
    data: rolesData,
    loading,
    error
  } = useQuery<GetRolesQuery, GetRolesQueryVariables>(
    GET_ROLES,
    {
      variables: { guildId: effectiveGuildId },
      fetchPolicy: 'network-only',
      onError: (error) => {
        console.error("Fehler beim Laden der Rollen:", error);
      }
    }
  );

  // Fallback-Werte für Demo-Zwecke
  const defaultRoles = [
    { value: "123456789", label: "Admin", color: 16711680, colorHex: "#FF0000" }, // Rot
    { value: "234567890", label: "Moderator", color: 65280, colorHex: "#00FF00" }, // Grün
    { value: "345678901", label: "VIP", color: 255, colorHex: "#0000FF" }, // Blau
    { value: "456789012", label: "Member", color: 16776960, colorHex: "#FFFF00" }, // Gelb
    { value: "567890123", label: "Newbie", color: 65535, colorHex: "#00FFFF" }, // Cyan
    { value: "678901234", label: "Bot", color: 16711935, colorHex: "#FF00FF" } // Magenta
  ];

  // Konvertiere die Rollen in das Format, das von der Dropdown-Komponente erwartet wird
  const availableRoles = rolesData?.roles?.map((role: any) => {
    return {
      value: role.id, // Verwende die Rollen-ID als Wert
      label: role.name, // Verwende den Rollen-Namen als Anzeigenamen
      color: role.color, // Behalte die numerische Farbe für GraphQL
      colorHex: role.colorHex || '#000000' // Verwende die vom Server bereitgestellte Hex-Farbe
    };
  }) || defaultRoles;

  console.log('Available roles:', availableRoles);

  return {
    roles: availableRoles,
    loading,
    error
  };
};