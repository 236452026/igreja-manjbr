# Comprime o vídeo do hero (H.264, sem áudio, até 1080p) e remove metadados.
param(
  [string]$Origem = "C:\projetos\midia-original\video\video-principal.mp4",
  [string]$Destino = (Join-Path $PSScriptRoot "..\frontend\public\videos\video-principal.mp4"),
  [int]$DuracaoMax = 30, [int]$Crf = 28
)
if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) { Write-Host "FFmpeg não encontrado. Reabra o VS Code." -ForegroundColor Red; exit 1 }
if (-not (Test-Path $Origem)) { Write-Host "Vídeo de origem não existe: $Origem" -ForegroundColor Red; exit 1 }
New-Item -ItemType Directory -Force -Path (Split-Path $Destino) | Out-Null
ffmpeg -y -loglevel error -i $Origem -t $DuracaoMax -an -map_metadata -1 -vf "scale='min(1920,iw)':-2" -c:v libx264 -preset slow -crf $Crf -pix_fmt yuv420p -movflags +faststart $Destino
if ($LASTEXITCODE -eq 0) { "Original: {0:N1} MB  ->  Otimizado: {1:N1} MB" -f ((Get-Item $Origem).Length / 1MB), ((Get-Item $Destino).Length / 1MB) }
else { Write-Host "FALHOU. Confira o arquivo de origem." -ForegroundColor Red }