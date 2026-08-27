@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo ========================================
echo        Iniciando Machinemy...
echo ========================================
echo.
if not exist node_modules (
  echo Dependencias ainda nao instaladas. Instalando...
  call npm install
  if errorlevel 1 (
    echo.
    echo ERRO ao instalar as dependencias.
    echo Confira se o Node.js esta instalado e tente novamente.
    pause
    exit /b 1
  )
)
echo Abrindo servidor em http://localhost:5173/
echo NAO feche esta janela enquanto estiver usando o site.
call npm run dev
pause
