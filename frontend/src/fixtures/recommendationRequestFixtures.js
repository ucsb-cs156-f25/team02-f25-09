const recommendationRequestFixtures = {
  oneRecommendationRequest:{
    id: 0,
    code: "laurenchorr",
    requesterEmail: "lauren.cho@ucsb.edu",
    professorEmail: "pconrad@cs.ucsb.edu",
    explanation: "Recommendation for summer 2026 internship",
    dateRequested: "2025-11-01T20:57:33.034Z",
    dateNeeded: "2025-11-01T20:57:33.034Z",
    done: true,
  },
  threeRecommendationRequests: [
    {
      id: 1,
      code: "laurenchorr",
      requesterEmail: "lauren.cho@umail.ucsb.edu",
      professorEmail: "pconrad@cs.ucsb.edu",
      explanation: "Recommendation for summer 2026 internship",
      dateRequested: "2025-11-01T21:57:33.034Z",
      dateNeeded: "2025-11-01T21:57:33.034Z",
      done: false,
    },
    {
     id: 2,
      code: "davidbazanrr",
      requesterEmail: "davidbazan@ucsb.edu",
      professorEmail: "pconrad@cs.ucsb.edu",
      explanation: "Recommendation for ERSP",
      dateRequested: "2025-11-01T22:30:33.034Z",
      dateNeeded: "2025-11-01T22:30:33.034Z",
      done: false,
    },
    {
      id: 3,
      code: "denniskimrr",
      requesterEmail: "djensen@ucsb.edu@ucsb.edu",
      professorEmail: "pconrad@cs.ucsb.edu",
      explanation: "Recommendation for Master's program",
      dateRequested: "2025-11-01T22:21:33.034Z",
      dateNeeded: "2025-11-01T22:21:33.034Z",
      done: false,
    },
  ],
};

export { recommendationRequestFixtures };
