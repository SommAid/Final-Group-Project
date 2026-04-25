import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const basePath = path.join(process.cwd(), '8451_The_Complete_Journey_2_Sample-2');
    
    let householdsText = '';
    let productsText = '';
    let transactionsText = '';
    
    try {
      householdsText = fs.readFileSync(path.join(basePath, '400_households.csv'), 'utf8');
      productsText = fs.readFileSync(path.join(basePath, '400_products.csv'), 'utf8');
      transactionsText = fs.readFileSync(path.join(basePath, '400_transactions.csv'), 'utf8');
    } catch (fsError) {
      console.error('Error reading files', fsError);
    }

    return NextResponse.json({
      householdsText,
      productsText,
      transactionsText
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
