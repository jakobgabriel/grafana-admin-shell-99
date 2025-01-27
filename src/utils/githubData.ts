import { GrafanaInstance } from "@/types/grafana";

const GITHUB_RAW_URL = "https://raw.githubusercontent.com";

export const fetchGrafanaData = async (repo: string, branch: string = "main"): Promise<GrafanaInstance[]> => {
  console.log('Fetching Grafana data from GitHub:', repo, branch);
  try {
    const response = await fetch(`${GITHUB_RAW_URL}/${repo}/${branch}/grafana-data.json`);
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