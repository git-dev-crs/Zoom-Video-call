import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Paper
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function History() {
    const { getHistoryOfUser, getUserDetails } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([]);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("Loading...");
    const navigate = useNavigate();

    const handleRefresh = () => {
        setLoadingMessage("Taking you to Home...");
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigate("/home");
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

    const handleHistoryNavigation = () => { }; // Already on history
    const handleProfileNavigation = () => navigate("/profile");

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                const details = await getUserDetails(token);
                setUserData(details);
            }
        }
        fetchUser();
    }, [getUserDetails]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getHistoryOfUser();
                setMeetings(history);
            } catch {
                // Handle error
            }
        }
        fetchHistory();
    }, [getHistoryOfUser]);

    let formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
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

            <Container maxWidth="md" sx={{ mt: 8, pb: 8 }}>
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827', mb: 1 }}>
                        Meeting History
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#6b7280' }}>
                        Track your past calls and see who attended.
                    </Typography>
                </Box>

                {meetings.length > 0 ? (
                    meetings.map((e, i) => (
                        <Paper
                            key={i}
                            elevation={0}
                            sx={{
                                mb: 3,
                                borderRadius: 4,
                                overflow: 'hidden',
                                border: '1px solid #f3f4f6',
                                transition: 'all 0.3s',
                                '&:hover': {
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                                    transform: 'translateY(-2px)'
                                }
                            }}
                        >
                            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: '50%',
                                        bgcolor: '#f3e8ff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#9c27b0'
                                    }}>
                                        <VideoCameraFrontIcon />
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="bold" color="#1f2937">
                                            {e.meetingCode}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#6b7280' }}>
                                            <CalendarTodayIcon sx={{ fontSize: 14 }} />
                                            <Typography variant="caption">
                                                {formatDate(e.date)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>

                            <Accordion elevation={0} sx={{ '&:before': { display: 'none' }, bgcolor: 'transparent' }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: '#9c27b0' }} />}
                                    sx={{
                                        px: 3,
                                        minHeight: 48,
                                        borderTop: '1px solid #f3f4f6',
                                        '& .MuiAccordionSummary-content': { m: 0 }
                                    }}
                                >
                                    <Typography variant="button" sx={{ color: '#9c27b0', textTransform: 'none', fontWeight: 600 }}>
                                        View Attendees
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ px: 3, pb: 3, pt: 0, bgcolor: '#fafafa' }}>
                                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        {/* Placeholder for attendees - assuming data structure or just showing UI */}
                                        <Box sx={{
                                            p: 1.5,
                                            bgcolor: 'white',
                                            borderRadius: 2,
                                            border: '1px solid #e5e7eb',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2
                                        }}>
                                            <PersonIcon fontSize="small" sx={{ color: '#9ca3af' }} />
                                            <Typography variant="body2" fontWeight="500" color="#374151">
                                                Host (You)
                                            </Typography>
                                        </Box>
                                        {/* Add more attendee items here when data is available */}
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </Paper>
                    ))
                ) : (
                    <Box sx={{ textAlign: 'center', py: 8, opacity: 0.6 }}>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            No meetings yet
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Join or create a meeting to see it here.
                        </Typography>
                    </Box>
                )}
            </Container>
            <Footer />
        </Box>
    );
}