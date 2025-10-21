@echo off
setlocal

set DEFAULT_JVM_OPTS=-Xmx64m -Xms64m
set APP_HOME=%~dp0
set WRAPPER_JAR=%APP_HOME%gradle\wrapper\gradle-wrapper.jar
set WRAPPER_URL=https://repo.gradle.org/gradle/libs-releases-local/org/gradle/gradle-wrapper/8.4/gradle-wrapper-8.4.jar

if not exist "%WRAPPER_JAR%" (
    if exist "%APP_HOME%gradle" (rem folder ok) else mkdir "%APP_HOME%gradle\wrapper"
    powershell -NoProfile -Command "try { Invoke-WebRequest -UseBasicParsing -Uri '%WRAPPER_URL%' -OutFile '%WRAPPER_JAR%' } catch { exit 1 }" || (
        echo Failed to download Gradle wrapper jar. Install Gradle 8.4+ or download manually.
        exit /b 1
    )
)

if defined JAVA_HOME (
    set JAVA_EXE=%JAVA_HOME%\bin\java.exe
) else (
    set JAVA_EXE=java.exe
)

"%JAVA_EXE%" %DEFAULT_JVM_OPTS% -classpath "%WRAPPER_JAR%" org.gradle.wrapper.GradleWrapperMain %*
endlocal
