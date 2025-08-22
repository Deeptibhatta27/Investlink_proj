import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read the dummy startups data from the recommender folder
    const filePath = path.join(process.cwd(), '..', 'recommender', 'dummy_startups.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const startups = JSON.parse(fileContent);
    
    return NextResponse.json(startups);
  } catch (error) {
    console.error('Error reading dummy startups:', error);
    return NextResponse.json(
      { error: 'Failed to load startups data' },
      { status: 500 }
    );
  }
}
