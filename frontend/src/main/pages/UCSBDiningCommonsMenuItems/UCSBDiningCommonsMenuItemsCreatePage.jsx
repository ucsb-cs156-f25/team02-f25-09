import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBDiningCommonsMenuItemsForm from "main/components/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsForm";
import { Navigate } from "react-router";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBDiningCommonsMenuItemsCreatePage({
  storybook = false,
}) {
  const objectToAxiosParams = (UCSBDiningCommonsMenuItems) => ({
    url: "/api/ucsbdiningcommonsmenuitems/post",
    method: "POST",
    params: {
      diningCommonsCode: UCSBDiningCommonsMenuItems.diningCommonsCode,
      name: UCSBDiningCommonsMenuItems.name,
      station: UCSBDiningCommonsMenuItems.station,
    },
  });

  const onSuccess = (UCSBDiningCommonsMenuItems) => {
    toast(
      `New UCSBDiningCommonsMenuItems Created - id: ${UCSBDiningCommonsMenuItems.id} name: ${UCSBDiningCommonsMenuItems.name}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/ucsbdiningcommonsmenuitems/all"],
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/ucsbdiningcommonsmenuitems" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New UCSBDiningCommonsMenuItems</h1>

        <UCSBDiningCommonsMenuItemsForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  );
}
