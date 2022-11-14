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
  test("GET - 200: responds with an array of categories each item in array have slug and decription keys", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          categories: expect.any(Array),
        });
        expect(res.body.categories.length).toBe(4);
        res.body.categories.forEach((category) => {
          expect(category).toEqual({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});
describe("/api/not-a-real-path", () => {
  test("GET - 404: responds with an error message if asking for non-existent path", () => {
    return request(app)
      .get("/api/not-a-real-path")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Route not found");
      });
  });
});
