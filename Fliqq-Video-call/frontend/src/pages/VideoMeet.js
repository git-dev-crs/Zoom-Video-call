import React, { useEffect, useRef, useState } from 'react'
import io from "socket.io-client";
import { Badge, IconButton, TextField, Box, Typography, Paper } from '@mui/material';
import { Button } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import styles from "../styles/videoComponent.module.css";
import CallEndIcon from '@mui/icons-material/CallEnd'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'
import ChatIcon from '@mui/icons-material/Chat'
import server from '../environment';

import { useLocation } from 'react-router-dom';

const server_url = server;

var connections = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" },
        { "urls": "stun:stun1.l.google.com:19302" },
        { "urls": "stun:stun2.l.google.com:19302" }
    ]
}

export default function VideoMeetComponent() {
    // Ensuring recompile for Paper import
    const location = useLocation();

    var socketRef = useRef();
    let socketIdRef = useRef();

    let localVideoref = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);

    let [audioAvailable, setAudioAvailable] = useState(true);

    let [video, setVideo] = useState([]);

    let [audio, setAudio] = useState();

    let [screen, setScreen] = useState();

    let [showModal, setModal] = useState(true);

    let [screenAvailable, setScreenAvailable] = useState();

    let [messages, setMessages] = useState([])

    let [message, setMessage] = useState("");

    let [newMessages, setNewMessages] = useState(0);
    const [loading, setLoading] = useState(false);

    let [username, setUsername] = useState(location.state?.username || "");

    // Auto-skip "Enter Lobby" if username is provided
    let [askForUsername, setAskForUsername] = useState(!location.state?.username);

    const videoRef = useRef([])

    let [videos, setVideos] = useState([])

    // TODO
    // if(isChrome() === false) {


    // }

    useEffect(() => {
        const init = async () => {
            await getPermissions();
            // If username was provided, connect automatically after permissions are set
            if (location.state?.username) {
                // Check if socket is already connected to avoid duplicates
                if (!socketRef.current) {
                    getMedia();
                }
            }
        }
        init();

        // Cleanup: Disconnect socket on unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
        // Intentionally run once on mount only — adding getPermissions/getMedia to deps
        // would cause infinite re-renders since they are recreated each render.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    let getDislayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => console.log(e))
            }
        }
    }

    const getPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoPermission) {
                setVideoAvailable(true);
                console.log('Video permission granted');
            } else {
                setVideoAvailable(false);
                console.log('Video permission denied');
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (audioPermission) {
                setAudioAvailable(true);
                console.log('Audio permission granted');
            } else {
                setAudioAvailable(false);
                console.log('Audio permission denied');
            }

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false);
            }

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoref.current) {
                        localVideoref.current.srcObject = userMediaStream;
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
            console.log("SET STATE HAS ", video, audio);

        }

        // Intentionally runs whenever video/audio state changes.
        // getUserMedia is not in deps to avoid infinite loops (recreated each render).
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [video, audio])
    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();

    }

    let getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        // FIX: Use addTrack (modern) instead of deprecated addStream
        for (let id in connections) {
            if (id === socketIdRef.current) continue

            stream.getTracks().forEach(track => {
                connections[id].addTrack(track, stream)
            })

            connections[id].createOffer().then((description) => {
                console.log(description)
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            for (let id in connections) {
                // FIX: Use addTrack for the blank silence stream too
                window.localStream.getTracks().forEach(track => {
                    connections[id].addTrack(track, window.localStream)
                })

                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                        })
                        .catch(e => console.log(e))
                })
            }
        })
    }

    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .then((stream) => { })
                .catch((e) => console.log(e))
        } else {
            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { }
        }
    }





    let getDislayMediaSuccess = (stream) => {
        console.log("HERE")
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        // FIX: Use addTrack (modern) instead of deprecated addStream
        for (let id in connections) {
            if (id === socketIdRef.current) continue

            stream.getTracks().forEach(track => {
                connections[id].addTrack(track, stream)
            })

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            getUserMedia()
        })
    }

    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e)) // Original catch block
                    }
                }).catch(e => console.log(e))
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }
    }




    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false })

        socketRef.current.on('signal', gotMessageFromServer)

        socketRef.current.on('connect', () => {
            // FIX: Use pathname (Meeting Code) so localhost and ngrok users join SAME room
            socketRef.current.emit('join-call', window.location.pathname)
            socketIdRef.current = socketRef.current.id

            socketRef.current.on('chat-message', addMessage)

            socketRef.current.on('chat-history', (history) => {
                setMessages(history)
            })

            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id))
            })

            socketRef.current.on('user-joined', (id, clients) => {
                clients.forEach((socketListId) => {

                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections)
                    // Wait for their ice candidate       
                    connections[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
                        }
                    }

                    // FIX: Use modern ontrack instead of deprecated onaddstream
                    // ontrack fires for each individual track. We build a MediaStream from them.
                    const remoteStreams = {};
                    connections[socketListId].ontrack = (event) => {
                        console.log("ontrack fired for:", socketListId);

                        // Build or reuse a MediaStream for this peer
                        if (!remoteStreams[socketListId]) {
                            remoteStreams[socketListId] = new MediaStream();
                        }
                        remoteStreams[socketListId].addTrack(event.track);
                        const stream = remoteStreams[socketListId];

                        let videoExists = videoRef.current.find(video => video.socketId === socketListId);

                        if (videoExists) {
                            console.log("FOUND EXISTING - updating stream");
                            setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: stream } : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        } else {
                            console.log("CREATING NEW video entry");
                            let newVideo = {
                                socketId: socketListId,
                                stream: stream,
                                autoplay: true,
                                playsinline: true
                            };
                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    };

                    // FIX: Use addTrack (modern) instead of deprecated addStream
                    if (window.localStream !== undefined && window.localStream !== null) {
                        window.localStream.getTracks().forEach(track => {
                            connections[socketListId].addTrack(track, window.localStream)
                        })
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()])
                        window.localStream = blackSilence()
                        window.localStream.getTracks().forEach(track => {
                            connections[socketListId].addTrack(track, window.localStream)
                        })
                    }
                })

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue

                        try {
                            // FIX: Use addTrack for renegotiation
                            window.localStream.getTracks().forEach(track => {
                                connections[id2].addTrack(track, window.localStream)
                            })
                        } catch (e) { }

                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }))
                                })
                                .catch(e => console.log(e))
                        })
                    }
                }
            })
        })
    }

    let silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator()
        let dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }
    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height })
        canvas.getContext('2d').fillRect(0, 0, width, height)
        let stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }

    let handleVideo = () => {
        setVideo(!video);
        // getUserMedia();
    }
    let handleAudio = () => {
        setAudio(!audio)
        // getUserMedia();
    }

    useEffect(() => {
        if (screen !== undefined) {
            getDislayMedia();
        }
        // Intentionally runs only when screen state changes.
        // getDislayMedia not in deps to avoid infinite loops (recreated each render).
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [screen])
    let handleScreen = () => {
        setScreen(!screen);
    }

    let handleEndCall = () => {
        try {
            let tracks = localVideoref.current.srcObject.getTracks()
            tracks.forEach(track => track.stop())
        } catch (e) { }
        setLoading(true);
        setTimeout(() => {
            window.location.href = "/home";
        }, 2000);
    }

    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => {
            // De-dupe: Check if message already exists
            const exists = prevMessages.some(msg => msg.data === data && msg.sender === sender);
            if (exists) return prevMessages;
            return [...prevMessages, { sender: sender, data: data, socketIdSender: socketIdSender }];
        });
    };

    // Keep a ref for showModal to access in effect without dependency
    const showModalRef = useRef(showModal);

    useEffect(() => {
        showModalRef.current = showModal;
    }, [showModal]);

    // Badge Logic: Watch messages for changes
    useEffect(() => {
        if (messages.length === 0) return;

        // Increment for EVERY new message (Session Message Counter)
        setNewMessages((prev) => prev + 1);
    }, [messages]);



    let sendMessage = () => {
        console.log(socketRef.current);
        socketRef.current.emit('chat-message', message, username)
        setMessage("");

        // this.setState({ message: "", sender: username })
    }


    let connect = () => {
        setAskForUsername(false);
        getMedia();
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
                <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
                    <Box sx={{
                        position: 'absolute',
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        bgcolor: '#ef4444', // Red for ending call
                        opacity: 0.7,
                        animation: 'ripple 1.5s linear infinite'
                    }} />
                    <Box sx={{
                        position: 'absolute',
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        bgcolor: '#ef4444',
                        opacity: 0.7,
                        animation: 'ripple 1.5s linear infinite',
                        animationDelay: '0.75s'
                    }} />
                    <Box sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        bgcolor: '#ef4444',
                        zIndex: 1
                    }} />
                </Box>
                <Typography sx={{ mt: 2, color: '#6b7280', fontSize: '1.1rem', fontWeight: 500, letterSpacing: '0.5px' }}>
                    Ending Call...
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
        )
    }

    if (askForUsername) {
        return (
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#f9fafb',
                p: 2
            }}>
                <Paper elevation={3} sx={{
                    p: 4,
                    width: '100%',
                    maxWidth: 400,
                    borderRadius: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3
                }}>
                    <Typography variant="h5" fontWeight="bold">Enter Lobby</Typography>

                    <Box sx={{
                        width: '100%',
                        height: 200,
                        bgcolor: '#000',
                        borderRadius: 2,
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        <video
                            ref={localVideoref}
                            autoPlay
                            muted
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        ></video>
                    </Box>

                    <TextField
                        label="Display Name"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        fullWidth
                        variant="outlined"
                        placeholder="Enter your name"
                        InputProps={{ sx: { borderRadius: 2 } }}
                    />

                    <Button
                        variant="contained"
                        onClick={connect}
                        fullWidth
                        size="large"
                        disabled={!username.trim()}
                        sx={{
                            borderRadius: 2,
                            bgcolor: '#9c27b0',
                            fontWeight: 'bold',
                            '&:hover': { bgcolor: '#7b1fa2' }
                        }}
                    >
                        Join Meeting
                    </Button>
                </Paper>
            </Box>
        )
    }

    return (
        <div className={styles.meetVideoContainer}>
            {/* Main Layout: Flex Row */}
            <div className={styles.mainContent}>

                {/* Left Side: Video Area */}
                <div className={styles.videoArea}>
                    <video className={styles.meetUserVideo} ref={localVideoref} autoPlay muted></video>

                    <div className={styles.conferenceView}>
                        {videos.map((video) => (
                            <div key={video.socketId} className={styles.remoteVideoContainer}>
                                <video
                                    data-socket={video.socketId}
                                    ref={ref => {
                                        if (ref && video.stream) {
                                            ref.srcObject = video.stream;
                                        }
                                    }}
                                    autoPlay
                                >
                                </video>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Control Bar */}
                    <div className={styles.buttonContainers}>
                        <IconButton onClick={handleVideo} style={{ color: "#4b5563" }}> {/* Grey 600 */}
                            {(video === true) ? <VideocamIcon sx={{ fontSize: 32 }} /> : <VideocamOffIcon sx={{ fontSize: 32 }} />}
                        </IconButton>

                        <IconButton onClick={handleEndCall} style={{ color: "#ef4444" }}> {/* Red 500 */}
                            <CallEndIcon sx={{ fontSize: 32 }} />
                        </IconButton>

                        <IconButton onClick={handleAudio} style={{ color: "#4b5563" }}>
                            {audio === true ? <MicIcon sx={{ fontSize: 32 }} /> : <MicOffIcon sx={{ fontSize: 32 }} />}
                        </IconButton>

                        {screenAvailable === true ?
                            <IconButton onClick={handleScreen} style={{ color: "#4b5563" }}>
                                {screen === true ? <ScreenShareIcon sx={{ fontSize: 32 }} /> : <StopScreenShareIcon sx={{ fontSize: 32 }} />}
                            </IconButton> : <></>}

                        <Badge badgeContent={newMessages} max={999} color='warning'>
                            {/* Chat toggle only for mobile or if we want it collapsible. Staying always visible for now based on request */}
                            <IconButton onClick={() => setModal(!showModal)} style={{ color: "#4b5563" }}>
                                <ChatIcon sx={{ fontSize: 32 }} />
                            </IconButton>
                        </Badge>
                    </div>
                </div>

                {/* Right Side: Chat Sidebar */}
                {showModal ? (
                    <div className={styles.chatRoom}>
                        <div className={styles.chatContainer}>
                            <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Chat</h1>

                            <div className={styles.chattingDisplay}>
                                {messages.length !== 0 ? messages.map((item, index) => {
                                    return (
                                        <div style={{ marginBottom: "10px" }} key={index}>
                                            <p style={{ fontWeight: "bold", fontSize: '0.875rem' }}>{item.sender}</p>
                                            <p style={{ fontSize: '0.875rem' }}>{item.data}</p>
                                        </div>
                                    )
                                }) : <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>No Messages Yet</p>}
                            </div>

                            <div className={styles.chattingArea}>
                                <TextField
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    id="outlined-basic"
                                    label="Enter Your chat"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    sx={{
                                        '& .MuiOutlinedInput-root': { borderRadius: '4px' },
                                        '& .MuiInputBase-input': {
                                            padding: '12px', // Increased vertical padding
                                        }
                                    }}
                                />
                                <Button
                                    variant='contained'
                                    onClick={sendMessage}
                                    sx={{
                                        bgcolor: '#9333ea',
                                        color: 'white',
                                        textTransform: 'none',
                                        padding: '12px', // Match input padding
                                        '&:hover': { bgcolor: '#7e22ce' },
                                        minWidth: '70px'
                                    }}
                                >
                                    Send
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    )
}