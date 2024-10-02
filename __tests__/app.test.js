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
          user_id: expect.any(Number),
          email: "jimmy4000@gmail.com",
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
  it("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/user/999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("NOT FOUND");
      });
  });
  it("GET:400 sends an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .get("/api/user/jhvkjhbkh")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("BAD REQUEST");
      });
  });
  it("PATCH:201 responds with the edited user", () => {
    const newEmail = { email: "whopper@gmail.com" };
    return request(app)
      .patch("/api/user/1")
      .send(newEmail)
      .expect(201)
      .then(
        ({
          body: {
            user: { email },
          },
        }) => {
          expect(email).toBe("whopper@gmail.com");
        }
      );
  });
  it("PATCH:201 responds with the edited user when the patch request contains multiple values", () => {
    const newEmail = {
      email: "bigmac@gmail.com",
      income: 9999,
      password: "H0oD3ini£",
    };
    return request(app)
      .patch("/api/user/1")
      .send(newEmail)
      .expect(201)
      .then(
        ({
          body: {
            user: { email, income, password },
          },
        }) => {
          expect(email).toBe("bigmac@gmail.com");
          expect(income).toBe(9999);
          expect(password).toBe("H0oD3ini£");
        }
      );
  });
  it("PATCH:400 responds with bad request if email, password or name are invalid", () => {
    const badEmail = { email: "notanemailaddress.net" };
    const badPass = { password: 123 };
    const badName = { fname: '%%^%£"£$%^$' };
    const emailTest = request(app)
      .patch("/api/user/2")
      .expect(400)
      .send(badEmail)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("BAD REQUEST");
      });
    const passTest = request(app)
      .patch("/api/user/2")
      .expect(400)
      .send(badPass)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("BAD REQUEST");
      });
    const nameTest = request(app)
      .patch("/api/user/2")
      .expect(400)
      .send(badName)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("BAD REQUEST");
      });
    return Promise.all([emailTest, passTest, nameTest]);
  });
  it("PATCH:400 responds with bad request when passed multiple invalid values", () => {
    const requestBody = {
      email: "notanemailaddress.net",
      password: "fsdfsf",
      name: 12345,
    };
    return request(app)
      .patch("/api/user/2")
      .expect(400)
      .send(requestBody)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("BAD REQUEST");
      });
  });
  it("PATCH:400 responds with bad request when passed an invalid property", () => {
    const requestBody = {
      shoeSize: 9,
      email: "shoeKing@outlook.com",
    };
    return request(app)
      .patch("/api/user/2")
      .expect(400)
      .send(requestBody)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("BAD REQUEST");
      });
  });
  it("PATCH:404 responds with not found when passed a non existent user_id", () => {
    const requestBody = {
      email: "shoeKing@outlook.com",
    };
    return request(app)
      .patch("/api/user/9999")
      .expect(404)
      .send(requestBody)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("NOT FOUND");
      });
  });
  it("DELETE:204 deletes the specified user", () => {
    return request(app)
      .delete("/api/user/3")
      .expect(204)
      .then(() => {
        return request(app).get("/api/user/3").expect(404);
      })
      .then(({ body: { msg } }) => {
        expect(msg).toBe("NOT FOUND");
      });
  });
  it("DELETE:400 responds with bad request for an invalid user_id", () => {
    return request(app)
      .delete("/api/user/imnotarealuser")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("BAD REQUEST");
      });
  });
});

describe("/api/user", () => {
  it("POST:201 responds with the newly created user", () => {
    const requestBody = {
      email: "markimoo55@gmail.com",
      password: "Jwisper5$",
      fname: "Mark",
    };
    return request(app)
      .post("/api/user")
      .expect(201)
      .send(requestBody)
      .then(({ body: { user } }) => {
        expect(user).toMatchObject({
          user_id: 4,
          email: "markimoo55@gmail.com",
          password: "Jwisper5$",
          fname: "Mark",
          income: 0,
          savings_target: 0,
          mandatory_spend: 0,
          disposable_spend: 0,
          created_at: expect.any(String),
        });
      });
  });
  it("POST:400 responds with appropriate error message if bad request body", () => {
    const requestBody = {
      email: "marki55@gmail.com",
      fname: "Marko",
    };
    return request(app)
      .post("/api/user")
      .expect(400)
      .send(requestBody)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("BAD REQUEST");
      });
  });
  it("POST:201 ignores unnecessary properties on the request body", () => {
    const requestBody = {
      email: "marki55@gmail.com",
      password: "Jwisper5$",
      fname: "Marko",
      banana: true,
      giveMoney: "yes",
      income: 10000000000,
    };
    return request(app)
      .post("/api/user")
      .expect(201)
      .send(requestBody)
      .then(({ body: { user } }) => {
        expect(user).toMatchObject({
          user_id: 4,
          email: "marki55@gmail.com",
          password: "Jwisper5$",
          fname: "Marko",
          income: 0,
          savings_target: 0,
          mandatory_spend: 0,
          disposable_spend: 0,
          created_at: expect.any(String),
        });
      });
  });
  it("POST:400 responds with appropriate error message if values do not satisfy validation regex", () => {
    const invalidEmail = {
      email: 333,
      password: "Pa5$word",
      fname: "Mark",
    };
    const invalidPass = {
      email: "markimoo55@gmail.com",
      password: "password123",
      fname: "Mark",
    };
    const invalidName = {
      email: "markimoo55@gmail.com",
      password: "Pa5$word",
      fname: "$$$",
    };
    const emailTest = request(app)
      .post("/api/user")
      .expect(400)
      .send(invalidEmail)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("BAD REQUEST");
      });
    const passTest = request(app)
      .post("/api/user")
      .expect(400)
      .send(invalidPass)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("BAD REQUEST");
      });
    const nameTest = request(app)
      .post("/api/user")
      .expect(400)
      .send(invalidName)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("BAD REQUEST");
      });
    return Promise.all([emailTest, nameTest, passTest]);
  });
  it("POST:409 responds with an appropriate message if email is already taken", () => {
    const requestBody = {
      email: "jimmy4000@gmail.com",
      password: "Jwisper5$",
      fname: "josh",
    };
    return request(app)
      .post("/api/user")
      .expect(409)
      .send(requestBody)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("EMAIL TAKEN");
      });
  });
});

describe("/api/user/:user_id/transactions", () => {
  it("GET:200 responds with a list of transactions for the specified user", () => {
    return request(app)
      .get("/api/user/1/transactions")
      .expect(200)
      .then(({ body: { transactions } }) => {
        expect(transactions.length).toBe(4);
        transactions.forEach((transaction) => {
          expect(transaction.description).toBe(undefined);
          expect(transaction).toMatchObject({
            transaction_id: expect.any(Number),
            name: expect.any(String),
            cost: expect.any(Number),
            img_url: expect.toBeOneOf([expect.any(String), null]),
            created_at: expect.any(String),
            user_id: expect.any(Number),
          });
        });
      });
  });
  it("GET:400 responds with bad request for an invalid user_id", () => {
    return request(app)
      .get("/api/user/fakeuser/transactions")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("BAD REQUEST");
      });
  });
  it("GET:404 responds with not found for a valid but non-existent user_id", () => {
    return request(app)
      .get("/api/user/999/transactions")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("NOT FOUND");
      });
  });
  it("GET:200 responds with an empty array for a valid user with no transactions", () => {
    return request(app)
      .get("/api/user/2/transactions")
      .expect(200)
      .then(({ body: { transactions } }) => {
        expect(transactions).toEqual([]);
      });
  });
});
