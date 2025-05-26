import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../state/hooks';
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Menu, Package2, ShoppingCart, Users, LineChart as ChartIcon, Settings, Bell, Search, ChevronDown } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (!user) {
    navigate('/');
    return null;
  }

  // Sample data for the chart
  const chartData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
  ];

  const stats = [
    { title: 'Total Revenue', value: '$45,231.89', change: '+20.1% from last month' },
    { title: 'Active Users', value: '12,345', change: '+180.1% from last month' },
    { title: 'New Orders', value: '1,234', change: '+19% from last month' },
    { title: 'Pending Orders', value: '573', change: '+201 since last hour' },
  ];

  const recentActivity = [
    { id: 1, title: 'New order received', time: '2 min ago', user: 'John Doe', amount: '$125.00' },
    { id: 2, title: 'New user registered', time: '5 min ago', user: 'Jane Smith', amount: '' },
    { id: 3, title: 'Payment received', time: '10 min ago', user: 'Acme Inc', amount: '$1,250.00' },
    { id: 4, title: 'New message', time: '15 min ago', user: 'Support Team', amount: '' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r transition-all duration-300`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            {isSidebarOpen ? (
              <h1 className="text-xl font-bold">Acme Inc</h1>
            ) : (
              <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <Package2 className="h-5 w-5 text-white" />
              </div>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="ml-auto"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1 p-2 space-y-1">
            <Button variant="ghost" className="w-full justify-start gap-2 bg-gray-100">
              <ChartIcon className="h-5 w-5" />
              {isSidebarOpen && 'Dashboard'}
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <ShoppingCart className="h-5 w-5" />
              {isSidebarOpen && 'Orders'}
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Users className="h-5 w-5" />
              {isSidebarOpen && 'Customers'}
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Settings className="h-5 w-5" />
              {isSidebarOpen && 'Settings'}
            </Button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                {isSidebarOpen && (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
              <p className="text-sm text-gray-500">Welcome back, {user.name || 'User'}! Here's what's happening with your store today.</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex items-center">
                This Month
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Download Report
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">{stat.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-green-600">{stat.change}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts and Activity */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Main Chart */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <p className="text-sm text-gray-500">Monthly revenue and growth</p>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip 
                        formatter={(value) => [`$${value}`, 'Revenue']}
                        labelFormatter={(label) => `Month: ${label}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <p className="text-sm text-gray-500">Latest activities in your store</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <span className="text-blue-600 text-sm font-medium">
                          {activity.user.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {activity.user} • {activity.time}
                        </p>
                      </div>
                      {activity.amount && (
                        <div className="text-sm font-medium text-gray-900">
                          {activity.amount}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="mt-4 text-blue-600 hover:bg-blue-50 w-full">
                  View all activity
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Total Users</p>
                    <p className="text-2xl font-bold">12,345</p>
                    <p className="text-xs text-green-600">+20.1% from last month</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Total Products</p>
                    <p className="text-2xl font-bold">1,234</p>
                    <p className="text-xs text-green-600">+12.5% from last month</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Total Orders</p>
                    <p className="text-2xl font-bold">5,678</p>
                    <p className="text-xs text-green-600">+8.2% from last month</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-bold">$45,231.89</p>
                    <p className="text-xs text-green-600">+15.3% from last month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
