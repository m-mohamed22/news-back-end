const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => seed(testData));

afterAll(() => {
  if (db.end) db.end();
});

describe("1. GET/api/topics", () => {
  test("status:200, responds with an array of topics objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toBeInstanceOf(Array);
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
  test("Status:404 returns an error message when path is not found", () => {
    return request(app)
      .get("/api/topiks")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Error, path not found");
      });
  });
});

describe("2. GET/api/articles/:article_id", () => {
  test("Status:200, responds with an article object", () => {
    const article_id = 3;
    const time = new Date(1604394720000).toISOString();
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(200)
      .then(({ body }) => {
        const thirdArticle = {
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: time,
          votes: 0,
        };
        expect(body.article).toMatchObject(thirdArticle);
      });
  });
  test("Status:404 returns an error message if article that could exist but does not", () => {
    return request(app)
      .get("/api/articles/888")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID not found");
      });
  });
});

describe("3: PATCH /api/articles/:article_id", () => {
  test("Status:200, responds with the updated article when vote is incremented", () => {
    const time = new Date(1604394720000).toISOString();
    const updatedArticle = {
      article_id: 3,
      title: "Eight pug gifs that remind me of mitch",
      topic: "mitch",
      author: "icellusedkars",
      body: "some gifs",
      created_at: time,
      votes: 1,
    };
    const newVote = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/3")
      .send(newVote)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(updatedArticle);
      });
  });
  test("Status:200, responds with the updated article when vote is decremented", () => {
    //  const time = new Date(1594329060000).toISOString();
    const time = "2020-07-09T20:11:00.000Z";
    const updatedArticle = {
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: time,
      votes: 0,
    };
    const newVote = { inc_votes: -100 };
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(updatedArticle);
      });
  });
  test("Status:404 returns an error message if article is not found", () => {
    //  const requestBody = { inc_votes: 0 };
    return (
      request(app)
        .patch("/api/articles/888")
        // .send(requestBody)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article ID 888 does not exist");
        })
    );
  });
  test("Status:400 returns an error message if incorrect data type is entered on path", () => {
    return request(app)
      .patch("/api/articles/incorrectData")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("Status:400 returns an error message if user enters incorrect or missing data", () => {
    const emptyVote = { inc_votes: "wrongdata" };
    return request(app)
      .patch("/api/articles/1")
      .send(emptyVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("6. GET/api/users", () => {
  test("status:200, responds with an array of objects with the property username", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });

  test("Status:404 returns an error message when path is not found", () => {
    return request(app)
      .get("/api/ucers")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Error, path not found");
      });
  });
});
