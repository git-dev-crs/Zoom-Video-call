import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';
import { Snackbar, Container, Alert, InputAdornment, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Divider, Slide } from '@mui/material';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Icons
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockResetIcon from '@mui/icons-material/LockReset';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const defaultTheme = createTheme();

// Slide-up transition for the error snackbar
const SlideTransition = (props) => <Slide {...props} direction="down" />;

export default function Authentication() {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [name, setName] = React.useState("");
    const [error, setError] = React.useState("");
    const [message, setMessage] = React.useState("");
    const [formState, setFormState] = React.useState(0); // 0: Login, 1: Register
    const [open, setOpen] = React.useState(false);          // success snackbar
    const [errorOpen, setErrorOpen] = React.useState(false); // error snackbar
    const [isAuthenticating, setIsAuthenticating] = React.useState(false);

    // Password visibility toggle
    const [showPassword, setShowPassword] = React.useState(false);
    const [showNewPassword, setShowNewPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    // Forgot Password dialog state
    const [forgotOpen, setForgotOpen] = React.useState(false);
    const [forgotStep, setForgotStep] = React.useState(1); // 1: enter username, 2: enter new password
    const [forgotUsername, setForgotUsername] = React.useState("");
    const [forgotNewPassword, setForgotNewPassword] = React.useState("");
    const [forgotConfirmPassword, setForgotConfirmPassword] = React.useState("");
    const [forgotError, setForgotError] = React.useState("");
    const [forgotLoading, setForgotLoading] = React.useState(false);

    const { handleRegister, handleLogin, handleGoogleLogin } = React.useContext(AuthContext);
    const router = useNavigate();

    // ─── Show error as popup snackbar ───
    const showError = (msg) => {
        setError(msg);
        setErrorOpen(true);
    };

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setIsAuthenticating(true);
            try {
                const userInfo = await axios.get(
                    'https://www.googleapis.com/oauth2/v3/userinfo',
                    { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
                );
                const { name, email } = userInfo.data;
                await handleGoogleLogin(name, email, email);
            } catch (err) {
                console.log(err);
                showError("Google Login Failed. Please try again.");
                setIsAuthenticating(false);
            }
        },
        onError: () => showError("Google Sign-In was cancelled or failed."),
    });

    const handleAuth = async () => {
        setIsAuthenticating(true);
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
                setMessage("Account created successfully! Please sign in.");
                setOpen(true);
                setError("");
                setFormState(0);
                setIsAuthenticating(false);
            }
        } catch (err) {
            console.log(err);
            let msg;
            if (err.response && err.response.status === 401) {
                msg = "Incorrect password. Please try again.";
            } else if (err.response && err.response.status === 404) {
                msg = "No account found with that username. Please check and try again.";
            } else if (err.response && err.response.status === 409) {
                msg = "Username already taken. Please choose a different one.";
            } else if (err.response && err.response.data && err.response.data.message) {
                msg = err.response.data.message;
            } else if (err.message) {
                msg = `Connection error: ${err.message}`;
            } else {
                msg = "Something went wrong. Please try again.";
            }
            showError(msg);
            setIsAuthenticating(false);
        }
    };

    // ─── Forgot Password: Verify username exists ───
    const handleForgotVerify = async () => {
        if (!forgotUsername.trim()) {
            setForgotError("Please enter your username.");
            return;
        }
        setForgotLoading(true);
        setForgotError("");
        try {
            // Try to hit a GET users endpoint to check if user exists
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL || "http://localhost:8000"}/api/v1/users/check_user`, {
                params: { username: forgotUsername }
            });
            if (res.status === 200) {
                setForgotStep(2);
            }
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setForgotError("No account found with that username. Please check and try again.");
            } else {
                setForgotError("Could not verify username. Please try again.");
            }
        } finally {
            setForgotLoading(false);
        }
    };

    // ─── Forgot Password: Reset password ───
    const handleForgotReset = async () => {
        if (!forgotNewPassword || forgotNewPassword.length < 6) {
            setForgotError("Password must be at least 6 characters.");
            return;
        }
        if (forgotNewPassword !== forgotConfirmPassword) {
            setForgotError("Passwords do not match.");
            return;
        }
        setForgotLoading(true);
        setForgotError("");
        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL || "http://localhost:8000"}/api/v1/users/reset_password`, {
                username: forgotUsername,
                newPassword: forgotNewPassword
            });
            setForgotOpen(false);
            setForgotStep(1);
            setForgotUsername("");
            setForgotNewPassword("");
            setForgotConfirmPassword("");
            setMessage("Password reset successfully! Please sign in with your new password.");
            setOpen(true);
        } catch (err) {
            setForgotError("Failed to reset password. Please try again.");
        } finally {
            setForgotLoading(false);
        }
    };

    const closeForgotDialog = () => {
        setForgotOpen(false);
        setForgotStep(1);
        setForgotUsername("");
        setForgotNewPassword("");
        setForgotConfirmPassword("");
        setForgotError("");
    };

    if (isAuthenticating) {
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
                    Authenticating...
                </Typography>
                <style>
                    {`
                        @keyframes ripple {
                            0% { transform: scale(1); opacity: 0.7; }
                            100% { transform: scale(4); opacity: 0; }
                        }
                    `}
                </style>
            </Box>
        );
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#f9fafb',
            }}>
                <CssBaseline />
                <Container component="main" maxWidth="xs">
                    <Paper elevation={0} sx={{
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderRadius: '16px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                    }}>
                        {/* Branding */}
                        <Box
                            onClick={() => router('/')}
                            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1, cursor: 'pointer' }}
                        >
                            <Box
                                component="img"
                                src="/fliq_logo_white.png"
                                alt="Fliqq Logo"
                                sx={{ height: 40, width: 'auto' }}
                            />
                            <Typography component="h1" variant="h4" sx={{
                                fontWeight: 800,
                                color: '#a855f7',
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
                            <Button
                                variant="outlined"
                                onClick={() => googleLogin()}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    textTransform: 'none',
                                    borderColor: '#dadce0',
                                    color: '#3c4043',
                                    bgcolor: 'white',
                                    py: 1,
                                    px: 2,
                                    borderRadius: '4px',
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    boxShadow: 'none',
                                    '&:hover': { bgcolor: '#f8faff', borderColor: '#dadce0', boxShadow: 'none' }
                                }}
                            >
                                <Box component="svg" viewBox="0 0 48 48" width="20px" height="20px">
                                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                                </Box>
                                <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, fontFamily: 'Roboto, sans-serif' }}>
                                    Sign in with Google
                                </Typography>
                            </Button>
                        </Box>

                        {/* Toggle Buttons */}
                        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                            <Button onClick={() => setFormState(0)} sx={{
                                bgcolor: formState === 0 ? '#c084fc' : '#e5e7eb',
                                color: formState === 0 ? 'white' : '#374151',
                                fontWeight: 600, textTransform: 'none', px: 3,
                                '&:hover': { bgcolor: formState === 0 ? '#a855f7' : '#d1d5db' }
                            }}>Sign In</Button>
                            <Button onClick={() => setFormState(1)} sx={{
                                bgcolor: formState === 1 ? '#c084fc' : '#e5e7eb',
                                color: formState === 1 ? 'white' : '#374151',
                                fontWeight: 600, textTransform: 'none', px: 3,
                                '&:hover': { bgcolor: formState === 1 ? '#a855f7' : '#d1d5db' }
                            }}>Sign Up</Button>
                        </Box>

                        {/* Form Fields */}
                        <Box component="form" noValidate sx={{ width: '100%' }}>
                            {formState === 1 && (
                                <TextField
                                    margin="normal" required fullWidth
                                    id="name" label="Full Name" name="name"
                                    autoComplete="name" value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 }, mb: 1 }}
                                />
                            )}

                            <TextField
                                margin="normal" required fullWidth
                                id="username" label="Email / Username" name="username"
                                autoComplete="username" autoFocus value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 }, mb: 1 }}
                            />

                            {/* FIX: Password field with visibility toggle eye icon */}
                            <TextField
                                margin="normal" required fullWidth
                                name="password" label="Password"
                                type={showPassword ? "text" : "password"}
                                id="password" autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 }, mb: 1 }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />

                            {/* FIX: Forgot Password link */}
                            {formState === 0 && (
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                                    <Typography
                                        variant="body2"
                                        onClick={() => setForgotOpen(true)}
                                        sx={{
                                            color: '#a855f7',
                                            cursor: 'pointer',
                                            fontWeight: 500,
                                            fontSize: '0.82rem',
                                            '&:hover': { textDecoration: 'underline' }
                                        }}
                                    >
                                        Forgot Password?
                                    </Typography>
                                </Box>
                            )}

                            {/* Submit Button */}
                            <Button
                                fullWidth variant="contained"
                                onClick={handleAuth}
                                sx={{
                                    mt: 1, mb: 2,
                                    bgcolor: '#c084fc',
                                    color: 'white', py: 1.5,
                                    fontSize: '1rem', fontWeight: 600,
                                    borderRadius: '8px', textTransform: 'none',
                                    boxShadow: 'none',
                                    '&:hover': { bgcolor: '#a855f7', boxShadow: 'none' }
                                }}
                            >
                                {formState === 0 ? "Login" : "Register"}
                            </Button>
                        </Box>
                    </Paper>
                </Container>
            </Box>

            {/* ── SUCCESS Snackbar ── */}
            <Snackbar
                open={open}
                onClose={() => setOpen(false)}
                autoHideDuration={4000}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                TransitionComponent={SlideTransition}
            >
                <Alert
                    onClose={() => setOpen(false)}
                    severity="success"
                    variant="filled"
                    icon={<CheckCircleOutlineIcon />}
                    sx={{ width: '100%', bgcolor: '#4caf50', borderRadius: 2, fontWeight: 600 }}
                >
                    {message}
                </Alert>
            </Snackbar>

            {/* FIX: ERROR Snackbar popup — replaces inline red text */}
            <Snackbar
                open={errorOpen}
                onClose={() => setErrorOpen(false)}
                autoHideDuration={5000}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                TransitionComponent={SlideTransition}
            >
                <Alert
                    onClose={() => setErrorOpen(false)}
                    severity="error"
                    variant="filled"
                    icon={<ErrorOutlineIcon />}
                    sx={{
                        width: '100%',
                        borderRadius: 2,
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        bgcolor: '#d32f2f',
                        boxShadow: '0 8px 32px rgba(211,47,47,0.35)'
                    }}
                >
                    {error}
                </Alert>
            </Snackbar>

            {/* ── FORGOT PASSWORD DIALOG ── */}
            <Dialog
                open={forgotOpen}
                onClose={closeForgotDialog}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        p: 1,
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
                    }
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <LockResetIcon sx={{ color: '#a855f7', fontSize: 28 }} />
                        <Box>
                            <Typography variant="h6" fontWeight={700} color="#1f2937">
                                {forgotStep === 1 ? "Forgot Password?" : "Set New Password"}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {forgotStep === 1
                                    ? "Enter your username to reset your password"
                                    : `Setting new password for: ${forgotUsername}`}
                            </Typography>
                        </Box>
                    </Box>
                </DialogTitle>

                <Divider />

                <DialogContent sx={{ pt: 2 }}>
                    {/* Step 1: Enter username */}
                    {forgotStep === 1 && (
                        <Box>
                            <Box sx={{
                                display: 'flex', alignItems: 'center', gap: 1,
                                bgcolor: '#fef3c7', borderRadius: 2, p: 1.5, mb: 2
                            }}>
                                <WarningAmberIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
                                <Typography variant="body2" color="#92400e" fontWeight={500}>
                                    Enter the username you registered with
                                </Typography>
                            </Box>
                            <TextField
                                fullWidth autoFocus
                                label="Username"
                                value={forgotUsername}
                                onChange={(e) => { setForgotUsername(e.target.value); setForgotError(""); }}
                                onKeyDown={(e) => e.key === 'Enter' && handleForgotVerify()}
                                error={!!forgotError}
                                helperText={forgotError}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Box>
                    )}

                    {/* Step 2: Enter new password */}
                    {forgotStep === 2 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{
                                display: 'flex', alignItems: 'center', gap: 1,
                                bgcolor: '#f0fdf4', borderRadius: 2, p: 1.5
                            }}>
                                <CheckCircleOutlineIcon sx={{ color: '#22c55e', fontSize: 20 }} />
                                <Typography variant="body2" color="#15803d" fontWeight={500}>
                                    Username verified! Now set a new password.
                                </Typography>
                            </Box>

                            <TextField
                                fullWidth autoFocus
                                label="New Password"
                                type={showNewPassword ? "text" : "password"}
                                value={forgotNewPassword}
                                onChange={(e) => { setForgotNewPassword(e.target.value); setForgotError(""); }}
                                error={!!forgotError}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                                                {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Confirm New Password"
                                type={showConfirmPassword ? "text" : "password"}
                                value={forgotConfirmPassword}
                                onChange={(e) => { setForgotConfirmPassword(e.target.value); setForgotError(""); }}
                                error={!!forgotError}
                                helperText={forgotError}
                                onKeyDown={(e) => e.key === 'Enter' && handleForgotReset()}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Box>
                    )}
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                    <Button
                        onClick={closeForgotDialog}
                        sx={{ color: '#6b7280', textTransform: 'none', fontWeight: 600 }}
                    >
                        Cancel
                    </Button>

                    {forgotStep === 1 && (
                        <Button
                            variant="contained"
                            onClick={handleForgotVerify}
                            disabled={forgotLoading}
                            sx={{
                                bgcolor: '#a855f7', color: 'white',
                                textTransform: 'none', fontWeight: 700,
                                borderRadius: 2, px: 3,
                                '&:hover': { bgcolor: '#9333ea' }
                            }}
                        >
                            {forgotLoading ? "Checking..." : "Continue →"}
                        </Button>
                    )}

                    {forgotStep === 2 && (
                        <Button
                            variant="contained"
                            onClick={handleForgotReset}
                            disabled={forgotLoading}
                            sx={{
                                bgcolor: '#22c55e', color: 'white',
                                textTransform: 'none', fontWeight: 700,
                                borderRadius: 2, px: 3,
                                '&:hover': { bgcolor: '#16a34a' }
                            }}
                        >
                            {forgotLoading ? "Resetting..." : "Reset Password"}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
}