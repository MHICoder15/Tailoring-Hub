@echo off

wt ^
new-tab --title "Backend" cmd /k "cd /d D:\MHI Data\Tailoring Hub\backend && npm run dev" ^
; split-pane -H cmd /k "cd /d D:\MHI Data\Tailoring Hub\frontend && npm start"

@REM @echo off

@REM start cmd /k "cd /d D:\MHI Data\Tailoring Hub\backend && npm run dev"

@REM start cmd /k "cd /d D:\MHI Data\Tailoring Hub\frontend && npm start"

@REM exit