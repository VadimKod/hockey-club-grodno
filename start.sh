#!/bin/bash

# Запускаем seed (игнорируем ошибки если данные уже есть)
cd server && node seed.js || true

# Запускаем сервер
node server/index.js
