// app/(auth)/layout.tsx
import Sidebar from "@/app/components/Sidebar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <main className="flex-1 overflow-auto">
      <Sidebar />
        {children}
      </main>
    </div>
  );
}