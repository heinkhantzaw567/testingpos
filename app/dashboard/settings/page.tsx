"use client";

import { useState, useEffect } from "react";
import { 
  Settings, 
  User, 
  Bell, 
  Palette, 
  Database, 
  Shield, 
  Monitor,
  Smartphone,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Globe,
  DollarSign,
  Calendar,
  Clock,
  Printer,
  Receipt,
  TrendingUp,
  BarChart3,
  PieChart,
  FileText,
  AlertTriangle,
  CheckCircle,
  X,
  Copy,
  RotateCcw
} from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";

interface SettingsTab {
  id: string;
  name: string;
  icon: any;
}

const settingsTabs: SettingsTab[] = [
  { id: "profile", name: "Profile", icon: User },
  { id: "notifications", name: "Notifications", icon: Bell },
  { id: "appearance", name: "Appearance", icon: Palette },
  { id: "business", name: "Business", icon: Globe },
  { id: "payment", name: "Payment", icon: CreditCard },
  { id: "receipt", name: "Receipt", icon: Receipt },
  { id: "reports", name: "Reports", icon: BarChart3 },
  { id: "backup", name: "Backup", icon: Database },
  { id: "security", name: "Security", icon: Shield },
  { id: "advanced", name: "Advanced", icon: Settings },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Profile Settings State
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    role: "Manager",
    avatar: ""
  });

  // Business Settings State
  const [businessData, setBusinessData] = useState({
    name: "POS Business",
    address: "123 Main St, City, State 12345",
    phone: "+1 (555) 987-6543",
    email: "business@example.com",
    website: "www.example.com",
    taxId: "12-3456789",
    currency: "USD",
    timezone: "America/New_York"
  });

  // Notification Settings State
  const [notifications, setNotifications] = useState({
    orderAlerts: true,
    lowStockAlerts: true,
    paymentAlerts: true,
    emailNotifications: true,
    smsNotifications: false,
    dailyReports: true,
    weeklyReports: true,
    monthlyReports: false
  });

  // Receipt Settings State
  const [receiptSettings, setReceiptSettings] = useState({
    showLogo: true,
    showAddress: true,
    showPhone: true,
    showEmail: true,
    showWebsite: false,
    showTaxId: true,
    footerMessage: "Thank you for your business!",
    paperSize: "80mm",
    copies: 1
  });

  // Report Settings State
  const [reportSettings, setReportSettings] = useState({
    autoGenerate: true,
    frequency: "daily",
    includeCharts: true,
    includeTaxBreakdown: true,
    includeProductAnalysis: true,
    emailReports: true,
    reportFormat: "PDF"
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: ""
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedProfile = localStorage.getItem("pos-profile-settings");
        const savedBusiness = localStorage.getItem("pos-business-settings");
        const savedNotifications = localStorage.getItem("pos-notification-settings");
        const savedReceipt = localStorage.getItem("pos-receipt-settings");
        const savedReports = localStorage.getItem("pos-report-settings");

        if (savedProfile) setProfileData(JSON.parse(savedProfile));
        if (savedBusiness) setBusinessData(JSON.parse(savedBusiness));
        if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
        if (savedReceipt) setReceiptSettings(JSON.parse(savedReceipt));
        if (savedReports) setReportSettings(JSON.parse(savedReports));
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Save to localStorage
      localStorage.setItem("pos-profile-settings", JSON.stringify(profileData));
      localStorage.setItem("pos-business-settings", JSON.stringify(businessData));
      localStorage.setItem("pos-notification-settings", JSON.stringify(notifications));
      localStorage.setItem("pos-receipt-settings", JSON.stringify(receiptSettings));
      localStorage.setItem("pos-report-settings", JSON.stringify(reportSettings));

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportSettings = () => {
    const allSettings = {
      profile: profileData,
      business: businessData,
      notifications,
      receipt: receiptSettings,
      reports: reportSettings,
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(allSettings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `pos-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const settings = JSON.parse(e.target?.result as string);
        
        if (settings.profile) setProfileData(settings.profile);
        if (settings.business) setBusinessData(settings.business);
        if (settings.notifications) setNotifications(settings.notifications);
        if (settings.receipt) setReceiptSettings(settings.receipt);
        if (settings.reports) setReportSettings(settings.reports);
        
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (error) {
        console.error("Error importing settings:", error);
        alert("Error importing settings. Please check the file format.");
      }
    };
    reader.readAsText(file);
  };

  const handleCopySettings = async () => {
    const allSettings = {
      profile: profileData,
      business: businessData,
      notifications,
      receipt: receiptSettings,
      reports: reportSettings
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(allSettings, null, 2));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error copying settings:", error);
    }
  };

  const handleResetToDefaults = () => {
    if (confirm("Are you sure you want to reset all settings to defaults? This action cannot be undone.")) {
      // Reset to default values
      setProfileData({
        name: "John Doe",
        email: "john@example.com",
        phone: "+1 (555) 123-4567",
        role: "Manager",
        avatar: ""
      });
      
      setBusinessData({
        name: "POS Business",
        address: "123 Main St, City, State 12345",
        phone: "+1 (555) 987-6543",
        email: "business@example.com",
        website: "www.example.com",
        taxId: "12-3456789",
        currency: "USD",
        timezone: "America/New_York"
      });
      
      setNotifications({
        orderAlerts: true,
        lowStockAlerts: true,
        paymentAlerts: true,
        emailNotifications: true,
        smsNotifications: false,
        dailyReports: true,
        weeklyReports: true,
        monthlyReports: false
      });
      
      setReceiptSettings({
        showLogo: true,
        showAddress: true,
        showPhone: true,
        showEmail: true,
        showWebsite: false,
        showTaxId: true,
        footerMessage: "Thank you for your business!",
        paperSize: "80mm",
        copies: 1
      });
      
      setReportSettings({
        autoGenerate: true,
        frequency: "daily",
        includeCharts: true,
        includeTaxBreakdown: true,
        includeProductAnalysis: true,
        emailReports: true,
        reportFormat: "PDF"
      });

      // Clear localStorage
      localStorage.removeItem("pos-profile-settings");
      localStorage.removeItem("pos-business-settings");
      localStorage.removeItem("pos-notification-settings");
      localStorage.removeItem("pos-receipt-settings");
      localStorage.removeItem("pos-report-settings");

      // Clear password fields
      setPasswordData({
        currentPassword: "",
        newPassword: ""
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={profileData.role}
                    onChange={(e) => setProfileData({...profileData, role: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="Manager">Manager</option>
                    <option value="Cashier">Cashier</option>
                    <option value="Administrator">Administrator</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    placeholder="Enter current password"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    placeholder="Enter new password"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Alert Preferences</h3>
              <div className="space-y-4">
                {[
                  { key: "orderAlerts", label: "New Order Alerts", desc: "Get notified when new orders are placed" },
                  { key: "lowStockAlerts", label: "Low Stock Alerts", desc: "Alert when inventory is running low" },
                  { key: "paymentAlerts", label: "Payment Alerts", desc: "Notifications for payment confirmations" }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{item.label}</h4>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications[item.key as keyof typeof notifications]}
                        onChange={(e) => setNotifications({
                          ...notifications,
                          [item.key]: e.target.checked
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Channels</h3>
              <div className="space-y-4">
                {[
                  { key: "emailNotifications", label: "Email Notifications", icon: Mail },
                  { key: "smsNotifications", label: "SMS Notifications", icon: Smartphone }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <item.icon className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="font-medium text-gray-900">{item.label}</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications[item.key as keyof typeof notifications]}
                        onChange={(e) => setNotifications({
                          ...notifications,
                          [item.key]: e.target.checked
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Frequency</h3>
              <div className="space-y-4">
                {[
                  { key: "dailyReports", label: "Daily Reports", desc: "Receive daily sales summaries" },
                  { key: "weeklyReports", label: "Weekly Reports", desc: "Weekly performance analysis" },
                  { key: "monthlyReports", label: "Monthly Reports", desc: "Monthly business insights" }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{item.label}</h4>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications[item.key as keyof typeof notifications]}
                        onChange={(e) => setNotifications({
                          ...notifications,
                          [item.key]: e.target.checked
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Theme Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Color Theme</h4>
                    <p className="text-sm text-gray-500">Choose your preferred theme</p>
                  </div>
                  <ThemeSwitcher />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Display Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                    <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                    <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="12">12 Hour (AM/PM)</option>
                    <option value="24">24 Hour</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Items per Page</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case "business":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                  <input
                    type="text"
                    value={businessData.name}
                    onChange={(e) => setBusinessData({...businessData, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={businessData.address}
                    onChange={(e) => setBusinessData({...businessData, address: e.target.value})}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={businessData.phone}
                    onChange={(e) => setBusinessData({...businessData, phone: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={businessData.email}
                    onChange={(e) => setBusinessData({...businessData, email: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input
                    type="url"
                    value={businessData.website}
                    onChange={(e) => setBusinessData({...businessData, website: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID</label>
                  <input
                    type="text"
                    value={businessData.taxId}
                    onChange={(e) => setBusinessData({...businessData, taxId: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select
                    value={businessData.currency}
                    onChange={(e) => setBusinessData({...businessData, currency: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                    <option value="AUD">AUD - Australian Dollar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  <select
                    value={businessData.timezone}
                    onChange={(e) => setBusinessData({...businessData, timezone: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case "payment":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
              <div className="space-y-4">
                {[
                  { name: "Cash", enabled: true, icon: DollarSign },
                  { name: "Credit Card", enabled: true, icon: CreditCard },
                  { name: "Debit Card", enabled: true, icon: CreditCard },
                  { name: "PayPal", enabled: false, icon: Globe },
                  { name: "Apple Pay", enabled: false, icon: Smartphone },
                  { name: "Google Pay", enabled: false, icon: Smartphone }
                ].map((method, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <method.icon className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="font-medium text-gray-900">{method.name}</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={method.enabled}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Tax Rate (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    defaultValue="8.25"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax Label</label>
                  <input
                    type="text"
                    defaultValue="Sales Tax"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "receipt":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Receipt Layout</h3>
              <div className="space-y-4">
                {[
                  { key: "showLogo", label: "Show Business Logo" },
                  { key: "showAddress", label: "Show Business Address" },
                  { key: "showPhone", label: "Show Phone Number" },
                  { key: "showEmail", label: "Show Email Address" },
                  { key: "showWebsite", label: "Show Website" },
                  { key: "showTaxId", label: "Show Tax ID" }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <span className="font-medium text-gray-900">{item.label}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(receiptSettings[item.key as keyof typeof receiptSettings])}
                        onChange={(e) => setReceiptSettings({
                          ...receiptSettings,
                          [item.key]: e.target.checked
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Print Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Paper Size</label>
                  <select
                    value={receiptSettings.paperSize}
                    onChange={(e) => setReceiptSettings({...receiptSettings, paperSize: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="58mm">58mm</option>
                    <option value="80mm">80mm</option>
                    <option value="A4">A4</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Copies</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={receiptSettings.copies}
                    onChange={(e) => setReceiptSettings({...receiptSettings, copies: parseInt(e.target.value) || 1})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Footer Message</label>
                  <textarea
                    value={receiptSettings.footerMessage}
                    onChange={(e) => setReceiptSettings({...receiptSettings, footerMessage: e.target.value})}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Thank you for your business!"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "reports":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Generation</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Auto-Generate Reports</h4>
                    <p className="text-sm text-gray-500">Automatically create reports based on schedule</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={reportSettings.autoGenerate}
                      onChange={(e) => setReportSettings({
                        ...reportSettings,
                        autoGenerate: e.target.checked
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Content</h3>
              <div className="space-y-4">
                {[
                  { key: "includeCharts", label: "Include Charts", desc: "Add visual charts to reports" },
                  { key: "includeTaxBreakdown", label: "Tax Breakdown", desc: "Show detailed tax information" },
                  { key: "includeProductAnalysis", label: "Product Analysis", desc: "Include product performance data" }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{item.label}</h4>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(reportSettings[item.key as keyof typeof reportSettings])}
                        onChange={(e) => setReportSettings({
                          ...reportSettings,
                          [item.key]: e.target.checked
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Generation Frequency</label>
                  <select
                    value={reportSettings.frequency}
                    onChange={(e) => setReportSettings({...reportSettings, frequency: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Report Format</label>
                  <select
                    value={reportSettings.reportFormat}
                    onChange={(e) => setReportSettings({...reportSettings, reportFormat: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="PDF">PDF</option>
                    <option value="Excel">Excel</option>
                    <option value="CSV">CSV</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case "backup":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Backup</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-center mb-4">
                    <Download className="h-12 w-12 text-indigo-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-center mb-2">Export Data</h4>
                  <p className="text-sm text-gray-500 text-center mb-4">Download a backup of all your data</p>
                  <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                    Download Backup
                  </button>
                </div>
                
                <div className="p-6 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-center mb-4">
                    <Upload className="h-12 w-12 text-green-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-center mb-2">Import Data</h4>
                  <p className="text-sm text-gray-500 text-center mb-4">Restore data from backup file</p>
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                    Select Backup File
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Automatic Backup</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Enable Auto Backup</h4>
                    <p className="text-sm text-gray-500">Automatically backup data daily</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Backup History</h3>
              <div className="space-y-3">
                {[
                  { date: "2024-01-15 10:30 AM", size: "2.4 MB", status: "completed" },
                  { date: "2024-01-14 10:30 AM", size: "2.3 MB", status: "completed" },
                  { date: "2024-01-13 10:30 AM", size: "2.2 MB", status: "completed" },
                ].map((backup, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{backup.date}</p>
                        <p className="text-sm text-gray-500">{backup.size}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-800">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                    <option value="480">8 hours</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Failed Login Attempts</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="3">3 attempts</option>
                    <option value="5">5 attempts</option>
                    <option value="10">10 attempts</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Features</h3>
              <div className="space-y-4">
                {[
                  { label: "Require Strong Passwords", desc: "Enforce password complexity requirements" },
                  { label: "Two-Factor Authentication", desc: "Add extra security with 2FA" },
                  { label: "Login Notifications", desc: "Get notified of new login attempts" },
                  { label: "Activity Logging", desc: "Log all user activities for audit" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{item.label}</h4>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={index < 2}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Sessions</h3>
              <div className="space-y-3">
                {[
                  { device: "Chrome on Windows", location: "New York, NY", time: "Currently active", current: true },
                  { device: "Safari on iPhone", location: "New York, NY", time: "2 hours ago", current: false },
                  { device: "Chrome on MacBook", location: "Brooklyn, NY", time: "Yesterday", current: false }
                ].map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <Monitor className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {session.device}
                          {session.current && <span className="ml-2 text-sm text-green-600">(Current)</span>}
                        </p>
                        <p className="text-sm text-gray-500">{session.location} • {session.time}</p>
                      </div>
                    </div>
                    {!session.current && (
                      <button className="text-red-600 hover:text-red-800">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "advanced":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-center mb-4">
                    <Download className="h-12 w-12 text-indigo-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-center mb-2">Export Settings</h4>
                  <p className="text-sm text-gray-500 text-center mb-4">Download all your settings as a backup file</p>
                  <button 
                    onClick={handleExportSettings}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Settings
                  </button>
                </div>
                
                <div className="p-6 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-center mb-4">
                    <Upload className="h-12 w-12 text-green-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-center mb-2">Import Settings</h4>
                  <p className="text-sm text-gray-500 text-center mb-4">Restore settings from a backup file</p>
                  <label className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors cursor-pointer flex items-center justify-center">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Settings
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportSettings}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="p-6 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-center mb-4">
                    <Copy className="h-12 w-12 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-center mb-2">Copy Settings</h4>
                  <p className="text-sm text-gray-500 text-center mb-4">Copy settings to clipboard as JSON</p>
                  <button 
                    onClick={handleCopySettings}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Settings
                  </button>
                </div>

                <div className="p-6 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-center mb-4">
                    <RotateCcw className="h-12 w-12 text-red-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-center mb-2">Reset Settings</h4>
                  <p className="text-sm text-gray-500 text-center mb-4">Reset all settings to default values</p>
                  <button 
                    onClick={handleResetToDefaults}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset to Defaults
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Application Version</h4>
                    <p className="text-sm text-gray-600">POS System v1.0.0</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Last Settings Update</h4>
                    <p className="text-sm text-gray-600">{new Date().toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Database Status</h4>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-600">Connected</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Storage Used</h4>
                    <p className="text-sm text-gray-600">2.4 MB / 100 MB</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Debug Information</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Enable Debug Mode</h4>
                    <p className="text-sm text-gray-500">Show additional debugging information</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={false}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Performance Monitoring</h4>
                    <p className="text-sm text-gray-500">Track system performance metrics</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Select a settings category</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-indigo-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-sm text-gray-500">Manage your POS system preferences and configuration</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border">
              <nav className="p-4 space-y-1">
                {settingsTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? "bg-indigo-100 text-indigo-700 border-indigo-200"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                {renderTabContent()}
              </div>

              {/* Save Button */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {showSuccess && (
                      <div className="flex items-center text-green-600 mr-4">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span className="text-sm font-medium">Settings saved successfully!</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
