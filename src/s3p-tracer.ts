import { BatchSpanProcessor, SpanExporter } from '@opentelemetry/sdk-trace-base';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { Resource } from '@opentelemetry/resources';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import opentelemetry, { Context, Span, Tracer } from '@opentelemetry/api';

export class S3pTracer {
  private tracer: Tracer;

  constructor(exporter: SpanExporter, serviceName: string, tracerName: string) {
    const provider = new NodeTracerProvider({
      resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
      }),
    });

    provider.addSpanProcessor(new BatchSpanProcessor(exporter));
    provider.register();

    this.tracer = opentelemetry.trace.getTracer(tracerName);
  }

  /**
   * Get a remote context from the given parent Span.
   */
  getContext(parentSpan: Span): Context {
    return opentelemetry.trace.setSpanContext(opentelemetry.context.active(), parentSpan.spanContext());
  }

  /**
   * Get a remote context from the given traceId and spanId.
   */
  getRemoteContext(traceId: string, spanId: string, isRemote = true): Context {
    return opentelemetry.trace.setSpanContext(
      opentelemetry.context.active(),
      {
        traceId: traceId,
        spanId: spanId,
        traceFlags: 1,
        isRemote: isRemote,
      },
    );
  }

  /**
   * Start a new Span with an optional context. This Span MUST be closed with `span.end()`.
   */
  createSpan(name: string, context?: Context): Span {
    return this.tracer.startSpan(name, {}, context);
  }
}
