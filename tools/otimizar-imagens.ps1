# Converte as imagens de C:\projetos\midia-original\imagens para WebP otimizado em frontend\public\images.
# Remove metadados (inclusive localização GPS das fotos). O QR Code (pix-qrcode) é copiado sem alterações.
param(
  [string]$Origem = "C:\projetos\midia-original\imagens",
  [string]$Destino = (Join-Path $PSScriptRoot "..\frontend\public\images"),
  [int]$LarguraMax = 1600,   # largura máxima das imagens comuns (px)
  [int]$LarguraHero = 1920,  # largura máxima da capa do vídeo (px)
  [int]$Qualidade = 80       # 1 a 100 (menor = arquivo menor)
)

if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) { Write-Host "FFmpeg não encontrado. Reabra o VS Code ou reinstale." -ForegroundColor Red; exit 1 }
if (-not (Test-Path $Origem)) { Write-Host "Pasta de origem não existe: $Origem" -ForegroundColor Red; exit 1 }
New-Item -ItemType Directory -Force -Path $Destino | Out-Null

Get-ChildItem -Path $Origem -File | Where-Object { $_.Extension -match '^\.(jpe?g|png|webp)$' } | ForEach-Object {
  $nome = $_.BaseName.ToLower()

  if ($nome -eq 'pix-qrcode') {
    Copy-Item $_.FullName (Join-Path $Destino ($nome + $_.Extension.ToLower())) -Force
    Write-Host "QR Code copiado sem alterar: $nome"
    return
  }

  $larg = if ($nome -eq 'hero') { $LarguraHero } else { $LarguraMax }
  $saida = Join-Path $Destino ($nome + '.webp')
  ffmpeg -y -loglevel error -i $_.FullName -map_metadata -1 -vf "scale='min($larg,iw)':-2" -c:v libwebp -quality $Qualidade -compression_level 6 $saida

  if ($LASTEXITCODE -eq 0) {
    "{0,-28} {1,6:N0} KB  ->  {2,5:N0} KB" -f $_.Name, ($_.Length / 1KB), ((Get-Item $saida).Length / 1KB)
  } else {
    Write-Host "FALHOU: $($_.Name)" -ForegroundColor Red
  }
}
Write-Host "`nConcluído. Metas: imagens comuns até ~250 KB e hero até ~400 KB."