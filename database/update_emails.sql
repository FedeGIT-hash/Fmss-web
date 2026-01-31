-- Script para actualizar los correos electrónicos de los usuarios existentes
-- Ejecuta esto en el SQL Editor de Supabase

UPDATE "USUARIO" SET correo = 'romelcomparta09@gmail.com' WHERE nombre = 'Romel';
UPDATE "USUARIO" SET correo = 'eliasderas130@gmail.com' WHERE nombre = 'Elias';
UPDATE "USUARIO" SET correo = 'jesusalbertosenabraisnavarro@gmail.com' WHERE nombre = 'Jesus Alberto';
UPDATE "USUARIO" SET correo = 'mirandosa1234@gmail.com' WHERE nombre = 'Angel';

-- Verificación opcional
SELECT nombre, correo FROM "USUARIO";
