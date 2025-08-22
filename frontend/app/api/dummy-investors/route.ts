import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read the dummy investors data from the recommender folder
    const filePath = path.join(process.cwd(), '..', 'recommender', 'dummy_investors.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const investors = JSON.parse(fileContent);
    
    return NextResponse.json(investors);
  } catch (error) {
    console.error('Error reading dummy investors:', error);
    return NextResponse.json(
      { error: 'Failed to load investors data' },
      { status: 500 }
    );
  }
}
