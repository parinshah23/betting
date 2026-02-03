
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load env vars BEFORE importing services
dotenv.config();

async function runTests() {
    console.log('🧪 Starting Phase 2 Verification...\n');

    // Dynamic imports to ensure env vars are loaded
    const { sanitizeString } = await import('../src/middleware/sanitize');
    const { processUpload } = await import('../src/services/upload.service');

    // --- TEST 1: INPUT SANITIZATION ---
    console.log('1️⃣  Testing Input Sanitization...');

    const dangerousInput = 'Hello <script>alert("xss")</script><strong>World</strong>';
    // Allow HTML (should keep strong, remove script)
    const cleanedHtml = sanitizeString(dangerousInput, true);

    // Strict (should remove all tags)
    const cleanedStrict = sanitizeString(dangerousInput, false);

    if (cleanedHtml.includes('<script>')) {
        console.error('❌ Sanitization FAILED: Script tag preserved');
        process.exit(1);
    } else if (!cleanedHtml.includes('<strong>')) {
        console.error('❌ Sanitization FAILED: Safe tag removed in HTML mode');
    } else {
        console.log('✅ HTML Sanitization working (Script removed, Strong preserved)');
    }

    if (cleanedStrict.includes('<') || cleanedStrict.includes('>')) {
        console.error('❌ Strict Sanitization FAILED: Tags preserved');
    } else {
        console.log('✅ Strict Sanitization working');
    }
    console.log('');


    // --- TEST 2: IMAGE UPLOAD ---
    console.log('2️⃣  Testing Image Upload Service...');

    // Check if Cloudinary is configured
    const isCloudinary = process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET;

    console.log(`info: Storage Provider: ${isCloudinary ? 'CLOUDINARY ☁️' : 'LOCAL FILESYSTEM 📂'}`);

    // Create a dummy file buffer (1x1 pixel Transparent GIF)
    const buffer = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');

    const mockFile: any = {
        fieldname: 'image',
        originalname: 'test-image.gif',
        encoding: '7bit',
        mimetype: 'image/gif',
        buffer: buffer,
        size: buffer.length,
        filename: `test-${Date.now()}.gif`,
        path: path.join(__dirname, `../uploads/test-${Date.now()}.gif`)
    };

    try {
        if (!isCloudinary) {
            if (!fs.existsSync(path.join(__dirname, '../uploads'))) {
                fs.mkdirSync(path.join(__dirname, '../uploads'));
            }
            // Only write file for local test if NOT cloudinary, because processUpload logic differs
            fs.writeFileSync(mockFile.path, buffer);
        }

        const result = await processUpload(mockFile);

        console.log(`✅ Upload Successful!`);
        console.log(`   URL: ${result.url}`);

        // Cleanup local file if needed
        if (!isCloudinary && fs.existsSync(mockFile.path)) {
            fs.unlinkSync(mockFile.path);
        }
    } catch (error) {
        console.error('❌ Upload Failed:', error);
    }
    console.log('');


    // --- TEST 3: SENTRY CONFIG ---
    console.log('3️⃣  Testing Sentry Configuration...');
    if (process.env.SENTRY_DSN) {
        if (process.env.SENTRY_DSN.startsWith('https://')) {
            console.log('✅ Sentry DSN detected and seems valid');
        } else {
            console.warn('⚠️  Sentry DSN found but format looks incorrect');
        }
    } else {
        console.log('ℹ️  Sentry DSN not set (Skipping)');
    }
    console.log('');


    // --- TEST 4: BACKUP SCRIPT ---
    console.log('4️⃣  Checking Backup Script...');
    const msg = fs.existsSync(path.join(__dirname, 'backup_db.sh'))
        ? '✅ Backup script found'
        : '❌ Backup script MISSING';
    console.log(msg);

    console.log('\nUser Action Required for Live Verification:');
    console.log('1. Run `npm run dev` to start server');
    console.log('2. Visit /debug-sentry to test Error Tracking');
}

runTests().catch(console.error);
