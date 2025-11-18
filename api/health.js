// Health check endpoint to verify environment variables
export default async function handler(req, res) {
    const envStatus = {
        timestamp: new Date().toISOString(),
        environment: process.env.VERCEL_ENV || 'development',
        checks: {
            PLAN_TEMPLATE_URL: {
                configured: !!process.env.PLAN_TEMPLATE_URL,
                length: process.env.PLAN_TEMPLATE_URL?.length || 0,
                preview: process.env.PLAN_TEMPLATE_URL?.substring(0, 50) + '...' || 'NOT SET'
            },
            EVAL_TEMPLATE_URL: {
                configured: !!process.env.EVAL_TEMPLATE_URL,
                length: process.env.EVAL_TEMPLATE_URL?.length || 0,
                preview: process.env.EVAL_TEMPLATE_URL?.substring(0, 50) + '...' || 'NOT SET'
            },
            GEMINI_API_KEY: {
                configured: !!process.env.GEMINI_API_KEY,
                length: process.env.GEMINI_API_KEY?.length || 0,
                preview: process.env.GEMINI_API_KEY ? '***' + process.env.GEMINI_API_KEY.slice(-4) : 'NOT SET'
            },
            MONGODB_URI: {
                configured: !!process.env.MONGODB_URI || !!process.env.MONGO_URL,
                source: process.env.MONGODB_URI ? 'MONGODB_URI' : (process.env.MONGO_URL ? 'MONGO_URL' : 'NONE')
            }
        },
        allConfigured: !!(
            process.env.PLAN_TEMPLATE_URL && 
            process.env.EVAL_TEMPLATE_URL && 
            process.env.GEMINI_API_KEY
        )
    };

    res.status(200).json(envStatus);
}
