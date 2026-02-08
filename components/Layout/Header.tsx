'use client';

import { AppBar, Toolbar, Typography, Box } from '@mui/material';

export function Header() {
  return (
    <AppBar
      position="static"
      sx={{
        height: '60px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <Toolbar sx={{ minHeight: '60px !important' }}>
        <Typography variant="h6" component="h1" sx={{ fontWeight: 500 }}>
          🌡️ Tokyo Climate Portal
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Typography
            component="a"
            href="#"
            sx={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '14px',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Welcome
          </Typography>
          <Typography
            component="a"
            href="#"
            sx={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '14px',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            About
          </Typography>
          <Typography
            component="a"
            href="#"
            sx={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '14px',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            FAQ
          </Typography>
          <Typography
            component="a"
            href="#"
            sx={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '14px',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Help
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
