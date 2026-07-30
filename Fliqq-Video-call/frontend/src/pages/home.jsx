import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Box, Typography, Container, Paper } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import withAuth from '../utils/withAuth';
import Header from '../components/Header';
import Footer from '../components/Footer';


function Dashboard() {
    const navigate = useNavigate();
    const { getUserDetails } = useContext(AuthContext);
    const [meetingCode, setMeetingCode] = useState("");
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("Loading...");

    const handleRefresh = () => {
        setLoadingMessage("Taking you to Home...");
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigate("/");
        }, 1500);
    }

    const handleHomeNavigation = () => {
        setLoadingMessage("Loading...");
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigate("/home");
        }, 1500);
    }

    const handleHistoryNavigation = () => {
        setLoadingMessage("Loading Meeting History...");
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigate("/history");
        }, 2000);
    }

    const handleProfileNavigation = () => {
        navigate("/profile");
    }

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                const details = await getUserDetails(token);
                console.log(details)
                setUserData(details);
            }
        }
        fetchUser();
        // getUserDetails comes from AuthContext and is a new reference each render.
        // This effect intentionally runs once on mount to load user data.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleJoinVideoCall = () => {
        if (meetingCode.trim()) {
            navigate(`/${meetingCode}`)
        }
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
        <Box sx={{ minHeight: '100vh', bgcolor: '#f9fafb', display: 'flex', flexDirection: 'column' }}>
            <Header
                handleRefresh={handleRefresh}
                handleHomeNavigation={handleHomeNavigation}
                handleHistoryNavigation={handleHistoryNavigation}
                handleProfileNavigation={handleProfileNavigation}
                userData={userData}
            />

            <Container maxWidth="md" sx={{ mt: { xs: 4, md: 10 }, display: 'flex', justifyContent: 'center', px: 3 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 4, md: 6 },
                        width: '100%',
                        borderRadius: 6,
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 6,
                        bgcolor: 'white',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }}
                >
                    <Box sx={{ flex: 1, width: '100%' }}>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827', mb: 1 }}>
                            {userData?.name ? `Hello, ${userData.name}! 👋` : "Welcome Back! 👋"}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#6b7280', mb: 2, fontSize: '1.1rem' }}>
                            Enjoy seamless video calling with Fliqq
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                            <TextField
                                value={meetingCode}
                                onChange={e => setMeetingCode(e.target.value)}
                                placeholder="Enter Meeting Code"
                                variant="outlined"
                                fullWidth
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        bgcolor: '#f9fafb',
                                        '& fieldset': { borderColor: '#e5e7eb' },
                                        '&:hover fieldset': { borderColor: '#d1d5db' },
                                        '&.Mui-focused fieldset': { borderColor: '#b588d9' }
                                    }
                                }}
                            />
                            <Button
                                onClick={handleJoinVideoCall}
                                variant='contained'
                                disabled={!meetingCode}
                                sx={{
                                    bgcolor: '#f3e8ff',
                                    color: '#9c27b0',
                                    fontWeight: 700,
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: 3,
                                    textTransform: 'none',
                                    whiteSpace: 'nowrap',
                                    boxShadow: 'none',
                                    border: '1.5px solid #b588d9',
                                    '&:hover': { bgcolor: '#e9d5ff', boxShadow: 'none' },
                                    '&:disabled': { bgcolor: '#f3f4f6', color: '#9ca3af' }
                                }}
                            >
                                Join Meeting
                            </Button>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 3 }}>
                            <Box sx={{ height: '1px', flex: 1, bgcolor: '#e5e7eb' }} />
                            <Typography sx={{ color: '#9ca3af', fontSize: '0.875rem', fontWeight: 500 }}>OR</Typography>
                            <Box sx={{ height: '1px', flex: 1, bgcolor: '#e5e7eb' }} />
                        </Box>

                        <Button
                            variant='contained'
                            fullWidth
                            sx={{
                                bgcolor: '#9c27b0',
                                color: 'white',
                                fontWeight: 700,
                                py: 2,
                                borderRadius: 3,
                                textTransform: 'none',
                                fontSize: '1.1rem',
                                boxShadow: '0 4px 6px -1px rgba(156, 39, 176, 0.3), 0 2px 4px -1px rgba(156, 39, 176, 0.15)',
                                '&:hover': {
                                    bgcolor: '#8e24aa',
                                    boxShadow: '0 10px 15px -3px rgba(156, 39, 176, 0.4), 0 4px 6px -2px rgba(156, 39, 176, 0.2)'
                                }
                            }}
                            onClick={() => {
                                const generateCode = () => Math.random().toString(36).substring(2, 5) + '-' + Math.random().toString(36).substring(2, 6) + '-' + Math.random().toString(36).substring(2, 5);
                                const randomCode = generateCode();
                                setLoadingMessage("Creating Meeting...");
                                setLoading(true);
                                setTimeout(() => {
                                    setLoading(false);
                                    navigate("/lobby", { state: { meetingCode: randomCode } });
                                }, 3000);
                            }}
                        >
                            ✨ Create New Meeting
                        </Button>
                    </Box>

                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center' }}>
                        <Box sx={{
                            width: 220,
                            height: 220,
                            bgcolor: '#f3e8ff',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                width: '120%',
                                height: '120%',
                                borderRadius: '50%',
                                border: '1px dashed #d8b4fe',
                                animation: 'spin 20s linear infinite'
                            }
                        }}>
                            <Box
                                component="img"
                                src="/dashboard_icon.jpg"
                                alt="Fliqq Symbol"
                                sx={{ width: '85%', height: 'auto', mixBlendMode: 'multiply', borderRadius: '50%' }}
                            />
                        </Box>
                    </Box>
                </Paper>
            </Container>
            <Footer />

            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>
        </Box >
    )
}

export default withAuth(Dashboard);