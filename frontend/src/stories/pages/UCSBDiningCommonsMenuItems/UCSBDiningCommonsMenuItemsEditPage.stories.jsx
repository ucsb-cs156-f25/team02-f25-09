import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { UCSBDiningCommonsMenuItemsFixtures } from "fixtures/UCSBDiningCommonsMenuItems"; 
import { http, HttpResponse } from "msw";

import UCSBDiningCommonsMenuItemsEditPage from "main/pages/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsEditPage";

export default {
  title: "pages/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsEditPage",
  component: UCSBDiningCommonsMenuItemsEditPage,
};

const Template = () => <UCSBDiningCommonsMenuItemsEditPage storybook={true} />;

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
    http.get("/api/ucsbdiningcommons", () => {
      return HttpResponse.json(UCSBDiningCommonsMenuItemsFixtures.threeItems[0], {
        status: 200,
      });
    }),
    http.put("/api/ucsbdiningcommons", () => {
      return HttpResponse.json({}, { status: 200 });
    }),
  ],
};
