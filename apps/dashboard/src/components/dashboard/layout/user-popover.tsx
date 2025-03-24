'use client';

import type * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { CreditCard as CreditCardIcon } from '@phosphor-icons/react/dist/ssr/CreditCard';
import { LockKey as LockKeyIcon } from '@phosphor-icons/react/dist/ssr/LockKey';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { SignOut as SignOutIcon } from '@phosphor-icons/react/dist/ssr/SignOut';

import { paths } from '@/paths';
import { useAuth } from '@/context/auth-context';

export interface UserPopoverProps {
  anchorEl: null | Element;
  onClose?: () => void;
  open: boolean;
}

export function UserPopover({ anchorEl, onClose, open }: UserPopoverProps): React.JSX.Element {
  const { user, logout } = useAuth();
  
  const handleSignOut = () => {
    onClose?.();
    logout();
  };
  
  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      onClose={onClose}
      open={Boolean(open)}
      slotProps={{ paper: { sx: { width: '280px' } } }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle1">{user?.username || 'User'}</Typography>
        <Typography color="text.secondary" variant="body2">
          {user?.discriminator ? `#${user.discriminator}` : ''}
        </Typography>
      </Box>
      <Divider />
      <List sx={{ p: 1 }}>
        <MenuItem component={RouterLink} href={paths.dashboard.settings.account} onClick={onClose}>
          <ListItemIcon>
            <UserIcon />
          </ListItemIcon>
          Account
        </MenuItem>
        <MenuItem component={RouterLink} href={paths.dashboard.settings.security} onClick={onClose}>
          <ListItemIcon>
            <LockKeyIcon />
          </ListItemIcon>
          Security
        </MenuItem>
        <MenuItem component={RouterLink} href={paths.dashboard.settings.billing} onClick={onClose}>
          <ListItemIcon>
            <CreditCardIcon />
          </ListItemIcon>
          Billing
        </MenuItem>
      </List>
      <Divider />
      <Box sx={{ p: 1 }}>
        <MenuItem 
          onClick={handleSignOut} 
          sx={{ justifyContent: 'center' }}
        >
          <ListItemIcon>
            <SignOutIcon />
          </ListItemIcon>
          Sign out
        </MenuItem>
      </Box>
    </Popover>
  );
}