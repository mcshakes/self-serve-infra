import { describe, expect, it } from "vitest";
import app from "../../src/app.ts";
import request from "supertest";

describe("integration tests for environment api", () => {
  describe("POST /environments", () => {
    const validPayload = {
        name: 'dev-sandbox',
        template: 'ubuntu-vm',
        region: 'us-east-1',
        instanceType: 't3.micro',
        instanceCount: 1,
    };

    it("creates new Environment", async () => {
      const response = await request(app)
        .post("/api/environments")
        .send(validPayload)

      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      expect(response.status).toBe(201);

      expect(response.body).toEqual({
          success: true,
          jobId: expect.stringMatching(uuidRegex),
          data: {
            ...validPayload,
            uuid: expect.stringMatching(uuidRegex),
            status: 'pending',
            createdAt: expect.any(String),
          },
      });
      expect(new Date(response.body.data.createdAt).toISOString()).toBe(response.body.data.createdAt);

    });

    it("creates a queued provision job linked to the environment", async () => {
      const createResponse = await request(app)
        .post("/api/environments")
        .send(validPayload);

      expect(createResponse.status).toBe(201);

      const environmentId = createResponse.body.data.uuid;
      const jobId = createResponse.body.jobId;

      const jobResponse = await request(app).get(`/api/jobs/${jobId}`);

      expect(jobResponse.status).toBe(200);
      expect(jobResponse.body).toEqual({
        success: true,
        data: {
          uuid: jobId,
          environmentId,
          type: "provision",
          status: "queued",
          createdAt: expect.any(String),
        },
      });
    });

    it.each([
       {
         scenario: "missing name",
         payload: { ...validPayload, name: undefined },
         expectedStatus: 400,
       },
       {
         scenario: "empty name string",
         payload: { ...validPayload, name: "" },
         expectedStatus: 400,
       },
       {
         scenario: "missing template",
         payload: { ...validPayload, template: undefined },
         expectedStatus: 400,
       },
       {
         scenario: "missing region",
         payload: { ...validPayload, region: undefined },
         expectedStatus: 400,
       },
       {
         scenario: "missing instanceType",
         payload: { ...validPayload, instanceType: undefined },
         expectedStatus: 400,
       },
       {
         scenario: "instanceCount is 0",
         payload: { ...validPayload, instanceCount: 0 },
         expectedStatus: 400,
       },
       {
         scenario: "instanceCount is negative",
         payload: { ...validPayload, instanceCount: -2 },
         expectedStatus: 400,
       },
       {
         scenario: "instanceCount is not a number",
         payload: { ...validPayload, instanceCount: "two" },
         expectedStatus: 400,
       },
       {
         scenario: "empty request body",
         payload: {},
         expectedStatus: 400,
       },
     ])(
       "returns $expectedStatus when $scenario",
       async ({ payload, expectedStatus }) => {
         const response = await request(app)
           .post("/api/environments")
           .send(payload);

         expect(response.status).toBe(expectedStatus);
         expect(response.body.error || response.body.errors).toBeDefined();
       }
     );
  });
});
