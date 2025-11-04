import { Button, Form, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

function MenuItemReviewForm({
  initialContents,
  submitAction,
  buttonLabel = "Create",
}) {
  // Stryker disable all
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues: initialContents || {} });
  // Stryker restore all

  const navigate = useNavigate();

  // For explanation, see: https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
  // Note that even this complex regex may still need some tweaks

  // Stryker disable Regex
  const isodate_regex =
    /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;
  // Stryker restore Regex

  // Stryker disable next-line all
  const yyyyq_regex = /((19)|(20))\d{2}[1-4]/i; // Accepts from 1900-2099 followed by 1-4.  Close enough.

  return (
    <Form onSubmit={handleSubmit(submitAction)}>
      <Row>
        {initialContents && (
          <Col>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="id">Id</Form.Label>
              <Form.Control
                data-testid="MenuItemReviewForm-id"
                id="id"
                type="text"
                {...register("id")}
                value={initialContents.id}
                disabled
              />
            </Form.Group>
          </Col>
        )}

        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="itemId">Item Id</Form.Label>
            <Form.Control
              data-testid="MenuItemReviewForm-itemId"
              id="itemId"
              type="long"
              isInvalid={Boolean(errors.itemId)}
              {...register("itemId", {
                required: true,
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.itemId && "ItemId is required."}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="reviewerEmail">Reviewer Email</Form.Label>
            <Form.Control
              data-testid="MenuItemReviewForm-reviewerEmail"
              id="reviewerEmail"
              type="text"
              isInvalid={Boolean(errors.reviewerEmail)}
              {...register("reviewerEmail", {
                required: true,
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.itemId && "reviewerEmail is required."}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="stars">Stars</Form.Label>
            <Form.Control
              data-testid="MenuItemReviewForm-stars"
              id="stars"
              type="int"
              isInvalid={Boolean(errors.stars)}
              {...register("stars", {
                required: true,
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.itemId && "stars are required."}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="comments">Comments</Form.Label>
            <Form.Control
              data-testid="MenuItemReviewForm-comments"
              id="comments"
              type="text"
              isInvalid={Boolean(errors.comments)}
              {...register("comments", {
                required: true,
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.itemId && "comments are required."}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="dateReviewed">
              Date Reviewed (iso format)
            </Form.Label>
            <Form.Control
              data-testid="MenuItemReview-dateReviewed"
              id="dateReviewed"
              type="datetime-local"
              isInvalid={Boolean(errors.dateReviewed)}
              {...register("dateReviewed", {
                required: true,
                pattern: isodate_regex,
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.localDateTime && "dateReviewed is required."}
              {errors.itemId?.type === "pattern" &&
                "dateReviewed must be in ISO format"}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Button type="submit" data-testid="MenuItemForm-submit">
            {buttonLabel}
          </Button>
          <Button
            variant="Secondary"
            onClick={() => navigate(-1)}
            data-testid="MenuItemReviewForm-cancel"
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default MenuItemReviewForm;
