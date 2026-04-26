import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const householdsResult = await pool.query('SELECT * FROM households');
    const productsResult = await pool.query('SELECT * FROM products');
    const transactionsResult = await pool.query('SELECT * FROM transactions');

    return NextResponse.json({
      households: householdsResult.rows,
      products: productsResult.rows,
      transactions: transactionsResult.rows
    });
  } catch (error) {
    console.error('Database query error', error);
    return NextResponse.json({ error: `Failed to fetch data from RDS ${error}` }, { status: 500 });
  }
}
