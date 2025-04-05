'use client';

// apps/dashboard/src/components/dashboard/category-management/hooks/useCategories.ts

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useApolloClient, useSubscription } from '@apollo/client';
import { toast } from '@/components/core/toaster';
import { GET_CATEGORIES } from '../../../../graphql/queries';
import { CATEGORY_CREATED, CATEGORY_UPDATED, CATEGORY_REMOVED } from '../../../../graphql/subscriptions';
// GetZonesByCategoryDocument wird nicht mehr benötigt, da Zonen mit GET_CATEGORIES geladen werden
// import { GetZonesByCategoryDocument } from '@pyro/types';
import { CREATE_CATEGORY, UPDATE_CATEGORY, REMOVE_CATEGORY } from '../../../../graphql/mutations';
import {
  GetCategoriesQuery,
  GetCategoriesQueryVariables,
  CreateCategoryMutation,
  CreateCategoryMutationVariables,
  UpdateCategoryMutation,
  UpdateCategoryMutationVariables,
  RemoveCategoryMutation,
  RemoveCategoryMutationVariables,
  Category,
  Zone
} from '@pyro/types';
import { formatDate } from '../utils/formatters';
import { useGuild } from '@/context/guild-context';

// Erweiterter Typ für die Kategorien mit Frontend-spezifischen Eigenschaften
export interface EnhancedCategory extends Omit<Category, 'lastUsage' | 'zones'> {
  guild_id: string; // Assuming guild_id is present on the base Category type from GQL
  totalSecondsInCateg: number;
  lastActive: string;
  totalTimeSpent: number;
  totalUsers: number;
  zones: EnhancedZone[];
}

// Zone-Typ mit Frontend-spezifischen Eigenschaften
export interface EnhancedZone {
  id: string;
  name: string; // Assuming zoneName maps to name
  zoneKey: string;
  minutesRequired: number;
  pointsGranted: number;
  lastActive: string; // Mapped from lastUsage
  totalTimeSpent: number; // Mapped from totalSecondsInZone
  totalUsers: number; // Needs clarification on how this is calculated/derived
}

const initialCategories: EnhancedCategory[] = [];

export interface CategoryInput {
  id?: string;
  name: string;
  allowedRoles: string[];
  isVisible: boolean;
  sendSetup: boolean;
  trackingActive: boolean;
  categoryType?: string;
}

export const useCategories = () => {
  const { currentGuild } = useGuild();
  const guildId = currentGuild?.id || 'default_guild';
  const [categories, setCategories] = useState<EnhancedCategory[]>(initialCategories);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["1"]);
  const [searchQuery, setSearchQuery] = useState('');
  const client = useApolloClient();

  // GraphQL Abfragen mit Fehlerbehandlung
  const {
    data: categoriesData,
    loading,
    error,
    refetch
  } = useQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(GET_CATEGORIES, {
    variables: { guildId, searchQuery: searchQuery || null },
    fetchPolicy: 'network-only',
    skip: !guildId,
    onError: (error) => {
      console.error("Fehler beim Laden der Kategorien:", error);
      toast.error("Fehler beim Laden der Kategorien.");
    }
  });

  // GraphQL Mutationen
  const [createCategoryMutation] = useMutation<CreateCategoryMutation, CreateCategoryMutationVariables>(CREATE_CATEGORY);
  const [updateCategoryMutation] = useMutation<UpdateCategoryMutation, UpdateCategoryMutationVariables>(UPDATE_CATEGORY);
  const [removeCategoryMutation] = useMutation<RemoveCategoryMutation, RemoveCategoryMutationVariables>(REMOVE_CATEGORY);

  // Kategoriedaten von API laden und mappen
  useEffect(() => {
    console.log("DEBUG: raw categoriesData", categoriesData);
    if (categoriesData?.categories) {
      try {
        const mappedCategories: EnhancedCategory[] = categoriesData.categories.map((cat) => {
          const mappedZones: EnhancedZone[] = (cat.zones || []).map((zone: any) => ({
            id: zone.id,
            name: zone.zoneName || "Unnamed Zone",
            zoneKey: zone.zoneKey || "??",
            minutesRequired: zone.minutesRequired || 60,
            pointsGranted: zone.pointsGranted || 0,
            lastActive: zone.lastUsage ? formatDate(zone.lastUsage) : "-",
            totalTimeSpent: zone.totalSecondsInZone ? Math.round(zone.totalSecondsInZone / 60) : 0,
            totalUsers: 0
          }));

          const currentGuildId = (cat as any).guild_id || 'default_guild';

          return {
            id: cat.id,
            name: cat.name || "Unnamed Category",
            guild_id: currentGuildId,
            categoryType: cat.categoryType || "STANDARD",
            allowedRoles: cat.allowedRoles || [],
            isVisible: cat.isVisible !== undefined ? cat.isVisible : true,
            sendSetup: cat.sendSetup !== undefined ? cat.sendSetup : false,
            trackingActive: cat.trackingActive !== undefined ? cat.trackingActive : true,
            lastActive: cat.lastUsage ? formatDate(cat.lastUsage) : "-",
            totalSecondsInCateg: cat.totalSecondsInCateg || 0,
            totalTimeSpent: Math.round((cat.totalSecondsInCateg || 0) / 60),
            totalUsers: 0,
            discordCategoryId: cat.discordCategoryId || null,
            deletedInDiscord: cat.deletedInDiscord || false,
            createdAt: cat.createdAt || new Date(),
            updatedAt: cat.updatedAt || new Date(),
            zones: mappedZones
          };
        });

        console.log("DEBUG: Mapped categories with zones", mappedCategories);
        setCategories(mappedCategories);
      } catch (error) {
        console.error("Fehler bei der Datentransformation:", error);
        toast.error("Fehler bei der Datenverarbeitung.");
      }
    }
  }, [categoriesData, client]);

 // Subscription für neue Kategorien
 useSubscription(CATEGORY_CREATED, {
   // guildId-Parameter entfernt, da er nicht in der Subscription-Definition vorhanden ist
   shouldResubscribe: true,
   onData: ({ data }) => {
     console.log("Subscription CATEGORY_CREATED Daten empfangen:", data);
     const newCategory = data.data?.categoryCreated;
     if (newCategory) {
       try {
         // Kategorie hinzufügen und mit EnhancedCategory-Format mappen
         const mappedCategory: EnhancedCategory = {
           id: newCategory.id,
           name: newCategory.name || "Unnamed Category",
           guild_id: (newCategory as any).guild_id || guildId,
           categoryType: newCategory.categoryType || "STANDARD",
           allowedRoles: newCategory.allowedRoles || [],
           isVisible: newCategory.isVisible !== undefined ? newCategory.isVisible : true,
           sendSetup: newCategory.sendSetup !== undefined ? newCategory.sendSetup : false,
           trackingActive: newCategory.trackingActive !== undefined ? newCategory.trackingActive : true,
           lastActive: newCategory.lastUsage ? formatDate(newCategory.lastUsage) : "-",
           totalSecondsInCateg: newCategory.totalSecondsInCateg || 0,
           totalTimeSpent: Math.round((newCategory.totalSecondsInCateg || 0) / 60),
           totalUsers: 0,
           discordCategoryId: newCategory.discordCategoryId || null,
           deletedInDiscord: newCategory.deletedInDiscord || false,
           createdAt: new Date(),
           updatedAt: new Date(),
           zones: (newCategory.zones || []).map((zone: any) => ({
             id: zone.id,
             name: zone.zoneName || "Unnamed Zone",
             zoneKey: zone.zoneKey || "??",
             minutesRequired: zone.minutesRequired || 60,
             pointsGranted: zone.pointsGranted || 0,
             lastActive: zone.lastUsage ? formatDate(zone.lastUsage) : "-",
             totalTimeSpent: zone.totalSecondsInZone ? Math.round(zone.totalSecondsInZone / 60) : 0,
             totalUsers: 0
           }))
         };

         setCategories(prev => [...prev, mappedCategory]);

         // Kategorie wurde erfolgreich erstellt, jetzt Daten neu laden
         refetch();
       } catch (error) {
         console.error("Fehler bei der Verarbeitung der neuen Kategorie:", error);
       }
     }
   },
   onError: (error) => {
     console.error("Fehler in CATEGORY_CREATED Subscription:", error);
   }
 });

 // Subscription für aktualisierte Kategorien
 useSubscription(CATEGORY_UPDATED, {
   // guildId-Parameter entfernt, da er nicht in der Subscription-Definition vorhanden ist
   shouldResubscribe: true,
   onData: ({ data }) => {
     console.log("Subscription CATEGORY_UPDATED Daten empfangen:", data);
     const updatedCategory = data.data?.categoryUpdated;
     if (updatedCategory) {
       // Kategorie aktualisieren und mit EnhancedCategory-Format mappen
       const mappedCategory: EnhancedCategory = {
         id: updatedCategory.id,
         name: updatedCategory.name || "Unnamed Category",
         guild_id: (updatedCategory as any).guild_id || guildId,
         categoryType: updatedCategory.categoryType || "STANDARD",
         allowedRoles: updatedCategory.allowedRoles || [],
         isVisible: updatedCategory.isVisible !== undefined ? updatedCategory.isVisible : true,
         sendSetup: updatedCategory.sendSetup !== undefined ? updatedCategory.sendSetup : false,
         trackingActive: updatedCategory.trackingActive !== undefined ? updatedCategory.trackingActive : true,
         lastActive: updatedCategory.lastUsage ? formatDate(updatedCategory.lastUsage) : "-",
         totalSecondsInCateg: updatedCategory.totalSecondsInCateg || 0,
         totalTimeSpent: Math.round((updatedCategory.totalSecondsInCateg || 0) / 60),
         totalUsers: 0,
         discordCategoryId: updatedCategory.discordCategoryId || null,
         deletedInDiscord: updatedCategory.deletedInDiscord || false,
         createdAt: new Date(),
         updatedAt: new Date(),
         zones: (updatedCategory.zones || []).map((zone: any) => ({
           id: zone.id,
           name: zone.zoneName || "Unnamed Zone",
           zoneKey: zone.zoneKey || "??",
           minutesRequired: zone.minutesRequired || 60,
           pointsGranted: zone.pointsGranted || 0,
           lastActive: zone.lastUsage ? formatDate(zone.lastUsage) : "-",
           totalTimeSpent: zone.totalSecondsInZone ? Math.round(zone.totalSecondsInZone / 60) : 0,
           totalUsers: 0
         }))
       };

       try {
         // Kategorie in der Liste aktualisieren
         setCategories(prev =>
           prev.map(cat => cat.id === mappedCategory.id ? mappedCategory : cat)
         );

         // Kategorie wurde erfolgreich aktualisiert, jetzt Daten neu laden
         refetch();
       } catch (error) {
         console.error("Fehler bei der Aktualisierung der Kategorie:", error);
       }
     }
   },
   onError: (error) => {
     console.error("Fehler in CATEGORY_UPDATED Subscription:", error);
   }
 });

 // Subscription für gelöschte Kategorien
 useSubscription(CATEGORY_REMOVED, {
   // guildId-Parameter entfernt, da er nicht in der Subscription-Definition vorhanden ist
   shouldResubscribe: true,
   onData: ({ data }) => {
     console.log("Subscription CATEGORY_REMOVED Daten empfangen:", data);
     const removedCategory = data.data?.categoryRemoved;
     if (removedCategory) {
       setCategories(prev =>
         prev.filter(cat => cat.id !== removedCategory.id)
       );
     }
   },
   onError: (error) => {
     console.error("Fehler in CATEGORY_REMOVED Subscription:", error);
   }
 });

  // Kategorie erweitern/schließen
  const toggleCategoryExpand = (categoryId: string) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(expandedCategories.filter(id => id !== categoryId));
    } else {
      setExpandedCategories([...expandedCategories, categoryId]);
    }
  };

  // Kategorie speichern
  const saveCategory = async (categoryData: CategoryInput) => {
    try {
      const input = {
        ...categoryData,
        categoryType: categoryData.categoryType || "STANDARD",
        guild_id: guildId, // Aktuelle Guild-ID aus dem Context verwenden
      };

      console.log('Saving category with input:', input);

      if (categoryData.id) {
        await updateCategoryMutation({
          variables: { input: { ...input, id: categoryData.id } },
          optimisticResponse: {
            updateCategory: (({
              id: categoryData.id,
              name: categoryData.name,
              categoryType: input.categoryType,
              isVisible: categoryData.isVisible,
              trackingActive: categoryData.trackingActive,
              sendSetup: categoryData.sendSetup,
              allowedRoles: categoryData.allowedRoles,
              lastUsage: null,
              totalSecondsInCateg: 0,
              discordCategoryId: null,
              deletedInDiscord: false,
              createdAt: new Date(),
              updatedAt: new Date(),
              zones: []
            } as unknown) as UpdateCategoryMutation["updateCategory"])
          },
          onError: (error) => {
            console.error('Fehler beim Aktualisieren der Kategorie:', error);
            toast.error('Fehler beim Aktualisieren der Kategorie. Server nicht erreichbar.');
          }
        });
        toast.success('Kategorie erfolgreich aktualisiert');
      } else {
        console.log('Creating new category with input:', input);
        await createCategoryMutation({
          variables: { input },
          onError: (error) => {
            console.error('Fehler beim Erstellen der Kategorie:', error);
            toast.error('Fehler beim Erstellen der Kategorie. Server nicht erreichbar.');
          }
        });
        toast.success('Kategorie erfolgreich erstellt');
      }

      refetch();
      return true;
    } catch (error) {
      console.error('Fehler beim Speichern der Kategorie:', error);
      toast.error('Fehler beim Speichern der Kategorie');
      return false;
    }
  };

  // Kategorie mit ihren Zonen aktualisieren
  const updateCategoryWithZones = (categoryId: string, zones: EnhancedZone[]) => {
    setCategories(prevCategories =>
      prevCategories.map(category =>
        category.id === categoryId
          ? { ...category, zones }
          : category
      )
    );
  };

  const getTotalStats = () => {
    const totalUsers = categories.reduce((total, cat) => total + (cat.totalUsers || 0), 0);
    const totalTime = categories.reduce((total, cat) => total + (cat.totalTimeSpent || 0), 0);

    return {
      totalCategories: categories.length,
      totalUsers,
      totalTime
    };
  };

  // Kategorie löschen
  const deleteCategory = async (categoryId: string): Promise<{ success: boolean; message?: string }> => {
    try {
      // Prüfen, ob die Kategorie Zonen enthält
      const category = categories.find(cat => cat.id === categoryId);
      if (!category) {
        return { success: false, message: 'Kategorie nicht gefunden.' };
      }

      if (category.zones && category.zones.length > 0) {
        return {
          success: false,
          message: `Die Kategorie kann nicht gelöscht werden, da noch ${category.zones.length} Zone(n) damit verknüpft sind.`
        };
      }

      // Kategorie löschen
      await removeCategoryMutation({
        variables: { id: categoryId },
        onError: (error) => {
          console.error('Fehler beim Löschen der Kategorie:', error);
          throw new Error('Fehler beim Löschen der Kategorie. Server nicht erreichbar.');
        }
      });

      // Lokalen State aktualisieren
      setCategories(prevCategories => prevCategories.filter(cat => cat.id !== categoryId));

      toast.success('Kategorie erfolgreich gelöscht');
      return { success: true };
    } catch (error) {
      console.error('Fehler beim Löschen der Kategorie:', error);
      toast.error(error instanceof Error ? error.message : 'Fehler beim Löschen der Kategorie');
      return { success: false, message: 'Ein unerwarteter Fehler ist aufgetreten.' };
    }
  };

  return {
    categories,
    loading,
    error,
    expandedCategories,
    searchQuery,
    setSearchQuery,
    toggleCategoryExpand,
    saveCategory,
    updateCategoryWithZones,
    deleteCategory,
    getTotalStats,
    refetch
  };
};
