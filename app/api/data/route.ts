import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const householdsResult = await pool.query('SELECT * FROM households LIMIT 1000');
    const productsResult = await pool.query('SELECT * FROM products LIMIT 1000');
    const transactionsResult = await pool.query('SELECT * FROM transactions LIMIT 1000');

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
