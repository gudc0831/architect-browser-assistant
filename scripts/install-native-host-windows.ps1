param(
  [Parameter(Mandatory = $true)]
  [string]$ExtensionId,

  [string]$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path,

  [string]$NodePath = "node.exe",

  [switch]$Mock,

  [switch]$NoRegistry
)

$ErrorActionPreference = "Stop"

$hostName = "com.architect.browser_assistant.codex_bridge"
$nativeHostDir = Join-Path $RepoRoot "native-host"
$hostScriptPath = Join-Path $nativeHostDir "codex-bridge-host.mjs"
$launcherPath = Join-Path $nativeHostDir "architect-codex-bridge.cmd"
$manifestPath = Join-Path $nativeHostDir "$hostName.json"

if (-not (Test-Path -LiteralPath $hostScriptPath)) {
  throw "Native host script not found: $hostScriptPath"
}

if ($ExtensionId -notmatch "^[a-p]{32}$") {
  throw "ExtensionId must be the 32-character Chrome extension id from chrome://extensions."
}

$mockLine = ""
if ($Mock) {
  $mockLine = "set ARCHITECT_CODEX_BRIDGE_MOCK=1"
}

$launcher = @"
@echo off
$mockLine
"$NodePath" "$hostScriptPath"
"@
Set-Content -LiteralPath $launcherPath -Value $launcher -Encoding ASCII

$manifest = [ordered]@{
  name = $hostName
  description = "Architect Browser Assistant local Codex bridge"
  path = $launcherPath
  type = "stdio"
  allowed_origins = @("chrome-extension://$ExtensionId/")
}
$manifest | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $manifestPath -Encoding UTF8

if (-not $NoRegistry) {
  $registryKey = "HKCU:\Software\Google\Chrome\NativeMessagingHosts\$hostName"
  New-Item -Path $registryKey -Force | Out-Null
  Set-Item -Path $registryKey -Value $manifestPath
}

Write-Host "Native host launcher: $launcherPath"
Write-Host "Native host manifest: $manifestPath"
if ($NoRegistry) {
  Write-Host "Registry was not updated because -NoRegistry was set."
} else {
  Write-Host "Registered HKCU Chrome native host: $hostName"
}
