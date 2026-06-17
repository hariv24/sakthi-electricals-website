export default function Loading() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={{ background: '#fff', border: '1px solid #e2e5ea', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ width: '100%', aspectRatio: '4/3', background: '#f1f2f5' }} />
          <div style={{ padding: '12px 14px 14px' }}>
            <div style={{ height: 10, width: 60, borderRadius: 99, background: '#f1f2f5', marginBottom: 10 }} />
            <div style={{ height: 14, width: '70%', borderRadius: 4, background: '#f1f2f5' }} />
          </div>
        </div>
      ))}
    </div>
  );
}
