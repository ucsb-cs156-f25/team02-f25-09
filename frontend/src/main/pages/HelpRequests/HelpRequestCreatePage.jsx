import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import HelpRequestForm from "main/components/HelpRequests/HelpRequestForm";
import { Navigate } from "react-router";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function HelpRequestCreatePage({ storybook = false }) {
  const addZ = (string) => `${string}Z`;

  const objectToAxiosParams = (request) => ({
    url: "/api/helprequest/post",
    method: "POST",
    params: {
      id: request.id,
      requesterEmail: request.requesterEmail,
      teamId: request.teamId,
      tableOrBreakoutRoom: request.tableOrBreakoutRoom,
      requestTime: addZ(request.requestTime),
      explanation: request.explanation,
      solved: request.solved,
    },
  });

  const onSuccess = (request) => {
    toast(
      `New request Created - id: ${request.id} 
      requesterEmail: ${request.requesterEmail} 
      teamId: ${request.teamId} 
      tableOrBreakoutRoom: ${request.tableOrBreakoutRoom} 
      requestTime: ${request.requestTime} 
      explanation: ${request.explanation} 
      solved: ${request.solved}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/helprequest/all"], // mutation makes this key stale so that pages relying on it reload
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/helprequest" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Help Request</h1>
        <HelpRequestForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  );
}
