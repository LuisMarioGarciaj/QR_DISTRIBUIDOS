// Configurar DNS primero
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Verificar dependencias
try {
    require('qrcode');
    console.log('✅ Módulo qrcode encontrado');
} catch (e) {
    console.error('❌ Error: Falta instalar qrcode');
    console.log('\n📦 Ejecuta: npm install qrcode\n');
    process.exit(1);
}

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Importar modelos
const User = require('../../../QR2/QR_DISTRIBUIDOS/server/src/models/User');
const Site = require('../../../QR2/QR_DISTRIBUIDOS/server/src/models/Site'); // Ahora sí lo necesitamos
const Checkpoint = require('../../../QR2/QR_DISTRIBUIDOS/server/src/models/Checkpoint');

const crearDatosPrueba = async () => {
    try {
        // Verificar que MONGO_URI existe
        if (!process.env.MONGO_URI) {
            console.error('❌ Error: MONGO_URI no está definido en .env');
            process.exit(1);
        }

        // Conectar a MongoDB
        console.log('🔄 Conectando a MongoDB...');
        console.log('📡 Usando DNS de Google (8.8.8.8, 8.8.4.4)');
        
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });
        
        console.log('✅ Conectado a MongoDB');

        // 1. Buscar o crear usuario guardia
        let guardia = await User.findOne({ email: 'carlos@seguridad.com' });
        
        if (!guardia) {
            console.log('👤 Creando nuevo usuario...');
            const hashedPassword = await bcrypt.hash('123456', 10);
            guardia = await User.create({
                name: 'Carlos',
                lastname: 'Quispe',
                secondLastname: 'Mamani',
                ci: '7894561',
                phone: '70324567',
                email: 'carlos@seguridad.com',
                passwordHash: hashedPassword,
                role: 'GUARDIA',
                status: 1
            });
            console.log('✅ Usuario creado: carlos@seguridad.com / 123456');
        } else {
            console.log('✅ Usuario existente:', guardia.email);
        }

        // 2. Crear un sitio (site) para los checkpoints
        let site = await Site.findOne({ name: 'Planta Principal' });
        
        if (!site) {
            console.log('🏭 Creando sitio...');
            site = await Site.create({
                name: 'Planta Principal',
                address: 'Av. Principal #100',
                description: 'Sitio principal de pruebas',
                status: 1,
                createdBy: guardia._id
            });
            console.log('✅ Sitio creado:', site.name);
        } else {
            console.log('✅ Sitio existente:', site.name);
        }

        // 3. Eliminar checkpoints anteriores
        await Checkpoint.deleteMany({});
        console.log('🗑️  Checkpoints anteriores eliminados');

        // 4. Crear 3 checkpoints con QR codes únicos
        const timestamp = Date.now();
        const checkpointsData = [
            {
                name: 'Puerta Principal',
                description: 'Ingreso principal del edificio',
                location: { lat: -17.3935, lng: -66.1568 },
                qrCodeValue: `CHECK-${timestamp}-001`
            },
            {
                name: 'Almacén de Materiales',
                description: 'Bodega de insumos y materiales',
                location: { lat: -17.3940, lng: -66.1570 },
                qrCodeValue: `CHECK-${timestamp}-002`
            },
            {
                name: 'Oficina de Seguridad',
                description: 'Puesto de control de seguridad',
                location: { lat: -17.3930, lng: -66.1560 },
                qrCodeValue: `CHECK-${timestamp}-003`
            }
        ];

        const checkpoints = [];
        
        // Crear carpeta para QR si no existe
        const qrDir = path.join(__dirname, 'qr-generados');
        if (!fs.existsSync(qrDir)) {
            fs.mkdirSync(qrDir);
            console.log('📁 Carpeta creada: qr-generados');
        }

        for (const data of checkpointsData) {
            // Crear checkpoint en BD con siteId
            const checkpoint = await Checkpoint.create({
                siteId: site._id,  // Ahora tenemos el siteId
                name: data.name,
                description: data.description,
                location: data.location,
                qrCodeValue: data.qrCodeValue,
                status: 1,
                createdBy: guardia._id
            });
            
            checkpoints.push(checkpoint);
            
            // Generar archivo QR
            const fileName = `${checkpoint.name.replace(/\s+/g, '-')}.png`;
            const filePath = path.join(qrDir, fileName);
            
            await QRCode.toFile(filePath, checkpoint.qrCodeValue, {
                color: {
                    dark: '#001C59',
                    light: '#FFFFFF'
                },
                width: 300,
                margin: 2
            });
            
            console.log(`✅ QR generado: ${fileName}`);
            console.log(`   Valor: ${checkpoint.qrCodeValue}`);
        }

        console.log('\n' + '='.repeat(50));
        console.log('✅ DATOS CREADOS EXITOSAMENTE');
        console.log('='.repeat(50));
        console.log('\n📋 CREDENCIALES DE ACCESO:');
        console.log('📧 Email: carlos@seguridad.com');
        console.log('🔑 Contraseña: 123456');
        
        console.log('\n📍 CHECKPOINTS DISPONIBLES (3):');
        checkpoints.forEach((cp, index) => {
            console.log(`\n${index + 1}. ${cp.name}`);
            console.log(`   🏷️  QR: ${cp.qrCodeValue}`);
            console.log(`   📍 Ubicación: ${cp.location.lat}, ${cp.location.lng}`);
        });

        console.log(`\n📁 Los archivos QR están en: ${qrDir}`);
        console.log('\n🎯 Para probar:');
        console.log('1. Inicia el servidor: npm run dev');
        console.log('2. Inicia la app Expo');
        console.log('3. Inicia sesión con las credenciales');
        console.log('4. Escanea los QR desde la carpeta qr-generados');
        console.log('5. Revisa MongoDB en la colección "scan"');
        console.log('='.repeat(50));

        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

crearDatosPrueba();