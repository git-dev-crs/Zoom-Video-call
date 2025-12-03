import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AppBar,
    Box,
    Button,
    Container,
    Grid,
    Toolbar,
    Typography,
    useTheme,
    useMediaQuery
} from '@mui/material';

export default function LandingPage() {
    const router = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: 'background.default',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <AppBar position="static" color="transparent" elevation={0} sx={{ pt: 2 }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                                component="img"
                                src="/logo.png"
                                alt="Fliq Logo"
                                sx={{ height: 40, width: 'auto' }}
                            />
                            <Typography
                                variant="h5"
                                noWrap
                                component="div"
                                sx={{
                                    fontWeight: 700,
                                    color: '#9c27b0', // Purple color
                                    letterSpacing: '.1rem'
                                }}
                            >
                                Fliq
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={() => router("/auth")}
                                sx={{
                                    color: '#9c27b0',
                                    borderColor: '#9c27b0',
                                    '&:hover': { borderColor: '#7b1fa2', bgcolor: 'rgba(156, 39, 176, 0.04)' }
                                }}
                            >
                                Sign Up
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => router("/auth")}
                                sx={{
                                    bgcolor: '#9c27b0',
                                    '&:hover': { bgcolor: '#7b1fa2' }
                                }}
                            >
                                Login
                            </Button>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <Container maxWidth="xl" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', mt: 4 }}>
                <Grid container spacing={8} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                            <Typography variant={isMobile ? "h3" : "h2"} component="h1" fontWeight="bold" gutterBottom sx={{ color: '#333' }}>
                                Seamless Video Calling with Fliq
                            </Typography>
                            <Typography variant="h6" sx={{ mb: 4, color: '#666', lineHeight: 1.6 }}>
                                Experience high-quality video calls with no hassle. Connect with friends, family, or colleagues instantly with just one click.
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    onClick={() => router("/aljk23")}
                                    sx={{
                                        color: '#9c27b0',
                                        borderColor: '#9c27b0',
                                        fontSize: '1.1rem',
                                        px: 4,
                                        py: 1.5,
                                        '&:hover': { borderColor: '#7b1fa2', bgcolor: 'rgba(156, 39, 176, 0.04)' }
                                    }}
                                >
                                    Join as Guest
                                </Button>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => router("/auth")}
                                    sx={{
                                        bgcolor: '#9c27b0',
                                        fontSize: '1.1rem',
                                        px: 4,
                                        py: 1.5,
                                        '&:hover': { bgcolor: '#7b1fa2' }
                                    }}
                                >
                                    Get Started
                                </Button>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Box
                            sx={{
                                position: 'relative',
                                width: '100%',
                                maxWidth: '600px',
                                aspectRatio: '4/3',
                                bgcolor: '#f5f5f5',
                                borderRadius: 4,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                            }}
                        >
                            <Box
                                component="img"
                                src="/mobile.png"
                                alt="Video Call Illustration"
                                sx={{
                                    maxWidth: '90%',
                                    height: 'auto',
                                    display: 'block'
                                }}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}