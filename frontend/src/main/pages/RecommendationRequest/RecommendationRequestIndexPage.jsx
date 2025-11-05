import React from "react";
import { useBackend } from "main/utils/useBackend";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RecommendationRequestsTable from "main/components/RecommendationRequest/RecommendationRequestsTable";
import { Button } from "react-bootstrap";
import { useCurrentUser, hasRole } from "main/utils/useCurrentUser";

export default function RecommendationRequestIndexPage() {
  const currentUser  = useCurrentUser();

  const { data: recommendationRequests = [], error: _error, status: _status } =
    useBackend(
      ["/api/recommendationrequests/all"], // query key
      { method: "GET", url: "/api/recommendationrequests/all" },
      [], // initial data
    );

  const isAdmin = hasRole(currentUser, "ROLE_ADMIN");

  return (
    <BasicLayout>
      <div className="pt-2">
        {isAdmin && (
          <Button
            variant="primary"
            href="/recommendationrequests/create"
            style={{ float: "right" }}
          >
            Create RecommendationRequest
          </Button>
        )}
        <h1>RecommendationRequest</h1>
        <RecommendationRequestsTable
          recommendationRequests={recommendationRequests}
          currentUser={currentUser}
        />
      </div>
    </BasicLayout>
  );
}
