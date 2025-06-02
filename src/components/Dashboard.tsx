import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService, type Article, type Source, type Alert } from '../services/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Bell, Plus, Search, ExternalLink, Settings, Trash2, CheckCircle, LogOut, User } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { userToken, userInfo, logout } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('articles');
  const [error, setError] = useState('');

  if (articles.length > 0) {
    console.log(articles[0]);
  }

  // Form states
  const [newAlert, setNewAlert] = useState({
    keywords: '',
    source_ids: [] as number[],
    notification_methods: ['email']
  });

  const [searchKeywords, setSearchKeywords] = useState('');

  useEffect(() => {
    if (userToken) {
      loadInitialData();
    }
  }, [userToken]);

  const loadInitialData = async () => {
    if (!userToken) return;

    try {
      setLoading(true);
      setError('');
      await Promise.all([
        loadArticles(),
        loadSources(),
        loadAlerts()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadArticles = async () => {
    if (!userToken) return;

    try {
      const data = await apiService.getArticles(userToken, searchKeywords || undefined);
      setArticles(data);
    } catch (error) {
      console.error('Error loading articles:', error);
      throw error;
    }
  };

  const loadSources = async () => {
    if (!userToken) return;

    try {
      const data = await apiService.getSources(userToken);
      setSources(data);
    } catch (error) {
      console.error('Error loading sources:', error);
      throw error;
    }
  };

  const loadAlerts = async () => {
    if (!userToken) return;

    try {
      const data = await apiService.getAlerts(userToken);
      setAlerts(data);
    } catch (error) {
      console.error('Error loading alerts:', error);
      throw error;
    }
  };

  const createAlert = async () => {
    if (!userToken) return;

    try {
      const keywords = newAlert.keywords.split(',').map(k => k.trim()).filter(k => k);

      if (keywords.length === 0) {
        setError('Please enter at least one keyword');
        return;
      }

      const alertData = {
        keywords,
        source_ids: newAlert.source_ids,
        notification_methods: newAlert.notification_methods
      };

      const newAlertObj = await apiService.createAlert(userToken, alertData);
      setAlerts([...alerts, newAlertObj]);
      setNewAlert({ keywords: '', source_ids: [], notification_methods: ['email'] });
      setError('');
    } catch (error) {
      console.error('Error creating alert:', error);
      setError(error instanceof Error ? error.message : 'Failed to create alert');
    }
  };

  const triggerManualCheck = async () => {
    if (!userToken) return;

    try {
      setLoading(true);
      await apiService.triggerMonitoring(userToken);
      await loadArticles();
      setError('');
    } catch (error) {
      console.error('Error triggering manual check:', error);
      setError(error instanceof Error ? error.message : 'Failed to trigger monitoring');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffHours > 24) {
      return `${Math.floor(diffHours / 24)} days ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hours ago`;
    } else {
      return `${diffMins} minutes ago`;
    }
  };

  if (loading && articles.length === 0) {
    return (
      <div className="min-h-screen bg-radial-[at_25%_25%] from-white to-sky-500 to-75% flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading news data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-radial-[at_25%_25%] from-white to-sky-500 to-75%">
      <nav className="shadow-sm border-b sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              {/* <Bell className="h-8 w-8 text-blue-600" /> */}
              <img src="/RSS_Today_Logo.png" alt="RSS Today" className="h-12 w-12" />
              <h1 className="text-2xl font-bold text-gray-900">RSS Today</h1>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                onClick={triggerManualCheck}
                disabled={loading}
                variant="outline"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                ) : (
                  <Search className="h-4 w-4" />
                )}
                <span className="ml-2">Check Now</span>
              </Button>

              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">{userInfo?.display_name || userInfo?.email}</span>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-6">
            {error}
            <button
              onClick={() => setError('')}
              className="ml-2 text-red-800 hover:text-red-900"
            >
              ×
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
          {[
            { id: 'articles', label: 'Articles', icon: Search },
            { id: 'alerts', label: 'Alerts', icon: Bell },
            { id: 'sources', label: 'Sources', icon: Settings }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Articles Tab */}
        {activeTab === 'articles' && (
          <div>
            <div className="mb-6">
              <div className="flex space-x-4">
                <Input
                  placeholder="Filter by keywords (e.g., ukraine, climate)"
                  value={searchKeywords}
                  onChange={(e) => setSearchKeywords(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={loadArticles} variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {articles.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-500">No articles found. Try adjusting your search or check back later.</p>
                  </CardContent>
                </Card>
              ) : (
                articles.map((article) => (
                  <Card key={article.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-3">
                          <Badge variant="secondary">
                            {article.source.name}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {formatTimeAgo(article.pub_date)}
                          </span>
                        </div>
                        <a
                          href={article.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span className="text-sm">Read Article</span>
                        </a>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {article.title}
                      </h3>

                      <p className="text-gray-600 mb-4">
                        {article.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {article.keywords.slice(0, 5).map((keyword, index) => (
                          <Badge key={index} variant="outline">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div>
            {/* Create New Alert */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Create New Alert</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Keywords (comma separated)
                    </label>
                    <Input
                      placeholder="ukraine, war, conflict"
                      value={newAlert.keywords}
                      onChange={(e) => setNewAlert({ ...newAlert, keywords: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sources (optional - leave empty for all sources)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {sources.map((source) => (
                        <div key={source.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`source-${source.id}`}
                            checked={newAlert.source_ids.includes(source.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNewAlert({
                                  ...newAlert,
                                  source_ids: [...newAlert.source_ids, source.id]
                                });
                              } else {
                                setNewAlert({
                                  ...newAlert,
                                  source_ids: newAlert.source_ids.filter(id => id !== source.id)
                                });
                              }
                            }}
                          />
                          <label htmlFor={`source-${source.id}`} className="text-sm text-gray-700">
                            {source.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button onClick={createAlert}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Alert
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Existing Alerts */}
            <div className="space-y-4">
              {alerts.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-500">No alerts configured. Create your first alert above.</p>
                  </CardContent>
                </Card>
              ) : (
                alerts.map((alert) => (
                  <Card key={alert.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span className="font-medium text-gray-900">Active Alert</span>
                          </div>

                          <div className="mb-3">
                            <p className="text-sm text-gray-600 mb-1">Keywords:</p>
                            <div className="flex flex-wrap gap-2">
                              {alert.keywords.map((keyword, index) => (
                                <Badge key={index} variant="secondary">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="text-sm text-gray-600 mb-1">Sources:</p>
                            <p className="text-sm text-gray-900">
                              {alert.source_ids.length === 0
                                ? 'All sources'
                                : alert.source_ids.map(id =>
                                    sources.find(s => s.id === id)?.name
                                  ).filter(Boolean).join(', ')
                              }
                            </p>
                          </div>
                        </div>

                        <button className="text-red-600 hover:text-red-800">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {/* Sources Tab */}
        {activeTab === 'sources' && (
          <div>
            {/* Sources List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sources.length === 0 ? (
                <div className="col-span-full">
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-gray-500">No sources configured. The API will manage sources automatically.</p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                sources.map((source) => (
                  <Card key={source.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-gray-900">{source.name}</h3>
                        <Badge variant="outline">
                          {source.article_count} articles
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 mb-3 truncate">{source.url}</p>

                      <div className="flex justify-between items-center">
                        <a
                          href={source.rss_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-xs flex items-center space-x-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>RSS Feed</span>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};