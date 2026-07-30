import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import {
    AppBar,
    Box,
    Button,
    Container,
    Grid,
    Paper,
    Toolbar,
    Typography,
    useTheme,
    useMediaQuery,
    IconButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

export default function LandingPage() {
    const router = useNavigate();
    const theme = useTheme();
    useMediaQuery(theme.breakpoints.down('md')); // kept for potential future use
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const { getUserDetails } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);

    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("Loading...");

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const details = await getUserDetails(token);
                    setUserData(details);
                } catch (e) {
                    console.error("Failed to fetch user on landing", e);
                }
            }
        }
        fetchUser();
    }, [getUserDetails]);

    const handleRefresh = () => {
        setLoadingMessage("Taking you to Home...");
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router("/");
        }, 1500);
    }

    const handleHomeNavigation = () => {
        setLoadingMessage("Loading...");
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router("/home");
        }, 1500);
    }



    const handleHistoryNavigation = () => {
        setLoadingMessage("Loading Meeting History...");
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router("/history");
        }, 2000);
    }

    const handleProfileNavigation = () => {
        router("/profile");
    }

    if (loading) {
        return (
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#ffffff',
                position: 'relative'
            }}>
                {/* Creative Sonar Ripple Animation */}
                <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
                    <Box sx={{
                        position: 'absolute',
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        bgcolor: '#a855f7',
                        opacity: 0.7,
                        animation: 'ripple 1.5s linear infinite'
                    }} />
                    <Box sx={{
                        position: 'absolute',
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        bgcolor: '#a855f7',
                        opacity: 0.7,
                        animation: 'ripple 1.5s linear infinite',
                        animationDelay: '0.75s'
                    }} />
                    <Box sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        bgcolor: '#a855f7',
                        zIndex: 1
                    }} />
                </Box>

                <Typography sx={{ mt: 2, color: '#6b7280', fontSize: '1.1rem', fontWeight: 500, letterSpacing: '0.5px' }}>
                    {loadingMessage}
                </Typography>
                <style>
                    {`
                        @keyframes ripple {
                            0% {
                                transform: scale(1);
                                opacity: 0.7;
                            }
                            100% {
                                transform: scale(4);
                                opacity: 0;
                            }
                        }
                    `}
                </style>
            </Box>
        )
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: 'background.default',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {userData ? (
                <Header
                    handleRefresh={handleRefresh}
                    handleHomeNavigation={handleHomeNavigation}
                    handleHistoryNavigation={handleHistoryNavigation}
                    handleProfileNavigation={handleProfileNavigation}
                    userData={userData}
                />
            ) : (
                <AppBar position="static" color="transparent" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #e5e7eb', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)', py: '0.5rem', px: '1rem' }}>
                    <Container maxWidth="xl">
                        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', border: 'none' }}>
                                <Box
                                    component="img"
                                    src="/fliq_logo_white.png"
                                    alt="Logo"
                                    sx={{ height: 40, width: 'auto', border: 'none' }}
                                />
                                <Typography
                                    component="h1"
                                    sx={{
                                        fontSize: '1.5rem',
                                        fontWeight: 800,
                                        color: '#b588d9',
                                        fontFamily: 'Poppins, sans-serif'
                                    }}
                                >
                                    Fliqq
                                </Typography>
                            </Box>

                            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
                                <Button
                                    onClick={() => router("/auth")}
                                    sx={{
                                        px: 2,
                                        py: 1,
                                        fontWeight: 600,
                                        color: '#b588d9',
                                        border: '1px solid #b588d9',
                                        borderRadius: '8px',
                                        textTransform: 'none',
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            bgcolor: '#f3e8ff',
                                            cursor: 'pointer'
                                        }
                                    }}
                                >
                                    Sign Up
                                </Button>
                                <Button
                                    onClick={() => router("/auth")}
                                    sx={{
                                        px: 2,
                                        py: 1,
                                        fontWeight: 600,
                                        color: 'white',
                                        bgcolor: '#099be4ff',
                                        borderRadius: '8px',
                                        textTransform: 'none',
                                        boxShadow: 'none',
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            bgcolor: '#38BDF8',
                                            cursor: 'pointer',
                                            boxShadow: 'none'
                                        }
                                    }}
                                >
                                    Login
                                </Button>
                            </Box>

                            {/* Mobile Menu Button */}
                            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                                <IconButton
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    sx={{
                                        color: '#9c27b0'
                                    }}
                                >
                                    {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                                </IconButton>
                            </Box>
                        </Toolbar>

                        {/* Mobile Menu - Inside Container, Right-Aligned */}
                        {mobileMenuOpen && (
                            <Box
                                sx={{
                                    display: { xs: 'flex', md: 'none' },
                                    flexDirection: 'column',
                                    gap: 1.5,
                                    mt: 2,
                                    justifyContent: 'center',
                                    alignItems: 'flex-end',
                                    pr: 2,
                                    transition: 'all 0.3s ease-in-out'
                                }}
                            >
                                <Button
                                    onClick={() => {
                                        router("/auth");
                                        setMobileMenuOpen(false);
                                    }}
                                    sx={{
                                        width: 'auto',
                                        px: 2,
                                        py: 1,
                                        fontWeight: 600,
                                        color: '#b588d9',
                                        border: '1px solid #b588d9',
                                        borderRadius: '8px',
                                        textTransform: 'none',
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            bgcolor: '#f3e8ff',
                                            cursor: 'pointer'
                                        }
                                    }}
                                >
                                    Sign Up
                                </Button>
                                <Button
                                    onClick={() => {
                                        router("/auth");
                                        setMobileMenuOpen(false);
                                    }}
                                    sx={{
                                        width: 'auto',
                                        px: 2,
                                        py: 1,
                                        fontWeight: 600,
                                        color: 'white',
                                        bgcolor: '#0284C7',
                                        borderRadius: '8px',
                                        textTransform: 'none',
                                        boxShadow: 'none',
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            bgcolor: '#38BDF8',
                                            cursor: 'pointer',
                                            boxShadow: 'none'
                                        }
                                    }}
                                >
                                    Login
                                </Button>
                            </Box>
                        )}
                    </Container>
                </AppBar>
            )}


            <Box
                component="section"
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '70vh',
                    px: 3,
                    py: 8,
                    gap: 6,
                    bgcolor: '#f9fafb'
                }}
            >
                <Box sx={{ p: { xs: 2, md: 4 }, width: { xs: '100%', md: '50%' } }}>
                    <Typography
                        component="h2"
                        sx={{
                            fontSize: { xs: '2rem', md: '2.5rem' },
                            fontWeight: 700,
                            color: '#000000',
                            fontFamily: 'Poppins, Inter, sans-serif',
                            lineHeight: 1.2,
                            letterSpacing: '-0.03em',
                            mb: 2
                        }}
                    >
                        Seamless Video Calling with Fliqq
                    </Typography>
                    <Typography
                        sx={{
                            mt: 2,
                            mb: 3,
                            color: '#4b5563',
                            maxWidth: '42rem',
                            lineHeight: 1.75
                        }}
                    >
                        Experience high-quality video calls with no hassle. Connect with friends, family, or colleagues instantly with just one click.
                    </Typography>
                    <Box>
                        <Button
                            onClick={() => router("/guest")}
                            sx={{
                                fontFamily: 'monospace',
                                fontWeight: 600,
                                px: { xs: 1, md: 2 },
                                py: 1,
                                mr: 2,
                                mb: 1,
                                color: '#C38BFF',
                                border: '1px solid #C38BFF',
                                borderRadius: '8px',
                                textTransform: 'none',
                                transition: 'all 0.3s',
                                '&:hover': {
                                    bgcolor: '#f3e8ff',
                                    cursor: 'pointer'
                                }
                            }}
                        >
                            Join as Guest
                        </Button>
                        <Button
                            onClick={() => router("/auth")}
                            sx={{
                                fontFamily: 'monospace',
                                fontWeight: 600,
                                px: { xs: 1, md: 2 },
                                py: 1,
                                mb: 1,
                                bgcolor: '#c084fc',
                                color: 'white',
                                borderRadius: '8px',
                                textTransform: 'none',
                                boxShadow: 'none',
                                transition: 'all 0.3s',
                                '&:hover': {
                                    bgcolor: '#a855f7',
                                    cursor: 'pointer',
                                    boxShadow: 'none'
                                }
                            }}
                        >
                            Get Started
                        </Button>
                    </Box>
                </Box>

                <Box sx={{
                    px: { xs: 5, md: 4 },
                    minHeight: { xs: 'auto', md: '40vh' },
                    width: { xs: '100%', md: '33.333%' }
                }}>
                    <Box
                        sx={{
                            position: 'relative',
                            overflow: 'hidden',
                            borderRadius: 4,
                            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                            transition: 'all 0.5s ease-in-out',
                            '&:hover': {
                                boxShadow: '0 25px 70px rgba(0,0,0,0.2)',
                            }
                        }}
                    >
                        <Box
                            component="img"
                            src="/landing_hero.jpg"
                            alt="video-call hero image"
                            sx={{
                                width: '100%',
                                height: 'auto',
                                display: 'block',
                                borderRadius: 4,
                                transform: 'scale(1)',
                                transition: 'transform 0.7s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.05)'
                                }
                            }}
                        />
                    </Box>
                </Box>
            </Box>

            <Box
                component="section"
                sx={{
                    bgcolor: 'white',
                    px: 3,
                    py: 6
                }}
            >
                <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
                    <Typography
                        component="h3"
                        sx={{
                            fontSize: { xs: '2.25rem', md: '3rem' },
                            fontWeight: 700,
                            color: '#000000',
                            fontFamily: 'Poppins, Inter, sans-serif',
                            lineHeight: 1.2,
                            letterSpacing: '-0.03em',
                            mb: 2
                        }}
                    >
                        What is Fliqq?
                    </Typography>
                    <Typography
                        sx={{
                            color: '#4b5563',
                            maxWidth: '48rem',
                            mx: 'auto'
                        }}
                    >
                        Fliqq is a modern, lightweight video meeting platform designed to make online collaboration effortless. Whether you're hosting a team meeting, running a class, or catching up with friends, Fliqq gives you a smooth, no-fuss experience with powerful extras like meeting history and attendee tracking — all in one place.
                    </Typography>
                </Container>
            </Box>

            <Box
                component="section"
                sx={{
                    px: 3,
                    py: 6,
                    bgcolor: '#f9fafb'
                }}
            >
                <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
                    <Typography
                        component="h4"
                        sx={{
                            fontSize: { xs: '2.25rem', md: '3rem' },
                            fontWeight: 700,
                            color: '#000000',
                            fontFamily: 'Poppins, Inter, sans-serif',
                            lineHeight: 1.2,
                            letterSpacing: '-0.03em',
                            mb: 2
                        }}
                    >
                        Built for You
                    </Typography>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Paper
                                sx={{
                                    p: 3,
                                    bgcolor: '#f9fafb',
                                    borderRadius: 4,
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                    transition: 'all 0.3s',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    '&:hover': {
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                                    }
                                }}
                            >
                                <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, mb: 2, color: '#C38BFF' }}>
                                    📅 Meeting History
                                </Typography>
                                <Typography sx={{ color: '#4b5563' }}>
                                    Access a complete log of your past video calls — including times, users, and duration.
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper
                                sx={{
                                    p: 3,
                                    bgcolor: '#f9fafb',
                                    borderRadius: 4,
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                    transition: 'all 0.3s',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    '&:hover': {
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                                    }
                                }}
                            >
                                <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, mb: 2, color: '#C38BFF' }}>
                                    👥 Attendee Tracking
                                </Typography>
                                <Typography sx={{ color: '#4b5563' }}>
                                    See a full list of attendees for each meeting. Perfect for tracking participation and collaboration.
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper
                                sx={{
                                    p: 3,
                                    bgcolor: '#f9fafb',
                                    borderRadius: 4,
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                    transition: 'all 0.3s',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    '&:hover': {
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                                    }
                                }}
                            >
                                <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, mb: 2, color: '#C38BFF' }}>
                                    🔐 Google Login
                                </Typography>
                                <Typography sx={{ color: '#4b5563' }}>
                                    Sign in quickly and securely with your Google account. No extra passwords, just one click.
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper
                                sx={{
                                    p: 3,
                                    bgcolor: '#f9fafb',
                                    borderRadius: 4,
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                    transition: 'all 0.3s',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    '&:hover': {
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                                    }
                                }}
                            >
                                <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, mb: 2, color: '#C38BFF' }}>
                                    💬 Real-Time Video & Chat
                                </Typography>
                                <Typography sx={{ color: '#4b5563' }}>
                                    High-quality video, audio, and messaging — all in one sleek, responsive interface.
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper
                                sx={{
                                    p: 3,
                                    bgcolor: '#f9fafb',
                                    borderRadius: 4,
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                    transition: 'all 0.3s',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    '&:hover': {
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                                    }
                                }}
                            >
                                <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, mb: 2, color: '#C38BFF' }}>
                                    ✨ Simple & Intuitive
                                </Typography>
                                <Typography sx={{ color: '#4b5563' }}>
                                    Clean design with zero clutter. Fliqq is built for humans, not just techies.
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper
                                sx={{
                                    p: 3,
                                    bgcolor: '#f9fafb',
                                    borderRadius: 4,
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                    transition: 'all 0.3s',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    '&:hover': {
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                                    }
                                }}
                            >
                                <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, mb: 2, color: '#C38BFF' }}>
                                    📝 Editable Profile
                                </Typography>
                                <Typography sx={{ color: '#4b5563' }}>
                                    Update your name, profile picture, and preferences anytime. Keep your Fliqq identity fresh and personal.
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Box
                component="section"
                sx={{
                    bgcolor: 'white',
                    px: 3,
                    py: 10
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography
                            component="h4"
                            sx={{
                                fontSize: { xs: '2.25rem', md: '3rem' },
                                fontWeight: 700,
                                color: '#000000',
                                fontFamily: 'Poppins, Inter, sans-serif',
                                lineHeight: 1.2,
                                letterSpacing: '-0.03em',
                                mb: 1
                            }}
                        >
                            How It Works
                        </Typography>
                        <Typography
                            sx={{
                                color: '#4b5563',
                                mt: 2,
                                maxWidth: '42rem',
                                mx: 'auto'
                            }}
                        >
                            Just a few simple steps to start, connect, and stay on top of every meeting.
                        </Typography>
                    </Box>

                    <Box sx={{ maxWidth: '80vw', mx: 'auto' }}>
                        {/* Step 1 */}
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                alignItems: 'center',
                                mb: 5,
                                gap: 5
                            }}
                        >
                            <Box sx={{ width: { xs: '100%', md: '33.333%' } }}>
                                <Box
                                    component="img"
                                    src="/block_section_page.webp"
                                    alt="Start a call"
                                    sx={{
                                        width: '100%',
                                        borderRadius: 4,
                                        boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
                                    }}
                                />
                            </Box>
                            <Box sx={{ width: { xs: '100%', md: '50%' }, textAlign: { xs: 'center', md: 'left' } }}>
                                <Typography
                                    component="h5"
                                    sx={{
                                        fontSize: '1.5rem',
                                        fontWeight: 700,
                                        color: '#C38BFF',
                                        fontFamily: 'Poppins, sans-serif',
                                        lineHeight: 1.5,
                                        mb: 2
                                    }}
                                >
                                    🚀 Start or Join Instantly
                                </Typography>
                                <Typography sx={{ color: '#4b5563', fontSize: '1.125rem' }}>
                                    Click log in to launch a meeting in seconds — no setup or downloads.
                                </Typography>
                            </Box>
                        </Box>

                        {/* Step 2 - Reversed */}
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row-reverse' },
                                alignItems: 'center',
                                mb: 5,
                                gap: 5
                            }}
                        >
                            <Box sx={{ width: { xs: '100%', md: '33.333%' } }}>
                                <Box
                                    component="img"
                                    src="/block_section_page_1.webp"
                                    alt="Share link"
                                    sx={{
                                        width: '100%',
                                        borderRadius: 4,
                                        boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
                                    }}
                                />
                            </Box>
                            <Box sx={{ width: { xs: '100%', md: '50%' }, textAlign: { xs: 'center', md: 'left' } }}>
                                <Typography
                                    component="h5"
                                    sx={{
                                        fontSize: '1.5rem',
                                        fontWeight: 700,
                                        color: '#C38BFF',
                                        mb: 2
                                    }}
                                >
                                    🔗 Share the Link
                                </Typography>
                                <Typography sx={{ color: '#4b5563', fontSize: '1.125rem' }}>
                                    Send the unique meeting link to others — they can join instantly.
                                </Typography>
                            </Box>
                        </Box>

                        {/* Step 3 */}
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                alignItems: 'center',
                                gap: 5
                            }}
                        >
                            <Box sx={{ width: { xs: '100%', md: '33.333%' } }}>
                                <Box
                                    component="img"
                                    src="/block_section_page_2.webp"
                                    alt="Track meetings"
                                    sx={{
                                        width: '100%',
                                        borderRadius: 4,
                                        boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
                                    }}
                                />
                            </Box>
                            <Box sx={{ width: { xs: '100%', md: '50%' }, textAlign: { xs: 'center', md: 'left' } }}>
                                <Typography
                                    component="h5"
                                    sx={{
                                        fontSize: '1.5rem',
                                        fontWeight: 700,
                                        color: '#C38BFF',
                                        mb: 2
                                    }}
                                >
                                    📊 View History & Attendees
                                </Typography>
                                <Typography sx={{ color: '#4b5563', fontSize: '1.125rem' }}>
                                    After the call, see a complete meeting history and who attended — all in your dashboard.
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Container>
            </Box>

            <Box component="footer" sx={{ py: 2, textAlign: 'center', bgcolor: 'white', boxShadow: 'rgba(0, 0, 0, 0.05) 0px -4px 10px' }}>
                <Typography variant="body2" sx={{ color: '#4b5563', fontSize: '0.875rem' }}>
                    © 2025 Fliqq. All rights reserved.
                </Typography>
                <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 1, color: '#4b5563', fontWeight: 600 }}>
                    Designed and Developed by <a href="https://www.linkedin.com/in/mohit-jatav-6819a0260/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>Mohit Jatav</a>
                </Typography>
            </Box>
        </Box>
    );
}