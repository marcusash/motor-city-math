param(
    [string[]]$Exams = @("retake-practice-6.json", "retake-practice-7.json")
)

$failed = $false
foreach ($exam in $Exams) {
    Write-Output "verify $exam"
    node tests\verify-practice-exams.js $exam
    if ($LASTEXITCODE -ne 0) {
        $failed = $true
    }
}

if ($failed) {
    Write-Output "retake_smoke status=fail"
    exit 1
}

Write-Output "retake_smoke status=pass exams=$($Exams.Count)"
