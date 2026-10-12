import './globals.css';

export const metadata = {
  title: 'New Petto',
  description: 'Социальная сеть для питомцев',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
      <html lang="ru">
      <body>{children}</body>
      </html>
  );
}