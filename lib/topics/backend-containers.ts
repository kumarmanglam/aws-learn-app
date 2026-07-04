// ============================================================
// SECTION: Backend — Containers
// Docker fundamentals, Docker Compose, and image layer / caching /
// multi-stage build mechanics. Authored to the messaging.ts /
// frontend-core.ts gold-standard bar.
// ============================================================
import { svgDefs, type Topic } from "./shared";

const box = (
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
  sub: string,
  color = "#0ea5e9",
) => `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#243349" stroke="${color}"/>
  <text x="${x + w / 2}" y="${y + h / 2 - 2}" text-anchor="middle" fill="#e6edf3" font-size="12" font-weight="600">${title}</text>
  <text x="${x + w / 2}" y="${y + h / 2 + 15}" text-anchor="middle" fill="#8b949e" font-size="10">${sub}</text>
`;

export const backendContainersTopics: Topic[] = [
  // -----------------------------------------------------------------
  {
    id: "be-docker",
    title: "Docker: Images & Containers",
    shortLabel: "Docker Basics",
    section: "Containers",
    domain: "Backend",
    tldr:
      "Docker packages an application plus all its dependencies into a portable, reproducible unit. A Dockerfile is the recipe, an image is the read-only baked result built from stacked layers, and a container is a running instance of that image. Unlike VMs, containers share the host OS kernel, so they start in milliseconds and stay small. Build once, ship a registry image, and run identically on any machine.",
    subtopics: [
      {
        heading: "The core mental model",
        bullets: [
          { icon: "📜", text: "A **Dockerfile** is the recipe — an ordered list of build instructions (`FROM`, `RUN`, `COPY`, `CMD`)." },
          { icon: "📦", text: "An **image** is the read-only blueprint (like a class); a **container** is a running instance of it (like an object). One image → many containers." },
          { icon: "🗄️", text: "A **registry** (Docker Hub, Amazon ECR, GCR) stores images so you `push` to publish and `pull` to deploy." },
        ],
      },
      {
        heading: "Containers vs virtual machines",
        bullets: [
          { icon: "🧬", text: "Containers **share the host OS kernel** and isolate only the process, filesystem, and network — no guest OS per app." },
          { icon: "⚡", text: "Result: **millisecond startup**, tiny footprint, high density — many containers per host vs a handful of VMs." },
          { icon: "🎯", text: "Solves 'it works on my machine': the **same image** runs on a laptop, a CI runner, and a cloud instance." },
        ],
      },
      {
        heading: "Everyday commands",
        bullets: [
          { icon: "🔨", text: "`docker build -t app:v1 .` builds an image; `docker run -p 8000:8000 app:v1` runs it, mapping **host:container** ports." },
          { icon: "🔍", text: "`docker ps` lists running containers; `docker logs <id>` tails output; `docker exec -it <id> bash` opens a shell inside." },
          { icon: "💾", text: "`-v ./data:/app/data` mounts a **volume** for persistent storage; `--env-file .env` injects environment variables." },
        ],
      },
    ],
    keyFacts: [
      { label: "Image", value: "Read-only blueprint", icon: "📦" },
      { label: "Container", value: "Running instance of an image", icon: "🏃" },
      { label: "Isolation", value: "Shares host OS kernel", icon: "🧬" },
      { label: "Startup", value: "Milliseconds (vs VM minutes)", icon: "⚡" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'Recipe vs baked result vs serving' → **Dockerfile → image → container**.",
        "'Why not a VM?' → containers **share the host kernel**, so they're smaller and start in ms.",
        "'It works on my machine' → ship the **image**; it runs identically everywhere.",
        "`-p host:container` maps ports; `-v host:container` mounts volumes; `--env-file` injects env.",
        "`build` (make image) vs `run` (start container) vs `exec` (into a running one).",
      ],
      analogyBrief:
        "A Dockerfile is a recipe, the image is the cake you baked and sealed in a box, and a container is a slice you serve — you can serve many identical slices from one cake.",
    },
    explanation:
      "Docker packages an application together with all of its dependencies — the OS libraries, language runtime, and code — into a single portable, reproducible unit so it runs the same way everywhere. Three concepts anchor the model. A Dockerfile is the recipe: an ordered list of instructions such as FROM (choose a base image), RUN (execute a build command), COPY (add files), EXPOSE (document a port), and CMD (the default command to run). Building that Dockerfile produces an image, a read-only blueprint that is best thought of like a class definition. Running an image produces a container, a live instance of the image, like an object created from a class — and because the image is read-only you can run many isolated containers from a single image simultaneously. Images live in a registry (Docker Hub, Amazon ECR, Google Container Registry), which you push to when publishing and pull from when deploying. The reason containers beat both 'just use a virtualenv' and full virtual machines is isolation with efficiency: containers share the host operating system kernel and isolate only the process tree, filesystem, and network namespace, so unlike a VM there is no full guest OS per application. That yields millisecond startup times, tiny memory footprints, and high density (many containers per host), while still guaranteeing reproducibility — the same OS, the same language version, the same system libraries — which is what eliminates the classic 'it works on my machine' problem. In daily use you build an image with docker build -t name:tag ., run it with docker run mapping host and container ports (-p 8000:8000), inject configuration with --env-file, and persist data with a volume mount (-v ./data:/app/data). You inspect the system with docker ps (running containers), docker logs to follow output, and docker exec -it <id> bash to open a shell inside a running container for debugging, and you clean up unused resources with docker system prune.",
    analogy:
      "Think of Docker like a professional bakery. The Dockerfile is the written recipe — a precise, ordered list of steps and ingredients. When you follow that recipe you bake a cake and seal it in a box: that sealed box is the image, a finished, unchangeable artifact you can store on a shelf (the registry) or mail anywhere. A container is a slice you cut and serve to a customer — a live, running portion of that cake. Because the box is read-only you can serve ten identical slices at once (ten containers from one image), each on its own plate (isolated), and none of them alters the original cake. And unlike renting a whole separate kitchen for every dish (a virtual machine), all these slices are served from the one shared kitchen (the host OS kernel), which is why it's so fast and cheap.",
    diagram: `<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Dockerfile builds an image; containers run from it on a shared kernel">${svgDefs}
      ${box(20, 30, 150, 55, "Dockerfile", "the recipe", "#f59e0b")}
      <text x="185" y="62" fill="#f59e0b" font-size="12">build →</text>
      ${box(250, 30, 150, 55, "Image", "read-only blueprint", "#0ea5e9")}
      <line x1="170" y1="57" x2="248" y2="57" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="415" y="62" fill="#8b949e" font-size="12">run →</text>
      <rect x="470" y="15" width="235" height="90" rx="10" fill="#1a2332" stroke="#22c55e" stroke-dasharray="5 4"/>
      <text x="485" y="34" fill="#22c55e" font-size="11" font-weight="700">Containers (many from 1 image)</text>
      ${box(482, 45, 100, 45, "Container", "instance", "#22c55e")}
      ${box(592, 45, 100, 45, "Container", "instance", "#22c55e")}
      <line x1="400" y1="57" x2="468" y2="57" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <rect x="20" y="140" width="685" height="55" rx="10" fill="#161b22" stroke="#3b82f6"/>
      <text x="38" y="163" fill="#58a6ff" font-size="12" font-weight="700">Docker Engine</text>
      <text x="38" y="183" fill="#8b949e" font-size="10">Runs containers as isolated processes; pulls/pushes images to a registry.</text>
      <rect x="20" y="205" width="685" height="55" rx="10" fill="#0d1117" stroke="#8b5cf6"/>
      <text x="38" y="228" fill="#d2a8ff" font-size="12" font-weight="700">Shared Host OS Kernel</text>
      <text x="38" y="248" fill="#8b949e" font-size="10">All containers share it — no guest OS per app, so startup is ms and images stay small.</text>
    </svg>`,
    diagramLegend: [
      { color: "#f59e0b", label: "Dockerfile", description: "The recipe: ordered build instructions." },
      { color: "#0ea5e9", label: "Image", description: "Read-only blueprint stored in a registry." },
      { color: "#22c55e", label: "Container", description: "A running instance; many run from one image." },
    ],
    codeExample: {
      language: "dockerfile",
      title: "A production-ready Dockerfile for a FastAPI app",
      code: `# Slim base image — smaller than full ubuntu
FROM python:3.11-slim

WORKDIR /app

# System deps first (rarely changes → cached layer)
RUN apt-get update && apt-get install -y --no-install-recommends curl \\
    && rm -rf /var/lib/apt/lists/*

# Install Python deps BEFORE copying code (cached until requirements change)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code (invalidates cache on any code change)
COPY . .

# Security: run as a non-root user
RUN useradd -m appuser && chown -R appuser /app
USER appuser

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]`,
    },
    codeExamples: [
      {
        language: "dockerfile",
        tab: "Dockerfile",
        title: "Production Dockerfile with layer caching",
        code: `FROM python:3.11-slim
WORKDIR /app

# System deps (cached layer — rarely changes)
RUN apt-get update && apt-get install -y --no-install-recommends curl \\
    && rm -rf /var/lib/apt/lists/*

# Dependencies BEFORE code so pip layer is reused when only code changes
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# App code last (most frequently changing)
COPY . .

RUN useradd -m appuser && chown -R appuser /app
USER appuser

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]`,
      },
      {
        language: "bash",
        tab: "CLI workflow",
        title: "Build, run, inspect, debug",
        code: `# Build an image from the current directory
docker build -t myapp:v1 .

# Run it: map host:container port, load env, detached
docker run -d -p 8000:8000 --env-file .env myapp:v1

# Mount a volume for persistent data
docker run -p 8000:8000 -v $(pwd)/data:/app/data myapp:v1

# Inspect
docker ps                       # running containers
docker logs -f <container_id>   # follow logs
docker exec -it <id> bash       # shell into a running container

# Cleanup
docker stop <id> && docker rm <id>
docker system prune             # remove unused images/containers/networks`,
      },
      {
        language: "dockerfile",
        tab: ".dockerignore",
        title: "Shrink the build context",
        code: `# .dockerignore — keeps the build context small & fast,
# and prevents secrets/junk from being copied by "COPY . ."
.venv/
__pycache__/
*.pyc
.env
.git/
*.log
node_modules/
data/`,
      },
    ],
    problemStatement:
      "A data team ships a FastAPI service that runs perfectly on the lead engineer's Mac but crashes on a teammate's Windows box and again on the GPU cloud instance — different Python versions and missing system libraries each time. Explain how Docker eliminates this class of failure, what the difference is between the Dockerfile, the image, and the container, and why a container is far lighter than giving each environment its own virtual machine.",
    questions: [
      {
        q: "What is the relationship between a Docker image and a container?",
        options: [
          "A. They are two words for the same thing",
          "B. An image is a read-only blueprint; a container is a running instance of that image",
          "C. A container is a blueprint used to build images",
          "D. An image runs inside a container",
        ],
        answer: "B",
        explanation:
          "B is correct: the image is the read-only blueprint (like a class) and a container is a live instance created from it (like an object). You can run many containers from one image.",
      },
      {
        q: "What is a Dockerfile?",
        options: [
          "A. A running container's log file",
          "B. A text file of ordered instructions used to build an image",
          "C. The registry that stores images",
          "D. A network configuration for containers",
        ],
        answer: "B",
        explanation:
          "B is correct: a Dockerfile is the recipe — instructions like FROM, RUN, COPY, and CMD that Docker executes to build an image. It is not a log, a registry, or a network config.",
      },
      {
        q: "How do containers differ fundamentally from virtual machines?",
        options: [
          "A. Containers include a full guest operating system each",
          "B. Containers share the host OS kernel and isolate only the process, so they are smaller and start in milliseconds",
          "C. VMs share the host kernel while containers do not",
          "D. There is no technical difference",
        ],
        answer: "B",
        explanation:
          "B is correct: containers share the host kernel and isolate the process/filesystem/network, avoiding a per-app guest OS. That makes them far lighter and faster to start than VMs, which each run a full OS.",
      },
      {
        q: "Which command maps port 8000 on the host to port 8000 in the container?",
        options: [
          "A. docker run -v 8000:8000 myapp",
          "B. docker run -p 8000:8000 myapp",
          "C. docker build -p 8000:8000 myapp",
          "D. docker exec -p 8000:8000 myapp",
        ],
        answer: "B",
        explanation:
          "B is correct: -p host:container publishes a port. -v is for volume mounts, build creates images (no port publishing at build), and exec runs a command in an already-running container.",
      },
      {
        q: "Where are Docker images stored so they can be shared and deployed?",
        options: [
          "A. In a registry such as Docker Hub or Amazon ECR",
          "B. Only in the local /tmp directory",
          "C. Inside the running container",
          "D. In the Dockerfile itself",
        ],
        answer: "A",
        explanation:
          "A is correct: registries (Docker Hub, ECR, GCR) store images; you push to publish and pull to deploy. Images are not kept inside containers or embedded in the Dockerfile.",
      },
      {
        q: "You need to open an interactive shell inside a container that is already running to debug it. Which command?",
        options: [
          "A. docker build -it <id> bash",
          "B. docker run -it <id> bash",
          "C. docker exec -it <id> bash",
          "D. docker logs -it <id> bash",
        ],
        answer: "C",
        explanation:
          "C is correct: docker exec runs a new command (here an interactive bash) inside an already-running container. docker run would start a new container, build makes an image, and logs only streams output.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "be-docker-compose",
    title: "Docker Compose & Multi-Container Apps",
    shortLabel: "Docker Compose",
    section: "Containers",
    domain: "Backend",
    tldr:
      "Docker Compose defines a multi-container application in one declarative YAML file and runs it with a single command. Each entry under `services` becomes a container; Compose creates a shared network so services reach each other by service name (e.g. `redis:6379`). `depends_on` orders startup, `volumes` persist data, and `docker compose up` / `down` bring the whole stack up or tear it down together.",
    subtopics: [
      {
        heading: "What Compose is for",
        bullets: [
          { icon: "📄", text: "Describe a **whole stack** (API + database + cache + worker) declaratively in one **compose.yaml** instead of many `docker run` commands." },
          { icon: "🚀", text: "`docker compose up -d` starts every service; `docker compose down` stops and removes them together — reproducible for every developer." },
          { icon: "🧩", text: "Each key under **services** is one container built from `build:` (a local Dockerfile) or `image:` (a registry image)." },
        ],
      },
      {
        heading: "Networking & startup order",
        bullets: [
          { icon: "🌐", text: "Compose creates a **default network**; services find each other by **service name** as the hostname (`redis://redis:6379`, not localhost)." },
          { icon: "🔗", text: "**depends_on** controls **start order**; with `condition: service_healthy` it waits for a **healthcheck** to pass before starting the dependent." },
          { icon: "⚠️", text: "`depends_on` alone waits for the container to **start**, not to be **ready** — use a healthcheck for true readiness." },
        ],
      },
      {
        heading: "Config, data & rebuilds",
        bullets: [
          { icon: "🔑", text: "Inject config with **environment:** or **env_file:**; publish ports with **ports: \"host:container\"**." },
          { icon: "💾", text: "**Named volumes** (e.g. `redis_data:/data`) persist data across restarts; **bind mounts** (`./src:/app`) sync local code for dev." },
          { icon: "🔁", text: "`docker compose build --no-cache` rebuilds ignoring cache; `docker compose logs -f api` tails one service." },
        ],
      },
    ],
    keyFacts: [
      { label: "Definition", value: "One declarative YAML file", icon: "📄" },
      { label: "Service discovery", value: "By service name on shared network", icon: "🌐" },
      { label: "Startup order", value: "depends_on (+ healthcheck)", icon: "🔗" },
      { label: "Bring up / tear down", value: "compose up / compose down", icon: "🚀" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'Run several containers together reproducibly' → **Docker Compose**.",
        "Services reach each other by **service name**, not localhost (Compose default network).",
        "'Wait until the DB is actually ready' → `depends_on` + `condition: service_healthy`.",
        "`depends_on` alone = wait for **start**, not **readiness**.",
        "Persist data → **named volume**; live-reload dev code → **bind mount**.",
      ],
      analogyBrief:
        "Compose is a stage manager's cue sheet: one document that lists every actor (service), tells them where to stand and how to talk to each other (network), and who must be ready before the next enters (depends_on).",
    },
    explanation:
      "Docker Compose solves the problem that real applications are rarely a single container: a typical backend is an API plus a database plus a cache plus a background worker, and starting each with its own long docker run command (with the right ports, env vars, volumes, and network) is tedious and error-prone. Compose lets you describe the entire stack declaratively in one YAML file (compose.yaml) and manage it with single commands: docker compose up -d starts every service in the background, and docker compose down stops and removes them together, so any developer gets an identical environment. Each key under the top-level services block becomes one container, defined either by build: (pointing at a local Dockerfile so Compose builds the image) or image: (pulling a prebuilt image from a registry). Compose automatically creates a shared default network and, crucially, registers each service under its own name as a DNS hostname — so the API connects to the cache at redis://redis:6379 using the service name 'redis', never localhost, because each service is an isolated container. Startup order is expressed with depends_on, but there is a common gotcha: by default depends_on only waits for the dependency's container to start, not for the process inside to be ready to accept connections; to wait for genuine readiness you attach a healthcheck to the dependency (for example redis-cli ping) and set depends_on with condition: service_healthy on the dependent service. Configuration is injected through environment: (inline key/values) or env_file: (a .env file), and ports are published with the host:container syntax. Data persistence uses volumes: named volumes (declared in a top-level volumes: block and mounted like redis_data:/data) survive container restarts and recreations, while bind mounts (./src:/app) map a host directory into the container and are ideal for live-reloading code during development. Finally, docker compose build --no-cache forces a clean rebuild, and docker compose logs -f api follows the logs of a single service.",
    analogy:
      "Docker Compose is the stage manager's cue sheet for a play. Instead of separately hiring, positioning, and instructing each actor (running each container by hand), the stage manager holds one master document that lists every performer in the production (the services), tells each where to stand and how to reach the others by name over the same intercom (the shared network with service-name DNS), and specifies the order of entrances — the lead can't walk on until the supporting actor is not merely backstage but fully in costume and ready (depends_on with a healthcheck). Call 'places, everyone' once (compose up) and the whole cast assembles; call 'that's a wrap' (compose down) and they all leave together. Props that must survive between shows are locked in a labeled cabinet (a named volume) rather than left on the set.",
    diagram: `<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Docker Compose services on a shared network with a persistent volume">${svgDefs}
      ${box(20, 30, 150, 55, "compose.yaml", "declares the stack", "#f59e0b")}
      <text x="185" y="62" fill="#f59e0b" font-size="12">up →</text>
      <rect x="240" y="15" width="460" height="180" rx="12" fill="#0d1117" stroke="#0ea5e9" stroke-dasharray="5 4"/>
      <text x="258" y="36" fill="#58a6ff" font-size="11" font-weight="700">Compose default network (service-name DNS)</text>
      ${box(260, 55, 130, 50, "api", ":8000 (build:)", "#22c55e")}
      ${box(430, 55, 130, 50, "redis", ":6379 (image:)", "#e11d8f")}
      ${box(595, 55, 90, 50, "worker", "build:", "#8b5cf6")}
      <line x1="390" y1="80" x2="428" y2="80" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
      <text x="360" y="128" fill="#8b949e" font-size="10">api → redis://redis:6379</text>
      <line x1="595" y1="80" x2="562" y2="80" stroke="#ff9900" stroke-width="1.5" marker-end="url(#arrow)"/>
      <text x="560" y="150" fill="#8b949e" font-size="10">depends_on:</text>
      <text x="560" y="164" fill="#8b949e" font-size="10">redis (healthy)</text>
      ${box(430, 130, 130, 45, "volume", "redis_data:/data", "#16a34a")}
      <line x1="495" y1="105" x2="495" y2="128" stroke="#16a34a" stroke-width="2" marker-end="url(#arrow)"/>
      <rect x="20" y="220" width="685" height="55" rx="10" fill="#161b22" stroke="#3b82f6"/>
      <text x="38" y="243" fill="#58a6ff" font-size="12" font-weight="700">docker compose up -d  /  down</text>
      <text x="38" y="263" fill="#8b949e" font-size="10">Brings the whole stack up or tears it down together — one command, reproducible per dev.</text>
    </svg>`,
    diagramLegend: [
      { color: "#22c55e", label: "api service", description: "Built from a local Dockerfile; talks to redis by name." },
      { color: "#e11d8f", label: "redis service", description: "Pulled from a registry image; reached at redis:6379." },
      { color: "#16a34a", label: "Named volume", description: "Persists data across container restarts/recreations." },
    ],
    codeExample: {
      language: "yaml",
      title: "compose.yaml — API + Redis + worker with healthcheck",
      code: `services:
  api:
    build: .                     # build from local Dockerfile
    ports:
      - "8000:8000"              # host:container
    env_file: .env
    environment:
      - REDIS_URL=redis://redis:6379   # reach redis by SERVICE NAME
    depends_on:
      redis:
        condition: service_healthy     # wait for readiness, not just start
    volumes:
      - ./src:/app/src           # bind mount for live dev

  redis:
    image: redis:7-alpine        # pull from registry
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3
    volumes:
      - redis_data:/data         # named volume persists across restarts

  worker:
    build: .
    command: python worker.py
    depends_on:
      - redis

volumes:
  redis_data:`,
    },
    codeExamples: [
      {
        language: "yaml",
        tab: "compose.yaml",
        title: "Multi-service stack with health-gated startup",
        code: `services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - REDIS_URL=redis://redis:6379   # service name = hostname
    depends_on:
      redis:
        condition: service_healthy
    volumes:
      - ./src:/app/src

  redis:
    image: redis:7-alpine
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3
    volumes:
      - redis_data:/data

volumes:
  redis_data:`,
      },
      {
        language: "bash",
        tab: "Compose CLI",
        title: "Everyday Compose commands",
        code: `# Start the whole stack in the background
docker compose up -d

# Follow logs for just one service
docker compose logs -f api

# Rebuild images ignoring the cache
docker compose build --no-cache

# Run a one-off command in a service's container
docker compose exec api python manage.py migrate

# Stop and remove containers, networks (add -v to also drop volumes)
docker compose down`,
      },
      {
        language: "python",
        tab: "App usage",
        title: "Connecting to a service by its Compose name",
        code: `import os
import redis

# In Compose, "redis" resolves to the redis container via the
# shared network's DNS — NOT localhost.
REDIS_URL = os.environ.get("REDIS_URL", "redis://redis:6379")

r = redis.from_url(REDIS_URL)
r.set("greeting", "hello from the api container")
print(r.get("greeting"))   # b'hello from the api container'`,
      },
    ],
    problemStatement:
      "A backend needs an API, a Postgres database, and a Redis cache to run together locally, and new hires waste a day wiring them up by hand. The API also intermittently crashes on boot because it connects to Postgres before the database has finished initializing. Design a single Compose file that starts all three, lets the API reach the others by name, persists the database data across restarts, and only starts the API once Postgres is truly ready.",
    questions: [
      {
        q: "What problem does Docker Compose primarily solve?",
        options: [
          "A. Building a single image faster",
          "B. Defining and running a multi-container application from one declarative file",
          "C. Replacing the Dockerfile entirely",
          "D. Encrypting container filesystems",
        ],
        answer: "B",
        explanation:
          "B is correct: Compose describes a whole stack of services in one YAML file and runs them together with a single command. It complements (not replaces) the Dockerfile and does not build images faster or handle encryption.",
      },
      {
        q: "In a Compose file, how does the `api` service connect to the `redis` service?",
        options: [
          "A. Via localhost:6379",
          "B. Via the service name as the hostname, e.g. redis:6379",
          "C. Via the host machine's public IP",
          "D. They cannot communicate",
        ],
        answer: "B",
        explanation:
          "B is correct: Compose creates a shared network and registers each service name as a DNS hostname, so the api reaches the cache at redis:6379. localhost would refer to the api's own container, not redis.",
      },
      {
        q: "What is the limitation of using `depends_on` by itself?",
        options: [
          "A. It reverses the startup order",
          "B. It waits only for the dependency's container to START, not for the process inside to be READY",
          "C. It prevents the dependency from starting at all",
          "D. It only works with named volumes",
        ],
        answer: "B",
        explanation:
          "B is correct: plain depends_on waits for the container to start, not for the service to accept connections. To wait for real readiness, add a healthcheck and use condition: service_healthy.",
      },
      {
        q: "Which mechanism ensures Redis data survives a `docker compose down` followed by `up`?",
        options: [
          "A. A named volume mounted at the data directory",
          "B. Setting restart: always",
          "C. Publishing the port with ports:",
          "D. Using env_file:",
        ],
        answer: "A",
        explanation:
          "A is correct: a named volume (e.g. redis_data:/data) persists data independently of the container lifecycle. Restart policies, port publishing, and env files do not persist data. (Note: `down -v` would still delete the volume.)",
      },
      {
        q: "What does `docker compose up -d` do?",
        options: [
          "A. Deletes all services",
          "B. Starts all defined services in detached (background) mode",
          "C. Only downloads images without running them",
          "D. Rebuilds every image from scratch",
        ],
        answer: "B",
        explanation:
          "B is correct: up starts every service defined in the compose file, and -d runs them detached in the background. It does not delete services or force a from-scratch rebuild (that's build --no-cache).",
      },
      {
        q: "You changed only application code and want Compose to see it without rebuilding the image on every edit. What is the idiomatic dev approach?",
        options: [
          "A. Run docker compose build --no-cache after each edit",
          "B. Use a bind mount (e.g. ./src:/app/src) so host code is synced into the container",
          "C. Delete the image and pull a new one",
          "D. Add the code to a named volume",
        ],
        answer: "B",
        explanation:
          "B is correct: a bind mount maps your host source directory into the container so edits are reflected live (often with a reloader). Rebuilding every edit is slow, and named volumes are for persistent data, not live source syncing.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "be-container-images",
    title: "Image Layers, Caching & Multi-Stage Builds",
    shortLabel: "Image Layers",
    section: "Containers",
    domain: "Backend",
    tldr:
      "A Docker image is a stack of read-only layers, one per build instruction (FROM/RUN/COPY). The build cache reuses a layer whenever its input is unchanged AND every layer before it also hit the cache — so ordering matters: put rarely-changing steps (deps) before frequently-changing ones (code). Multi-stage builds use a heavy 'builder' stage to compile, then copy only the artifacts into a slim final stage, cutting image size dramatically.",
    subtopics: [
      {
        heading: "Layers & the union filesystem",
        bullets: [
          { icon: "🥞", text: "Each instruction (`FROM`, `RUN`, `COPY`, `ADD`) creates a **read-only layer**; the image is those layers stacked via a **union filesystem**." },
          { icon: "🔗", text: "Layers are **shared** across images — two images on the same base download that base **once**, saving disk and pull time." },
          { icon: "✍️", text: "A container adds a thin **writable layer** on top; the underlying image layers stay immutable (copy-on-write)." },
        ],
      },
      {
        heading: "How the build cache works",
        bullets: [
          { icon: "♻️", text: "Docker **reuses** a layer if its instruction + inputs are unchanged **and** every prior layer was also a cache hit — a single miss **busts** all later layers." },
          { icon: "📐", text: "**Order for cache-friendliness**: base → system packages → dependency install → application code (most volatile last)." },
          { icon: "🎯", text: "Copy **dependency manifests first** (`COPY requirements.txt .` → `pip install`) so editing app code doesn't reinstall dependencies." },
        ],
      },
      {
        heading: "Multi-stage builds",
        bullets: [
          { icon: "🏗️", text: "Use multiple `FROM` stages: a **builder** stage compiles/installs, then a slim **runtime** stage `COPY --from=builder` grabs only the artifacts." },
          { icon: "🪶", text: "The final image ships **no compilers or build tooling** — shrinking size (e.g. **1.5 GB → 200 MB**) and reducing attack surface." },
          { icon: "🏷️", text: "Name stages with `AS builder`; only the **last** stage becomes the published image unless you target one with `--target`." },
        ],
      },
    ],
    keyFacts: [
      { label: "Layer", value: "One per build instruction", icon: "🥞" },
      { label: "Cache rule", value: "Reused only if input + all prior layers unchanged", icon: "♻️" },
      { label: "Best order", value: "Deps before code", icon: "📐" },
      { label: "Multi-stage", value: "Copy artifacts into slim final image", icon: "🏗️" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'Image = stack of read-only **layers**, one per instruction.'",
        "'Rebuild reinstalls deps every time' → **copy manifests before code**.",
        "A cache **miss** on one layer invalidates **all layers after it**.",
        "'Shrink a huge image / drop build tools' → **multi-stage build**.",
        "`COPY --from=builder` pulls artifacts from an earlier stage.",
      ],
      analogyBrief:
        "Layers are transparent sheets stacked into one picture; the cache reuses a sheet only if it and every sheet beneath it are unchanged. A multi-stage build is doing messy prep in the kitchen, then plating only the finished dish.",
    },
    explanation:
      "A Docker image is not a monolithic blob — it is an ordered stack of read-only layers, and each instruction in the Dockerfile that changes the filesystem (FROM, RUN, COPY, ADD) produces one layer. At runtime these layers are merged into a single view by a union filesystem, and a running container simply adds a thin writable layer on top using copy-on-write, leaving the image layers themselves immutable. Because layers are content-addressed and read-only, they are shared: if two images are built on python:3.11-slim, that base layer is stored and pulled only once, saving both disk space and network transfer. The build cache is the payoff of this design. When Docker builds, it walks the instructions in order and, for each one, checks whether it can reuse a previously built layer; it reuses a layer only when that instruction and its inputs are unchanged AND every layer before it was also a cache hit. The consequence is the single most important optimization rule: a cache miss on any layer invalidates every layer after it, so you must order the Dockerfile from least-frequently-changing to most-frequently-changing — base image, then system packages, then language dependencies, and finally the application code. The classic application of this is to copy only the dependency manifest first (COPY requirements.txt . followed by pip install, or COPY package.json before npm install) and copy the rest of the source afterward; that way editing a line of application code invalidates only the cheap final COPY layer instead of forcing a full, slow dependency reinstall. Multi-stage builds tackle a different problem: build tools bloat images and widen the attack surface. You declare more than one FROM in the same Dockerfile — an initial heavy 'builder' stage (with compilers, dev headers, and full toolchains) installs and compiles everything, and then a slim final 'runtime' stage copies only the finished artifacts across with COPY --from=builder, discarding the entire builder stage. The published image therefore contains just the runtime and the app, commonly shrinking an image from something like 1.5 GB down to around 200 MB, speeding up pulls and removing compilers that an attacker could otherwise exploit. Stages can be named with AS builder, only the final stage is published by default, and you can build up to a specific stage with --target.",
    analogy:
      "Picture an image as a painting made from a stack of transparent acetate sheets, one drawn per build step, laid on top of one another so you see a single combined picture (the union filesystem). If you want to redraw the picture and the bottom sheets haven't changed, you keep them and only redraw from the first altered sheet upward — but the moment one sheet in the middle changes, every sheet above it must be redrawn too (a cache miss cascades). That's why you draw the parts that rarely change (the base, the dependencies) on the lower sheets and the parts you tweak constantly (your code) on the very top sheet. A multi-stage build is like a restaurant kitchen: the prep station is a chaotic space full of knives, mixers, and raw ingredients (the builder stage with all the compilers), but none of that clutter goes to the customer — you plate only the finished dish on a clean plate (the slim runtime stage) and send that out, leaving the messy tools behind.",
    diagram: `<svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Image layers with cache invalidation and a multi-stage build">${svgDefs}
      <text x="150" y="28" text-anchor="middle" fill="#e6edf3" font-size="12" font-weight="700">Layer stack &amp; cache</text>
      ${box(40, 40, 220, 34, "COPY . .  (app code)", "changes often → top", "#f85149")}
      ${box(40, 80, 220, 34, "RUN pip install", "cached if reqs unchanged", "#22c55e")}
      ${box(40, 120, 220, 34, "COPY requirements.txt", "manifest first", "#22c55e")}
      ${box(40, 160, 220, 34, "RUN apt-get install", "system deps", "#22c55e")}
      ${box(40, 200, 220, 34, "FROM python:3.11-slim", "base (shared)", "#0ea5e9")}
      <text x="275" y="60" fill="#f85149" font-size="10">a miss here…</text>
      <text x="275" y="74" fill="#f85149" font-size="10">only busts the top layer</text>
      <text x="40" y="256" fill="#8b949e" font-size="10">Build reads bottom→top; a cache miss invalidates every layer above it.</text>
      <rect x="380" y="34" width="320" height="240" rx="12" fill="#0d1117" stroke="#8b5cf6" stroke-dasharray="5 4"/>
      <text x="398" y="55" fill="#d2a8ff" font-size="11" font-weight="700">Multi-stage build</text>
      ${box(400, 68, 280, 55, "FROM python:3.11 AS builder", "compilers, full toolchain", "#f59e0b")}
      ${box(400, 150, 280, 55, "FROM python:3.11-slim (runtime)", "slim, no build tools", "#22c55e")}
      <line x1="540" y1="123" x2="540" y2="148" stroke="#8b5cf6" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="398" y="140" fill="#8b949e" font-size="10">COPY --from=builder /artifacts .</text>
      <text x="398" y="230" fill="#8b949e" font-size="10">Final image ships only artifacts:</text>
      <text x="398" y="246" fill="#7ee787" font-size="10">~1.5 GB → ~200 MB, smaller attack surface.</text>
    </svg>`,
    diagramLegend: [
      { color: "#0ea5e9", label: "Base layer", description: "FROM image; shared across images, pulled once." },
      { color: "#22c55e", label: "Cached layers", description: "Reused while their inputs and prior layers are unchanged." },
      { color: "#f85149", label: "Invalidated layer", description: "A changed layer busts every layer after it." },
    ],
    codeExample: {
      language: "dockerfile",
      title: "Multi-stage build: heavy builder → slim runtime",
      code: `# --- Stage 1: builder (has the full toolchain) ---
FROM python:3.11 AS builder
WORKDIR /app
COPY requirements.txt .
# Install into a relocatable prefix we can copy out later
RUN pip install --user -r requirements.txt

# --- Stage 2: runtime (slim, no compilers) ---
FROM python:3.11-slim AS runtime
WORKDIR /app
# Copy ONLY the installed packages from the builder stage
COPY --from=builder /root/.local /root/.local
COPY . .
ENV PATH=/root/.local/bin:\$PATH
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
# Result: final image ships no build tools — e.g. 1.5 GB -> ~200 MB`,
    },
    codeExamples: [
      {
        language: "dockerfile",
        tab: "Cache-friendly",
        title: "Order deps before code so edits stay cheap",
        code: `FROM python:3.11-slim
WORKDIR /app

# 1) Rarely changes → deep, stable layer
RUN apt-get update && apt-get install -y --no-install-recommends curl \\
    && rm -rf /var/lib/apt/lists/*

# 2) Copy the MANIFEST first, install deps → cached until reqs change
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 3) App code LAST → editing code only busts this cheap layer
COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]`,
      },
      {
        language: "dockerfile",
        tab: "Multi-stage",
        title: "Builder + slim runtime",
        code: `# Stage 1: build with the full image
FROM python:3.11 AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --user -r requirements.txt

# Stage 2: runtime keeps only the artifacts
FROM python:3.11-slim AS runtime
WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY . .
ENV PATH=/root/.local/bin:\$PATH
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]`,
      },
      {
        language: "bash",
        tab: "Inspect layers",
        title: "See layers, cache hits, and size",
        code: `# Show each layer, its size, and the instruction that made it
docker history myapp:v1

# During a build, "CACHED" lines mean a layer was reused
docker build -t myapp:v1 .
#  => [2/5] RUN apt-get update ...        CACHED
#  => [3/5] COPY requirements.txt .       CACHED
#  => [4/5] RUN pip install ...           CACHED
#  => [5/5] COPY . .                      (rebuilt — code changed)

# Build only up to a named stage (e.g. to test the builder)
docker build --target builder -t myapp:builder .`,
      },
    ],
    problemStatement:
      "A CI pipeline takes eight minutes to build a Python service on every commit because it reinstalls all dependencies each time, and the resulting 1.6 GB image is slow to push and pull and flagged by security scanners for shipping compilers. Explain why the dependency reinstall keeps happening in terms of layer caching, how reordering the Dockerfile fixes it, and how a multi-stage build both shrinks the image and removes the build tooling from production.",
    questions: [
      {
        q: "What is a Docker image made of?",
        options: [
          "A. A single compressed binary",
          "B. A stack of read-only layers, one per filesystem-changing build instruction",
          "C. A running process and its memory",
          "D. Only the base operating system",
        ],
        answer: "B",
        explanation:
          "B is correct: an image is an ordered stack of read-only layers, each produced by an instruction like FROM, RUN, or COPY, merged by a union filesystem. It is not a single binary or a running process.",
      },
      {
        q: "When does Docker reuse a cached layer during a build?",
        options: [
          "A. Always, regardless of changes",
          "B. Only if that instruction's inputs are unchanged AND every layer before it was also a cache hit",
          "C. Only for the final layer",
          "D. Never; every build is from scratch",
        ],
        answer: "B",
        explanation:
          "B is correct: a layer is reused only when its instruction/inputs are unchanged and all preceding layers hit the cache. A miss on any earlier layer invalidates all layers after it.",
      },
      {
        q: "Why should you `COPY requirements.txt` and install dependencies BEFORE `COPY . .`?",
        options: [
          "A. It makes the base image smaller",
          "B. So editing application code doesn't invalidate the dependency-install layer, avoiding a full reinstall",
          "C. It is required syntax or the build fails",
          "D. It encrypts the dependencies",
        ],
        answer: "B",
        explanation:
          "B is correct: copying the manifest first isolates the dependency layer, so a code change only busts the final COPY layer and pip/npm install stays cached. It is an optimization, not required syntax, and unrelated to encryption or base size.",
      },
      {
        q: "What is the main benefit of a multi-stage build?",
        options: [
          "A. It runs multiple containers at once",
          "B. It produces a small final image containing only runtime artifacts, leaving build tools behind",
          "C. It skips the need for a base image",
          "D. It automatically scales the app",
        ],
        answer: "B",
        explanation:
          "B is correct: a builder stage compiles/installs, then a slim runtime stage copies only the artifacts, so the published image excludes compilers/build tooling — smaller and with a reduced attack surface. It doesn't run or scale containers.",
      },
      {
        q: "In a multi-stage Dockerfile, how do you pull artifacts from an earlier stage named `builder`?",
        options: [
          "A. IMPORT builder /app",
          "B. COPY --from=builder <src> <dest>",
          "C. FROM builder INCLUDE /app",
          "D. RUN --stage=builder cp /app .",
        ],
        answer: "B",
        explanation:
          "B is correct: COPY --from=builder copies files from the earlier named stage into the current stage. The other forms are not valid Dockerfile syntax.",
      },
      {
        q: "You change one line of application code and rebuild. With a cache-friendly Dockerfile (deps copied before code), what happens?",
        options: [
          "A. Every layer including the base is rebuilt",
          "B. Only the final COPY . . layer (and anything after it) is rebuilt; the base, system deps, and pip install layers are reused",
          "C. The build fails because the cache is stale",
          "D. Dependencies are reinstalled from scratch",
        ],
        answer: "B",
        explanation:
          "B is correct: only the changed layer and those after it are rebuilt. Because dependencies were installed on an earlier, unchanged layer, that install stays cached and just the cheap code-copy layer is redone.",
      },
    ],
  },
];
