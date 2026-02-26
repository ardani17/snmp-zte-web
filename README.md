# SNMP-ZTE Web

Frontend dashboard untuk SNMP-ZTE API - OLT Monitoring untuk ZTE devices.

## 🎯 Fitur

- ✅ **23 Endpoint Support** - Semua endpoint dari SNMP-ZTE API
- ✅ **Sidebar Navigation** - Navigasi rapi dengan kategori
- ✅ **Stateless** - Tidak menyimpan kredensial
- ✅ **Responsive Design** - Desktop & Mobile support
- ✅ **Real-time Query** - Eksekusi query langsung ke OLT

## 📋 Endpoint Categories

### 📁 Core (11 endpoints)
- ONU List, ONU Detail, Empty Slots
- System Info, Board Info, All Boards
- PON Info, Interface Stats
- Fan Info, Temperature, ONU Traffic

### 📊 Bandwidth (4 endpoints)
- ONU Bandwidth
- PON Port Stats
- ONU Errors
- Voltage Info

### ⚙️ Provisioning (4 endpoints)
- ONU Status
- ONU Create
- ONU Delete
- ONU Rename

### 📈 Statistics & VLAN (4 endpoints)
- Distance Info
- VLAN List
- VLAN Info
- Profile List

## 🚀 Instalasi

### Prasyarat
- Node.js 18+
- npm atau yarn
- SNMP-ZTE API running

### 1. Clone Repository

```bash
git clone https://github.com/ardani17/snmp-zte-web.git
cd snmp-zte-web
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Konfigurasi API URL

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 4. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

### 5. Build Production

```bash
npm run build
npm start
```

## 🐳 Docker

### Build Image

```bash
docker build -t snmp-zte-web .
```

### Run Container

```bash
docker run -p 3000:3000 snmp-zte-web
```

### Docker Compose

```yaml
version: '3.8'
services:
  snmp-zte-web:
    image: snmp-zte-web:latest
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8080
    restart: unless-stopped
```

## 📖 Penggunaan

### 1. Connect to OLT

Masukkan kredensial OLT:
- IP Address
- Port (default: 161)
- SNMP Community (public/globalrw)
- OLT Model (C320/C300/C600)

### 2. Pilih Query

Klik endpoint di sidebar untuk memilih query yang diinginkan.

### 3. Isi Parameter

Beberapa query membutuhkan parameter:
- Board (1-16)
- PON (1-16)
- ONU ID (1-128)
- Name (untuk create/rename)

### 4. Execute Query

Klik "Execute Query" untuk menjalankan query.

### 5. View Result

Hasil query ditampilkan dalam format JSON.

## 🔧 Konfigurasi

### Environment Variables

| Variable | Default | Deskripsi |
|----------|---------|-----------|
| `NEXT_PUBLIC_API_URL` | http://localhost:8080 | URL SNMP-ZTE API |

### SNMP Communities

| Community | Akses | Penggunaan |
|-----------|-------|------------|
| `public` | Read-Only | Monitoring |
| `globalrw` | Read-Write | Provisioning |

## 📁 Struktur Proyek

```
snmp-zte-web/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Main page
│   │   └── globals.css     # Global styles
│   ├── components/
│   │   ├── features/
│   │   │   ├── OLTForm.tsx     # Connection form
│   │   │   ├── ONUList.tsx     # ONU list display
│   │   │   └── QueryPanel.tsx  # Query execution
│   │   ├── layout/
│   │   │   └── Sidebar.tsx     # Navigation sidebar
│   │   └── ui/
│   │       ├── Button.tsx      # Button component
│   │       └── Card.tsx        # Card component
│   ├── lib/
│   │   ├── api.ts          # API client
│   │   └── utils.ts        # Utilities
│   └── types/
│       └── index.ts        # TypeScript types
├── public/
│   └── favicon.ico
├── .env.local
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── Dockerfile
└── README.md
```

## 🛠️ Tech Stack

- **Framework:** Next.js 15
- **UI Library:** React 19
- **Styling:** Tailwind CSS
- **HTTP Client:** SWR
- **Icons:** Lucide React
- **Language:** TypeScript

## 🔗 Related Projects

- [SNMP-ZTE API](https://github.com/ardani17/snmp-zte) - Backend API

## 📸 Screenshots

### Login Page
![Login](docs/login.png)

### Dashboard with Sidebar
![Dashboard](docs/dashboard.png)

### Query Result
![Query](docs/query.png)

## 🤝 Contributing

1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

MIT License

## 👤 Author

- **Ardani** - [github.com/ardani17](https://github.com/ardani17)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
