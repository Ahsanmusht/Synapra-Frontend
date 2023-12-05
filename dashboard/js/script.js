// ################## LOGOUT FUNCTION STARTS HERE !!!!!!!!!!!

function Logout() {
  const URL = "http://localhost:5000/logout";

  // Using Axios for the HTTP request
  axios
    .get(URL)
    .then((res) => {
      localStorage.removeItem('token')
      if (res.data && res.data.message) {
        console.log(res.data.message);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: res.data.message,
        }).then(() => {
          // Introduce a delay of 2 seconds before redirecting to /login

          window.location.href = "/index.html";
        });
      } else {
        console.error("Unexpected response format:", res);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Unexpected response format",
        });
      }
    })
    .catch((err) => {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response.data.message || JSON.stringify(err),
      });
    });
}

// ################## GET BLOGS FUNCTION STARTS HERE !!!!!!!!!!!

async function GetAllBlogs() {
  const URL = "http://localhost:5000/all-blogs";

  try {
    const response = await axios.get(URL);

    const blogs = response.data.Blogs;

    // Get the tbody element
    const tbody = document.getElementById("tbody");

    // Clear existing rows
    tbody.innerHTML = "";

    // Iterate through blogs and append rows to tbody
    blogs.map((blog) => {
      const filename = blog.image.slice(8);
      const row = `<tr>
                        <td>${blog.title}</td>
                        <td>${blog.description}</td>
                        <td><img src="${blog.image}" alt="Blog Image" style="width: 200px; height: 100px;"></td>
                        <td>
                          <button style="margin-bottom: 1rem;" class="btn btn-primary " onclick="editBlog('${blog._id}', '${blog.title}','${blog.description}', '${filename}');"> <i class="fas fa-edit"></i></button>
                          <button class="btn btn-danger " onclick="deleteBlog('${blog._id}')"> <i class="fas fa-trash"></i></button>
                        
                          </td>
                      </tr>`;
      tbody.innerHTML += row;
    });
  } catch (err) {
    console.error(err);

    // Display a more informative error message using Swal
    Swal.fire({
      icon: "error",
      title: "Error",
      text: err.response.data.message
    });
  }
}

// ################## DELETE BLOG FUNCTION STARTS HERE !!!!!!!!!!!

function deleteBlog(id) {
  const URL = `http://localhost:5000/delete-blog/${id}`;

  axios
    .delete(URL)
    .then((res) => {
      if (res.data && res.data.message) {
        // Show success message using Swal
        Swal.fire({
          icon: "success",
          title: "Success",
          text: res.data.message,
        }).then(() => {
          // Refresh the page
          location.reload();
        });
      } else {
        console.error("Unexpected response format:", res);

        // Show error message using Swal with the message from the backend
        Swal.fire({
          icon: "error",
          title: "Error",
          text: res.data.message || "Unexpected response format",
        });
      }
    })
    .catch((err) => {
      // Show error message using Swal
      Swal.fire({
        icon: "error",
        title: "Error",
        text:  err.response.data.message || JSON.stringify(err),
      });
    });
}

// ################## EDIT BLOG FUNCTION STARTS HERE !!!!!!!!!!!


async function editBlog(id, title, description, filename) {
  try {
    // Get the edit form elements
    let editTitleInput = document.getElementById("editTitle");
    let editDescriptionInput = document.getElementById("editDescription");
    let editImageInput = document.getElementById("editImage");
    // Set the existing data to the form inputs
    editTitleInput.value = title;
    editDescriptionInput.value = description;
    editImageInput.files[0] = filename;

    // Show the modal
    $("#editBlogModal").modal("show");

    // Add an event listener to the update button in the modal
    document.getElementById("updateBlogBtn").onclick = async function () {
      try {
        // Get the updated values from the form inputs
        let updatedTitle = editTitleInput.value;
        let updatedDescription = editDescriptionInput.value;
        let updatedImage = editImageInput.files[0];

        // Call the updateBlog function with the new data
        await updateBlog(id, updatedTitle, updatedDescription, updatedImage);

        // Optionally, hide the modal after successful update
        $("#editBlogModal").modal("hide");

        // Refresh the blogs after update
        GetAllBlogs();
      } catch (error) {
        console.error(error);

        // Display an error message using Swal
        Swal.fire({
          icon: "error",
          title: "Error",
          text:  error.response.data.message || "An error occurred during blog update.",
        });
      }
    };
  } catch (error) {
    console.error(error);

    // Display an error message using Swal
    Swal.fire({
      icon: "error",
      title: "Error",
      text:  error.response.data.message || "An error occurred while preparing the edit form.",
    });
  }
}

async function updateBlog(id, title, description, image) {
  const URL = `http://localhost:5000/edit-blog/${id}`;

  const response = await axios.put(
    URL,
    {
      title,
      description,
      image,
    },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  if (response.data && response.data.message) {
    console.log(response.data.message);
    // Show success message using Swal
    Swal.fire({
      icon: "success",
      title: "Success",
      text: response.data.message,
    });
  } else {
    console.error("Unexpected response format:", response);
    // Show error message using Swal with the message from the backend
    Swal.fire({
      icon: "error",
      title: "Error",
      text: response.data.message || "Unexpected response format",
    });
  }
}

// ################## CREATE BLOG FUNCTION STARTS HERE !!!!!!!!!!!

async function PostBlog() {
  try {
    // Get form input values
    let title = document.getElementById("title").value;
    let description = document.getElementById("description").value;
    let imageInput = document.getElementById("image");
    let image = imageInput.files[0];

    // Create FormData object to send as multipart/form-data
    let formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);

    const URL = "http://localhost:5000/create-blog";

    // Make a POST request using axios
    const response = await axios.post(URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Check if the response contains a message
    if (response.data && response.data.message) {
      // Show success message using SweetAlert
      Swal.fire({
        icon: "success",
        title: "Success",
        text: response.data.message,
      }).then(() => {
        // Optionally, perform additional actions after successful post
        // For example, clear the form and refresh the blogs
        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
        imageInput.value = ""; // Reset the file input
        window.location.href = "/dashboard/All-Blogs.html"; // Refresh the blogs
      });
    } else {
      console.error("Unexpected response format:", response);

      // Show error message using SweetAlert with the message from the backend
      Swal.fire({
        icon: "error",
        title: "Error",
        text: response.data.message || "Unexpected response format",
      });
    }
  } catch (error) {
    console.error(error);

    // Show error message using SweetAlert
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.response.data.message || JSON.stringify(error),
    });
  }
}

// ################## FETCH PROFILE DATA FUNCTION STARTS HERE !!!!!!!!!!!

async function Profile(){
  const URL = "http://localhost:5000/profile";

  try {
    const response = await axios.get(URL);

    const user = response.data.user;

    // user.map((user) => {
    //   console.log(user.name);
    // })

    // Get the tbody element
    const AdminName = document.getElementById("AdminName");

    // Clear existing rows
    AdminName.innerHTML = "";

    // Iterate through blogs and append rows to tbody
    user.map((user) => {
      console.log(user.name);
      const row = `
      <span class="mr-2 d-none d-lg-inline text-gray-600 small">${user.name}</span>`;
      AdminName.innerHTML += row;
    });
  } catch (err) {
    console.error(err);

    // Display a more informative error message using Swal
    Swal.fire({
      icon: "error",
      title: "Error",
      text: err.response.data.message
    });
  }
}


async function getAllBlogs() {
  const URL = "http://localhost:5000/all-blogs";

  try {
    const response = await axios.get(URL);

    const blogs = response.data.Blogs;

    // Get the tbody element
    const card = document.getElementById("container");

    // Clear existing rows
    card.innerHTML = "";

    // Iterate through blogs and append rows to tbody
    blogs.map((blog) => {
      console.log(blog);
      const row = `  <div class="blog-card">
      <img src="${blog.image}" alt="Blog Image">
      <div class="blog-card-content">
        <h2>${blog.title}</h2>
        <p>${blog.description}</p>
        <a href="#">Read more</a>
      </div>
    </div>`;
      card.innerHTML += row;
    });
  } catch (err) {
    console.error(err);

    // Display a more informative error message using Swal
    Swal.fire({
      icon: "error",
      title: "Error",
      text: err.response.data.message
    });
  }
}

// ################## END !!!!!!!!!!!