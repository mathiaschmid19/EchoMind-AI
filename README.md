# EchoMind - AI Chat Assistant

EchoMind is a modern, feature-rich AI chat assistant powered by OpenRouter. It provides a seamless interface for interacting with various AI models, including Claude, GPT, and more.

![EchoMind Screenshot](public/logo.svg)

## Features

- 🤖 Multiple AI Model Support (Claude, GPT, etc.)
- 🌙 Dark/Light Mode
- 🎨 Customizable UI (Font Size, Message Density, Chat Style)
- 🔐 Secure API Key Management
- 👤 User Authentication with Clerk
- 💬 Real-time Chat Interface
- 📱 Responsive Design

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- OpenRouter API Key
- Clerk Account

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/echomind.git
cd echomind
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
# OpenRouter API Key
VITE_OPENROUTER_API_KEY=your_api_key_here

# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_CLERK_SECRET_KEY=your_clerk_secret_key
```

### Getting an OpenRouter API Key

1. Visit [OpenRouter](https://openrouter.ai/)
2. Sign up for an account
3. Navigate to the API Keys section
4. Create a new API key
5. Copy the key and paste it in your `.env` file

### Setting up Clerk Authentication

1. Visit [Clerk](https://clerk.dev/) and sign up for an account
2. Create a new application
3. In your Clerk dashboard, go to API Keys
4. Copy both the Publishable Key and Secret Key
5. Add these keys to your `.env` file:
   - `VITE_CLERK_PUBLISHABLE_KEY`: Your Clerk Publishable Key
   - `VITE_CLERK_SECRET_KEY`: Your Clerk Secret Key

### Running the Application

Development mode:

```bash
npm run dev
```

Production build:

```bash
npm run build
```

## Customization

### Theme Settings

- Dark/Light Mode
- Font Size (Small, Medium, Large, X-Large)
- Message Density (Compact, Comfortable, Spacious)
- Chat Style (Modern, Classic)

### API Configuration

- Support for multiple AI models
- Customizable model parameters
- Secure API key storage

## Deployment

### Self-Hosting

1. Build the application:

```bash
npm run build
```

2. Deploy the contents of the `dist` folder to your hosting provider.

### Recommended Hosting Providers

- Vercel
- Netlify
- AWS Amplify
- DigitalOcean App Platform

## License and Commercial Use

### Open Source License

This project is available under the MIT License for personal and non-commercial use.

### Commercial License

For commercial use, please contact us at amineouhannou19@gmail.com to discuss licensing options. Commercial licenses include:

- Full source code access
- Priority support
- Custom branding options
- White-label solutions
- Enterprise features
- Regular updates

### Pricing

- Personal Use: Free (MIT License)
- Small Business: $99/year
- Enterprise: Custom pricing

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For support, email amineouhannou19@gmail.com or join our [Discord community](https://discord.gg/your-discord).

## Roadmap

- [ ] Voice input/output
- [ ] File upload support
- [ ] Custom model fine-tuning
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Team collaboration features

## Acknowledgments

- [OpenRouter](https://openrouter.ai/) for AI model access
- [Clerk](https://clerk.dev/) for authentication
- [shadcn/ui](https://ui.shadcn.com/) for UI components
- [React](https://reactjs.org/) for the frontend framework
- [Vite](https://vitejs.dev/) for the build tool

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
