const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const {
  userData,
  monthlyExpenseData,
  transactionData,
  tagData,
} = require("../db/test-data/index");
const endpointsData = require("../endpoints.json");

beforeEach(() =>
  seed({ userData, monthlyExpenseData, transactionData, tagData })
);
afterAll(() => db.end());

describe("/not-a-route", () => {
  it("GET:404 responds with not found", () => {
    return request(app).get("/not-a-route").expect(404);
  });
});

describe("/api", () => {
  it("GET:200 responds with an object detailing all of the available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsData);
      });
  });
});

describe("/api/user/:user_id", () => {
  it("GET:200 responds with all of the users data", () => {
    return request(app)
      .get("/api/user/1")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toMatchObject({
          username: "jimmy4000",
          password: expect.any(String),
          fname: "Jimmy",
          income: expect.any(Number),
          savings_target: expect.any(Number),
          mandatory_spend: expect.any(Number),
          disposable_spend: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
});
