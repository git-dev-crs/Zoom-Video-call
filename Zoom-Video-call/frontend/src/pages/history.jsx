import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    AppBar,
    Box,
    Card,
    CardContent,
    Container,
    IconButton,
    Toolbar,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
    Button,
    Paper
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';

export default function History() {
    const { getHistoryOfUser } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([]);
    const navigate = useNavigate();

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

                        <Button
                            startIcon={<HomeIcon />}
                            onClick={() => navigate("/home")}
                            sx={{
                                color: '#9c27b0',
                                bgcolor: '#f3e8ff',
                                textTransform: 'none',
                                fontWeight: 600,
                                px: 2,
                                borderRadius: 2,
                                '&:hover': { bgcolor: '#e9d5ff' }
                            }}
                        >
                            Back to Home
                        </Button>
                    </Toolbar>
                </Container>
            </AppBar>

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
        </Box>
    );
}