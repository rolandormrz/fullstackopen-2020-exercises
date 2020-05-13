const listHelper = require('../utils/listHelper');

const listWithOneBlog = [
  {
    title: "The Best Blog",
    author: "Koopa",
    url: "google.com",
    likes: 242,
    id: "5ebb12f89c6be8aebbc49f80"
  }
];

const listWithManyBlogs = [
  ...listWithOneBlog,
  {
    title: "The Second Best Blog",
    author: "Bob",
    url: "google.com",
    likes: 212,
    id: "7eb247f89c6be8aebbc25f80"
  },
  {
    title: "The Cool guys Blog",
    author: "Bob",
    url: "google.com",
    likes: 2200,
    id: "9eb555f89c6ut8aehjj25f80"
  },
  {
    title: "King of Blogs",
    author: "Joba",
    url: "google.com",
    likes: 2000,
    id: "dfjfio435325263262246922"
  }
];

test('dummy returns one', () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe('total likes', () => {
  test("list with one blog should equal the blog's total likes", () => {
    const result = listHelper.totalLikes(listWithOneBlog);

    expect(result).toBe(242);
  });

  test("list with no blogs should return 0", () => {
    expect(listHelper.totalLikes([])).toBe(0);
  });

  test("list with many blogs should equal the sum of each blog's total likes", () => {
    const result = listHelper.totalLikes(listWithManyBlogs);

    expect(result).toBe(4654);
  });
});

describe('favorite blog', () => {
  test('list with no blogs should return empty object', () => {
    expect(listHelper.favoriteBlog([])).toEqual({});
  });

  test('list with one blog should return the blog', () => {
    expect(listHelper.favoriteBlog(listWithOneBlog)).toEqual(listWithOneBlog[0]);
  });

  test('list with many blogs should return the list with most likes', () => {
    expect(listHelper.favoriteBlog(listWithManyBlogs)).toEqual(listWithManyBlogs[2]);
  });

});

describe('most blogs', () => {
  test('list with no blogs should return empty object', () => {
    expect(listHelper.mostBlogs([])).toEqual({});
  });

  test('list with one blog should return the author and blog equal to 1', () => {
    expect(listHelper.mostBlogs(listWithOneBlog)).toEqual({ author: "Koopa", blogs: 1 });
  });

  test('list with many blogs should return the author with the most blogs and the number of blogs they have made', () => {
    expect(listHelper.mostBlogs(listWithManyBlogs)).toEqual( { author: "Bob", blogs: 2 });
  });
});

describe('most likes', () => {
  test('list with no blogs should return empty object', () => {
    expect(listHelper.mostLikes([])).toEqual({});
  });

  test('list with one blog should return the author and his likes', () => {
    expect(listHelper.mostLikes(listWithOneBlog)).toEqual({ author: "Koopa", likes: 242 });
  });

  test('list with many blogs should return the author with the most likes across all the blogs and the total number of likes', () => {
    expect(listHelper.mostLikes(listWithManyBlogs)).toEqual({ author: "Bob", likes: 2412 });
  });
});

