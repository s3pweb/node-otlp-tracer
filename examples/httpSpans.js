'use strict';
const { HttpTracer } = require('../dist/index');

// Create and configure the tracer
const tracer = new HttpTracer('<url>/v1/traces', 'node-otlp-example');

const mainWork = () => {
  // Create a remote context
  //const ctx = tracer.getRemoteContext('63b3b3ad532f8c7a38f8fa10fa117723', 'b8a16e8b0da65d7e')
  const ctx = undefined;

  // Start a new Span
  const parentSpan = tracer.createSpan('mainWork - startNewSpan', ctx);

  // We can get the traceId and spanId
  // parentSpan.spanContext().traceId;
  // parentSpan.spanContext().spanId;

  for (let i = 0; i < 3; i += 1) {
    doWork(parentSpan, i);
  }

  // Be sure to end the parent span!
  parentSpan.end();
};

const doWork = (parent, i) => {
  // To create a child span, we need to mark the current (parent) span as the active span
  // in the context, then use the resulting context to create a child span.
  const ctx = tracer.getContext(parent);
  // Create a new child span
  const span = tracer.createSpan(`doWork:${i}`, ctx);
  // Set optional attributes
  span.setAttribute('key', 'value');

  // simulate some random work.
  for (let i = 0; i <= Math.floor(Math.random() * 40000000); i += 1) {
    // empty
  }

  // Make sure to end this child span! If you don't,
  // it will continue to track work beyond 'doWork'!
  span.end();
};

mainWork();

setTimeout(() => {
  console.log('end');
}, 6000);
