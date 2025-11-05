import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { recommendationRequestsFixtures } from "fixtures/recommendationRequestsFixtures";
import { http, HttpResponse } from "msw";

import RecommendationRequestsIndexPage from "main/pages/RecommendationRequest/RecommendationRequestsIndexPage";

export default {
  title: "pages/RecommendationRequest/RecommendationRequestsIndexPage",
  component: RecommendationRequestsIndexPage,
};

const Template = () => <RecommendationRequestsIndexPage storybook={true} />;

export const Empty = Template.bind({});
Empty.parameters = {
  msw: [
    http.get("/api/currentUser", () =>
      HttpResponse.json(apiCurrentUserFixtures.userOnly, { status: 200 })
    ),
    http.get("/api/systemInfo", () =>
      HttpResponse.json(systemInfoFixtures.showingNeither, { status: 200 })
    ),
    http.get("/api/recommendationrequests/all", () =>
      HttpResponse.json([], { status: 200 })
    ),
  ],
};

export const ThreeItemsOrdinaryUser = Template.bind({});
ThreeItemsOrdinaryUser.parameters = {
  msw: [
    http.get("/api/currentUser", () =>
      HttpResponse.json(apiCurrentUserFixtures.userOnly)
    ),
    http.get("/api/systemInfo", () =>
      HttpResponse.json(systemInfoFixtures.showingNeither)
    ),
    http.get("/api/recommendationrequests/all", () =>
      HttpResponse.json(recommendationRequestsFixtures.threeRequests)
    ),
  ],
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.parameters = {
  msw: [
    http.get("/api/currentUser", () =>
      HttpResponse.json(apiCurrentUserFixtures.adminUser)
    ),
    http.get("/api/systemInfo", () =>
      HttpResponse.json(systemInfoFixtures.showingNeither)
    ),
    http.get("/api/recommendationrequests/all", () =>
      HttpResponse.json(recommendationRequestsFixtures.threeRequests)
    ),
    http.delete("/api/recommendationrequests", () =>
      HttpResponse.json({}, { status: 200 })
    ),
  ],
};
