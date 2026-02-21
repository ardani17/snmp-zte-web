# SNMP-ZTE Web

Frontend dashboard untuk [SNMP-ZTE](https://github.com/ardani17/snmp-zte) - Multi-OLT Monitoring System.

## Features

- 🔌 **Stateless Connection** - No credentials stored
- 📊 **ONU List View** - Real-time ONU status
- 📡 **Multi-OLT Support** - C320, C300, C600
- ⚡ **Fast & Responsive** - SWR caching
- 🎨 **Modern UI** - Tailwind CSS
- 📱 **Responsive** - Mobile friendly

## Tech Stack

- **Next.js 16** - React Framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **SWR** - Data Fetching
- **Lucide Icons** - Icons

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/ardani17/snmp-zte-web.git
cd snmp-zte-web
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Usage

1. Enter OLT credentials (IP, Port, Community, Model)
2. Click "Connect"
3. Select Board and PON
4. View ONU list with status, power, and details
5. Disconnect when done

**No credentials are stored anywhere.** All queries are stateless.

## Project Structure

```
snmp-zte-web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── ui/                 # Base components
│   │   │   ├── Card.tsx
│   │   │   └── Button.tsx
│   │   └── features/           # Feature components
│   │       ├── OLTForm.tsx     # Connection form
│   │       └── ONUList.tsx     # ONU table
│   ├── lib/
│   │   ├── api.ts              # API client
│   │   └── utils.ts            # Utilities
│   ├── hooks/                  # Custom hooks
│   └── types/                  # TypeScript types
├── public/
├── .env.local                  # Environment variables
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

## API Integration

Connects to [SNMP-ZTE API](https://github.com/ardani17/snmp-zte) via:

```
POST /api/v1/query
```

## Security

- ✅ No credential storage
- ✅ Client-side only caching (SWR)
- ✅ HTTPS recommended
- ✅ Rate limited backend

## Deployment

### Vercel (Recommended)

```bash
vercel
```

### Docker

```bash
docker build -t snmp-zte-web .
docker run -p 3000:3000 snmp-zte-web
```

## Related

- [SNMP-ZTE API](https://github.com/ardani17/snmp-zte) - Backend

## License

MIT
