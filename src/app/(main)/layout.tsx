export default async function MainLayout({ children }: { children: React.ReactNode }) {
  // Temporarily bypass session check for development
  // if (!session) {
  //   redirect('/auth/signin')
  // }
  return <>{children}</>
} 