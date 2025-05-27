# Ship-Tech Hub

A comprehensive ship technology management platform built with React, TypeScript, and modern web technologies.

## 🚢 Overview

Ship-Tech Hub is a powerful web application designed for managing ship operations, maintenance schedules, job assignments, and crew management. The platform provides an intuitive interface for maritime professionals to streamline their vessel management processes.

## ✨ Features

- **Dashboard Analytics** - Real-time KPI monitoring and performance charts
- **Ship Management** - Complete vessel inventory and status tracking
- **Job Management** - Task assignment and progress tracking
- **Component Tracking** - Equipment and component maintenance schedules
- **Calendar Integration** - Event and maintenance scheduling
- **User Authentication** - Secure login and role-based access control
- **Responsive Design** - Mobile-friendly interface
- **Real-time Notifications** - Stay updated with important alerts

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS, Tailwind Animate
- **UI Components**: Custom component library with Radix UI primitives
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Charts**: Recharts
- **Date Handling**: date-fns
- **State Management**: React Context API
- **Routing**: React Router DOM

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ship-tech-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080`

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Authentication/ # Login and auth components
│   ├── Dashboard/      # Dashboard-specific components
│   ├── Ships/          # Ship management components
│   ├── Jobs/           # Job management components
│   ├── Components/     # Component tracking
│   ├── Layout/         # Layout components
│   ├── Notifications/  # Notification system
│   └── ui/            # Base UI components
├── contexts/           # React Context providers
├── hooks/             # Custom React hooks
├── lib/               # Utility libraries
├── pages/             # Page components
├── types/             # TypeScript type definitions
└── utils/             # Helper functions
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_APP_NAME=Ship-Tech Hub
VITE_API_URL=your-api-url
```

### Tailwind CSS

The project uses a custom Tailwind configuration with:
- Custom color scheme
- Extended component variants
- Animation utilities

## 🎨 UI Components

The project includes a comprehensive set of reusable UI components:

- **Forms**: Input, Select, Checkbox, Radio, Textarea
- **Navigation**: Navbar, Sidebar, Breadcrumbs, Pagination
- **Feedback**: Alerts, Toasts, Progress indicators
- **Layout**: Cards, Dialogs, Sheets, Tabs
- **Data Display**: Tables, Charts, Badges, Avatars

## 👥 User Roles

The platform supports different user roles with varying permissions:

- **Admin** - Full system access
- **Captain** - Ship operations and crew management
- **Engineer** - Technical systems and maintenance
- **Crew** - Basic task and schedule access

## 📱 Responsive Design

Ship-Tech Hub is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile devices

## 🔒 Security Features

- Secure authentication system
- Role-based access control
- Protected routes
- Input validation and sanitization

## 🚧 Development

### Adding New Components

1. Create component in appropriate directory under `src/components/`
2. Export from component's index file
3. Add TypeScript interfaces in `src/types/`
4. Include proper styling with Tailwind CSS

### State Management

The application uses React Context for state management:
- `AuthContext` - User authentication state
- `DataContext` - Application data state

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Consistent naming conventions
- Component-based architecture

## 📈 Performance

- Vite for fast development and builds
- Code splitting with React.lazy()
- Optimized bundle sizes
- Efficient re-rendering with React best practices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Version History

- **v1.0.0** - Initial release with core features
- Ship management system
- Job tracking functionality
- User authentication
- Dashboard analytics

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first styling
- Radix UI for accessible component primitives
- All contributors and maritime industry professionals who provided feedback

---

**Ship-Tech Hub** - Streamlining maritime operations through modern technology.
