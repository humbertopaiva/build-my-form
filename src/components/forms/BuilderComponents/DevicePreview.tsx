// src/components/forms/BuilderComponents/DevicePreview.tsx
"use client";

import { useState } from "react";
import { Smartphone, Monitor, Tablet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DevicePreviewProps {
  children: React.ReactNode;
}

type DeviceType = "desktop" | "tablet" | "mobile";

export function DevicePreview({ children }: DevicePreviewProps) {
  const [device, setDevice] = useState<DeviceType>("desktop");

  const deviceStyles = {
    desktop: "w-full",
    tablet: "max-w-[768px]",
    mobile: "max-w-[375px]",
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-2 pb-4 border-b">
        <Button
          variant={device === "desktop" ? "default" : "outline"}
          size="icon"
          onClick={() => setDevice("desktop")}
        >
          <Monitor className="h-4 w-4" />
        </Button>
        <Button
          variant={device === "tablet" ? "default" : "outline"}
          size="icon"
          onClick={() => setDevice("tablet")}
        >
          <Tablet className="h-4 w-4" />
        </Button>
        <Button
          variant={device === "mobile" ? "default" : "outline"}
          size="icon"
          onClick={() => setDevice("mobile")}
        >
          <Smartphone className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex justify-center">
        <div
          className={cn(
            "transition-all duration-200 border rounded-lg overflow-hidden",
            deviceStyles[device]
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
