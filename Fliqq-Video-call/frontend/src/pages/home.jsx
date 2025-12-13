import React, { useContext, useState } from 'react';
import withAuth from '../utils/withAuth';
import { useNavigate } from 'react-router-dom';
import {
    AppBar,
    Box,
    Button,
    Container,
    IconButton,
    Paper,
    TextField,
    Toolbar,
    Typography,
    useTheme,
    useMediaQuery
} from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import LogoutIcon from '@mui/icons-material/Logout';
import { AuthContext } from '../contexts/AuthContext';

function HomeComponent() {
    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");
    const { addToUserHistory } = useContext(AuthContext);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    let handleJoinVideoCall = async () => {
        if (meetingCode.trim().length > 0) {
            await addToUserHistory(meetingCode)
            navigate(`/${meetingCode}`)
        }
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f9fafb' }}>
            <AppBar position="static" color="transparent" elevation={0} sx={{ bgcolor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)', p: 2 }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }} onClick={() => navigate("/home")}>
                            <Box
                                component="img"
                                src="/fliq_logo_white.png"
                                alt="Fliqq Logo"
                                sx={{ height: 40, width: 'auto' }}
                            />
                            <Typography
                                component="h1"
                                sx={{
                                    fontSize: '1.5rem',
                                    fontWeight: 800,
                                    color: '#b588d9'
                                }}
                            >
                                Fliqq
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Button
                                startIcon={<RestoreIcon />}
                                onClick={() => navigate("/history")}
                                sx={{
                                    color: '#6b7280',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    '&:hover': { bgcolor: '#f3f4f6', color: '#9c27b0' }
                                }}
                            >
                                History
                            </Button>
                            <Button
                                startIcon={<LogoutIcon />}
                                onClick={() => {
                                    localStorage.removeItem("token")
                                    navigate("/auth")
                                }}
                                sx={{
                                    color: '#ef4444',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    '&:hover': { bgcolor: '#fef2f2' }
                                }}
                            >
                                Logout
                            </Button>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

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
                            Welcome Back! 👋
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#6b7280', mb: 5, fontSize: '1.1rem' }}>
                            Ready to connect? Start a new meeting or join an existing one instantly.
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
                                    boxShadow: 'none',
                                    '&:hover': { bgcolor: '#e9d5ff', boxShadow: 'none' },
                                    '&:disabled': { bgcolor: '#f3f4f6', color: '#9ca3af' }
                                }}
                            >
                                Join
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
                                const randomCode = Math.random().toString(36).substring(2, 7);
                                setMeetingCode(randomCode);
                            }}
                        >
                            ✨ Create New Meeting
                        </Button>
                    </Box>

                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center' }}>
                        <Box sx={{
                            width: 200,
                            height: 200,
                            bgcolor: '#f3e8ff',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                width: '140%',
                                height: '140%',
                                borderRadius: '50%',
                                border: '1px dashed #d8b4fe',
                                animation: 'spin 20s linear infinite'
                            }
                        }}>
                            <Box
                                component="img"
                                src="/fliq_symbol_new.jpg"
                                alt="Fliqq Symbol"
                                sx={{ width: '60%', height: 'auto', mixBlendMode: 'multiply' }}
                            />
                        </Box>
                    </Box>
                </Paper>
            </Container>
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>
        </Box>
    )
}

export default withAuth(HomeComponent)