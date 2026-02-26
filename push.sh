#!/bin/bash
cd /root/.openclaw/workspace/snmp-zte-web
git add -A
git commit -m "feat: Complete frontend with sidebar navigation

- Add Sidebar component with query categories
- Add QueryPanel for executing queries
- Update types with all 23 endpoints
- Improve Card and Button components
- Add proper layout with dashboard view

Features:
- Sidebar navigation with 4 categories (Core, Bandwidth, Provisioning, Statistics)
- 23 endpoints accessible from sidebar
- Query execution with parameters (board, pon, onu_id, name)
- Result display in JSON format
- Responsive design with mobile support"
git push origin main
