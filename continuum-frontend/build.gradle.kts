import com.github.gradle.node.yarn.task.YarnTask

plugins {
    id("com.github.node-gradle.node") version "3.2.1"
}

val version = "1.0.0"
val description = "Continuum Workbench"

node {
    version.set("22.12.0") // Specify the Node.js version
    yarnVersion.set("1.22.22") // Specify the Yarn version
    download.set(true) // Automatically download and install Node.js
}

tasks.register<YarnTask>("yarnInstall") {
    args.set(listOf("install"))
}

tasks.register<YarnTask>("build") {
    dependsOn("yarnInstall")
    args.set(listOf("run", "build"))
}

tasks.register<Delete>("clean") {
    delete("continuum-workbench/lib")
    delete("workflow-editor-extension/lib")
}

tasks.named("build") {
    dependsOn("clean")
}

// Register task for docker build
tasks.register<Exec>("jib") {
    commandLine("bash", "-c",
        "docker build -t elilillyco-continuum-docker-lc.jfrog.io/continuum-workbench:$version . --progress=plain && " +
        "docker login elilillyco-continuum-docker-lc.jfrog.io --username ${System.getenv("MAVEN_REPO_USR")} --password ${System.getenv("MAVEN_REPO_PSW")} && " +
        "docker push elilillyco-continuum-docker-lc.jfrog.io/continuum-workbench:$version"
    )
}
