# 📹 Zoom Video Call

> A modern video conferencing web application with real-time communication features

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![WebRTC](https://img.shields.io/badge/WebRTC-333333?style=flat&logo=webrtc&logoColor=white)](https://webrtc.org/)

## 🌐 Live Demo

[![Live Demo](https://img.shields.io/badge/Live%20Demo-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)](https://apnacollegezoombackend.onrender.com)

**Try it now:** Join video calls, share screens, and collaborate in real-time!

## 🚀 Features

- **📞 HD Video Calls** - Crystal clear video communication
- **🎙️ Audio Controls** - Mute/unmute with noise cancellation
- **📱 Screen Sharing** - Share your screen or specific applications
- **💬 Real-time Chat** - Text messaging during video calls
- **👥 Multi-participant** - Support for group video conferences
- **📋 Meeting Controls** - Host controls for managing participants

## 🛠️ Tech Stack

**Frontend:** HTML5, CSS3, JavaScript  
**Communication:** WebRTC, Socket.io  
**Backend:** Node.js, Express.js  
**Real-time:** WebSocket connections  

## 📦 Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/git-dev-crs/Zoom-Video-call.git
cd Zoom-Video-call
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the server**
```bash
npm start
```

4. **Open your browser**
- Navigate to `http://localhost:3000`
- Create or join a meeting room

## 📁 Project Structure

```
Zoom-Video-call/
├── public/           # Static files
│   ├── index.html
│   ├── style.css
│   └── script.js
├── server/           # Backend server
│   ├── server.js
│   └── routes/
├── package.json
└── README.md
```

## 🎯 Key Features Demo

### Video Calling
- Peer-to-peer video communication using WebRTC
- Automatic camera and microphone detection
- Video quality adjustment based on network

### Screen Sharing
- Share entire screen or specific application windows
- Real-time screen sharing with all participants
- Easy toggle between camera and screen share

### Chat System
- Send messages during video calls
- Persistent chat history during session
- Emoji support and message timestamps

### Meeting Controls
- Join/leave meetings with unique room codes
- Participant list with connection status
- Host controls for muting participants

## 🔧 Configuration

The application works out of the box with default settings. For production deployment:

```javascript
// Update server configuration in server.js
const PORT = process.env.PORT || 3000;
const HOSTNAME = process.env.HOSTNAME || 'localhost';
```

## 🎮 How to Use

1. **Create a Meeting**
   - Open the application
   - Enter your name and create a new meeting room
   - Share the room code with participants

2. **Join a Meeting**
   - Enter the meeting room code
   - Allow camera and microphone permissions
   - Start communicating!

3. **During the Call**
   - Use video/audio controls to mute/unmute
   - Share your screen when needed
   - Chat with participants via text messages

## 🧪 Running Tests

```bash
# Run application locally
npm start

# Test different browsers for WebRTC compatibility
# Recommended: Chrome, Firefox, Safari, Edge
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🔧 Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+
- ⚠️ Mobile browsers (limited features)

## 📱 Features Overview

| Feature | Status | Description |
|---------|--------|-------------|
| Video Calls | ✅ | HD video communication |
| Audio Calls | ✅ | Clear audio transmission |
| Screen Share | ✅ | Desktop/app sharing |
| Text Chat | ✅ | Real-time messaging |
| File Sharing | 🔄 | Document sharing |
| Recording | 📋 | Call recording feature |

## 📞 Contact

**Mohit Jatav**

[![Portfolio](https://img.shields.io/badge/Portfolio-FF5722?style=flat&logo=todoist&logoColor=white)](https://mohit-portfolio-teal.vercel.app/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/mohit-jatav-6819a0260/)
[![Email](https://img.shields.io/badge/Email-D14836?style=flat&logo=gmail&logoColor=white)](mailto:mohitjatav326@gmail.com)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

⭐ **If this project helped you, please consider giving it a star!**
