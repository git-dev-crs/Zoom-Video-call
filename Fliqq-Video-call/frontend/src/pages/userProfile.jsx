import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Paper, TextField, Button, Avatar, Grid } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import withAuth from '../utils/withAuth';

function UserProfile() {
    const navigate = useNavigate();
    const { getUserDetails, updateUserProfile } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState("Loading Profile...");
    const [editingBio, setEditingBio] = useState(false);
    const [editingLocation, setEditingLocation] = useState(false);
    const [editingName, setEditingName] = useState(false);
    const [photoHover, setPhotoHover] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [fileName, setFileName] = useState("No file chosen");

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserData(prev => ({ ...prev, photoUrl: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Initial State
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        username: '',
        bio: '',
        location: '',
        photoUrl: ''
    });

    // Loading handlers
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

    const handleProfileNavigation = () => { }; // Already on profile

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                const details = await getUserDetails(token);
                setUserData(prev => ({ ...prev, ...details }));
            }
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        }
        fetchUser();
        // getUserDetails comes from AuthContext and is a new reference each render.
        // This effect intentionally runs once on mount to load profile data.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };



    const handleSave = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setErrorMessage("Authentication token missing. Please login again.");
                setShowError(true);
                setTimeout(() => setShowError(false), 3000);
                return;
            }

            await updateUserProfile({
                token: token,
                ...userData
            });
            console.log("Saved user data:", userData);

            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
            }, 3000);
        } catch (err) {
            console.error("Failed to save profile:", err);
            setErrorMessage(err.response?.data?.message || "Failed to save profile. Please restart backend.");
            setShowError(true);
            setTimeout(() => {
                setShowError(false);
            }, 3000);
        }
    };





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
            {showSuccess && (
                <Box sx={{
                    position: 'fixed',
                    top: 20,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bgcolor: '#d1fae5',
                    color: '#065f46',
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    zIndex: 9999,
                    fontWeight: 600,
                    fontSize: '0.95rem'
                }}>
                    <Box
                        component="span"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 20,
                            height: 20,
                            bgcolor: '#10b981',
                            borderRadius: '4px',
                            color: 'white',
                            fontSize: '12px'
                        }}
                    >
                        ✓
                    </Box>
                    Profile updated successfully!
                </Box>
            )}
            {showError && (
                <Box sx={{
                    position: 'fixed',
                    top: 20,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bgcolor: '#fee2e2',
                    color: '#991b1b',
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    zIndex: 9999,
                    fontWeight: 600,
                    fontSize: '0.95rem'
                }}>
                    <Box
                        component="span"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 20,
                            height: 20,
                            bgcolor: '#ef4444',
                            borderRadius: '4px',
                            color: 'white',
                            fontSize: '12px'
                        }}
                    >
                        ✕
                    </Box>
                    {errorMessage || "Failed to save profile."}
                </Box>
            )}
            <Header
                handleRefresh={handleRefresh}
                handleHomeNavigation={handleHomeNavigation}
                handleHistoryNavigation={handleHistoryNavigation}
                handleProfileNavigation={handleProfileNavigation}
                userData={userData}
            />

            <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 4, md: 6 },
                        pb: { xs: 4, md: 2 }, // Reduced bottom padding
                        borderRadius: 6,
                        bgcolor: 'white',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }}
                >
                    <Grid container spacing={6}>
                        {/* Left Column: Photo & Action */}
                        <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: { md: '1px solid #f3f4f6' } }}>
                            <Box sx={{ position: 'relative', mb: 3 }}>
                                <Avatar
                                    src={userData.photoUrl}
                                    sx={{ width: 150, height: 150, bgcolor: '#f3f4f6', color: '#b588d9', fontSize: '3rem', fontWeight: 600 }}
                                >
                                    {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                                </Avatar>
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                <label
                                    htmlFor="photo-upload"
                                    style={{ cursor: 'pointer', display: 'block' }}
                                    onMouseEnter={() => setPhotoHover(true)}
                                    onMouseLeave={() => setPhotoHover(false)}
                                >
                                    <Typography variant="body1" sx={{ color: '#111827', fontWeight: 500, '&:hover': { color: '#9c27b0' } }}>
                                        Change Photo
                                    </Typography>
                                </label>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                                    <input
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id="photo-upload"
                                        type="file"
                                        onChange={handleFileChange}
                                    />
                                    <label htmlFor="photo-upload">
                                        <Typography
                                            component="span"
                                            sx={{
                                                bgcolor: photoHover ? '#e9d5ff' : '#f3e8ff',
                                                color: '#9c27b0',
                                                py: 1,
                                                px: 2,
                                                borderRadius: 2,
                                                fontWeight: 600,
                                                fontSize: '0.9rem',
                                                cursor: 'pointer',
                                                '&:hover': { bgcolor: '#e9d5ff' },
                                                transition: 'background-color 0.2s'
                                            }}
                                        >
                                            Choose File
                                        </Typography>
                                    </label>
                                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                        {fileName}
                                    </Typography>
                                </Box>
                            </Box>

                        </Grid>

                        {/* Right Column: Form Fields */}
                        <Grid item xs={12} md={8}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                                <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827' }}>
                                    My Profile
                                </Typography>
                                {/* Edit Button Removed as fields are inline editable */}
                            </Box>

                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" sx={{ color: '#111827', fontWeight: 600, mb: 1, ml: 1 }}>
                                        Full Name
                                    </Typography>
                                    {!editingName ? (
                                        <Box
                                            onClick={() => setEditingName(true)}
                                            sx={{
                                                p: 2,
                                                cursor: 'pointer',
                                                borderRadius: 2,
                                                bgcolor: '#f9fafb',
                                                '&:hover': { bgcolor: '#f3f4f6' }
                                            }}
                                        >
                                            <Typography variant="body1" sx={{ color: userData.name ? '#374151' : '#9ca3af' }}>
                                                {userData.name || "Click to add name"}
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <TextField
                                            name="name"
                                            value={userData.name}
                                            onChange={handleChange}
                                            autoFocus
                                            onBlur={() => setEditingName(false)}
                                            fullWidth
                                            variant="outlined"
                                            placeholder="John Doe"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    bgcolor: 'white',
                                                    '&.Mui-focused fieldset': { borderColor: '#b588d9' }
                                                }
                                            }}
                                        />
                                    )}
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" sx={{ color: '#111827', fontWeight: 600, mb: 1, ml: 1 }}>
                                        Email / Username
                                    </Typography>
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor: '#f3f4f6',
                                            border: '1px solid transparent'
                                        }}
                                    >
                                        <Typography variant="body1" sx={{ color: '#6b7280' }}>
                                            {userData.email || userData.username}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body2" sx={{ color: '#111827', fontWeight: 600, mb: 1, ml: 1 }}>
                                        Bio
                                    </Typography>
                                    {!editingBio ? (
                                        <Box
                                            onClick={() => setEditingBio(true)}
                                            sx={{
                                                p: 2,
                                                cursor: 'pointer',
                                                borderRadius: 2,
                                                bgcolor: '#f9fafb',
                                                '&:hover': { bgcolor: '#f3f4f6' }
                                            }}
                                        >
                                            <Typography variant="body1" sx={{ color: userData.bio ? '#374151' : '#9ca3af' }}>
                                                {userData.bio || "Click to add bio"}
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <TextField
                                            name="bio"
                                            value={userData.bio}
                                            onChange={handleChange}
                                            autoFocus
                                            onBlur={() => setEditingBio(false)}
                                            fullWidth
                                            multiline
                                            rows={3}
                                            variant="outlined"
                                            placeholder="Tell us about yourself"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    bgcolor: 'white',
                                                    '&.Mui-focused fieldset': { borderColor: '#b588d9' }
                                                }
                                            }}
                                        />
                                    )}
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body2" sx={{ color: '#111827', fontWeight: 600, mb: 1, ml: 1 }}>
                                        Location
                                    </Typography>
                                    {!editingLocation ? (
                                        <Box
                                            onClick={() => setEditingLocation(true)}
                                            sx={{
                                                p: 2,
                                                cursor: 'pointer',
                                                borderRadius: 2,
                                                bgcolor: '#f9fafb',
                                                '&:hover': { bgcolor: '#f3f4f6' }
                                            }}
                                        >
                                            <Typography variant="body1" sx={{ color: userData.location ? '#374151' : '#9ca3af' }}>
                                                {userData.location || "Click to add Location"}
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <TextField
                                            name="location"
                                            value={userData.location}
                                            onChange={handleChange}
                                            autoFocus
                                            onBlur={() => setEditingLocation(false)}
                                            fullWidth
                                            variant="outlined"
                                            placeholder="Where are you based?"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    bgcolor: 'white',
                                                    '&.Mui-focused fieldset': { borderColor: '#b588d9' }
                                                }
                                            }}
                                        />
                                    )}
                                </Grid>

                                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>

                                    <Button
                                        variant="contained"
                                        onClick={handleSave}
                                        sx={{
                                            bgcolor: '#a855f7',
                                            '&:hover': { bgcolor: '#9333ea' },
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            px: 4,
                                            borderRadius: 2
                                        }}
                                    >
                                        Save Changes
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                </Paper>
            </Container >
            <Footer />
        </Box >
    );
}

export default withAuth(UserProfile);
