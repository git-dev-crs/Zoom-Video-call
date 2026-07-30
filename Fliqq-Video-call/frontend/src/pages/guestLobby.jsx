import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Container, TextField, Typography, AppBar, Toolbar, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

export default function GuestLobby() {
    const [username, setUsername] = useState("");
    const videoRef = useRef(null);
    const router = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");
    const [copied, setCopied] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mediaError, setMediaError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [openPermissionDialog, setOpenPermissionDialog] = useState(false);

    const generateMeetingCode = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        const segment = () => {
            let res = '';
            for (let i = 0; i < 3; i++) res += chars.charAt(Math.floor(Math.random() * chars.length));
            return res;
        };
        return `${segment()}-${segment()}-${segment()}`;
    };

    useEffect(() => {
        // Initialize meeting code from session storage or generate new one
        const storedCode = sessionStorage.getItem("meeting_code");
        if (storedCode) {
            setMeetingCode(storedCode);
        } else {
            const newCode = generateMeetingCode();
            setMeetingCode(newCode);
            sessionStorage.setItem("meeting_code", newCode);
        }
    }, []);

    const handleJoin = () => {
        // Navigate to the video meeting page with the meeting code and username
        if (username.trim()) {
            router(`/${meetingCode}`, { state: { username: username } });
        } else {
            // Optional: Alert user to enter username or generate a guest one
            router(`/${meetingCode}`, { state: { username: "Guest" } });
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(meetingCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset copied status after 2 seconds
    };

    const getVideo = async () => {
        setIsLoading(true);
        try {
            // Mobile-friendly constraints
            const constraints = {
                video: { facingMode: 'user' }, // Prefer front camera
                audio: true
            };
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setMediaError("");
                setOpenPermissionDialog(false);
            }
        } catch (err) {
            console.error("Error accessing media devices:", err);
            // Detailed error for debugging
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                setMediaError("Permission Denied");
            } else if (err.name === 'NotReadableError') {
                setMediaError("Camera Busy"); // Common on mobile if another app uses it
            } else if (err.name === 'OverconstrainedError') {
                setMediaError("Incompatible Device");
            } else {
                setMediaError(`${err.name}: ${err.message}`); // Show actual error for debugging
            }
            setOpenPermissionDialog(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getVideo();
    }, []);

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'white' }}>
            {/* Header - Exact Match from Landing Page */}
            <AppBar position="static" color="transparent" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #e5e7eb', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)', py: '0.5rem', px: '1rem' }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
                        <Box
                            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}
                            onClick={() => {
                                sessionStorage.removeItem("meeting_code"); // Clear code so a new one generates next time
                                router('/');
                            }}
                        >
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
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                        onClick={handleJoin}
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
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ fontWeight: 500, color: '#374151' }}>Meeting Code:</Typography>

                            <Typography sx={{ color: '#9333ea', fontWeight: 600 }}>{meetingCode}</Typography>

                            <Tooltip title={copied ? "Copied!" : "Copy to clipboard"} placement="bottom">
                                <IconButton
                                    size="small"
                                    onClick={handleCopy}
                                    sx={{
                                        color: '#9333ea',
                                        p: 0.5,
                                        borderRadius: 1,
                                        '&:hover': { bgcolor: '#f3e8ff' }
                                    }}
                                >
                                    <ContentCopyIcon fontSize="small" sx={{ width: 16, height: 16 }} />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        {copied && (
                            <Typography sx={{ color: '#22c55e', fontSize: '0.875rem', mt: 0.5, fontWeight: 500 }}>
                                Copied!
                            </Typography>
                        )}
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
                    justifyContent: 'center',
                    position: 'relative' // For overlay
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
                            bgcolor: '#d1d5db',
                            display: mediaError ? 'none' : 'block' // Hide video if error
                        }}
                    />

                    {mediaError && (
                        <Box sx={{
                            position: 'absolute',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2,
                            bgcolor: 'rgba(255,255,255,0.95)',
                            p: 3,
                            borderRadius: 2,
                            textAlign: 'center',
                            width: '80%'
                        }}>
                            <Typography color="error" fontWeight={600} variant="h6">
                                {mediaError === "Permission Denied" ? "Access Blocked" : "Camera Error"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {mediaError === "Permission Denied"
                                    ? "Please allow camera access in your browser address bar."
                                    : "We couldn't access your camera."}
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={getVideo}
                                disabled={isLoading}
                            >
                                {isLoading ? "Retrying..." : "Try Again"}
                            </Button>
                        </Box>
                    )}
                </Box>
            </Box>

            {/* Dialog for explicit 'Popup' request */}
            <Dialog
                open={openPermissionDialog}
                onClose={() => setOpenPermissionDialog(false)}
                PaperProps={{
                    sx: { borderRadius: 2, p: 1 }
                }}
            >
                <DialogTitle sx={{ fontWeight: 700, color: '#9333ea', textAlign: 'center' }}>
                    Camera Access Needed
                </DialogTitle>
                <DialogContent>
                    <Typography textAlign="center" sx={{ mb: 2 }}>
                        To join the video call, Fliqq needs access to your camera and microphone.
                    </Typography>
                    <Box sx={{ bgcolor: '#f3f4f6', p: 2, borderRadius: 1, mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight={600}>
                            If the prompt didn't appear:
                        </Typography>
                        <ol style={{ paddingLeft: '20px', margin: '8px 0' }}>
                            <li>Look for a <strong>lock icon</strong> or <strong>camera icon</strong> in your address bar URL.</li>
                            <li>Click it and select <strong>"Allow"</strong> or <strong>"Reset Permission"</strong>.</li>
                            <li>Refresh the page.</li>
                        </ol>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button
                        onClick={() => {
                            setOpenPermissionDialog(false);
                            getVideo();
                        }}
                        variant="contained"
                        sx={{ bgcolor: '#0284C7', '&:hover': { bgcolor: '#0ea5e9' } }}
                    >
                        I've Enabled It
                    </Button>
                </DialogActions>
            </Dialog>

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
