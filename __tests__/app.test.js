const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index");
const endpoints = require("../endpoints.json");
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
        expect(res.body.reviews[0].total_count).toBe(13);
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
            comment_count: expect.any(Number),
            total_count: expect.any(Number),
          });
        });
      });
  });
  test("GET - 200: responds with an empty array if category does not have any reviews", () => {
    return request(app)
      .get("/api/reviews?category=children's+games")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          reviews: expect.any(Array),
        });
        expect(res.body.reviews.length).toBe(0);
      });
  });

  test("GET - 404: sends an appropriate error message when given a category that does not exist", () => {
    return request(app)
      .get("/api/reviews?category=BLAHBLAHBLAH")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("category does not exist");
      });
  });

  test("GET - 200: responds with an array of reviews each item in array have required keys and count of comments for each review using specific category query", () => {
    return request(app)
      .get("/api/reviews?category=dexterity")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          reviews: expect.any(Array),
        });
        expect(res.body.reviews.length).toBe(1);
        expect(res.body.reviews).toBeSortedBy("created_at", {
          descending: true,
        });
        res.body.reviews.forEach((review) => {
          expect(review).toEqual({
            review_id: expect.any(Number),
            title: expect.any(String),
            owner: expect.any(String),
            category: "dexterity",
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            designer: expect.any(String),
            comment_count: expect.any(Number),
            total_count: expect.any(Number),
          });
        });
      });
  });
  test("GET - 200: responds with an array of reviews each item in array have required keys and count of comments for each review using order query", () => {
    return request(app)
      .get("/api/reviews?order=ASC")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          reviews: expect.any(Array),
        });
        expect(res.body.reviews[0].total_count).toBe(13);
        expect(res.body.reviews).toBeSortedBy("created_at", {
          descending: false,
        });
      });
  });

  test("GET - 200: responds with an array of reviews each item in array have required keys and count of comments for each review using sort by query", () => {
    return request(app)
      .get("/api/reviews?sort_by=category")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          reviews: expect.any(Array),
        });
        expect(res.body.reviews[0].total_count).toBe(13);
        expect(res.body.reviews).toBeSortedBy("category", {
          descending: true,
        });
      });
  });
  test("GET - 200: responds with an array of reviews each item in array have required keys and count of comments for each review using limit and p query", () => {
    return request(app)
      .get("/api/reviews?sort_by=category&limit=2&p=6")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          reviews: expect.any(Array),
        });
        expect(res.body.reviews.length).toBe(1);
        expect(res.body.reviews[0].total_count).toBe(13);
        expect(res.body.reviews).toBeSortedBy("category", {
          descending: true,
        });
      });
  });
  test("GET - 200: responds with an array of reviews each item in array have required keys and count of comments for each review using all queries possible", () => {
    return request(app)
      .get("/api/reviews?category=social+deduction&order=ASC&sort_by=category")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          reviews: expect.any(Array),
        });
        expect(res.body.reviews[0].total_count).toBe(11);
        expect(res.body.reviews).toBeSortedBy("category", {
          descending: false,
        });
        res.body.reviews.forEach((review) => {
          expect(review).toEqual({
            review_id: expect.any(Number),
            title: expect.any(String),
            owner: expect.any(String),
            category: "social deduction",
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            designer: expect.any(String),
            comment_count: expect.any(Number),
            total_count: expect.any(Number),
          });
        });
      });
  });

  test("GET - 400: INVALID ORDER QUERY", () => {
    return request(app)
      .get("/api/reviews?order=blahblahblah")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid order query");
      });
  });

  test("GET - 400: INVALID SORT QUERY", () => {
    return request(app)
      .get("/api/reviews?sort_by=blahblahblah")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid sort query");
      });
  });

  test("POST - 201: adds new review to table and returns added object", () => {
    const newReview = {
      title: "this is a title",
      owner: "mallionaire",
      review_body: "good one",
      designer: "designer",
      category: "dexterity",
    };
    return request(app)
      .post("/api/reviews/")
      .send(newReview)
      .expect(201)
      .then((res) => {
        expect(res.body.review).toEqual({
          review_id: expect.any(Number),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(Number),
          review_img_url: expect.any(String),
          ...newReview,
        });
      });
  });
  test("POST - 406: returns an error message if request misses key values", () => {
    const newReview = {
      owner: "mallionaire",
      review_body: "good one",
      designer: "designer",
      category: "dexterity",
    };
    return request(app)
      .post("/api/reviews/")
      .send(newReview)
      .expect(406)
      .then((res) => {
        expect(res.body.msg).toBe("body misses required keys");
      });
  });
  test("POST - 404: returns an error message if user with this username doest not exist", () => {
    const newReview = {
      title: "this is a title",
      owner: "bublgum",
      review_body: "good one",
      designer: "designer",
      category: "dexterity",
    };
    return request(app)
      .post("/api/reviews/")
      .send(newReview)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("User does not exist");
      });
  });
  test("POST - 404: returns an error message if category doest not exist", () => {
    const newReview = {
      title: "this is a title",
      owner: "mallionaire",
      review_body: "good one",
      designer: "designer",
      category: "NONEXISTENTONE",
    };
    return request(app)
      .post("/api/reviews/")
      .send(newReview)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("category does not exist");
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
          comment_count: 0,
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
  test("PATCH - 200: responds with updated object", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: 5 })
      .expect(200)
      .then((res) => {
        expect(res.body.review.votes).toBe(6);
      });
  });
  test("PATCH - 400: sends an appropriate error message when given an invalid id", () => {
    return request(app)
      .patch("/api/reviews/one")
      .send({ inc_votes: 5 })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid id");
      });
  });
  test("PATCH - 404: sends an appropriate error message when given a valid but non-existent id", () => {
    return request(app)
      .patch("/api/reviews/999999")
      .send({ inc_votes: 5 })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("review does not exist");
      });
  });
  test("PATCH - 406: responds with error message if body does not have inc_votes key", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_catttes: 5 })
      .expect(406)
      .then((res) => {
        expect(res.body.msg).toBe("body misses required keys");
      });
  });
  test("PATCH - 406: responds with error message if body does not have inc_votes key or it is not a number", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: "five" })
      .expect(406)
      .then((res) => {
        expect(res.body.msg).toBe("body misses required keys");
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
            review_id: 2,
            body: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          });
        });
      });
  });
  test("GET - 200: responds with an empty array if reviews does not have any comments", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          comments: expect.any(Array),
        });
        expect(res.body.comments.length).toBe(0);
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
  test("POST - 201: adds new comment to table and returns added object", () => {
    const newComment = {
      username: "mallionaire",
      body: "good one",
    };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(newComment)
      .expect(201)
      .then((res) => {
        expect(res.body.comment).toEqual({
          comment_id: expect.any(Number),
          created_at: expect.any(String),
          votes: expect.any(Number),
          review_id: 1,
          author: newComment.username,
          body: newComment.body,
        });
      });
  });
  test("POST - 406: returns an error message if request misses key values", () => {
    const newComment = {
      username: "mallionaire",
      notAbody: "good one",
    };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(newComment)
      .expect(406)
      .then((res) => {
        expect(res.body.msg).toBe("body misses required keys");
      });
  });
  test("POST - 404: returns an error message if user with this username doest not exist", () => {
    const newComment = {
      username: "literallyNoOne",
      body: "good one",
    };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(newComment)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("User does not exist");
      });
  });
});
describe("/api/users", () => {
  test("GET - 200: responds with an array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          users: expect.any(Array),
        });
        expect(res.body.users.length).toBe(4);
        res.body.users.forEach((review) => {
          expect(review).toEqual({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});
describe("/api/comments/:comment_id", () => {
  test("DELETE:204 deletes the specified comment and sends no body back", () => {
    return request(app).delete("/api/comments/3").expect(204);
  });
  test("DELETE:404 responds with an appropriate error message when given a non-existent id", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("comment does not exist");
      });
  });
  test("DELETE:400 responds with an appropriate error message when given an invalid id", () => {
    return request(app)
      .delete("/api/comments/one")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid id");
      });
  });
  test("PATCH - 200: responds with updated object", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 5 })
      .expect(200)
      .then((res) => {
        expect(res.body.comment.votes).toBe(21);
      });
  });
  test("PATCH - 400: sends an appropriate error message when given an invalid id", () => {
    return request(app)
      .patch("/api/comments/one")
      .send({ inc_votes: 5 })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid id");
      });
  });
  test("PATCH - 404: sends an appropriate error message when given a valid but non-existent id", () => {
    return request(app)
      .patch("/api/comments/999999")
      .send({ inc_votes: 5 })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("comment does not exist");
      });
  });
  test("PATCH - 406: responds with error message if body does not have inc_votes key", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_catttes: 5 })
      .expect(406)
      .then((res) => {
        expect(res.body.msg).toBe("body misses required keys");
      });
  });
  test("PATCH - 406: responds with error message if body does not have inc_votes key or it is not a number", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: "five" })
      .expect(406)
      .then((res) => {
        expect(res.body.msg).toBe("body misses required keys");
      });
  });
});
describe("/api/", () => {
  test("GET - 200: responds with an object of endpoints", () => {
    return request(app)
      .get("/api/")
      .expect(200)
      .then((res) => {
        expect(res.body.endpoints).toEqual(endpoints);
      });
  });
});
describe("/api/health", () => {
  test("GET - 200: responds with a message that server works", () => {
    return request(app)
      .get("/api/health")
      .expect(200)
      .then((res) => {
        expect(res.body.msg).toBe("server up and running");
      });
  });
});
describe("/api/users/:username", () => {
  test("GET - 200: responds a user object", () => {
    return request(app)
      .get("/api/users/mallionaire")
      .expect(200)
      .then((res) => {
        expect(res.body.user).toEqual({
          username: "mallionaire",
          name: "haz",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
      });
  });
  test("GET - 404: responds with an appropriate error message when given a non-existent id", () => {
    return request(app)
      .get("/api/users/blahblahblah")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("user does not exist");
      });
  });
});
