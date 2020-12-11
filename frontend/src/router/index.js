import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";

// Auth views
import Login from "@/views/auth/Login.vue";
import Register from "@/views/auth/Register.vue";
// Admin views
import PanelAdmin from "@/views/PanelAdmin.vue";
// User views
import UserProfile from "@/views/user/UserProfile.vue";
import UpdateUser from "@/views/user/UpdateUser.vue";
// Posts views
import PostsList from "@/views/posts/PostsList.vue";
// import ShowPost from "@/views/posts/ShowPost.vue";
import AddPost from "@/views/posts/AddPost.vue";
import UpdatePost from "@/views/posts/UpdatePost.vue";

Vue.use(VueRouter);

// middleware pour ne pas acceder au page sans authentification
const guard = (to, from, next) => {
  if (!store.getters["auth/authentificated"]) {
    return next({
      name: "login"
    });
  }
  next();
};

const routes = [
  // Auth routes
  {
    path: "/connexion",
    name: "login",
    component: Login
  },
  {
    path: "/inscription",
    name: "register",
    component: Register
  },
  // Admin routes
  {
    path: "/panel-admin",
    name: "panelAdmin",
    component: PanelAdmin
  },
  // User routes
  {
    path: "/mon-profil",
    name: "userProfile",
    component: UserProfile,
    beforeEnter: guard
  },
  {
    path: "/mon-profil/update",
    name: "updateUser",
    component: UpdateUser,
    beforeEnter: guard
  },
  // Posts routes
  {
    path: "/",
    name: "postsList",
    component: PostsList,
    beforeEnter: guard
  },
  // {
  //   path: "/posts/:postId",
  //   name: "showPost",
  //   component: ShowPost,
  //   beforeEnter: guard
  // },
  {
    path: "/posts/new",
    name: "addPost",
    component: AddPost,
    beforeEnter: guard
  },
  {
    path: "/posts/update/:postId",
    name: "updatePost",
    component: UpdatePost,
    beforeEnter: guard
  },
  // si aucune correspondance : retour dashboard
  { path: "*", redirect: "/" }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
