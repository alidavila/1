import type { Metadata } from "next";
// Usar importaciones locales en lugar de next/font para evitar problemas con SWC
import "./globals.css";

// Variables CSS para fonts
const fontVariables = `
  --font-geist-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  --font-geist-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
`;

export const metadata: Metadata = {
  title: "DANTE Finance",
  description: "Aplicación de administración financiera personal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            ${fontVariables}
          }
        `}} />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
