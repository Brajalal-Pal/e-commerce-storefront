// pages/index.tsx
import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { ISalesData } from '@/types/types';

interface CsvRow {
  [key: string]: string; // Adjust based on your CSV structure
}

export default function SalesDataToJson() {
  const [data, setData] = useState<ISalesData[]>([]);

  useEffect(() => {
    const fetchAndParseCsv = async () => {
      try {
        const response = await fetch('/data/Amazon Sale Report.csv');
        const csvText = await response.text();

        Papa.parse<ISalesData>(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: async (result) => {
            setData(result.data as ISalesData[]);
            console.log('Parsed CSV data:', result.data);
            
            // Send parsed data to API route
            try {
              const apiResponse = await fetch('/api/save-json', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(result.data),
              });

              if (apiResponse.ok) {
                console.log('JSON file saved successfully');
              } else {
                console.error('Failed to save JSON');
              }
            } catch (error) {
              console.error('Error sending data to API:', error);
            }
          },
          error: (error: Error) => {
            console.error('Error parsing CSV:', error);
          },
        });
      } catch (error) {
        console.error('Error fetching CSV:', error);
      }
    };

    fetchAndParseCsv();
  }, []);

  return <div>{
        data && data.length > 0 ? (
            <span>{data.length} records found</span>
        ) : (
            <span>No records found</span>
        )
    }</div>;
}