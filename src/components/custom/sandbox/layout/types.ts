interface Tab {
  title: string;
  icon: JSX.Element;
  content: JSX.Element;
  value: string;
  unsavedChanges?: boolean;
}

interface TabsProps {
  tabsMap: Tab[];
  crumbs?: string[];
  onExpand?: () => void;
  onContract?: () => void;
  type?: "subwindow" | "window";
  className?: string;
}

export type { Tab, TabsProps };
