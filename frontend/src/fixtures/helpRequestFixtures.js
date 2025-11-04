const helpRequestFixtures = {
  oneRequest: {
      "id": 1,
      "requesterEmail": "dkim876@ucsb.edu",
      "teamId": "one",
      "tableOrBreakoutRoom": "table01",
      "requestTime": "2025-11-02T10:12:00",
      "explanation": "This is a test.",
      "solved": false
  },
  threeRequests: [
    {
      "id": 1,
      "requesterEmail": "dkim876@ucsb.edu",
      "teamId": "one",
      "tableOrBreakoutRoom": "table01",
      "requestTime": "2025-11-02T10:12:00",
      "explanation": "This is a test.",
      "solved": false
    },
    {
      "id": 3,
      "requesterEmail": "dkim876@ucsb.edu",
      "teamId": "two",
      "tableOrBreakoutRoom": "table02",
      "requestTime": "2025-11-02T11:12:00",
      "explanation": "This is a test.",
      "solved": true
    },
    {
      "id": 4,
      "requesterEmail": "dkim876@ucsb.edu",
      "teamId": "three",
      "tableOrBreakoutRoom": "table03",
      "requestTime": "2025-11-02T12:12:00",
      "explanation": "This is a test.",
      "solved": false
    },
  ],
};

export { helpRequestFixtures };
