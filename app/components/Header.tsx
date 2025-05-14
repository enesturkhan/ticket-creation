"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AppBar, Toolbar, Typography, Box, Container } from '@mui/material';

export default function Header() {
  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        background: 'transparent', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        padding: '0.5rem 0'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between', padding: { xs: '0.5rem 1rem', sm: 0 } }}>
          <Link href="/" passHref>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
              '&:hover': { opacity: 0.9 }
            }}>
              <Box sx={{ position: 'relative', width: 40, height: 40, mr: 1.5 }}>
                <Image
                  src="/images/logo.png"
                  alt="CodeFusion Logo"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </Box>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                CodeFusion 2025
              </Typography>
            </Box>
          </Link>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link href="/" passHref>
              <Typography 
                sx={{ 
                  color: 'white', 
                  fontWeight: 500, 
                  fontSize: '0.9rem', 
                  opacity: 0.8, 
                  '&:hover': { opacity: 1, color: '#c4b5fd' },
                  cursor: 'pointer'
                }}
              >
                Ana Sayfa
              </Typography>
            </Link>
            <Link href="/form" passHref>
              <Typography 
                sx={{ 
                  color: 'white', 
                  fontWeight: 500, 
                  fontSize: '0.9rem', 
                  opacity: 0.8, 
                  '&:hover': { opacity: 1, color: '#c4b5fd' },
                  cursor: 'pointer'
                }}
              >
                Kayıt Ol
              </Typography>
            </Link>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
} 