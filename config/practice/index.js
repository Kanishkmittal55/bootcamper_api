console.log("Crash Course on Call Backs, promises");
const posts = [
  { title: "Post One", body: "This is post One" },
  { title: "Post Two", body: "This is post Two" }
];

function getPosts() {
  setTimeout(function () {
    let output = "";
    posts.forEach((post, index) => {
      output += `<li>${post.title}</li>`;
    });
    document.body.innerHTML = output;
  }, 1000 * 1);
}

function createPost(post) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      posts.push(post);

      const error = false;

      if (!error) {
        resolve(
          posts.map((post) => {
            console.log(post.title);
          })
        );
      } else {
        reject("Error : Something went wrong.");
      }
    }, 2000);
  });
}

createPost({ title: "Post 3", body: "This is post three." }).then(getPosts);

// getPosts();
