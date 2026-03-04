<p style="text-align: center">
  <img src="docs/gifs/logo-ani.gif" width="25%">
</p>

<h1 style="text-align: center">Project Continuum</h1>

<p style="text-align: center">
  <strong>Visual workflows that actually run — and survive.</strong><br/>
  Inspired by KNIME. Made for the cloud. Built to never die.
</p>

<p style="text-align: center">
  <a href="#-quick-start"><img src="https://img.shields.io/badge/Quick_Start-🚀-blue?style=for-the-badge" alt="Quick Start"></a>
  <a href="#-how-it-works"><img src="https://img.shields.io/badge/Architecture-🧱-orange?style=for-the-badge" alt="Architecture"></a>
  <a href="#-contribute"><img src="https://img.shields.io/badge/Contribute-💜-purple?style=for-the-badge" alt="Contribute"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-Apache_2.0-green?style=for-the-badge" alt="License"></a>
</p>

<p style="text-align: center">
  <em>No desktop. No install. Just resilient workflows, in your browser.</em>
</p>

---

## 🎬 See It In Action

<p style="text-align: center">
  <img src="docs/gifs/Sensor Anomaly.gif" width="80%" alt="Sensor Anomaly Detection Workflow">
</p>

<p style="text-align: center"><em>↑ A real workflow: streaming sensor data → anomaly detection → alert — all drag-and-drop.</em></p>

---

## 💡 The Idea

Start with a drop.
One node. Two.
Transform. Branch. Loop.

Each step tiny.
But at the end — it's a river.
A request turned system.
A click turned outcome.

> **Most tools look good. Then break.**
> We want graphs that keep running —
> even if Kafka dies, even if S3 lags, even if your code crashes.

---

## ✨ Features at a Glance

| | Feature | Description |
|---|---------|-------------|
| 🎨 | **Browser-Native Canvas** | Drag-and-drop workflow editor — real IDE feel, zero install |
| 🔁 | **Indestructible Execution** | Workflows survive crashes, restarts, and infrastructure failures |
| ⚡ | **Live Streaming Updates** | Watch your workflow execute step-by-step in real time |
| 📊 | **Columnar Data Passing** | Parquet tables between nodes — fast, query-ready |
| 🧪 | **AI / ML Ready** | Train models with Unsloth, run inference, all inside your flow |
| 🐳 | **Self-Hostable** | Docker Compose up and you're running |

---

## 🧱 How It Works

```
┌─────────────────────────────────────────────────────┐
│                    BROWSER                           │
│   Eclipse Theia + React Flow (drag & drop canvas)   │
└──────────────────────┬──────────────────────────────┘
                       │ WebSocket / REST
                       ▼
┌─────────────────────────────────────────────────────┐
│              BACKEND (Kotlin + Spring Boot)          │
│         Typed, clean, contract-safe API server       │
└──────┬──────────────────────────────┬───────────────┘
       │                              │
       ▼                              ▼
┌──────────────┐          ┌───────────────────────┐
│   Temporal   │          │   Kafka → MQTT (WS)   │
│  Durable     │          │   Live event stream    │
│  Execution   │          │   step-by-step updates │
└──────────────┘          └───────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────┐
│         Storage: AWS S3 / MinIO (local dev)         │
│         Format: Apache Parquet — columnar, fast     │
└─────────────────────────────────────────────────────┘
```

### The Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Canvas** | [Eclipse Theia](https://theia-ide.org/) + [React Flow](https://reactflow.dev/) | Full IDE experience in the browser |
| **Engine** | [Temporal](https://temporal.io) | Durable execution, auto-retry, infinite scale |
| **Events** | Kafka → MQTT over WebSockets | Real-time step-by-step workflow updates |
| **Data** | Apache Parquet | Fast, columnar, query-ready inter-node data |
| **Storage** | AWS S3 / MinIO | Open, portable, no vendor lock-in |
| **Backend** | Kotlin + Spring Boot | Type-safe, clean, battle-tested |
| **Resilience** | Temporal | Fails? Retries. Crashes? Recovers. Forever. |
| **Flow Control** | Output `null` on a port = flow stops | Simple guard logic. Real loops coming. |

---

## 🧬 AI Training Workflows

<p style="text-align: center">
  <img src="docs/gifs/Unsloth1.gif" width="80%" alt="Unsloth AI Training Workflow">
</p>

<p style="text-align: center"><em>↑ Fine-tune LLMs with Unsloth — right inside your workflow graph.</em></p>

---

## 🚀 Quick Start

### Option A: IntelliJ IDEA (Recommended)

> 🧠 **Zero-config IDE setup** — This repo ships with shared [IntelliJ IDEA Run Configurations](https://www.jetbrains.com/help/idea/run-debug-configuration.html) in the `.run/` directory. Just open the project and they'll be **auto-detected** in your Run/Debug toolbar — no manual setup needed.
>
> Included configurations: **ApiServer**, **MessageBridge**, **BaseWorker**, **Frontend**

1. Open the project in IntelliJ IDEA
2. Start infrastructure:
   ```bash
   cd docker && docker compose up -d
   ```
3. Select a run configuration from the toolbar and hit ▶️ — start **ApiServer**, **MessageBridge**, and **BaseWorker**
4. Run the **Frontend** configuration (or manually):
   ```bash
   cd continuum-frontend && yarn install && yarn start:workbench
   ```
5. Open [http://localhost:3002](http://localhost:3002) and start building workflows!

### Option B: Command Line

```bash
# Clone the repo
git clone https://github.com/your-org/Continuum.git
cd Continuum

# Spin up infrastructure (Temporal, Kafka, MinIO, Mosquitto)
cd docker
docker compose up -d

# Build & run the backend
./gradlew :continuum-api-server:bootRun --args='--server.port=8080'

# (In another terminal) Build and run Message Bridge (Kafka → MQTT)
./gradlew :continuum-message-bridge:bootRun --args='--server.port=8082'

# (In another terminal) Start the worker
./gradlew :workers:continuum-base-worker:bootRun --args='--server.port=8081'

# Open the Workbench
cd continuum-frontend
yarn install
yarn start:workbench

# Open http://localhost:3002 and start building workflows!
```

> 💡 **Tip:** Pass any `spring.*` property via `--args`:
> ```bash
> ./gradlew :continuum-api-server:bootRun --args='--spring.profiles.active=dev --server.port=9090'
> ```

> 💡 Full setup guide coming soon. For now — explore, break things, open issues.

---

## 🗺️ Roadmap

- [x] Drag-and-drop visual workflow editor
- [x] Durable execution with Temporal
- [x] Live streaming updates via Kafka → MQTT
- [x] Parquet-based data passing between nodes
- [x] Base node library (Transform, REST, Branch, etc.)
- [x] Unsloth AI training node
- [x] IntelliJ IDEA shared run configurations — zero-config dev setup
- [ ] 🔁 True `while` / `for` loops with condition builder
- [ ] 🧪 More RDKit chemistry nodes
- [ ] 🤖 Full AI training node suite (Unsloth ecosystem)
- [ ] 🔌 Plugin store — Slack, Stripe, Databases, AI services
- [ ] 🙋 Human-in-the-loop — interactive workflows with approval gates, manual review steps, and pause/resume
- [ ] 🐛 Visual debugger with timeline replay
- [ ] 👥 Multi-tenancy & RBAC
- [ ] 🏗️ Multi-worker support — each plugin runs its own worker, all discovered via shared registry
- [ ] 📦 Zero-config self-host with `docker compose up`

---

## 🤝 Contribute

We don't want perfect. We want **working**.

If you see the gap — fill it. Check out the [Issues](../../issues) page, pick something, and send a PR.

**First time?** Look for issues labeled `good first issue`. We're friendly.

---

## 📄 License

[Apache 2.0](LICENSE) — open, safe, patent-protected.

---

<p style="text-align: center">
  <strong>Welcome. Break it. Fix it. Flow with us.</strong>
</p>

