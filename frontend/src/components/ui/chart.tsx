"use client";

import React from "react";
import {
  Area, Bar, Line,
  ComposedChart, AreaChart, BarChart,
  LineChart, PieChart, RadarChart,
  RadialBarChart, ScatterChart,
  Pie, Cell, XAxis, YAxis,
  CartesianGrid, PolarGrid,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  ResponsiveContainer
} from "recharts";
import { Payload } from "recharts/types/component/DefaultTooltipContent";
import { cn } from "@/lib/utils";

export const Chart = {
  Area,
  Bar,
  Line,
  ComposedChart,
  AreaChart,
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  RadialBarChart,
  ScatterChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  PolarGrid,
  Tooltip: ChartTooltip,
  Legend: ChartLegend,
  ResponsiveContainer,
};

const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

export function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) throw new Error("useChart must be used within a <ChartContainer />");
  return context;
}

export const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig;
    children: React.ReactNode;
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn("flex aspect-video justify-center text-xs", className)}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <ResponsiveContainer>
          {children as React.ReactElement}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = "ChartContainer";

export const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  type ColorConfigEntry = [string, { color?: string; theme?: Record<string, string> }];
  function isColorConfigEntry(entry: [string, { color?: string; theme?: Record<string, string> }]): entry is ColorConfigEntry {
    const [, configItem] = entry;
    return !!(configItem.theme || configItem.color);
  }
  const colorConfig: ColorConfigEntry[] = Object.entries(config).filter(isColorConfigEntry);

  if (!colorConfig.length) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES).map(([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig.map(([key, itemConfig]) => {
  const color = itemConfig.theme?.[theme as keyof typeof itemConfig.theme] || itemConfig.color;
  return color ? `  --color-${key}: ${color};` : null;
}).join("\n")}
}
`).join("\n")
      }}
    />
  );
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: Payload<number, string>[];
  label?: React.ReactNode;
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: "line" | "dot" | "dashed";
  nameKey?: string;
  labelKey?: string;
  labelClassName?: string;
  customLabelFormatter?: (
    value: unknown,
    payload: Payload<number, string>[]
  ) => React.ReactNode;
  formatter?: (
    value: number | string,
    name: string,
    entry: Payload<number, string>,
    index: number
  ) => React.ReactNode;
  color?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const ChartTooltipContent = React.forwardRef<HTMLDivElement, CustomTooltipProps>(
  ({ active, payload, hideLabel, labelKey, labelClassName, customLabelFormatter, formatter, className }, ref) => {
    if (!active || !payload?.length) return null;
    const [first] = payload;
    const labelValue = (labelKey || first.name || first.dataKey || "value") as string;

    return (
      <div ref={ref} className={cn("rounded-md border bg-white p-2 text-xs shadow", className)}>
        {customLabelFormatter ? (
          <div className={labelClassName}>
            {customLabelFormatter(labelValue, payload)}
          </div>
        ) : (
          !hideLabel && <div className={labelClassName}>{labelValue}</div>
        )}
        {payload.map((item, idx) => {
          const display = formatter
            ? formatter(item.value as number | string, item.name ?? "", item, idx)
            : `${item.name}: ${item.value}`;
          return <div key={idx}>{display}</div>;
        })}
      </div>
    );
  }
);
ChartTooltipContent.displayName = "ChartTooltipContent";

export interface ChartLegendContentProps extends React.ComponentProps<"div"> {
  payload?: { value?: string; color?: string }[];
  verticalAlign?: "top" | "bottom" | "middle";
  hideIcon?: boolean;
  nameKey?: string;
}

export const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  ChartLegendContentProps
>(({ className, hideIcon = false, payload, verticalAlign = "bottom", nameKey }, ref) => {
  const { config } = useChart();
  if (!payload?.length) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {payload.map((item, idx) => {
        const key = `${nameKey || item.value || "value"}`;
        const itemConfig = config[key];
        return (
          <div key={idx} className="flex items-center gap-1.5">
            {!hideIcon && (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{ backgroundColor: item.color }}
              />
            )}
            {itemConfig?.label || item.value}
          </div>
        );
      })}
    </div>
  );
});
ChartLegendContent.displayName = "ChartLegendContent";
