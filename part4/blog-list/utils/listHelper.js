const dummy = blogs => {
  return 1;
};

const totalLikes = blogPosts => {
  return blogPosts.reduce((sum, current) => sum + current.likes, 0);
};

const favoriteBlog = blogPosts => {
  if(blogPosts.length === 0) {
    return {};
  }

  let mostLikes = 0;
  for(let i = 1; i < blogPosts.length; i++) {
    if(blogPosts[i].likes > blogPosts[mostLikes].likes) {
      mostLikes = i;
    }
  }

  return blogPosts[mostLikes];
};

const mostBlogs = blogPosts => {
  if(blogPosts.length === 0) {
    return {};
  }

  const map = {};

  blogPosts.forEach(blog => {
    if(map[blog.author]) {
      map[blog.author]++;
    }
    else {
      map[blog.author] = 1;
    }
  });

  const keys = Object.keys(map);

  let authorWithMostBlogs = 0;

  for(let i = 1; i < keys.length; i++) {
    if(map[keys[i]] > map[keys[authorWithMostBlogs]]) {
      authorWithMostBlogs = i;
    }
  }
  
  return { author: keys[authorWithMostBlogs], blogs: map[keys[authorWithMostBlogs]] };
};

const mostLikes = blogPosts => {
  if(blogPosts.length === 0) {
    return {};
  }

  const map = {};

  blogPosts.forEach(blog => {
    if(map[blog.author]) {
      map[blog.author] += blog.likes;
    }
    else {
      map[blog.author] = blog.likes;
    }
  });

  const keys = Object.keys(map);

  let authorWithMostLikes = 0;

  for(let i = 1; i < keys.length; i++) {
    if(map[keys[i]] > map[keys[authorWithMostLikes]]) {
      authorWithMostLikes = i;
    }
  }

  return { author: keys[authorWithMostLikes], likes: map[keys[authorWithMostLikes]] };
};


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
    likes: 22,
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


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};