@echo off
setlocal enabledelayedexpansion

set BUILD_DIRECTORY_PATH=C:\Files\Projects\wanlok-component-react\build
set GITHUB_PAGES_DIRECTORY_PATH=C:\Files\Projects\wanlok.github.io

if exist "%BUILD_DIRECTORY_PATH%" (
  rmdir "%BUILD_DIRECTORY_PATH%" /s /q
)

if exist "%GITHUB_PAGES_DIRECTORY_PATH%" (
  for /f "delims=" %%D in ('dir "%GITHUB_PAGES_DIRECTORY_PATH%" /a /b') do (
    if not "%%D"==".git" (
      set PATH="%GITHUB_PAGES_DIRECTORY_PATH%\%%D"
      if exist "!PATH!\*" (
        rmdir !PATH! /s /q
      ) else (
        del !PATH!
      )
    )
  )
)

npm run build && (
  xcopy "%BUILD_DIRECTORY_PATH%\*" "%GITHUB_PAGES_DIRECTORY_PATH%" /e
  rmdir %BUILD_DIRECTORY_PATH% /s /q
  cd %GITHUB_PAGES_DIRECTORY_PATH%
  git add .
  git commit -m "commit"
  git push
)

endlocal