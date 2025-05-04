import React, { ReactNode } from 'react';
import { Card } from '@/shared/ui';

export interface DashboardWidgetProps {
  children: ReactNode;
  title: string;
  isLoading?: boolean;
  className?: string;
}

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  children,
  title,
  isLoading = false,
  className = '',
}) => {
  return (
    <Card className={`h-full ${className}`}>
      <div className="p-4">
        <h3 className="text-lg font-medium mb-3">{title}</h3>
        {isLoading ? (
          <div className="animate-pulse flex flex-col space-y-4">
            <div className="h-4 bg-accent rounded w-3/4"></div>
            <div className="h-4 bg-accent rounded w-1/2"></div>
            <div className="h-4 bg-accent rounded w-5/6"></div>
          </div>
        ) : (
          children
        )}
      </div>
    </Card>
  );
};

export interface DashboardLayoutProps {
  children?: ReactNode;
  headerContent?: ReactNode;
  topRow?: ReactNode[];
  mainContent?: ReactNode;
  sideContent?: ReactNode[];
  bottomRow?: ReactNode[];
  className?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  headerContent,
  topRow = [],
  mainContent,
  sideContent = [],
  bottomRow = [],
  className = '',
}) => {
  // Use children if provided directly, otherwise use the layout pattern
  if (children) {
    return <div className={`container mx-auto px-4 py-6 ${className}`}>{children}</div>;
  }

  return (
    <div className={`container mx-auto px-4 py-6 ${className}`}>
      {/* Header Section */}
      {headerContent && (
        <div className="mb-6">
          {headerContent}
        </div>
      )}

      {/* Top Row Widgets */}
      {topRow.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {topRow.map((widget, index) => (
            <div key={`top-widget-${index}`} className="w-full">
              {widget}
            </div>
          ))}
        </div>
      )}

      {/* Main Content + Side Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        {/* Main Content Area (3/4 width on large screens) */}
        {mainContent && (
          <div className="lg:col-span-3">
            {mainContent}
          </div>
        )}

        {/* Side Widgets Area (1/4 width on large screens) */}
        {sideContent.length > 0 && (
          <div className="space-y-6">
            {sideContent.map((widget, index) => (
              <div key={`side-widget-${index}`}>
                {widget}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Row Widgets */}
      {bottomRow.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bottomRow.map((widget, index) => (
            <div key={`bottom-widget-${index}`} className="w-full">
              {widget}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardLayout; 