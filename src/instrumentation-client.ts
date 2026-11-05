import { initErrorMonitoring, onRouterTransitionStart } from "@/shared/observability/error-monitoring";

initErrorMonitoring();

export { onRouterTransitionStart };
