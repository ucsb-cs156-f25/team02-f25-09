import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router";
import MenuItemReviewForm from "main/components/MenuItemReviews/MenuItemReviewForm";
import { Navigate } from "react-router";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function MenuItemReviewEditPage({ storybook = false }) {
  let { id } = useParams();

  const {
    data: menuitemreview,
    _error,
    _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/menuitemreview?id=${id}`],
    {
      // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
      method: "GET",
      url: `/api/menuitemreview`,
      params: {
        id,
      },
    },
  );

  const objectToAxiosPutParams = (menuitemreview) => ({
    url: "/api/menuitemreview",
    method: "PUT",
    params: {
      id: menuitemreview.id,
    },
    data: {
      itemId: menuitemreview.itemId,
      reviewerEmail: menuitemreview.reviewerEmail,
      dateReviewed: menuitemreview.dateReviewed,
      stars: menuitemreview.stars,
      comments: menuitemreview.comments,
    },
  });

  const onSuccess = (menuitemreview) => {
    toast(`MenuItemReview Updated - ItemId: ${menuitemreview.itemId} reviewerEmail: ${menuitemreview.reviewerEmail}`);
  };

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/menuitemreview?id=${id}`],
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/menuitemreview" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit MenuItemReview</h1>
        {menuitemreview && (
          <MenuItemReviewForm
            initialContents={menuitemreview}
            submitAction={onSubmit}
            buttonLabel="Update"
          />
        )}
      </div>
    </BasicLayout>
  );
}
