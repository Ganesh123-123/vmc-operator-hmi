# VMC Operator HMI & Industrial Machine Dashboard

A production-grade, industrial-spec **Human-Machine Interface (HMI)** and **Machine Telemetry Dashboard** web application designed for a single **3-Axis Vertical Machining Center (VMC-01)** operator for Primeform Labs.

```
OPERATOR LOGIN  →  HMI GUIDANCE (5 STAGES)  ↔  MACHINE TELEMETRY DASHBOARD
```

---

## 🌟 Key Application Modules

### 1. 🔐 Operator Authentication
- **Secure Industrial Terminal Login**: Access control for single VMC machine operator.
- **1-Click Demo Login**: Quick-fill demo credentials (`operator` / `operator123`).
- **Session Persistence**: Stored in `localStorage` with operator profile badge and logout action in the top header.

### 2. 📊 Industrial Machine & Telemetry Dashboard
- **Top Navigation Switcher**: Seamlessly toggle between **[🛠️ HMI GUIDANCE]** and **[📊 DASHBOARD]**.
- **OEE & Productivity KPIs**: Overall OEE (88.5%), Availability (99.2%), Performance (94.8%), Quality (100.0%).
- **Active Job & Blueprint Specification**: `PRF_VMC_POCKET_001 REV-B`, drawing `PRF-VMC-001 REV-B`, Aluminium 6061-T6 block dimensions (`100 × 80 × 25 mm`), Work Offset `G54`, and Precision Vice `FV-100`.
- **Sensors & Pneumatics Monitoring**: Spindle speed, motor load %, main air pressure (6.0 bar), lubrication pressure (3.2 bar), coolant level (94%), spindle motor temperature, and axis home coordinates.
- **Cutting Tool Magazine Wear Monitor**: Tool condition gauges and accumulated cutting time for T01, T02, T03, and T04.
- **Live Event Audit Log Feed**: Real-time event log from SQLite capturing check verifications, tool installations, spindle activations, and workflow resets.

### 3. 🛠️ Step-by-Step HMI Startup Guidance Workflow
- **Power On Splash**: Machine online banner and prompt to initiate startup guidance.
- **Stage 1 (Machine Checks)**: 6 safety checks confirmed sequentially with detailed instructions and sequence tracker.
- **Stage 2 (Required Tools)**: 4 required cutting tools (`T01 Face Mill`, `T02 End Mill`, `T03 Drill`, `T04 Ball Nose End Mill`) with installation confirmation gating.
- **Stage 3 (Workpiece Setup)**: 6 sequential fixture & clamping steps with dimensions, Datum A orientation, and G54 offset verification.
- **Stage 4 (Ready Review)**: Comprehensive 3-column verification checklist with prominent **`✓ READY`** banner and gated `PROCEED TO OPERATION` button.
- **Stage 5 (Operation)**: Machining monitor with rotating spindle graphics, 4,500 RPM telemetry, 800 mm/min feed rate, live elapsed timer (`00:02:45`), cycle progress %, and tactile `START OPERATION` / `STOP OPERATION` controls.
- **Workflow Reset**: Integrated confirmation modal to restart from Stage 1 safely.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Bundler & Dev Server**: Vite
- **Styling**: Tailwind CSS (custom industrial theme tokens & animations)
- **Icons**: Lucide React
- **Design Resolution**: Fully responsive for Touchscreens, Tablets, and Desktop (1024×768 and up)

### Backend
- **Runtime**: Node.js 24 + Express.js + TypeScript
- **ORM**: Prisma ORM v6
- **Database / Persistence**: SQLite (`backend/prisma/dev.db`)
- **Validation**: Strict workflow state machine enforcement
- **Testing**: Vitest + Supertest integration test suite

---

## 🔑 Demo Access Credentials

| Field | Value |
| :--- | :--- |
| **Username** | `operator` |
| **Password** | `operator123` |
| **Role** | VMC Machinist Level 1 |

*(You can also use the 1-click Demo Login button on the login screen).*

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+ or v20+ recommended, tested on Node 24)
- npm (v9+)

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Setup & Seed Database
```bash
npm run db:setup
```

### 3. Run Development Servers
```bash
npm run dev
```
- **Frontend HMI**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🧪 Automated Testing

Run the automated integration test suite:
```bash
npm test
```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Operator authentication with demo credentials |
| `GET` | `/api/auth/me` | Current authenticated operator session |
| `GET` | `/api/dashboard/stats` | Comprehensive machine telemetry, OEE, tool wear, and sensors |
| `GET` | `/api/logs` | Real-time system event audit logs |
| `GET` | `/api/machine` | Get machine parameters, program, drawing, and work offset |
| `GET` | `/api/workflow` | Get current stage, active step index, progress counts & gating flags |
| `POST` | `/api/workflow/next` | Advance to next stage (validated against stage completion) |
| `POST` | `/api/workflow/reset` | Reset all confirmations back to Stage 1 |
| `GET` | `/api/machine-checks` | List 6 machine checks with confirmation statuses |
| `POST` | `/api/machine-checks/:id/confirm` | Confirm a specific machine check |
| `GET` | `/api/tools` | List 4 required cutting tools with specs |
| `POST` | `/api/tools/:id/confirm` | Confirm tool installation in holder |
| `GET` | `/api/workpiece` | List 6 workpiece setup steps |
| `POST` | `/api/workpiece/:id/confirm` | Confirm workpiece clamping step |
| `GET` | `/api/ready-review` | Get aggregated readiness verification payload |
| `GET` | `/api/operation` | Get live operation telemetry, timer, RPM, and cycle progress |
| `POST` | `/api/operation/start` | Start machining cycle (`READY` → `RUNNING`) |
| `POST` | `/api/operation/stop` | Halt machining cycle (`RUNNING` → `STOPPED`) |
| `GET` | `/api/health` | Backend service health check |

---

## 👨‍💻 Developed For
**Primeform Labs – Software Engineer Technical Assignment**
*VMC Operator HMI & Industrial Telemetry Dashboard*
