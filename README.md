# SNMP-ZTE Web

Frontend dashboard untuk [SNMP-ZTE](https://github.com/ardani17/snmp-zte) - Multi-OLT Monitoring System.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- SWR (Data Fetching)

## Features

- OLT Management Dashboard
- ONU List & Detail View
- Real-time Status Monitoring
- Power Meter Visualization
- Empty Slots Detection

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## API Backend

This frontend connects to [SNMP-ZTE API](https://github.com/ardani17/snmp-zte).

## License

MIT
