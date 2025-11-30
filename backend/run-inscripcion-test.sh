#!/bin/sh
cd /home/juandam/Luckas/backend
npm test -- __tests__/controllers/inscripcionController.test.js --coverage --collectCoverageFrom=controllers/inscripcionController.js
