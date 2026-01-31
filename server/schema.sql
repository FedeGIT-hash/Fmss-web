-- Esquema de Base de Datos para FMSS
-- Sistema de Gestión de Citas y Servicios

CREATE TABLE CAT_ESTADO (
    id_estado INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    tipo ENUM('CITA', 'ORDEN', 'VENTA') NOT NULL,
    descripcion VARCHAR(100)
);

CREATE TABLE CAT_METODO_PAGO (
    id_metodo_pago INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion VARCHAR(100)
);

CREATE TABLE USUARIO (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100),
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE CLIENTE (
    id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    tipo ENUM('Persona', 'Empresa') NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100),
    apellido_materno VARCHAR(100),
    telefono VARCHAR(20),
    correo VARCHAR(100),
    direccion VARCHAR(100),
    codigo_postal VARCHAR(10),
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro DATE DEFAULT (CURRENT_DATE)
);

CREATE TABLE DATOS_FACTURACION (
    id_datos_facturacion INT PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT NOT NULL,
    razon_social VARCHAR(150) NOT NULL,
    rfc VARCHAR(13) NOT NULL,
    regimen_fiscal VARCHAR(100),
    uso_cfdi VARCHAR(10) DEFAULT 'G03',
    calle VARCHAR(100),
    numero_exterior VARCHAR(20),
    numero_interior VARCHAR(20),
    colonia VARCHAR(100),
    codigo_postal VARCHAR(10),
    FOREIGN KEY (id_cliente) REFERENCES CLIENTE(id_cliente)
);

CREATE TABLE SERVICIO (
    id_servicio INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    tiempo_estimado INT NOT NULL, -- en minutos
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE ORDEN_SERVICIO (
    id_orden INT PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT NOT NULL,
    id_usuario INT NOT NULL,
    id_estado INT NOT NULL,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME,
    subtotal DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    observaciones TEXT,
    FOREIGN KEY (id_cliente) REFERENCES CLIENTE(id_cliente),
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario),
    FOREIGN KEY (id_estado) REFERENCES CAT_ESTADO(id_estado)
);

CREATE TABLE CITA (
    id_cita INT PRIMARY KEY AUTO_INCREMENT,
    id_estado INT NOT NULL,
    id_orden INT UNIQUE NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    observaciones TEXT,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_estado) REFERENCES CAT_ESTADO(id_estado),
    FOREIGN KEY (id_orden) REFERENCES ORDEN_SERVICIO(id_orden)
);

CREATE TABLE ORDEN_DETALLE (
    id_detalle INT PRIMARY KEY AUTO_INCREMENT,
    id_orden INT NOT NULL,
    id_servicio INT NOT NULL,
    cantidad INT DEFAULT 1,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    observaciones TEXT,
    FOREIGN KEY (id_orden) REFERENCES ORDEN_SERVICIO(id_orden),
    FOREIGN KEY (id_servicio) REFERENCES SERVICIO(id_servicio)
);

CREATE TABLE FACTURA (
    id_factura INT PRIMARY KEY AUTO_INCREMENT,
    id_metodo_pago INT NOT NULL,
    id_datos_facturacion INT NOT NULL,
    folio VARCHAR(50) UNIQUE NOT NULL,
    uuid VARCHAR(36) UNIQUE,
    fecha_emision DATETIME DEFAULT CURRENT_TIMESTAMP,
    subtotal DECIMAL(10,2) NOT NULL,
    impuestos DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    ruta_xml VARCHAR(255),
    ruta_pdf VARCHAR(255),
    FOREIGN KEY (id_metodo_pago) REFERENCES CAT_METODO_PAGO(id_metodo_pago),
    FOREIGN KEY (id_datos_facturacion) REFERENCES DATOS_FACTURACION(id_datos_facturacion)
);

CREATE TABLE FACTURA_DETALLE (
    id_factura_detalle INT PRIMARY KEY AUTO_INCREMENT,
    id_factura INT NOT NULL,
    id_orden_detalle INT NOT NULL,
    clave_producto VARCHAR(20),
    clave_unidad VARCHAR(10) DEFAULT 'E48',
    descripcion VARCHAR(200) NOT NULL,
    cantidad DECIMAL(10,2) NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    impuestos DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_factura) REFERENCES FACTURA(id_factura),
    FOREIGN KEY (id_orden_detalle) REFERENCES ORDEN_DETALLE(id_detalle)
);
