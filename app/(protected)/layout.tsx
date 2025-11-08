import { ProtectedLayout } from '@/widgets/layout/ui/protected-layout'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>
}

