// app/page.tsx
import Homepage from './(public)/home/page'
import { redirect } from 'next/navigation'

export default function RootPage() {
  const isAuthenticated = false; // Replace with your actual auth check

  if (isAuthenticated) {
    redirect('/homepage')
  }
  // This return won't be reached due to the redirects above
  return <Homepage />
}