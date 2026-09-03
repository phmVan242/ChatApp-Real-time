export interface SectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

export interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  danger?: boolean;
}