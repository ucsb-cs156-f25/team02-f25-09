import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { Navigate } from "react-router-dom";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function RecommendationRequestsEditPage({ storybook = false }) {
  const { id } = useParams();

  // Load the existing RecommendationRequest by id
  const {
    data: recommendationRequest,
    _error,
    _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/recommendationrequests?id=${id}`],
    {
      method: "GET",
      url: `/api/recommendationrequests`,
      params: { id },
    },
  );

  // Build PUT request from form data
  const objectToAxiosPutParams = (rr) => ({
    url: "/api/recommendationrequests",
    method: "PUT",
    params: { id: rr.id },
    data: {
      code: rr.code,
      requesterEmail: rr.requesterEmail,
      professorEmail: rr.professorEmail,
      explanation: rr.explanation,
      dateRequested: rr.dateRequested, // ISO string from form
      dateNeeded: rr.dateNeeded, // ISO string from form
      done: rr.done,
    },
  });

  const onSuccess = (updated) => {
    toast(
      `RecommendationRequest updated — id: ${updated.id}, code: ${updated.code}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/recommendationrequests?id=${id}`],
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/recommendationrequests" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit RecommendationRequest</h1>
        {recommendationRequest && (
          <RecommendationRequestForm
            initialContents={recommendationRequest}
            submitAction={onSubmit}
            buttonLabel="Update"
          />
        )}
      </div>
    </BasicLayout>
  );
}
