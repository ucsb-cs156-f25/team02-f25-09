import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { Navigate } from "react-router-dom";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function RecommendationRequestCreatePage({ storybook = false }) {
  // Data shape should match RecommendationRequestForm fields
  const objectToAxiosParams = (rr) => ({
    url: "/api/recommendationrequests/post",
    method: "POST",
    params: {
      code: rr.code,
      requesterEmail: rr.requesterEmail,
      professorEmail: rr.professorEmail,
      explanation: rr.explanation,
      dateRequested: rr.dateRequested, // ISO string from form
      dateNeeded: rr.dateNeeded,       // ISO string from form
      done: rr.done,
    },
  });

  const onSuccess = (created) => {
    toast(`New RecommendationRequest created — id: ${created.id}, code: ${created.code}`);
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/recommendationrequests/all"],
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
        <h1>Create New RecommendationRequest</h1>
        <RecommendationRequestForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  );
}
