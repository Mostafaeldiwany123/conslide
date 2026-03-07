import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, BarChart3, Settings, CreditCard, Bell, Shield, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Tab = 'profile' | 'usage' | 'settings';

const Profile = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  // Sync state when profile/user data loads
  useEffect(() => {
    if (profile?.full_name) setFullName(profile.full_name);
  }, [profile]);

  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user]);

  const getDisplayName = () => {
    if (profile?.full_name) return profile.full_name;
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const getAvatarUrl = () => {
    if (profile?.avatar_url) return profile.avatar_url;
    if (user?.user_metadata?.avatar_url) return user.user_metadata.avatar_url;
    if (user?.user_metadata?.picture) return user.user_metadata.picture;
    return null;
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name.charAt(0).toUpperCase();
  };

  const avatarUrl = getAvatarUrl();

  const tier = profile?.tier || 'free';
  const creditsUsed = profile?.token_usage || 0;
  const creditsLimit = profile?.token_limit || (tier === 'pro' ? 100 : 0);
  const usagePercent = creditsLimit > 0 ? (creditsUsed / creditsLimit) * 100 : 0;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const tabs = [
    { id: 'profile' as Tab, label: 'Profile', icon: User },
    { id: 'usage' as Tab, label: 'Usage', icon: BarChart3 },
    { id: 'settings' as Tab, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="absolute top-0 left-0 right-0 z-10 p-6">
        <button
          onClick={() => navigate('/')}
          type="button"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Go back
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Account</h1>
          <p className="text-gray-500 mt-1">Manage your account settings and preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                      ? 'bg-purple-50 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Profile Card */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Profile Information</h2>

                  <div className="flex items-center gap-6 mb-8">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={getDisplayName()}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center">
                        <span className="text-2xl font-medium text-white">{getInitials()}</span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-medium text-gray-900">{getDisplayName()}</h3>
                      <p className="text-gray-500">{user?.email}</p>
                      {tier && (
                        <span className="inline-block mt-2 px-3 py-1 text-sm font-medium bg-purple-100 text-purple-700 rounded-full capitalize">
                          {tier} Plan
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-6">
                    <div>
                      <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="mt-1.5 h-11"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        disabled
                        className="mt-1.5 h-11 bg-gray-50"
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                    <Button className="w-fit bg-purple-600 hover:bg-purple-700 text-white">
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'usage' && (
              <div className="space-y-6">
                {/* Usage Overview */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">AI Credits Usage</h2>

                  <div className="grid sm:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1">Current Plan</p>
                      <p className="text-2xl font-semibold text-gray-900 capitalize">{tier}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1">AI Credits Used</p>
                      <p className="text-2xl font-semibold text-gray-900">{creditsUsed}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1">Monthly Limit</p>
                      <p className="text-2xl font-semibold text-gray-900">{creditsLimit}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-700">Monthly Usage</p>
                      <p className="text-sm text-gray-500">{creditsUsed} / {creditsLimit} credits</p>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-600 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(usagePercent, 100)}%` }}
                      />
                    </div>
                    {tier === 'free' && (
                      <p className="text-sm text-amber-600 mt-2">
                        AI features require a Pro subscription. Upgrade to get 100 AI credits per month.
                      </p>
                    )}
                    {tier === 'pro' && usagePercent >= 80 && (
                      <p className="text-sm text-amber-600 mt-2">
                        You've used {usagePercent.toFixed(0)}% of your monthly credits. Consider upgrading for more.
                      </p>
                    )}
                  </div>

                  <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Upgrade Plan
                  </Button>
                </div>

                {/* AI Features Info */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">AI Features</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Your AI credits are used for the following features:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                      </div>
                      Generate Slide (2 credits per slide)
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                      </div>
                      Translate Page (1 credit per translation)
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                      </div>
                      Generate Lead Sentence (1 credit per generation)
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                      </div>
                      Rewrite Text Professionally (1 credit per rewrite)
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                      </div>
                      Rewrite as Bullets (1 credit per rewrite)
                    </li>
                  </ul>
                </div>

                {/* Usage History */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
                  <div className="text-center py-8 text-gray-500">
                    <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No recent activity to display</p>
                    <p className="text-sm mt-1">Start using Conslide to see your usage history</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                {/* Notifications */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Bell className="w-5 h-5 text-gray-400" />
                    <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Email notifications</p>
                        <p className="text-sm text-gray-500">Receive updates about your account</p>
                      </div>
                      <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Product updates</p>
                        <p className="text-sm text-gray-500">News about new features and improvements</p>
                      </div>
                      <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500" defaultChecked />
                    </div>
                  </div>
                </div>

                {/* Security */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <h2 className="text-lg font-medium text-gray-900">Security</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Password</p>
                        <p className="text-sm text-gray-500">Last changed 30 days ago</p>
                      </div>
                      <Button variant="outline" size="sm">Change</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Two-factor authentication</p>
                        <p className="text-sm text-gray-500">Add an extra layer of security</p>
                      </div>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-white rounded-xl border border-red-200 p-6">
                  <h2 className="text-lg font-medium text-red-600 mb-2">Danger Zone</h2>
                  <p className="text-sm text-gray-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                  <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300">
                    Delete Account
                  </Button>
                </div>

                {/* Sign Out */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;