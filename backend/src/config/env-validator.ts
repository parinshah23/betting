export function validateEnv(): void {
    const requiredVars = [
        'DATABASE_URL',
        'JWT_SECRET',
        'REFRESH_TOKEN_SECRET',
        'STRIPE_SECRET_KEY',
        'STRIPE_WEBHOOK_SECRET',
        'EMAIL_PROVIDER',
        'EMAIL_FROM',
        'FRONTEND_URL'
    ];

    // If using SMTP, require SMTP credentials
    if (process.env.EMAIL_PROVIDER === 'smtp') {
        requiredVars.push('SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS');
    }

    const missing: string[] = [];
    const empty: string[] = [];

    for (const varName of requiredVars) {
        const value = process.env[varName];
        if (value === undefined) {
            missing.push(varName);
        } else if (value.trim() === '') {
            empty.push(varName);
        }
    }

    if (missing.length > 0 || empty.length > 0) {
        console.error('\n❌ Environment validation failed!\n');

        if (missing.length > 0) {
            console.error('Missing required environment variables:');
            missing.forEach(v => console.error(`  - ${v}`));
        }

        if (empty.length > 0) {
            console.error('\nEmpty environment variables:');
            empty.forEach(v => console.error(`  - ${v}`));
        }

        console.error('\nPlease check your .env file and ensure all required variables are set.\n');
        process.exit(1);
    }

    console.log('✅ Environment validation passed');
}
