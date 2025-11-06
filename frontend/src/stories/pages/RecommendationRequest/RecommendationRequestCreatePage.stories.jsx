import React from "react";
import { http, HttpResponse } from "msw";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import RecommendationRequestCreatePage from "main/pages/RecommendationRequest/RecommendationRequestCreatePage";

export default {
  title: "pages/RecommendationRequest/RecommendationRequestCreatePage",
  component: RecommendationRequestCreatePage,
};

const Template = () => <RecommendationRequestCreatePage storybook={true} />;

export const Default = Template.bind({});
Default.parameters = {
  msw: [
    http.get("/api/currentUser", () =>
      HttpResponse.json(apiCurrentUserFixtures.userOnly, { status: 200 }),
    ),
    http.get("/api/systemInfo", () =>
      HttpResponse.json(systemInfoFixtures.showingNeither, { status: 200 }),
    ),
    // ✅ Post to the correct endpoint for RecommendationRequests
    http.post("/api/recommendationrequests/post", () =>
      HttpResponse.json(
        {
          code: "laurenchorr",
          requesterEmail: "laurencho@ucsb.edu",
          professorEmail: "pconrad@ucsb.edu",
          explanation: "Please write me a recommendation.",
          dateRequested: "2025-01-01T12:00",
          dateNeeded: "2025-01-10T12:00",
          done: false,
        },
        { status: 200 },
      ),
    ),
  ],
};
