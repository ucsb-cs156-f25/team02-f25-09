import React from "react";
import UCSBDiningCommonsMenuItemsForm from "main/components/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsForm";
import { UCSBDiningCommonsMenuItemsFixtures  } from "fixtures/UCSBDiningCommonsMenuItems";

export default {
  title: "components/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsForm",
  component: UCSBDiningCommonsMenuItemsForm,
};

const Template = (args) => {
  return <UCSBDiningCommonsMenuItemsForm {...args} />;
};

export const Create = Template.bind({});

Create.args = {
  buttonLabel: "Create",
  submitAction: (data) => {
    console.log("Submit was clicked with data: ", data);
    window.alert("Submit was clicked with data: " + JSON.stringify(data));
  },
};

export const Update = Template.bind({});

Update.args = {
  initialContents: UCSBDiningCommonsMenuItemsFixtures.oneItems,
  buttonLabel: "Update",
  submitAction: (data) => {
    console.log("Submit was clicked with data: ", data);
    window.alert("Submit was clicked with data: " + JSON.stringify(data));
  },
};
