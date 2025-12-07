import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Container, TextField, Typography, AppBar, Toolbar, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

export default function GuestLobby() {
    const videoRef = useRef(null);
    const router = useNavigate();
    const [meetingCode] = useState("j99-9v5-kqn");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const getVideo = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing media devices:", err);
            }
        };
        getVideo();
    }, []);

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'white' }}>
            {/* Header - Exact Match from Landing Page */}
            <AppBar position="static" color="transparent" elevation={0} sx={{ bgcolor: 'white', boxShadow: 'rgba(0, 0, 0, 0.22) 0px 4px 10px', py: '0.5rem', px: '1rem' }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }} onClick={() => router('/')}>
                            <Box
                                component="img"
                                src="/fliq_logo_white.png"
                                alt="Logo"
                                sx={{ height: 36, width: 'auto' }}
                            />
                            <Typography
                                component="h1"
                                sx={{
                                    fontSize: '1.4rem',
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

            {/* Main Content - Mimicking the provided Tailwind Layout */}
            {/* class="flex flex-col-reverse md:flex-row items-center justify-center min-h-[82vh] md:min-h-[78vh] bg-gray-100" */}
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column-reverse', md: 'row' },
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: { xs: '82vh', md: '78vh' },
                bgcolor: '#f3f4f6' // bg-gray-100
            }}>
                {/* Left Side: Controls */}
                {/* class="flex flex-col" */}
                <Box sx={{ display: 'flex', flexDirection: 'column', p: 4 }}>

                    {/* class="text-2xl font-bold mb-4" */}
                    <Typography component="h2" sx={{ fontSize: '1.5rem', fontWeight: 700, mb: 2 }}>
                        Enter into Lobby
                    </Typography>

                    {/* Input Field */}
                    <TextField
                        fullWidth
                        placeholder="username"
                        variant="outlined"
                        sx={{
                            mb: 2,
                            bgcolor: 'white',
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 1,
                            }
                        }}
                    />

                    {/* class="bg-purple-500 text-white px-4 py-2 m-6 rounded hover:cursor-pointer" */}
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: '#0284C7',
                            color: 'white',
                            alignSelf: 'center',
                            width: '90%',
                            py: 1,
                            my: 2,
                            borderRadius: '0.25rem', // rounded
                            textTransform: 'none',
                            fontSize: '1rem',
                            fontWeight: 500,
                            boxShadow: 'none',
                            '&:hover': {
                                bgcolor: '#38BDF8',
                                boxShadow: 'none'
                            }
                        }}
                    >
                        Join In
                    </Button>

                    {/* Meeting Code Section */}
                    {/* class="flex items-center gap-2 mb-4" */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        {/* class="font-medium text-gray-700" */}
                        <Typography sx={{ fontWeight: 500, color: '#374151' }}>Meeting Code:</Typography>

                        {/* class="text-purple-600 font-semibold" */}
                        <Typography sx={{ color: '#9333ea', fontWeight: 600 }}>{meetingCode}</Typography>

                        {/* class="p-1 rounded hover:bg-purple-100 hover:cursor-pointer transition" */}
                        <IconButton
                            size="small"
                            sx={{
                                color: '#9333ea',
                                p: 0.5,
                                borderRadius: 1,
                                '&:hover': { bgcolor: '#f3e8ff' }
                            }}
                        >
                            <ContentCopyIcon fontSize="small" sx={{ width: 16, height: 16 }} />
                        </IconButton>
                    </Box>
                </Box>

                {/* Right Side: Video Preview */}
                {/* class="p-4 m-4 md:w-[30vw] md:h-[50vh]" */}
                <Box sx={{
                    p: 2,
                    m: 2,
                    width: { md: '30vw' },
                    height: { md: '50vh' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {/* class="rounded-lg" */}
                    <Box
                        component="video"
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '0.5rem', // rounded-lg
                            transform: 'scaleX(-1)',
                            bgcolor: '#d1d5db'
                        }}
                    />
                </Box>
            </Box>

            {/* Footer - With specific shadow form as requested */}
            <Box component="footer" sx={{
                py: 2,
                textAlign: 'center',
                bgcolor: 'white',
                boxShadow: 'rgba(0, 0, 0, 0.08) 0px -4px 10px' // Reverse of header shadow
            }}>
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
