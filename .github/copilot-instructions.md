# Copilot Instructions for SPE_continuum

## Big Picture Architecture
- **Continuum** is a distributed, cloud-native workflow engine for data science and machine learning. It orchestrates workflows using Temporal, Kafka, and MQTT for scalable, event-driven processing.
- The codebase is organized into multiple modules:
  - **Backend (Kotlin/Spring Boot):**
    - `continuum-api-server`, `continuum-message-bridge`, `continuum-springboot-starter-worker`, `continuum-commons`, `continuum-avro-schemas`, etc.
    - Uses Temporal for workflow orchestration, Kafka for event streaming, and MQTT for lightweight messaging.
    - Avro schemas are managed in `continuum-avro-schemas` and shared across modules.
  - **Frontend (TypeScript/React/Vue/Theia):**
    - `continuum-frontend` (monorepo with Turbo), including `continuum-core`, `continuum-workbench`, `workflow-editor-extension`, and submodules like `knime-core-ui`.
    - Uses Theia for IDE-like UI, React for components, and integrates with backend via REST/gRPC/WebSockets.

## Developer Workflows
- **Backend Build/Test:**
  - Use Gradle (`gradlew build`, `gradlew test`) in each backend module.
  - Java 21 and Kotlin are required; Spring Boot is the main framework.
  - Avro schemas are auto-generated via Gradle plugin in `continuum-avro-schemas`.
- **Frontend Build/Test:**
  - Use Yarn and Turbo (`yarn build`, `yarn dev`, `yarn lint`) in `continuum-frontend`.
  - Theia-based apps (`continuum-workbench`, etc.) use `yarn start` or `theia start`.
- **Docker Compose:**
  - Start all required services (Temporal, Kafka, Mosquitto, PostgreSQL) via `docker-compose up -d` in `/docker`.
  - Add Temporal search attributes using `docker exec` commands (see README).

## Project-Specific Conventions
- **Module Interdependencies:**
  - Backend modules depend on shared code in `continuum-commons` and Avro schemas in `continuum-avro-schemas`.
  - Frontend packages use workspace references and local submodules (e.g., `knime-core-ui`).
- **Code Generation:**
  - Avro schemas generate Java classes in `continuum-avro-schemas/build/generated-main-avro-java`.
- **Testing:**
  - JUnit 5 for backend, Theia/React testing for frontend (not standardized).
- **Formatting/Linting:**
  - Prettier and ESLint for frontend; Gradle tasks for backend.

## Integration Points & Communication
- **Temporal:**
  - Central workflow engine; all workflow logic and status tracked here.
- **Kafka:**
  - Used for event streaming between backend services.
- **MQTT:**
  - Used for lightweight messaging, especially for IoT/data science integrations.
- **REST/gRPC:**
  - Backend APIs exposed via Spring Boot controllers; frontend communicates via HTTP/WebSockets.
- **Avro:**
  - Data contracts defined in Avro, shared between backend modules.

## Key Files & Directories
- `/docker/docker-compose.yml`: Service orchestration for local dev.
- `/continuum-api-server/`, `/continuum-message-bridge/`, `/continuum-springboot-starter-worker/`: Main backend services.
- `/continuum-frontend/`: Monorepo for all frontend packages.
- `/continuum-avro-schemas/`: Avro schema definitions and code generation.
- `/continuum-commons/`: Shared backend utilities and models.
- `/continuum-frontend/submodules/knime-core-ui/`: KNIME UI integration.

## Example Commands
- Backend build: `./gradlew build`
- Frontend build: `yarn build` (from `continuum-frontend`)
- Start services: `cd docker && docker-compose up -d`
- Add Temporal search attributes:
  ```bash
  docker exec -it temporal-admin-tools temporal operator search-attribute create --name "Continuum:ExecutionStatus" --type "Int"
  docker exec -it temporal-admin-tools temporal operator search-attribute create --name "Continuum:WorkflowFileName" --type "Keyword"
  ```

---

**Feedback requested:**
- Are there any undocumented workflows, conventions, or integration points?
- Is any part of the architecture or build/test process unclear or incomplete?
