/**
 * API To Get Comment Data For Detail Product !
 *
 */
const productId = location.href.split("/detail/")[1];
const commentElement = document.querySelector("#comment");
const commentForm = document.querySelector("#comment-form");

const addCommentBtn = document.querySelector("#add-comment");
const cancelCommentBtn = document.querySelector("#cancel-comment");

const fixedButtonsContainer = document.querySelector(".fixed-buttons");

let loading = true;

const handleAddComment = () => {
  fixedButtonsContainer.querySelector("div").classList.add("active");
};

const handleSubmitComment = e => {
  e.preventDefault();

  const body = commentForm.querySelector("textarea").value;
  if (body.trim() !== "") {
    addComment({ body: body });
  } else {
    alert("올바른 데이터를 입력해주세요.");
  }
};

const addComment = body => {
  console.log("body : ", body);
  console.log("productId : ", productId);
  fetch("http://localhost:5000/api/product/comments/" + productId, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })
    .then(res => {
      console.log(res);
      return res.json();
    })
    .then(data => {
      getComments();
      handleCancelComment();

      //   console.log(data);
      //   console.log("댓글 리로딩 하기 !!");
    })
    .catch(err => console.error(err));
};

const handleCancelComment = () => {
  const isActive = fixedButtonsContainer
    .querySelector("div")
    .classList.contains("active");

  commentForm.querySelector("textarea").value = "";

  if (isActive) {
    fixedButtonsContainer.querySelector("div").classList.remove("active");
  }
  return;
};

const getComments = () => {
  commentElement.innerHTML = "로딩중 ... ";

  fetch("http://localhost:5000/api/product/comments/" + productId)
    .then(res => {
      return res.json();
    })
    .then(data => {
      console.log(data);
      if (data.comments && data.comments.length === 0) {
        // No Comment
        commentElement.innerHTML = `<h3>상품 후기가 없습니다.</h3>`;
      } else {
        console.log(data);
        let resultHtml = "";
        data.comments.forEach(comment => {
          resultHtml += `
                <div class="comment-body">
                <div class="author">
                    <img src="${
                      comment.userId !== null
                        ? `${comment.userId.profileImage}`
                        : ""
                    }" alt="no image">
                    <strong>
                        ${comment.userId.username}
                    </strong>
                </div>
                <div class="body">
                    ${
                      comment.body.length > 50
                        ? comment.body.substring(1, 250) + "... 자세히"
                        : comment.body
                    }
                </div>
                </div>
            `;
        });

        commentElement.innerHTML = resultHtml;
      }
    })
    .catch(err => {
      console.log(err);
      commentElement.innerHTML = "상품 코멘트를 불러 올 수 업습니다.!";
    });
};

if (commentElement) {
  getComments();
}

if (commentForm) {
  addCommentBtn.addEventListener("click", handleAddComment);

  cancelCommentBtn.addEventListener("click", handleCancelComment);

  commentForm
    .querySelector('input[type="submit"]')
    .addEventListener("click", handleSubmitComment);
}
