import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { recommendationRequestsFixtures } from "fixtures/recommendationRequestsFixtures";
import { http, HttpResponse } from "msw";

import RecommendationRequestsEditPage from "main/pages/RecommendationRequest/RecommendationRequestsEditPage";

export default {
  title: "pages/RecommendationRequest/RecommendationRequestsEditPage",
  component: RecommendationRequestsEditPage,
};

const Template = () => <RecommendationRequestsEditPage storybook={true} />;

export const Default = Template.bind({});
Default.parameters = {
  msw: [
    http.get("/api/currentUser", () =>
      HttpResponse.json(apiCurrentUserFixtures.userOnly, { status: 200 }),
    ),
    http.get("/api/systemInfo", () =>
      HttpResponse.json(systemInfoFixtures.showingNeither, { status: 200 }),
    ),
    // The page fetches the record by id; return one mock row
    http.get("/api/recommendationrequests", () =>
      HttpResponse.json(recommendationRequestsFixtures.threeRequests[0], {
        status: 200,
      }),
    ),
    http.put("/api/recommendationrequests", () =>
      HttpResponse.json({}, { status: 200 }),
    ),
  ],
};
