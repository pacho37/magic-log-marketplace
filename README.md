# Marketplace

Una aplicación de marketplace que incluye un backend (NestJS) y un frontend (React) para gestionar productos, usuarios, y autenticación.

## Descripción

Este proyecto es un marketplace que permite a los vendedores crear y administrar productos, a los compradores buscar productos mediante filtros (por nombre, SKU y rango de precios) y a los administradores ver todos los productos registrados, pudiendo filtrar por vendedor.

## Características

- Registro e inicio de sesión con autenticación JWT.
- Rol-based access: `seller`, `buyer`, `admin`.
- Funcionalidad para que los vendedores gestionen sus productos.
- Funcionalidad para que los compradores busquen productos.
- Panel de administración para ver y filtrar productos.
- Frontend en React y backend en NestJS.
- Base de datos SQLite gestionada con Prisma.

## Tecnologías

- **Backend:** NestJS, TypeScript, Prisma, SQLite.
- **Frontend:** React, Bootstrap.
- **Autenticación:** JWT, Passport.

## Estructura del Proyecto

La aplicación se organiza en dos carpetas principales:
- **marketplace-backend:** Código del backend (NestJS).
- **product-app:** Código del frontend (React).

### Requisitos previos

- Node.js (v18.20.6 o superior)
- npm (v8 o superior)



