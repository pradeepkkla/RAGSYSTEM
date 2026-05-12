# Enterprise RAG Chatbot Frontend

A modern, professional Enterprise AI RAG (Retrieval-Augmented Generation) Chatbot frontend built with React.js, Tailwind CSS, and Framer Motion.

## 🚀 Features

### Core Features
- **Modern Chat Interface** - ChatGPT-style conversation UI with real-time messaging
- **Document Management** - Upload, manage, and search documents (PDF, DOCX, DOC)
- **Dark/Light Mode** - Toggle between dark and light themes
- **Responsive Design** - Fully responsive for desktop, tablet, and mobile
- **Typing Animations** - Smooth typing indicators for AI responses
- **Message Timestamps** - Track when messages were sent
- **File Attachments** - Drag-and-drop file upload support

### Pages & Components
1. **Login Page** - Professional authentication interface
2. **Dashboard** - Overview with stats, recent chats, and quick actions
3. **Chatbot Page** - Main chat interface with document support
4. **Document Management** - Upload and manage documents with search
5. **Settings Page** - User preferences and account settings

### Enterprise Features
- AI Status Indicator
- Search functionality across documents
- Notification system
- User profile management
- Two-factor authentication toggle
- Security settings
- Suggested prompts for new conversations

## 📦 Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Icons** - Icon library
- **Axios** - HTTP client
- **Dark Mode** - Built-in theme switching

## 🎨 Design

### Color Scheme
- **Primary**: Blue (Enterprise professional)
- **Accent**: Purple (Modern elegance)
- **Neutral**: Gray and White (Clean interface)
- **Dark Mode**: Optimized dark theme

### Design Principles
- Clean modern UI similar to ChatGPT and Microsoft Copilot
- Soft shadows and rounded corners
- Smooth transitions and animations
- Professional enterprise appearance
- Accessibility-focused

## 📁 Project Structure

```
src/
├── pages/
│   ├── LoginPage.jsx              # Authentication
│   ├── DashboardPage.jsx          # Overview dashboard
│   ├── ChatbotPage.jsx            # Main chat interface
│   ├── DocumentManagementPage.jsx # Document management
│   └── SettingsPage.jsx           # Settings & preferences
├── components/
│   ├── common/                    # Reusable components
│   │   ├── Sidebar.jsx            # Left navigation
│   │   ├── Navbar.jsx             # Top navigation
│   │   ├── ThemeToggle.jsx        # Dark/light toggle
│   │   └── LoadingAnimation.jsx   # Loading spinner
│   ├── chat/                      # Chat-specific components
│   │   ├── ChatArea.jsx           # Message display
│   │   ├── MessageBubble.jsx      # Individual message
│   │   ├── InputArea.jsx          # Message input
│   │   ├── TypingAnimation.jsx    # Typing indicator
│   │   └── SuggestedPrompts.jsx   # Prompt suggestions
│   └── documents/                 # Document components
│       ├── DocumentUpload.jsx     # Upload interface
│       └── DocumentCard.jsx       # Document cards
├── hooks/
│   ├── useTheme.js                # Theme management
│   └── useChat.js                 # Chat state management
├── context/
│   └── ThemeContext.jsx           # Theme provider
├── utils/
│   ├── api.js                     # API configuration
│   └── constants.js               # Constants
├── App.jsx                        # Main app component
├── main.jsx                       # Entry point
└── index.css                      # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables** (optional)
   Create a `.env` file:
   ```
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🔐 Authentication

The app includes a demo login page:
- **Email**: demo@example.com
- **Password**: demo123

Tokens are stored in localStorage and can be replaced with actual authentication logic.

## 🎯 Component Usage

### Using the Chat Hook
```javascript
import { useChat } from '../hooks/useChat';

const MyComponent = () => {
  const { messages, isLoading, sendMessage } = useChat();
  
  const handleSend = (text) => {
    sendMessage(text);
  };
  
  return (
    // Component JSX
  );
};
```

### Using the Theme Hook
```javascript
import { useTheme } from '../hooks/useTheme';

const MyComponent = () => {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      {isDark ? 'Light' : 'Dark'}
    </button>
  );
};
```

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

The sidebar collapses on mobile with a hamburger menu toggle.

## 🎨 Customization

### Theme Colors
Edit `tailwind.config.js` to customize colors:
```javascript
colors: {
  primary: {
    600: '#4338ca', // Customize primary color
  },
}
```

### Adding New Components
1. Create component in appropriate directory
2. Import Framer Motion for animations
3. Use Tailwind CSS for styling
4. Export from component file

## 🔌 API Integration

The app uses Axios for API calls. Configure endpoints in `src/utils/api.js`:

```javascript
export const chatAPI = {
  sendMessage: (message) =>
    api.post('/chat/message', { message }),
};
```

## 🐛 Troubleshooting

### Dark mode not working
- Clear browser cache
- Check localStorage for 'theme' key
- Verify ThemeProvider wraps your app

### Components not styling
- Ensure Tailwind CSS is installed
- Check `tailwind.config.js` content paths
- Verify `index.css` has Tailwind directives

### API calls failing
- Check VITE_API_BASE_URL in .env
- Verify backend is running
- Check browser console for CORS errors

## 📚 Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [React Icons](https://react-icons.github.io/react-icons)
- [Vite Guide](https://vitejs.dev)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For questions or support, please open an issue on the repository.

---

**Built with ❤️ for Enterprise AI Applications**
