const { Worker } = require('bullmq');
const Redis = require('ioredis');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const connection = new Redis({
  host: '127.0.0.1',
  port: 6379,
  maxRetriesPerRequest: null,
});

const publicDir = path.join(__dirname, 'public', 'pdf');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Wait for the server to be ready before navigating
function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

const worker = new Worker('pdf-generation', async (job) => {
  const data = job.data;
  console.log(`[Job ${job.id}] Started PDF generation for vehicle: ${data.report?.vehicle?.licensePlate || 'Unknown'}`);
  
  const pdfPath = path.join(publicDir, `${job.id}.pdf`);

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true, // Use new headless mode
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Navigate to local render page
    await page.goto('http://localhost:3001/render.html', {
      waitUntil: 'networkidle0',
      timeout: 30000 
    });

    // Inject data and render HTML via client-side JS
    await page.evaluate(async (report, workshop) => {
      await window.renderBackendPDF(report, workshop);
    }, data.report, data.workshop);

    // Emulate screen media to ensure CSS applies correctly
    await page.emulateMediaType('screen');

    // Generate PDF
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '15mm',
        left: '10mm'
      }
    });

    console.log(`[Job ${job.id}] Successfully generated PDF at ${pdfPath}`);
  } catch (error) {
    console.error(`[Job ${job.id}] Failed:`, error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }

}, { 
  connection,
  concurrency: 2 // Allow max 2 concurrent browsers to save RAM
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed with error ${err.message}`);
});

console.log('PDF Worker is listening for jobs...');

// Graceful shutdown
const shutdown = async (signal) => {
  console.log(`Received ${signal}. Shutting down worker gracefully...`);
  await worker.close();
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
