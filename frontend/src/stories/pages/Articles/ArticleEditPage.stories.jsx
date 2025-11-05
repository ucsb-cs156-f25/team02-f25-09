import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import ArticleEditPage from "main/pages/Articles/ArticleEditPage";
import { articleFixtures } from "fixtures/articleFixtures";

export default {
  title: "pages/Articles/ArticleEditPage",
  component: ArticleEditPage,
};

const Template = () => <ArticleEditPage storybook={true} />;

export const Default = Template.bind({});
Default.parameters = {
  msw: [
    http.get("/api/currentUser", () => {
      return HttpResponse.json(apiCurrentUserFixtures.userOnly, {
        status: 200,
      });
    }),
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingNeither, {
        status: 200,
      });
    }),
    http.get("/api/articles", ({ request }) => {
      const url = new URL(request.url);
      const id = url.searchParams.get("id");
      return HttpResponse.json(
        articleFixtures.threeArticles.find((a) => a.id === parseInt(id)),
        {
          status: 200,
        }
      );
    }),
    http.put("/api/articles", () => {
      return HttpResponse.json({}, { status: 200 });
    }),
  ],
};

