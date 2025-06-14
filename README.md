# TACCTILE Dashboard

A modern, responsive dashboard application with casting capabilities built with React, TypeScript, and Tailwind CSS.

## Features

- 📊 Interactive dashboard tiles with real-time data
- 📱 Mobile-first responsive design
- 🎨 Customizable tile appearance and layouts
- 🖥️ Multi-device casting support
- 🔒 Authentication system
- 🌙 Dark mode optimized
- ⚡ Fast and performant

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open in browser**
   Navigate to `http://localhost:5173`

## Casting Setup

TACCTILE supports multiple casting methods:

### 1. New Window (Recommended for Quick Start)
- ✅ Works immediately on any setup
- 🖥️ Just drag the window to your TV or second screen
- 🔧 No configuration required

### 2. Custom Receiver (Best Experience)
For full Chromecast integration, set up a Custom Receiver App:

1. **Register Custom Receiver**
   - Go to [Google Cast Developer Console](https://cast.google.com/publish)
   - Click "Add New Application"
   - Select "Custom Receiver" → "Web Receiver"
   - Use URL: `https://yourdomain.com/cast-display.html`
   - Note the App ID you receive

2. **Configure Environment**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Add your Custom Receiver App ID
   VITE_CAST_RECEIVER_APP_ID=your_app_id_here
   ```

3. **Deploy cast-display.html**
   - Ensure `public/cast-display.html` is accessible via HTTPS
   - The URL must match what you registered in the Cast Console

### 3. Wireless Display
- 📡 Uses Presentation API for wireless displays
- 🖥️ Works with compatible smart TVs and displays
- 🔄 Automatic fallback if device supports it

## Development

### Project Structure
```
src/
├── components/          # React components
├── contexts/           # React contexts (Auth, Theme)
├── hooks/              # Custom hooks
├── services/           # API and external services
├── types/              # TypeScript type definitions
└── data/               # Mock data and constants
```

### Key Technologies
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **Lucide React** for icons
- **Google Cast SDK** for Chromecast support

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to your hosting provider**
   - Ensure `dist/cast-display.html` is accessible via HTTPS
   - Update your Cast Developer Console with the production URL
   - Set the production environment variable for your Custom Receiver App ID

## Environment Variables

Create a `.env` file in the project root:

```env
# Custom Receiver App ID from Google Cast Developer Console
VITE_CAST_RECEIVER_APP_ID=your_app_id_here
```

## Troubleshooting

### Casting Issues
- **Blue Cast icon only**: You need to set up a Custom Receiver App ID
- **"New Window" not working**: Check if popups are blocked in your browser
- **Chromecast not connecting**: Ensure your Custom Receiver URL is accessible via HTTPS

### Development Issues
- **Port conflicts**: Change the port in `vite.config.ts`
- **Build errors**: Clear `node_modules` and reinstall dependencies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test casting functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details