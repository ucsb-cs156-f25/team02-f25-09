import React from "react";
import UCSBDiningCommonsMenuItemsTable from "main/components/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsTable";
import { UCSBDiningCommonsMenuItemsFixtures } from "fixtures/UCSBDiningCommonsMenuItems";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { http, HttpResponse } from "msw";

export default {
  title:
    "components/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsTable",
  component: UCSBDiningCommonsMenuItemsTable,
};

const Template = (args) => {
  return <UCSBDiningCommonsMenuItemsTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  items: [],
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
  items: UCSBDiningCommonsMenuItemsFixtures.threeItems,
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
  items: UCSBDiningCommonsMenuItemsFixtures.threeItems,
  currentUser: currentUserFixtures.adminUser,
};

ThreeItemsAdminUser.parameters = {
  msw: [
    http.delete("/api/ucsbdiningcommonsmenuitems", () => {
      return HttpResponse.json({}, { status: 200 });
    }),
  ],
};
