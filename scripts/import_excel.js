import fs from 'fs';
import path from 'path';
import * as xlsx from 'xlsx';
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
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Read first sheet
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    console.log(`Found ${data.length} rows. Preparing to upload to Supabase...`);

    // Map the excel columns to your Supabase table columns
    const formattedData = data.map(row => {
      return {
        // Here we try to catch different possible column names (English / Arabic)
        name: row.name || row.Name || row['الاسم'] || row['اسم العضو'] || 'Unknown',
        phone: (row.phone || row.Phone || row['الهاتف'] || row['رقم الهاتف'] || '').toString(),
        plan_type: row.plan_type || row.Plan || row['نوع الاشتراك'] || row['الاشتراك'] || 'Basic Plan',
        
        // Ensure dates are converted properly if they exist, otherwise use current date
        subscription_start: row.subscription_start || row['بداية الاشتراك'] ? new Date(row.subscription_start || row['بداية الاشتراك']).toISOString() : new Date().toISOString(),
        subscription_end: row.subscription_end || row['نهاية الاشتراك'] ? new Date(row.subscription_end || row['نهاية الاشتراك']).toISOString() : new Date().toISOString(),
      };
    });

    const { data: insertedData, error } = await supabase
      .from('members')
      .insert(formattedData)
      .select();

    if (error) {
      console.error('Error inserting data:', error);
    } else {
      console.log(`Successfully imported ${insertedData.length} rows into Supabase!`);
    }

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
