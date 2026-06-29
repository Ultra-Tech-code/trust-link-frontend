import { Suspense } from "react";
import dynamic from 'next/dynamic';
const VendorAnalyticsSection = dynamic(() => import('@/components/dashboard/VendorAnalyticsSection'), { ssr: false });

export const metadata = {
  title: "Vendor Analytics | TrustLink",
  description: "Track transaction volume, average order value, completion rate, and dispute rate.",
};

export default function VendorAnalyticsAliasPage() {
  return (
    <Suspense fallback={null}>
      <VendorAnalyticsSection />
    </Suspense>
  );
}
