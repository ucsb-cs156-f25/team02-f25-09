
import { Button, Form, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
function RecommendationRequestForm({
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
  
    const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Stryker restore Regex
  return (
    <Form noValidate onSubmit={handleSubmit(submitAction)}>
      <Row>
        {initialContents && (
          <Col>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="id">Id</Form.Label>
              <Form.Control
                data-testid="RecommendationRequestForm-id"
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
            <Form.Label htmlFor="code">Code</Form.Label>
            <Form.Control
              data-testid="RecommendationRequestForm-code"
              id="code"
              type="text"
              isInvalid={Boolean(errors.code)}
              {...register("code", {
                required: true,
              })}
            />
            <Form.Control.Feedback type="invalid">
            {errors.code?.type === "required" ? "Code is required." : null}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="requesterEmail">Requester Email</Form.Label>
            <Form.Control
              data-testid="RecommendationRequestForm-requesterEmail"
              id="requesterEmail"
              type="email"
              isInvalid={Boolean(errors.requesterEmail)}
              {...register("requesterEmail", {
                required: true,
                pattern: email_regex,
              })}
            />
            <Form.Control.Feedback type="invalid">
            {errors.requesterEmail?.type === "required" ? "Requester email is required." : null}
            {errors.requesterEmail?.type === "pattern"  ? "Enter a valid email address." : null}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="professorEmail">Professor Email</Form.Label>
            <Form.Control
              data-testid="RecommendationRequestForm-professorEmail"
              id="professorEmail"
              type="email"
              isInvalid={Boolean(errors.professorEmail)}
              {...register("professorEmail", {
                required: true,
                pattern: email_regex,
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.professorEmail?.type === "required" && "Professor email is required."}
              {errors.professorEmail?.type === "pattern" && "Enter a valid email address."}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="explanation">Explanation</Form.Label>
            <Form.Control
            as="textarea"
            rows={3}
            data-testid="RecommendationRequestForm-explanation"
            id="explanation"
            isInvalid={Boolean(errors.explanation)}
            {...register("explanation", {
                required: true,        // ← removed minLength
            })}
            />
            <Form.Control.Feedback type="invalid">
            {errors.explanation?.type === "required" ? "Explanation is required." : null}
            {/* removed minLength message */}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="dateRequested">Date Requested (ISO)</Form.Label>
            <Form.Control
              data-testid="RecommendationRequestForm-dateRequested"
              id="dateRequested"
              type="datetime-local"
              isInvalid={Boolean(errors.dateRequested)}
              {...register("dateRequested", {
                required: true,
                pattern: isodate_regex,
              })}
            />
            <Form.Control.Feedback type="invalid">
            {errors.dateRequested?.type === "required" ? "Date requested is required." : null}
            {/* {errors.dateRequested?.type === "pattern"  ? "Use ISO format." : null} */}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="dateNeeded">Date Needed (ISO)</Form.Label>
            <Form.Control
              data-testid="RecommendationRequestForm-dateNeeded"
              id="dateNeeded"
              type="datetime-local"
              isInvalid={Boolean(errors.dateNeeded)}
              {...register("dateNeeded", {
                required: true,
                pattern: isodate_regex,
              })}
            />
            <Form.Control.Feedback type="invalid">
            {errors.dateNeeded?.type === "required" ? "Date needed is required." : null}
            {/* {errors.dateNeeded?.type === "pattern"  ? "Use ISO format." : null} */}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md="auto">
          <Form.Check
            type="checkbox"
            id="done"
            label="Done"
            data-testid="RecommendationRequestForm-done"
            {...register("done")}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Button type="submit" data-testid="RecommendationRequestForm-submit">
            {buttonLabel}
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            data-testid="RecommendationRequestForm-cancel"
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
export default RecommendationRequestForm;
