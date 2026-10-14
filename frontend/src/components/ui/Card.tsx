import { ReactNode } from "react";

interface CardProps {
  title: string;
  icon: string;
  color: "navy" | "teal";
  children: ReactNode;
}

export const Card = ({ title, icon, color, children }: CardProps) => {
  return (
    <div className="rounded-lg border p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="h-8 w-8 rounded-full flex items-center justify-center">
          <span className="font-medium">{icon === "users" ? "👥" : 
                                 icon === "briefcase" ? "💼" : 
                                 icon === "handshake" ? "🤝" : 
                                 icon === "phone" ? "📞" : 
                                 icon === "trending-up" ? "📈" : 
                                 icon === "pie-chart" ? "🥧" : 
                                 "📊"}</span>
        </div>
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
};
