import { useQuery } from '@tanstack/react-query';
import { monitoringService } from '../api/monitoring.service';

export const useMonitoring = () => {
    return useQuery({
        queryKey: ['monitoring-dashboard'],
        queryFn: async () => {
            const [overview, system, app] = await Promise.all([
                monitoringService.getOverview(),
                monitoringService.getSystem(),
                monitoringService.getApp(),
            ]);

            return {
                overview: {
                    status: overview?.healthLevel || 'unknown',
                },
                system: {
                    cpu: {
                        usedPercent: system?.cpuPercent || 0,
                        cores: 0,
                    },
                    ram: {
                        usedBytes: system?.memoryUsedBytes || 0,
                        totalBytes: system?.memoryTotalBytes || 0,
                        usedPercent: system?.memoryTotalBytes 
                            ? (system.memoryUsedBytes / system.memoryTotalBytes) 
                            : 0
                    },
                    disk: {
                        usedBytes: system?.diskUsedBytes || 0,
                        totalBytes: system?.diskTotalBytes || 0,
                        usedPercent: system?.diskTotalBytes 
                            ? (system.diskUsedBytes / system.diskTotalBytes) 
                            : 0
                    }
                },
                app: {
                    status: app?.status || 'Down',
                    uptime: overview?.uptimeSeconds || system?.uptimeSeconds || 0,
                    cpuPercent: app?.cpuPercent || 0,
                    memoryUsedBytes: app?.memoryUsedBytes || 0
                }
            };
        },
        refetchInterval: 30000,
        staleTime: 10000, 
    });
};