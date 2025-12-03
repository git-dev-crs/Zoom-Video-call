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
import { AuthContext } from '../contexts/AuthContext';

function HomeComponent() {
    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");
    const { addToUserHistory } = useContext(AuthContext);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    let handleJoinVideoCall = async () => {
        await addToUserHistory(meetingCode)
        navigate(`/${meetingCode}`)
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
            <AppBar position="static" color="transparent" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #eee' }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                                component="img"
                                src="/logo.png"
                                alt="Fliq Logo"
                                sx={{ height: 32, width: 'auto' }}
                            />
                            <Typography
                                variant="h6"
                                noWrap
                                component="div"
                                sx={{
                                    fontWeight: 700,
                                    color: '#9c27b0',
                                    letterSpacing: '.1rem'
                                }}
                            >
                                Fliq
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Button
                                startIcon={<RestoreIcon />}
                                onClick={() => navigate("/history")}
                                sx={{ color: '#666' }}
                            >
                                History
                            </Button>
                            <Button
                                onClick={() => {
                                    localStorage.removeItem("token")
                                    navigate("/auth")
                                }}
                                variant="outlined"
                                sx={{
                                    color: '#9c27b0',
                                    borderColor: '#9c27b0',
                                    '&:hover': { borderColor: '#7b1fa2', bgcolor: 'rgba(156, 39, 176, 0.04)' }
                                }}
                            >
                                Logout
                            </Button>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <Container maxWidth="md" sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 6,
                        width: '100%',
                        borderRadius: 4,
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 4
                    }}
                >
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            Hello, User!
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                            Enjoy seamless video calling with Fliq
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                            <TextField
                                value={meetingCode}
                                onChange={e => setMeetingCode(e.target.value)}
                                placeholder="Enter Meeting Code"
                                variant="outlined"
                                size="small"
                                sx={{ flex: 1 }}
                            />
                            <Button
                                onClick={handleJoinVideoCall}
                                variant='contained'
                                sx={{
                                    bgcolor: '#e1bee7',
                                    color: '#4a148c',
                                    '&:hover': { bgcolor: '#ce93d8' },
                                    boxShadow: 'none'
                                }}
                            >
                                Join Meeting
                            </Button>
                        </Box>

                        <Button
                            variant='contained'
                            fullWidth={isMobile}
                            sx={{
                                bgcolor: '#9c27b0',
                                '&:hover': { bgcolor: '#7b1fa2' },
                                py: 1.5,
                                px: 4
                            }}
                            onClick={() => {
                                const randomCode = Math.random().toString(36).substring(2, 7);
                                setMeetingCode(randomCode);
                            }}
                        >
                            Create New Meeting
                        </Button>
                    </Box>

                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center' }}>
                        {/* Placeholder for the purple logo graphic */}
                        <Box sx={{
                            width: 150,
                            height: 150,
                            bgcolor: '#e1bee7',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                        }}>
                            <Box
                                component="img"
                                src="/logo.png"
                                alt="Fliq Logo"
                                sx={{ width: '80%', height: 'auto' }}
                            />
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    )
}

export default withAuth(HomeComponent)