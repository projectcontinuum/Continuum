plugins {
    id("org.jreleaser") version "1.23.0" apply false
}

// When running jreleaser tasks, automatically enable continue-on-failure so that
// if one module's release already exists on Maven Central, the remaining modules
// still get deployed. JReleaser's skipPublicationCheck detects already-deployed
// artifacts but still errors out — this ensures the build continues past those.
gradle.taskGraph.whenReady {
    if (allTasks.any { it.name.startsWith("jreleaser") }) {
        gradle.startParameter.isContinueOnFailure = true
    }
}
