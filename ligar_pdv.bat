@echo off
title Iniciando PDV Inteligente - Jorjao
cd /d "C:\Users\Jorjão\JORJAO PROJETOS\projetomeupdv"

:: Inicia o servidor em segundo plano
start /min node server.js

:: Aguarda 2 segundos para o servidor subir
timeout /t 2 /nobreak > nul

:: Abre o PDV no navegador padrão
start http://localhost:3000/index.html

exit