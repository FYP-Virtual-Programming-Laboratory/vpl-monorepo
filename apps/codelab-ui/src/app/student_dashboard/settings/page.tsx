import { Header } from "@/components/layout/header";

interface SettingsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function SettingsPage({ searchParams }: SettingsPageProps) {
  return (
    <>
      <Header
        title="Settings"
        description="Configure your preferences and account settings"
      />
      <div></div>
    </>
  );
}
