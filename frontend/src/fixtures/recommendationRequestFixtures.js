const recommendationRequestFixtures = {
  oneRecommendationRequest:{
    id: 3,
    code: "laurenchorr",
    requesterEmail: "lauren.cho@ucsb.edu",
    professorEmail: "pconrad@cs.ucsb.edu",
    explanation: "Recommendation for summer 2026 internship",
    dateRequested: "2025-11-01T20:57:33.034Z",
    dateNeeded: "2025-11-11T20:57:33.034Z",
    done: true,
  },
  threeRecommendationRequests: [
    {
      id: 8,
      code: "laurenchonewrr",
      requesterEmail: "lauren.cho@umail.ucsb.edu",
      professorEmail: "pconrad@cs.ucsb.edu",
      explanation: "Recommendation for summer 2027 internship",
      dateRequested: "2025-11-01T21:57:33.034Z",
      dateNeeded: "2025-11-21T21:57:33.034Z",
      done: false,
    },
    {
     id: 9,
      code: "davidbazanrr",
      requesterEmail: "davidbazan@ucsb.edu",
      professorEmail: "pconrad@cs.ucsb.edu",
      explanation: "Recommendation for ERSP",
      dateRequested: "2025-11-01T22:30:33.034Z",
      dateNeeded: "2025-11-02T22:30:33.034Z",
      done: false,
    },
    {
      id: 10,
      code: "denniskimrr",
      requesterEmail: "djensen@ucsb.edu",
      professorEmail: "pconrad@cs.ucsb.edu",
      explanation: "Recommendation for Master's program",
      dateRequested: "2025-11-01T22:21:33.034Z",
      dateNeeded: "2025-12-01T22:21:33.034Z",
      done: false,
    },
  ],
};

export { recommendationRequestFixtures };
