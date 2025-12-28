"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { configurationService, ConfigurationMap } from "@/lib/services/configuration";

interface ConfigurationContextType {
  configs: ConfigurationMap;
  isLoading: boolean;
  refreshConfigs: () => Promise<void>;
  get: (key: string, defaultValue?: string) => string;
}

const ConfigurationContext = createContext<ConfigurationContextType | undefined>(undefined);

export function ConfigurationProvider({ children }: { children: React.ReactNode }) {
  const [configs, setConfigs] = useState<ConfigurationMap>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchConfigs = async () => {
    try {
      const data = await configurationService.getPublicConfigurations();
      setConfigs(data || {});
    } catch (error) {
      console.error("Failed to fetch configurations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const get = (key: string, defaultValue = ""): string => {
    return configs?.[key] || defaultValue;
  };

  return (
    <ConfigurationContext.Provider value={{ configs, isLoading, refreshConfigs: fetchConfigs, get }}>
      {children}
    </ConfigurationContext.Provider>
  );
}

export function useConfiguration() {
  const context = useContext(ConfigurationContext);
  if (context === undefined) {
    throw new Error("useConfiguration must be used within a ConfigurationProvider");
  }
  return context;
}
