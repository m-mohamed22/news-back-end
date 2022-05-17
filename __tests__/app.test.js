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
});

describe("Status: 404", () => {
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
});
