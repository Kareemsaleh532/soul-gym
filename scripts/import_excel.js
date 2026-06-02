import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from .env file in root
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or Key in .env file");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function importExcel(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      process.exit(1);
    }

    console.log(`Reading file: ${filePath}`);
    const workbook = xlsx.readFile(filePath, { cellDates: true });
    const sheetName = workbook.SheetNames[0]; // Read first sheet
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    console.log(`Found ${data.length} rows. Preparing to upload to Supabase...`);

    // Map the excel columns to your Supabase table columns
    const formattedData = data.filter(row => row.Names || row.name || row['الاسم']).map(row => {
      let plan = row.Length || row.plan_type || row.Plan || row['الاشتراك'] || 'Basic Plan';
      if (typeof plan === 'number') {
        plan = plan + ' Months';
      }

      let startDate = new Date();
      if (row['Date Paid']) {
        const d = new Date(row['Date Paid']);
        if (!isNaN(d)) startDate = d;
      } else if (row.subscription_start) {
        const d = new Date(row.subscription_start);
        if (!isNaN(d)) startDate = d;
      }

      let endDate = new Date();
      if (row.Expiration) {
        const d = new Date(row.Expiration);
        if (!isNaN(d)) endDate = d;
      } else if (row.subscription_end) {
        const d = new Date(row.subscription_end);
        if (!isNaN(d)) endDate = d;
      }
      
      // Force the year to 2026 as requested
      startDate.setFullYear(2026);
      endDate.setFullYear(2026);

      return {
        name: row.Names || row.name || row.Name || row['الاسم'] || row['اسم العضو'] || 'Unknown',
        phone: (row.phone || row.Phone || row['الهاتف'] || row['رقم الهاتف'] || '0000000000').toString(),
        plan_type: plan.toString(),
        subscription_start: startDate.toISOString(),
        subscription_end: endDate.toISOString(),
      };
    });

    console.log(`Filtered to ${formattedData.length} valid rows. Uploading...`);

    // Insert in batches of 1000 just in case
    const batchSize = 1000;
    let totalInserted = 0;

    for (let i = 0; i < formattedData.length; i += batchSize) {
      const batch = formattedData.slice(i, i + batchSize);
      const { data: insertedData, error } = await supabase
        .from('members')
        .insert(batch)
        .select();

      if (error) {
        console.error('Error inserting data batch:', error);
      } else {
        totalInserted += insertedData.length;
      }
    }

    console.log(`Successfully imported ${totalInserted} rows into Supabase!`);

  } catch (err) {
    console.error('Failed to import data:', err);
  }
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node scripts/import_excel.js <path_to_excel_file>');
  process.exit(1);
}

importExcel(args[0]);
