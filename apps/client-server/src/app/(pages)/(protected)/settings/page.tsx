export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="p-6 border border-dashed border-gray-300 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Account Settings</h3>
          <p className="text-muted-foreground">Account settings coming soon...</p>
        </div>
        
        <div className="p-6 border border-dashed border-gray-300 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Preferences</h3>
          <p className="text-muted-foreground">User preferences coming soon...</p>
        </div>
      </div>
    </div>
  )
}