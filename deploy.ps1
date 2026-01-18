# PowerShell script to deploy website to GitHub Pages
# Usage: .\deploy.ps1

Write-Host "=== نشر الموقع على GitHub Pages ===" -ForegroundColor Green
Write-Host ""

# Check if git is installed
try {
    $gitVersion = git --version
    Write-Host "Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Git not found!" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Check if we're in a git repository
if (-not (Test-Path .git)) {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
    git branch -M main
}

# Ask for GitHub repository URL
$repoUrl = Read-Host "Enter your GitHub repository URL (e.g., https://github.com/username/repo-name.git)"

if ($repoUrl) {
    # Check if remote exists
    $remoteExists = git remote -v 2>&1
    if (-not $remoteExists -or $remoteExists -match "origin") {
        Write-Host "Setting remote origin..." -ForegroundColor Yellow
        git remote remove origin 2>$null
        git remote add origin $repoUrl
    }
}

# Add all files
Write-Host "Adding files..." -ForegroundColor Yellow
git add .

# Commit
$commitMessage = Read-Host "Enter commit message (or press Enter for default)"
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "Update website"
}

git commit -m $commitMessage

# Push
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

Write-Host ""
Write-Host "=== تم الرفع بنجاح! ===" -ForegroundColor Green
Write-Host ""
Write-Host "الخطوات التالية:" -ForegroundColor Yellow
Write-Host "1. اذهب للـ repository على GitHub"
Write-Host "2. Settings > Pages"
Write-Host "3. Source: main branch, / (root)"
Write-Host "4. Save"
Write-Host ""
Write-Host "الموقع هيبقى متاح بعد دقائق قليلة!" -ForegroundColor Green
