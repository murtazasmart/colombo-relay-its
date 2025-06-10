import {
  UserGroupIcon,
  CalendarIcon,
  UserPlusIcon,
  QrCodeIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  // This would typically fetch from the API
  const stats = [
    { name: 'Total Mumineen', value: '2,564', icon: UserGroupIcon, color: 'bg-green-600' },
    { name: 'Active Miqaats', value: '3', icon: CalendarIcon, color: 'bg-green-700' },
    { name: 'Pending Registrations', value: '168', icon: UserPlusIcon, color: 'bg-yellow-500' },
    { name: 'Today\'s Arrivals', value: '42', icon: QrCodeIcon, color: 'bg-green-800' },
    { name: 'Accommodations Assigned', value: '156', icon: BuildingOfficeIcon, color: 'bg-yellow-600' },
  ];

  const upcomingMiqaats = [
    { name: 'Milad Imam uz Zaman', date: '2025-06-15', location: 'Main Hall', registrations: 358 },
    { name: 'Eid ul Adha', date: '2025-06-25', location: 'Various Centers', registrations: 1240 },
    { name: 'Ashara Mubaraka', date: '2025-08-08', location: 'Multiple Locations', registrations: 526 },
  ];

  const recentActivity = [
    { action: 'Registration', details: 'Taher Saifuddin registered for Eid ul Adha', time: '12 minutes ago' },
    { action: 'Arrival', details: 'Ahmed Qutbuddin scanned at Main Hall', time: '1 hour ago' },
    { action: 'Census Update', details: 'Family of Hussein updated contact details', time: '2 hours ago' },
    { action: 'Accommodation', details: 'Room 303 assigned to Yusuf and family', time: '3 hours ago' },
    { action: 'Registration', details: 'Mufaddal signed up for Milad Imam uz Zaman', time: '5 hours ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-800">Dashboard</h1>
        <p className="text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="card bg-white border-t-4 border-green-700">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">{stat.name}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Miqaats */}
        <div className="lg:col-span-2 card border-t-4 border-green-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-green-800">Upcoming Miqaats</h2>
            <button className="btn-outline text-sm">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registrations</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {upcomingMiqaats.map((miqaat, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{miqaat.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{miqaat.date}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{miqaat.location}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{miqaat.registrations}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card border-t-4 border-green-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-green-800">Recent Activity</h2>
            <button className="btn-outline text-sm">View All</button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {activity.action}
                  </span>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
                <p className="mt-1 text-sm text-gray-600">{activity.details}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
