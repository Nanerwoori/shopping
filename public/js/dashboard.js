const forms = document.querySelectorAll(".form-delete");

function handleDeleteProduct(e) {
  e.preventDefault();
  const target = this.parentNode.parentNode.parentNode;
  const productId = this.parentNode.querySelector('input[name="productId"]')
    .value;

  // delete mehtod do not have body
  fetch(`/api/product/delete/${productId}`, {
    method: "DELETE",
    headers: {}
  })
    .then(result => {
      return result.json();
    })
    .then(data => {
      target.remove();
      console.log(data);
    })
    .catch(err => console.log(err));
}

if (forms) {
  forms.forEach(form => {
    form
      .querySelector('button[type="submit"]')
      .addEventListener("click", handleDeleteProduct);
  });
}
