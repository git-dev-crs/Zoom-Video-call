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
            backgroundImage: 'url("/background.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <AppBar position="static" color="transparent" elevation={0} sx={{ pt: 2 }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
                        <Typography
                            variant="h5"
                            noWrap
                            component="div"
                            sx={{
                                fontWeight: 700,
                                color: 'white',
                                letterSpacing: '.1rem'
                            }}
                        >
                            Apna Video Call
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                onClick={() => router("/aljk23")}
                                sx={{ color: 'white' }}
                            >
                                Join as Guest
                            </Button>
                            <Button
                                onClick={() => router("/auth")}
                                sx={{ color: 'white' }}
                            >
                                Register
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => router("/auth")}
                                sx={{
                                    bgcolor: '#FF9839',
                                    '&:hover': { bgcolor: '#e68a33' }
                                }}
                            >
                                Login
                            </Button>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <Container maxWidth="xl" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Box sx={{ textAlign: { xs: 'center', md: 'left' }, color: 'white' }}>
                            <Typography variant={isMobile ? "h3" : "h2"} component="h1" fontWeight="bold" gutterBottom>
                                <span style={{ color: "#FF9839" }}>Connect</span> with your loved Ones
                            </Typography>
                            <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                                Cover a distance by Apna Video Call
                            </Typography>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => router("/auth")}
                                sx={{
                                    bgcolor: '#FF9839',
                                    fontSize: '1.2rem',
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: '50px',
                                    '&:hover': { bgcolor: '#e68a33' }
                                }}
                            >
                                Get Started
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Box
                            component="img"
                            src="/mobile.png"
                            alt="Video Call App Interface"
                            sx={{
                                maxWidth: '100%',
                                height: 'auto',
                                maxHeight: '80vh',
                                display: { xs: 'none', md: 'block' } // Hide on very small screens if needed, or adjust
                            }}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}