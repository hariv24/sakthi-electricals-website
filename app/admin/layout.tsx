import AdminSidebar from './AdminSidebar';
import './admin.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-root" style={{ display: 'flex', minHeight: '100vh', background: '#f4f5f7' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
