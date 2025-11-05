import React from "react";
import HelpRequestTable from "main/components/HelpRequests/HelpRequestTable";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { http, HttpResponse } from "msw";

export default {
  title: "components/HelpRequests/HelpRequestTable",
  component: HelpRequestTable,
};

const Template = (args) => {
  return <HelpRequestTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  requests: [],
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
  requests: helpRequestFixtures.threeRequests,
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
  requests: helpRequestFixtures.threeRequests,
  currentUser: currentUserFixtures.adminUser,
};

ThreeItemsAdminUser.parameters = {
  msw: [
    http.delete("/api/helprequest", () => {
      return HttpResponse.json(
        { message: "Request deleted successfully" },
        { status: 200 },
      );
    }),
  ],
};
