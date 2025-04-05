'use client';

// apps/dashboard/src/components/dashboard/category-management/hooks/useZones.ts

import { useMutation, useQuery } from '@apollo/client';
import { toast } from '@/components/core/toaster';
import {
  GET_ZONES_BY_CATEGORY
} from '../../../../graphql/queries';
import {
  CREATE_ZONE,
  UPDATE_ZONE,
  REMOVE_ZONE
} from '../../../../graphql/mutations';
import {
  CreateZoneMutation,
  CreateZoneMutationVariables,
  UpdateZoneMutation,
  UpdateZoneMutationVariables,
  RemoveZoneMutation,
  RemoveZoneMutationVariables,
  GetZonesByCategoryQuery,
  GetZonesByCategoryQueryVariables,
  UpdateZoneInput,
  CreateZoneInput,
  Zone
} from '@pyro/types';
import { EnhancedZone } from './useCategories';
import { formatDate } from '../utils/formatters';
import { useEffect, useState } from 'react';
import { useGuild } from '@/context/guild-context';

export interface ZoneInput {
  id?: string;
  name: string;
  zoneKey: string;
  minutesRequired: number;
  pointsGranted: number;
}

/**
 * Custom hook für die Verwaltung von Zonen innerhalb einer Kategorie
 */
export const useZones = (
  categoryId?: string,
  updateParentCategory?: (categoryId: string, zones: EnhancedZone[]) => void
) => {
  const { currentGuild } = useGuild();
  const guildId = currentGuild?.id || 'default_guild';
  const [zones, setZones] = useState<EnhancedZone[]>([]);

  // GraphQL Abfragen
  const {
    data: zonesData,
    loading,
    refetch
  } = useQuery<GetZonesByCategoryQuery, GetZonesByCategoryQueryVariables>(
    GET_ZONES_BY_CATEGORY,
    {
      variables: { categoryId: categoryId || '' },
      skip: !categoryId,
      fetchPolicy: 'network-only',
      onError: (error) => {
        console.error("Fehler beim Laden der Zonen:", error);
      }
    }
  );

  // GraphQL Mutations
  const [createZone] = useMutation<CreateZoneMutation, CreateZoneMutationVariables>(CREATE_ZONE);
  const [updateZone] = useMutation<UpdateZoneMutation, UpdateZoneMutationVariables>(UPDATE_ZONE);
  const [removeZone] = useMutation<RemoveZoneMutation, RemoveZoneMutationVariables>(REMOVE_ZONE);

  // Laden der Zonen-Daten
  useEffect(() => {
    if (zonesData?.zonesByCategory && categoryId) {
      try {
        const enhancedZones: EnhancedZone[] = zonesData.zonesByCategory.map((zone: any) => ({
          id: zone.id,
          name: zone.zoneName || "Unnamed Zone",
          zoneKey: zone.zoneKey || "??",
          minutesRequired: zone.minutesRequired || 60,
          pointsGranted: zone.pointsGranted || 5,
          lastActive: zone.lastUsage ? formatDate(zone.lastUsage) : "-",
          totalTimeSpent: Math.round((zone.totalSecondsInZone || 0) / 60),
          totalUsers: zone.totalSecondsInZone ? Math.floor(zone.totalSecondsInZone / 3600) : 0
        }));

        setZones(enhancedZones);

        // Parent-Komponente informieren, falls callback vorhanden
        if (updateParentCategory) {
          updateParentCategory(categoryId, enhancedZones);
        }
      } catch (error) {
        console.error("Fehler bei der Verarbeitung der Zonen-Daten:", error);
      }
    }
  }, [zonesData, categoryId]);

  // Zone speichern (erstellen oder aktualisieren)
  const saveZone = async (zoneData: ZoneInput): Promise<boolean> => {
    if (!categoryId) return false;

    try {
      if (zoneData.id) {
        // Zone aktualisieren
        const zoneInput: UpdateZoneInput = {
          id: zoneData.id, // id ist für UpdateZoneInput erforderlich
          zoneName: zoneData.name,
          zoneKey: zoneData.zoneKey,
          minutesRequired: zoneData.minutesRequired,
          pointsGranted: zoneData.pointsGranted,
          categoryId,
          guild_id: guildId // Aktuelle Guild-ID verwenden
        };

        await updateZone({
          variables: { input: zoneInput },
          onError: (error) => {
            console.error('Fehler beim Aktualisieren der Zone:', error);
            toast.error('Fehler beim Aktualisieren der Zone');
            return false;
          }
        });

        toast.success('Zone erfolgreich aktualisiert');
      } else {
        // Neue Zone erstellen
        const zoneInput: CreateZoneInput = {
          zoneName: zoneData.name,
          zoneKey: zoneData.zoneKey,
          minutesRequired: zoneData.minutesRequired,
          pointsGranted: zoneData.pointsGranted,
          categoryId,
          guild_id: guildId // Aktuelle Guild-ID verwenden
        };

        await createZone({
          variables: { input: zoneInput },
          onError: (error) => {
            console.error('Fehler beim Erstellen der Zone:', error);
            toast.error('Fehler beim Erstellen der Zone');
            return false;
          }
        });

        toast.success('Zone erfolgreich erstellt');
      }

      await refetch();
      return true;
    } catch (error) {
      console.error('Fehler beim Speichern der Zone:', error);
      toast.error('Fehler beim Speichern der Zone');
      return false;
    }
  };

  // Zone löschen
  const deleteZone = async (zoneId: string): Promise<boolean> => {
    try {
      await removeZone({
        variables: { id: zoneId },
        onError: (error) => {
          console.error('Fehler beim Löschen der Zone:', error);
          toast.error('Fehler beim Löschen der Zone');
          return false;
        },
        update: (cache, { data }) => {
          if (data?.removeZone) {
            // Aktualisiere den Cache, um die gelöschte Zone zu entfernen
            const deletedZoneId = data.removeZone.id;

            // Aktualisiere den Cache für GET_ZONES_BY_CATEGORY
            const existingData = cache.readQuery<GetZonesByCategoryQuery>({
              query: GET_ZONES_BY_CATEGORY,
              variables: { categoryId }
            });

            if (existingData && existingData.zonesByCategory) {
              cache.writeQuery({
                query: GET_ZONES_BY_CATEGORY,
                variables: { categoryId },
                data: {
                  zonesByCategory: existingData.zonesByCategory.filter(
                    zone => zone.id !== deletedZoneId
                  )
                }
              });
            }
          }
        }
      });

      toast.success('Zone erfolgreich gelöscht');
      await refetch();
      return true;
    } catch (error) {
      console.error('Fehler beim Löschen der Zone:', error);
      toast.error('Fehler beim Löschen der Zone');
      return false;
    }
  };

  return { zones, loading, saveZone, deleteZone, refetch };
};