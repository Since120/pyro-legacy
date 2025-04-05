'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CaretUpDown as CaretUpDownIcon } from '@phosphor-icons/react/dist/ssr/CaretUpDown';

import { usePopover } from '@/hooks/use-popover';
import { useGuild } from '@/context/guild-context';

import { WorkspacesPopover } from './workspaces-popover';

export function WorkspacesSwitch(): React.JSX.Element {
  const popover = usePopover<HTMLDivElement>();
  const { currentGuild, loading } = useGuild();

  // Discord Server Icon URL erstellen
  const getDiscordIconUrl = (guildId: string, icon: string | null) => {
    if (!icon) return '/assets/discord-default.png'; // Fallback-Icon
    return `https://cdn.discordapp.com/icons/${guildId}/${icon}.png`;
  };

  if (loading || !currentGuild) {
    return (
      <Stack
        direction="row"
        spacing={2}
        sx={{
          alignItems: 'center',
          border: '1px solid var(--Workspaces-border-color)',
          borderRadius: '12px',
          p: '4px 8px',
        }}
      >
        <Box sx={{ width: 32, height: 32, borderRadius: '4px', backgroundColor: 'grey.300' }} />
        <Box sx={{ flex: '1 1 auto' }}>
          <Typography color="var(--Workspaces-title-color)" variant="caption">
            Discord
          </Typography>
          <Typography color="var(--Workspaces-name-color)" variant="subtitle2">
            Lädt...
          </Typography>
        </Box>
      </Stack>
    );
  }

  return (
    <React.Fragment>
      <Stack
        direction="row"
        onClick={popover.handleOpen}
        ref={popover.anchorRef}
        spacing={2}
        sx={{
          alignItems: 'center',
          border: '1px solid var(--Workspaces-border-color)',
          borderRadius: '12px',
          cursor: 'pointer',
          p: '4px 8px',
        }}
      >
        <Avatar
          src={getDiscordIconUrl(currentGuild.id, currentGuild.icon)}
          variant="rounded"
          sx={{ width: 32, height: 32 }}
        />
        <Box sx={{ flex: '1 1 auto' }}>
          <Typography color="var(--Workspaces-title-color)" variant="caption">
            Discord
          </Typography>
          <Typography color="var(--Workspaces-name-color)" variant="subtitle2">
            {currentGuild.name}
          </Typography>
        </Box>
        <CaretUpDownIcon color="var(--Workspaces-expand-color)" fontSize="var(--icon-fontSize-sm)" />
      </Stack>
      <WorkspacesPopover
        anchorEl={popover.anchorRef.current}
        onChange={popover.handleClose}
        onClose={popover.handleClose}
        open={popover.open}
      />
    </React.Fragment>
  );
}
