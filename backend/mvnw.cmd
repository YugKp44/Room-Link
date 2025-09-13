@ECHO OFF
SETLOCAL
SET WRAPPER_DIR=%~dp0\.mvn\wrapper
SET WRAPPER_JAR=%WRAPPER_DIR%\maven-wrapper.jar
SET WRAPPER_PROPERTIES=%WRAPPER_DIR%\maven-wrapper.properties

IF NOT EXIST "%WRAPPER_JAR%" (
  IF NOT EXIST "%WRAPPER_DIR%" mkdir "%WRAPPER_DIR%"
  FOR /F "usebackq tokens=1,* delims==" %%A IN (`type "%WRAPPER_PROPERTIES%" ^| findstr /R /C:"^wrapperUrl="`) DO (
    IF "%%A"=="wrapperUrl" SET WRAPPER_URL=%%B
  )
  ECHO Downloading Maven Wrapper JAR from: %WRAPPER_URL%
  IF NOT DEFINED WRAPPER_URL (
  SET WRAPPER_URL=https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.3.2/maven-wrapper-3.3.2.jar
  ECHO wrapperUrl not found in properties. Using default: %WRAPPER_URL%
  )
  REM Try multiple download tools: certutil, curl, bitsadmin
  certutil -urlcache -split -f "%WRAPPER_URL%" "%WRAPPER_JAR%" >NUL 2>&1 || curl -L -o "%WRAPPER_JAR%" "%WRAPPER_URL%" || bitsadmin /transfer "mvnw" /download /priority normal "%WRAPPER_URL%" "%WRAPPER_JAR%"
)

SET JAVA_EXE=%JAVA_HOME%\bin\java.exe
IF NOT EXIST "%JAVA_EXE%" SET JAVA_EXE=java

"%JAVA_EXE%" -classpath "%WRAPPER_JAR%" org.apache.maven.wrapper.MavenWrapperMain %*
