// pages/api/save-json.ts
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

interface ApiResponse {
  message?: string;
  error?: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method === 'POST') {
    try {
      console.log('Received request:'); // Log the incoming request body
      // Get the JSON data from the request body
      const jsonData: unknown = req.body; // Use unknown for safety; validate if needed

      // Define the path for the output JSON file
      const filePath = path.join(process.cwd(), 'data', 'output.json');

      // Ensure the 'data' directory exists
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Write the JSON data to the file
      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf8');

      return res.status(200).json({ message: 'JSON file saved successfully' });
    } catch (error) {
      console.error('Error writing JSON file:', error);
      return res.status(500).json({ error: 'Failed to save JSON file' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}