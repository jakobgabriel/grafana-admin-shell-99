import { GrafanaInstance } from "@/types/grafana";

export const fetchGrafanaData = async (repo: string, branch: string = "main"): Promise<GrafanaInstance[]> => {
  console.log('Fetching Grafana data');
  try {
    // In production (GitHub Pages), load from local path
    const dataUrl = import.meta.env.PROD 
      ? '/grafana-data.json'
      : `https://raw.githubusercontent.com/${repo}/${branch}/grafana-data.json`;
    
    console.log('Fetching from:', dataUrl);
    const response = await fetch(dataUrl);
    
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    
    const data = await response.json();
    console.log('Fetched data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};