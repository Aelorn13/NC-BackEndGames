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
describe("/api/reviews", () => {
  test("GET - 200: responds with an array of reviews each item in array have required keys and count of comments for each review", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          reviews: expect.any(Array),
        });
        expect(res.body.reviews.length).toBe(13);
        expect(res.body.reviews).toBeSortedBy("created_at", {
          descending: true,
        });

        res.body.reviews.forEach((review) => {
          expect(review).toEqual({
            review_id: expect.any(Number),
            title: expect.any(String),
            owner: expect.any(String),
            category: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            designer: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
});
describe("/api/reviews/:review_id", () => {
  test("GET - 200: responds with a review object", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then((res) => {
        expect(res.body.review).toEqual({
          review_id: 1,
          title: "Agricola",
          review_body: "Farmyard fun!",
          owner: "mallionaire",
          category: "euro game",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          created_at: "2021-01-18T10:00:20.514Z",
          votes: 1,
          designer: "Uwe Rosenberg",
        });
      });
  });
  test("GET:404 sends an appropriate error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/reviews/999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("review does not exist");
      });
  });
  test("GET:400 sends an appropriate error message when given an invalid id", () => {
    return request(app)
      .get("/api/reviews/one")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid id");
      });
  });
});
describe("/api/reviews/:review_id/comments", () => {
  test("GET - 200: responds with an array of comments", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          comments: expect.any(Array),
        });
        expect(res.body.comments.length).toBe(3);
        expect(res.body.comments).toBeSortedBy("created_at");
        res.body.comments.forEach((review) => {
          expect(review).toEqual({
            comment_id: expect.any(Number),
            review_id: expect.any(Number),
            body: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          });
        });
      });
  });
  test("GET:404 sends an appropriate error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/reviews/999/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("review does not exist");
      });
  });
  test("GET:400 sends an appropriate error message when given an invalid id", () => {
    return request(app)
      .get("/api/reviews/one/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid id");
      });
  });
});
