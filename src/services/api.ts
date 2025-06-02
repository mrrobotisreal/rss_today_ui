const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ApiError {
  error: string;
}

export interface Article {
  id: number;
  title: string;
  description: string;
  link: string;
  pub_date: string;
  source: {
    id: number;
    name: string;
    url: string;
    rss_url: string;
    active: boolean;
    created_at: string;
  };
  source_id: number;
  keywords: string[];
  content_hash: string;
  created_at: string;
}

export interface Source {
  id: number;
  name: string;
  url: string;
  rss_url: string;
  article_count: number;
}

export interface Alert {
  id: number;
  keywords: string[];
  source_ids: number[];
  notification_methods: string[];
  active: boolean;
}

export interface MonitorResponse {
  message: string;
}

class ApiService {
  private getAuthHeaders(token?: string): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Articles API
  async getArticles(token: string, keywords?: string): Promise<Article[]> {
    const url = new URL(`${API_BASE_URL}/api/articles`);
    if (keywords) {
      url.searchParams.append('keywords', keywords);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse(response);
  }

  // Sources API
  async getSources(token: string): Promise<Source[]> {
    const response = await fetch(`${API_BASE_URL}/api/sources`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse(response);
  }

  // Alerts API
  async getAlerts(token: string): Promise<Alert[]> {
    const response = await fetch(`${API_BASE_URL}/api/alerts`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse(response);
  }

  async createAlert(token: string, alertData: {
    keywords: string[];
    source_ids: number[];
    notification_methods: string[];
  }): Promise<Alert> {
    const response = await fetch(`${API_BASE_URL}/api/alerts`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(alertData),
    });

    return this.handleResponse(response);
  }

  // Monitoring API
  async triggerMonitoring(token: string): Promise<MonitorResponse> {
    const response = await fetch(`${API_BASE_URL}/api/monitor/trigger`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();