#!/usr/bin/env sh

DEFAULT_JVM_OPTS="-Xmx64m -Xms64m"

APP_HOME=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
WRAPPER_JAR="$APP_HOME/gradle/wrapper/gradle-wrapper.jar"
WRAPPER_URL="https://repo.gradle.org/gradle/libs-releases-local/org/gradle/gradle-wrapper/8.4/gradle-wrapper-8.4.jar"

if [ ! -f "$WRAPPER_JAR" ]; then
  mkdir -p "$(dirname "$WRAPPER_JAR")"
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL "$WRAPPER_URL" -o "$WRAPPER_JAR" || {
      echo "Failed to download Gradle wrapper jar. Install Gradle 8.4+ or download manually." >&2
      exit 1
    }
  elif command -v wget >/dev/null 2>&1; then
    wget -q "$WRAPPER_URL" -O "$WRAPPER_JAR" || {
      echo "Failed to download Gradle wrapper jar. Install Gradle 8.4+ or download manually." >&2
      exit 1
    }
  else
    echo "curl or wget is required to bootstrap the Gradle wrapper jar." >&2
    exit 1
  fi
fi

CLASSPATH="$WRAPPER_JAR"

if [ -n "$JAVA_HOME" ]; then
  JAVACMD="$JAVA_HOME/bin/java"
else
  JAVACMD="java"
fi

exec "$JAVACMD" $DEFAULT_JVM_OPTS -classpath "$CLASSPATH" org.gradle.wrapper.GradleWrapperMain "$@"
