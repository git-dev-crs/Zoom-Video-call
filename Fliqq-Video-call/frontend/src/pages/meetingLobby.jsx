import React, { useEffect, useRef, useState, useContext } from 'react';
import { Box, Button, TextField, Typography, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AuthContext } from '../contexts/AuthContext';
import withAuth from '../utils/withAuth';

function MeetingLobby() {
    const { getUserDetails } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [username, setUsername] = useState("");
    const videoRef = useRef(null);
    const router = useNavigate();
    const location = useLocation();

    const [meetingCode, setMeetingCode] = useState("");
    const [copied, setCopied] = useState(false);
    const [mediaError, setMediaError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [openPermissionDialog, setOpenPermissionDialog] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                const details = await getUserDetails(token);
                setUserData(details);
                if (details?.name) {
                    setUsername(details.name);
                }
            }
        }
        fetchUser();

        if (location.state?.meetingCode) {
            setMeetingCode(location.state.meetingCode);
        } else {
            const randomCode = Math.random().toString(36).substring(2, 7);
            setMeetingCode(randomCode);
        }
    }, [getUserDetails, location.state]);

    const handleJoin = () => {
        if (username.trim()) {
            router(`/${meetingCode}`, { state: { username: username } });
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(meetingCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getVideo = async () => {
        setIsLoading(true);
        try {
            // Mobile-friendly constraints
            const constraints = {
                video: { facingMode: 'user' },
                audio: true
            };
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                // Important: Ensure video plays on mobile
                videoRef.current.play().catch(e => console.error("Play error:", e));
                setMediaError("");
                setOpenPermissionDialog(false);
            }
        } catch (err) {
            console.error("Error accessing media devices:", err);
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                setMediaError("Permission Denied");
            } else if (err.name === 'NotReadableError') {
                setMediaError("Camera Busy");
            } else {
                setMediaError(`${err.name}: ${err.message}`);
            }
            setOpenPermissionDialog(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // FIX: Capture ref at the TOP of the effect so ESLint knows it's stable
        // and it's available in the cleanup even after unmount clears videoRef.current
        const videoEl = videoRef.current;
        getVideo();
        return () => {
            if (videoEl && videoEl.srcObject) {
                const tracks = videoEl.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }
        }
    }, []);

    const handleRefresh = () => {
        router("/");
    }
    const handleHomeNavigation = () => {
        router("/home");
    }
    const handleHistoryNavigation = () => {
        router("/history");
    }
    const handleProfileNavigation = () => {
        router("/profile");
    }

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f3f4f6' }}>
            <Header
                handleRefresh={handleRefresh}
                handleHomeNavigation={handleHomeNavigation}
                handleHistoryNavigation={handleHistoryNavigation}
                handleProfileNavigation={handleProfileNavigation}
                userData={userData}
            />

            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column-reverse', md: 'row' },
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: { xs: '82vh', md: '78vh' },
                flex: 1
            }}>
                {/* Left Side: Controls */}
                <Box sx={{ display: 'flex', flexDirection: 'column', p: 4, bgcolor: '#f3f4f6' }}>
                    <Typography component="h2" sx={{ fontSize: '1.5rem', fontWeight: 700, mb: 2 }}>
                        Enter into Lobby
                    </Typography>

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

                    <Button
                        variant="contained"
                        onClick={handleJoin}
                        disabled={!meetingCode}
                        sx={{
                            bgcolor: '#a855f7',
                            color: 'white',
                            alignSelf: 'center',
                            width: '90%',
                            py: 1,
                            my: 2,
                            borderRadius: '0.25rem',
                            textTransform: 'none',
                            fontSize: '1rem',
                            fontWeight: 500,
                            boxShadow: 'none',
                            '&:hover': {
                                bgcolor: '#9333ea',
                                boxShadow: 'none'
                            }
                        }}
                    >
                        Join In
                    </Button>

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
                <Box sx={{
                    p: 2,
                    m: 2,
                    width: { md: '30vw', xs: '100%' },
                    height: { md: '50vh', xs: '50vh' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                }}>
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
                            borderRadius: '0.5rem',
                            transform: 'scaleX(-1)',
                            bgcolor: '#d1d5db',
                            display: mediaError ? 'none' : 'block'
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
                            <Typography color="error" fontWeight="600" variant="h6">
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

            <Dialog
                open={openPermissionDialog}
                onClose={() => setOpenPermissionDialog(false)}
                PaperProps={{ sx: { borderRadius: 2, p: 1 } }}
            >
                <DialogTitle sx={{ fontWeight: 700, color: '#9333ea', textAlign: 'center' }}>
                    Camera Access Needed
                </DialogTitle>
                <DialogContent>
                    <Typography textAlign="center" sx={{ mb: 2 }}>
                        To join the video call, Fliqq needs access to your camera and microphone.
                    </Typography>
                    <Box sx={{ bgcolor: '#f3f4f6', p: 2, borderRadius: 1, mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight="600">
                            If the prompt didn't appear:
                        </Typography>
                        <ol style={{ paddingLeft: '20px', margin: '8px 0' }}>
                            <li>Look for a <strong>lock icon</strong> or <strong>camera icon</strong> in your address bar.</li>
                            <li>Click it and select <strong>"Allow"</strong>.</li>
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

            <Footer />
        </Box>
    );
}

export default withAuth(MeetingLobby);
