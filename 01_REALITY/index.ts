/**
 * 01_REALITY - Physical Machine Layer
 * 
 * Direct communication with Barbieri XRot 95 EVO PLC
 * - HTTP API polling (192.168.4.1:5000) every 5s
 * - GPS/RTK telemetry (±3cm precision)
 * - Motor hours (MTH) tracking
 * - Battery, temperature, diagnostics
 */

export * from './barbieri-api/client';
