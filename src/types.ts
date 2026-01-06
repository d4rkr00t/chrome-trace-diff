export type Diff = {
  timeline: {
    before: {};
    after: {};
  };
  functionCalls: {
    before: Record<string, FunctionCall>;
    after: Record<string, FunctionCall>;
  };
};

export type FunctionCall = {};

export type TimelineEvent = {};
