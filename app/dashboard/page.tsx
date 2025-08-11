import { useEffect, useState, useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { type User, type UserMetrics, type Survey, type Activity } from "@shared/schema";
import AvailableSurveysSection from '@/components/surveyspark/AvailableSurveysSection';
import ProfileSection from '@/components/surveyspark/ProfileSection';

interface DashboardData {
  user: User;
  metrics: UserMetrics;
  surveys: Survey[];
  activities: Activity[];
}

export default function SurveySparkPro() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboardHome');

  // Fetch dashboard data
  const { data: dashboardData, isLoading, error } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
    queryFn: async () => {
      const userResponse = await fetch('/api/users');
      if (!userResponse.ok) {
        throw new Error('Failed to fetch users');
      }
      const users = await userResponse.json();
      if (users.length === 0) {
        throw new Error('No users found');
      }
      
      const userId = users[0].id;
      const dashboardResponse = await fetch(`/api/dashboard/${userId}`);
      if (!dashboardResponse.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      return await dashboardResponse.json();
    }
  });

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const openSurveyModal = () => setShowSurveyModal(true);
  const closeSurveyModal = () => setShowSurveyModal(false);
  const handleMenuAction = (section: string) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  // Format activity time ago
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - new Date(date).getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInHours / 24;

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hour${Math.floor(diffInHours) > 1 ? 's' : ''} ago`;
    } else {
      return `${Math.floor(diffInDays)} day${Math.floor(diffInDays) > 1 ? 's' : ''} ago`;
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'surveys':
        return (
          <AvailableSurveysSection 
            onReturnToDashboard={() => setActiveSection('dashboardHome')} 
            showReturnButton={true}
          />
        );
      case 'profile':
        return (
          <ProfileSection 
            onReturnToDashboard={() => setActiveSection('dashboardHome')} 
          />
        );
      case 'redeem':
        return (
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">💰 Redeem Points</h3>
              <button 
                onClick={() => setActiveSection('dashboardHome')}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
            <p className="text-gray-600 text-center py-12">Point redemption feature coming soon!</p>
          </div>
        );
      case 'transfer':
        return (
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">💸 Transfer Points</h3>
              <button 
                onClick={() => setActiveSection('dashboardHome')}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
            <p className="text-gray-600 text-center py-12">Point transfer feature coming soon!</p>
          </div>
        );
      case 'history':
        return (
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">📜 History</h3>
              <button 
                onClick={() => setActiveSection('dashboardHome')}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
            <p className="text-gray-600 text-center py-12">Transaction history feature coming soon!</p>
          </div>
        );
      case 'support':
        return (
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">🎧 Support Center</h3>
              <button 
                onClick={() => setActiveSection('dashboardHome')}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold mb-2">📧 Contact Support</h4>
                <p className="text-gray-600">Email: support@surveyspark.com</p>
                <p className="text-gray-600">Response time: 24-48 hours</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2">❓ Frequently Asked Questions</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• How do I complete a survey?</li>
                  <li>• When will I receive my points?</li>
                  <li>• How do I redeem my points?</li>
                  <li>• What payment methods are available?</li>
                </ul>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <>
            {/* Dashboard Home Content */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {dashboardData.user.name || 'User'}! 👋</h2>
                  <p className="text-gray-600 text-lg">Here's your earning summary and latest opportunities</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Last login</p>
                  <p className="font-semibold text-gray-900">
                    {dashboardData.activities?.[0] 
                      ? formatTimeAgo(dashboardData.activities[0].createdAt)
                      : 'Recently'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-indigo-100 text-sm font-medium">Total Points</p>
                    <p className="text-3xl font-bold">{dashboardData.metrics.totalPoints}</p>
                  </div>
                  <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                    <i className="fas fa-coins text-2xl"></i>
                  </div>
                </div>
                <p className="text-indigo-100 text-sm mt-2">+{dashboardData.metrics.pointsThisMonth} this month</p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Surveys Completed</p>
                    <p className="text-3xl font-bold">{dashboardData.metrics.surveysCompleted}</p>
                  </div>
                  <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                    <i className="fas fa-check-circle text-2xl"></i>
                  </div>
                </div>
                <p className="text-green-100 text-sm mt-2">+{dashboardData.metrics.surveysThisMonth} this month</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-2xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Success Rate</p>
                    <p className="text-3xl font-bold">{dashboardData.metrics.successRate}%</p>
                  </div>
                  <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                    <i className="fas fa-chart-line text-2xl"></i>
                  </div>
                </div>
                <p className="text-purple-100 text-sm mt-2">Above average</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-2xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Rank</p>
                    <p className="text-3xl font-bold">#{dashboardData.metrics.rank}</p>
                  </div>
                  <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                    <i className="fas fa-trophy text-2xl"></i>
                  </div>
                </div>
                <p className="text-orange-100 text-sm mt-2">Top performer</p>
              </div>
            </div>

            {/* Survey Opportunities and Activity Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Survey Opportunities */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <span>🎯</span>
                  <span>Survey Opportunities</span>
                </h3>
                <div className="space-y-4">
                  {dashboardData.surveys?.filter(survey => survey.isActive).slice(0, 3).map((survey) => (
                    <div key={survey.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                          <i className="fas fa-poll"></i>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{survey.title}</h4>
                          <p className="text-sm text-gray-600">{survey.type} • {survey.reward} points</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                        Start
                      </button>
                    </div>
                  )) || []}
                </div>
                <button 
                  onClick={openSurveyModal}
                  className="w-full mt-4 py-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors font-medium"
                >
                  View All Surveys
                </button>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <span>⚡</span>
                  <span>Recent Activity</span>
                </h3>
                <div className="space-y-4">
                  {dashboardData.activities?.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                        <i className="fas fa-check text-sm"></i>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium">{activity.description}</p>
                        <p className="text-gray-500 text-sm">{formatTimeAgo(activity.createdAt)}</p>
                      </div>
                    </div>
                  )) || []}
                </div>
                <button className="w-full mt-4 py-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors font-medium">
                  View All Activity
                </button>
              </div>
            </div>
          </>
        );
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-lg font-medium">Failed to load dashboard data</p>
          <p className="text-gray-600 mt-2">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Font Awesome */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      
      <div className="min-h-screen bg-gray-50">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Sidebar */}
        <aside className={`fixed top-0 left-0 z-50 w-80 h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <i className="fas fa-chart-line text-white text-xl"></i>
                </div>
                <div>
                  <h1 className="font-bold text-xl text-gray-900">SurveySpark</h1>
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-1 rounded-full font-semibold">PRO</span>
                </div>
              </div>
              <button 
                onClick={toggleSidebar}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <i className="fas fa-times text-gray-600"></i>
              </button>
            </div>
            
            <nav className="space-y-2">
              <button 
                onClick={() => handleMenuAction('dashboardHome')}
                className={`w-full text-left flex items-center space-x-3 p-3 rounded-xl transition-colors ${
                  activeSection === 'dashboardHome' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <i className="fas fa-tachometer-alt"></i>
                <span>Dashboard</span>
              </button>
              <button 
                onClick={() => handleMenuAction('surveys')}
                className={`w-full text-left flex items-center space-x-3 p-3 rounded-xl transition-colors ${
                  activeSection === 'surveys' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <i className="fas fa-poll"></i>
                <span>Available Surveys</span>
              </button>
              <button 
                onClick={() => handleMenuAction('profile')}
                className={`w-full text-left flex items-center space-x-3 p-3 rounded-xl transition-colors ${
                  activeSection === 'profile' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <i className="fas fa-user-circle"></i>
                <span>Profile Settings</span>
              </button>
              <button 
                onClick={() => handleMenuAction('redeem')}
                className={`w-full text-left flex items-center space-x-3 p-3 rounded-xl transition-colors ${
                  activeSection === 'redeem' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <i className="fas fa-wallet"></i>
                <span>Redeem Points</span>
              </button>
              <button 
                onClick={() => handleMenuAction('transfer')}
                className={`w-full text-left flex items-center space-x-3 p-3 rounded-xl transition-colors ${
                  activeSection === 'transfer' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <i className="fas fa-exchange-alt"></i>
                <span>Transfer Points</span>
              </button>
              <button 
                onClick={() => handleMenuAction('history')}
                className={`w-full text-left flex items-center space-x-3 p-3 rounded-xl transition-colors ${
                  activeSection === 'history' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <i className="fas fa-history"></i>
                <span>History</span>
              </button>
              <button 
                onClick={() => handleMenuAction('support')}
                className={`w-full text-left flex items-center space-x-3 p-3 rounded-xl transition-colors ${
                  activeSection === 'support' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <i className="fas fa-headset"></i>
                <span>Support Center</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:ml-80">
          {/* Top Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={toggleSidebar}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                  <i className="fas fa-bars text-gray-600"></i>
                </button>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {activeSection === 'dashboardHome' ? 'Dashboard Overview' :
                     activeSection === 'surveys' ? 'Available Surveys' :
                     activeSection === 'profile' ? 'Profile Settings' :
                     activeSection === 'redeem' ? 'Redeem Points' :
                     activeSection === 'transfer' ? 'Transfer Points' :
                     activeSection === 'history' ? 'History' :
                     activeSection === 'support' ? 'Support Center' :
                     'Dashboard'}
                  </h2>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{dashboardData.user.name || 'User'}</p>
                  <p className="text-xs text-gray-600">{dashboardData.metrics.totalPoints} points</p>
                </div>
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-user text-indigo-600"></i>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="p-6">
            {renderSection()}
          </main>
        </div>

        {/* Survey Modal */}
        {showSurveyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && closeSurveyModal()}>
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Available Surveys</h3>
                  <p className="text-gray-600 mt-1">Choose a survey to start earning points</p>
                </div>
                <button 
                  onClick={closeSurveyModal}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <i className="fas fa-times text-gray-600"></i>
                </button>
              </div>

              <div className="space-y-4">
                {dashboardData.surveys && dashboardData.surveys.length > 0 ? (
                  dashboardData.surveys
                    .filter(survey => survey.isActive)
                    .map((survey) => (
                      <div key={survey.id} className="border border-gray-200 rounded-xl p-6 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 cursor-pointer">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                              <i className="fas fa-poll text-white"></i>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{survey.title}</h4>
                              <p className="text-sm text-gray-600">{survey.type === 'premium' ? 'Premium Survey' : 'Standard Survey'}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                              {survey.reward} points
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Estimated: 15-20 min</p>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-4">{survey.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <i className="fas fa-clock"></i>
                              <span>Active</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <i className="fas fa-shield-alt"></i>
                              <span>Secure</span>
                            </div>
                          </div>
                          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                            Start Survey
                          </button>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-inbox text-gray-400 text-2xl"></i>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No Surveys Available</h4>
                    <p className="text-gray-600">New surveys will appear here when they become available.</p>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <p>Total available surveys: <span className="font-medium">{dashboardData.surveys?.filter(s => s.isActive).length || 0}</span></p>
                    <p>Potential earnings: <span className="font-medium text-green-600">
                      {dashboardData.surveys?.filter(s => s.isActive).reduce((total, survey) => total + survey.reward, 0) || 0} points
                    </span></p>
                  </div>
                  <button 
                    onClick={closeSurveyModal}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
