"use client";

export default function TestPage() {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Test Page</h1>
      <p>Si puedes ver esta página, Next.js está funcionando correctamente.</p>
      <p>Timestamp: {new Date().toISOString()}</p>
    </div>
  );
} 