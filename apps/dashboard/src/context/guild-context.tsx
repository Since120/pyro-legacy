'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { AVAILABLE_GUILDS } from '@/graphql/guild-queries';
import { useAuth } from './auth-context';

export interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  botPresent: boolean;
}

interface GuildContextType {
  currentGuild: DiscordGuild | null;
  availableGuilds: DiscordGuild[];
  setCurrentGuild: (guildId: string) => void;
  loading: boolean;
}

const GuildContext = createContext<GuildContextType>({
  currentGuild: null,
  availableGuilds: [],
  setCurrentGuild: () => {},
  loading: true
});



export const GuildProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [currentGuild, setCurrentGuildState] = useState<DiscordGuild | null>(null);

  const { data, loading } = useQuery(AVAILABLE_GUILDS, {
    skip: !isAuthenticated,
    fetchPolicy: 'network-only'
  });

  const availableGuilds = data?.availableGuilds || [];

  console.log('Available guilds:', availableGuilds);

  useEffect(() => {
    // Wenn Guilds geladen wurden und noch keine aktuelle Guild gesetzt ist
    if (availableGuilds.length > 0 && !currentGuild) {
      // Versuche, die gespeicherte Guild-ID aus dem localStorage zu laden
      const savedGuildId = localStorage.getItem('currentGuildId');

      if (savedGuildId) {
        const guild = availableGuilds.find(g => g.id === savedGuildId);
        if (guild) {
          setCurrentGuildState(guild);
          return;
        }
      }

      // Fallback: Erste verfügbare Guild verwenden
      setCurrentGuildState(availableGuilds[0]);
    }
  }, [availableGuilds, currentGuild]);

  const setCurrentGuild = (guildId: string) => {
    const guild = availableGuilds.find(g => g.id === guildId);
    if (guild) {
      setCurrentGuildState(guild);
      localStorage.setItem('currentGuildId', guildId);

      // Seite neu laden, um alle Daten für die neue Guild zu laden
      window.location.reload();
    }
  };

  return (
    <GuildContext.Provider
      value={{
        currentGuild,
        availableGuilds,
        setCurrentGuild,
        loading
      }}
    >
      {children}
    </GuildContext.Provider>
  );
};

export const useGuild = () => useContext(GuildContext);
