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
    Divider
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';

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
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
            <AppBar position="static" color="transparent" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #eee' }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <IconButton
                            onClick={() => navigate("/home")}
                            sx={{ color: '#9c27b0', mr: 2 }}
                        >
                            <HomeIcon />
                        </IconButton>
                        <Typography variant="h6" fontWeight="bold" sx={{ color: '#333' }}>
                            History
                        </Typography>
                    </Toolbar>
                </Container>
            </AppBar>

            <Container maxWidth="md" sx={{ mt: 4, pb: 8 }}>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, textAlign: 'center' }}>
                    History of your meetings
                </Typography>

                {meetings.length > 0 ? (
                    meetings.map((e, i) => (
                        <Card key={i} variant="outlined" sx={{ mb: 3, borderRadius: 2, borderColor: '#e0e0e0' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                                        Code: {e.meetingCode}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Date: {formatDate(e.date)}
                                    </Typography>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Accordion elevation={0} sx={{ '&:before': { display: 'none' } }}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon sx={{ color: '#9c27b0' }} />}
                                        sx={{ px: 0, minHeight: 0, '& .MuiAccordionSummary-content': { m: 0 } }}
                                    >
                                        <Typography variant="button" sx={{ color: '#9c27b0', textTransform: 'none' }}>
                                            Show Attendees
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ px: 0 }}>
                                        {/* Placeholder for attendees list if data structure allows, currently just showing a placeholder or mapping if available */}
                                        {/* Assuming 'e.attendees' might exist in future or using dummy data for UI match */}
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            {/* Example Attendee Item */}
                                            <Box sx={{ p: 2, bgcolor: '#fafafa', borderRadius: 1, border: '1px solid #eee' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                    <PersonIcon fontSize="small" color="action" />
                                                    <Typography variant="subtitle2" fontWeight="bold">
                                                        Participant
                                                    </Typography>
                                                </Box>
                                                <Typography variant="caption" display="block" color="text.secondary">
                                                    Joined at: {formatDate(e.date)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </AccordionDetails>
                                </Accordion>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Typography variant="body1" textAlign="center" color="text.secondary">
                        No meeting history found.
                    </Typography>
                )}
            </Container>
        </Box>
    );
}