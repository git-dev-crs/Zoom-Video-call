import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';
import { Snackbar, Container } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme();

export default function Authentication() {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [name, setName] = React.useState("");
    const [error, setError] = React.useState("");
    const [message, setMessage] = React.useState("");
    const [formState, setFormState] = React.useState(0); // 0: Login, 1: Register
    const [open, setOpen] = React.useState(false);

    const { handleRegister, handleLogin, handleGoogleLogin } = React.useContext(AuthContext);
    const router = useNavigate();

    const handleAuth = async () => {
        try {
            if (formState === 0) {
                await handleLogin(username, password);
            }
            if (formState === 1) {
                let result = await handleRegister(name, username, password);
                console.log(result);
                setUsername("");
                setName("");
                setPassword("");
                setMessage(result);
                setOpen(true);
                setError("");
                setFormState(0); // Switch to login after success
            }
        } catch (err) {
            console.log(err);
            let message = (err.response?.data?.message) || "An error occurred";
            setError(message);
            // setOpen(true); // Optional: show error in snackbar too?
        }
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#f9fafb', // Light gray background
            }}>
                <CssBaseline />
                <Container component="main" maxWidth="xs">
                    <Paper elevation={0} sx={{
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderRadius: '16px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' // Soft shadow
                    }}>
                        {/* Branding Section */}
                        <Box
                            onClick={() => router('/')}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                mb: 1,
                                cursor: 'pointer'
                            }}
                        >
                            {/* Logo */}
                            <Box
                                component="img"
                                src="/fliq_logo_white.png"
                                alt="Fliqq Logo"
                                sx={{ height: 40, width: 'auto' }}
                            />
                            <Typography component="h1" variant="h4" sx={{
                                fontWeight: 800,
                                color: '#a855f7', // Purple-500
                                fontFamily: 'Poppins, sans-serif'
                            }}>
                                Fliqq
                            </Typography>
                        </Box>

                        {/* Title */}
                        <Typography component="h2" variant="h6" sx={{ mb: 3, fontWeight: 800, color: '#1f2937', whiteSpace: 'nowrap' }}>
                            {formState === 0 ? "Login to your existing account" : "Register a new account"}
                        </Typography>

                        {/* Google Sign In */}
                        <Box sx={{ mb: 3, width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <GoogleLogin
                                onSuccess={async (credentialResponse) => {
                                    try {
                                        const decoded = jwtDecode(credentialResponse.credential);
                                        await handleGoogleLogin(decoded.name, decoded.email, decoded.email);
                                    } catch (err) {
                                        console.log("Google Login Error:", err);
                                        setError("Google Login Failed");
                                    }
                                }}
                                onError={() => {
                                    console.log('Login Failed');
                                }}
                                width="300"
                            />
                        </Box>

                        {/* Toggle Buttons */}
                        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                            <Button
                                onClick={() => setFormState(0)}
                                sx={{
                                    bgcolor: formState === 0 ? '#c084fc' : '#e5e7eb', // Purple if active, Gray if not
                                    color: formState === 0 ? 'white' : '#374151',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    px: 3,
                                    '&:hover': {
                                        bgcolor: formState === 0 ? '#a855f7' : '#d1d5db',
                                    }
                                }}
                            >
                                Sign In
                            </Button>
                            <Button
                                onClick={() => setFormState(1)}
                                sx={{
                                    bgcolor: formState === 1 ? '#c084fc' : '#e5e7eb',
                                    color: formState === 1 ? 'white' : '#374151',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    px: 3,
                                    '&:hover': {
                                        bgcolor: formState === 1 ? '#a855f7' : '#d1d5db',
                                    }
                                }}
                            >
                                Sign Up
                            </Button>
                        </Box>

                        {/* Form Fields */}
                        <Box component="form" noValidate sx={{ width: '100%' }}>
                            {formState === 1 && (
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="name"
                                    label="Full Name"
                                    name="name"
                                    autoComplete="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    sx={{
                                        '& .MuiOutlinedInput-root': { borderRadius: 2 },
                                        mb: 1
                                    }}
                                />
                            )}
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Email / Username"
                                name="username"
                                autoComplete="username"
                                autoFocus
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-root': { borderRadius: 2 },
                                    mb: 1
                                }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-root': { borderRadius: 2 },
                                    mb: 2
                                }}
                            />

                            {/* Error Message */}
                            {error && (
                                <Typography color="error" variant="body2" sx={{ textAlign: 'center', mb: 2 }}>
                                    {error}
                                </Typography>
                            )}

                            {/* Submit Button */}
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleAuth}
                                sx={{
                                    mt: 1,
                                    mb: 2,
                                    bgcolor: '#c084fc', // Purple-400
                                    color: 'white',
                                    py: 1.5,
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    boxShadow: 'none',
                                    '&:hover': {
                                        bgcolor: '#a855f7', // Purple-500
                                        boxShadow: 'none'
                                    }
                                }}
                            >
                                {formState === 0 ? "Login" : "Register"}
                            </Button>
                        </Box>
                    </Paper>
                </Container>
            </Box>

            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={() => setOpen(false)}
                message={message}
            />
        </ThemeProvider>
    );
}