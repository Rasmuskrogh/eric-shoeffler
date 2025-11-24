import AdminProviders from "@/components/AdminDashboard/Providers";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminProviders>{children}</AdminProviders>;
}