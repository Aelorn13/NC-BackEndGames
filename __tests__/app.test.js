const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index");
afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(data);
});

describe("/api/categories", () => {
  test("GET - 200: responds with an array of categories", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          categories: expect.any(Array),
        });
      });
  });
});
