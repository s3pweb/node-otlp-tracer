import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { S3pTracer } from './s3p-tracer';

export class HttpTracer extends S3pTracer {
  constructor(url: string, serviceName: string, tracerName: string) {
    // Create exporter
    const exporter = new OTLPTraceExporter({
      url: url,
    });
    // Create base class
    super(exporter, serviceName, tracerName);
  }
}
