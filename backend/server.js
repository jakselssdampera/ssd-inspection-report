const Fastify = require('fastify');
const cors = require('@fastify/cors');
const { Queue } = require('bullmq');
const Redis = require('ioredis');
const fs = require('fs');
const path = require('path');

const app = Fastify({ logger: true });

// Setup CORS so the frontend can hit this API
app.register(cors, { 
  origin: true 
});

// Setup Redis & BullMQ
const connection = new Redis({
  host: '127.0.0.1',
  port: 6379,
  maxRetriesPerRequest: null,
});

const pdfQueue = new Queue('pdf-generation', { connection });

// Ensure public PDF folder exists
const publicDir = path.join(__dirname, 'public', 'pdf');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Serve static PDFs
app.register(require('@fastify/static'), {
  root: publicDir,
  prefix: '/pdf/',
  decorateReply: false // Prevent conflict with multiple static registers
});

// Serve frontend static files
const frontendDir = path.join(__dirname, '..');
app.register(require('@fastify/static'), {
  root: frontendDir,
  prefix: '/',
  decorateReply: false
});

// Route: Request PDF generation
app.post('/api/pdf/generate', async (request, reply) => {
  try {
    const data = request.body;
    
    // Enqueue the job
    const job = await pdfQueue.add('generate', data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 },
      removeOnComplete: true,
      removeOnFail: 100, // keep history of failed jobs for debug
    });

    return reply.status(202).send({
      status: 'queued',
      jobId: job.id
    });
  } catch (err) {
    app.log.error(err);
    return reply.status(500).send({ error: 'Internal Server Error' });
  }
});

// Route: Check PDF status
app.get('/api/pdf/status/:id', async (request, reply) => {
  const { id } = request.params;
  const job = await pdfQueue.getJob(id);

  if (!job) {
    // If job doesn't exist, check if the file was created (in case job was cleaned up)
    const filePath = path.join(publicDir, `${id}.pdf`);
    if (fs.existsSync(filePath)) {
      return reply.send({ status: 'completed', url: `/pdf/${id}.pdf` });
    }
    return reply.status(404).send({ error: 'Job not found' });
  }

  const state = await job.getState();
  
  if (state === 'completed') {
    return reply.send({ status: 'completed', url: `/pdf/${id}.pdf` });
  } else if (state === 'failed') {
    return reply.status(500).send({ status: 'failed', error: job.failedReason });
  }

  return reply.send({ status: state }); // active, waiting, delayed
});

// Start Server
const start = async () => {
  try {
    await app.listen({ port: 3001, host: '0.0.0.0' });
    console.log('PDF Backend Server running on http://localhost:3001');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
