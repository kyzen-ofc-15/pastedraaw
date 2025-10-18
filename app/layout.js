import './globals.css'

export const metadata = {
  title: 'Script Protector',
  description: 'Protect your scripts with browser detection',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
