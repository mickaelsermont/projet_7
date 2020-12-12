<template>
    <div>
        <!-- <router-link :to="{ name: 'showMedia', params: {mediaId: media.id } }"> -->
        <b-card no-body class="post_card">
            <template #header>
                <b-media class="p-0">
                    <template #aside vertical-align="center" class="mb-1">
                        <b-img :src="post.User.imgUrl" width="48" height="48" :alt="post.User.fullname" rounded></b-img>
                    </template>

                    <h5 class="mt-0 mb-0">{{ post.User.fullname }}</h5>
                    <em class="mb-0">{{ post.createdAt | moment("from", "now") }}</em>

                    <p left class="mt-2 mb-0">{{ post.text }}</p>
                </b-media>
            </template>
            
            <!-- image of post card -->
            <b-img-lazy :src="post.mediaUrl" fluid-grow alt="Fluid-grow image"></b-img-lazy>

            <template #footer>
                <div class="line_post">
                    <a href="#" class="card-link">
                        <div class="like_button">
                            <b-icon class="mr-1" icon="heart" font-scale="1.3"></b-icon>
                            <span class="pl-1">J'aime</span>
                        </div>
                    </a>
                    
                    <span>{{ post.countLikes }} likes | {{ reviews.length }} commentaires</span>
                </div>
                <!-- <hr v-if="reviews.length > 0"> -->
                <hr>
                <!-- List comments -->
                <b-media v-for="review in reviews" :key="review.id">
                    <template #aside>
                        <!-- <b-img :src="review.User.imgUrl" width="64" :alt="review.User.fullname"></b-img> -->
                        <b-img :src="review.User.imgUrl" width="40" height="40" :alt="review.User.fullname" rounded></b-img>
                    </template>

                    <h6 class="m-0">{{ review.User.fullname }}</h6>
                    <p>{{ review.text }}</p>
                </b-media>

                <!-- Form for to add comment -->
                <b-media v-for="review in reviews" :key="review.id">
                    <template #aside>
                        <!-- <b-img :src="review.User.imgUrl" width="64" :alt="review.User.fullname"></b-img> -->
                        <b-img :src="review.User.imgUrl" width="40" height="40" :alt="review.User.fullname" rounded></b-img>
                    </template>

                    <h6 class="m-0">{{ review.User.fullname }}</h6>
                    <p>{{ review.text }}</p>
                </b-media>
            
            </template>
        </b-card>
    </div>
</template>

<script>
    export default {
        name: "PostCard",
        props: ['post', 'reviews']
    };
</script>

<style lang="scss" scoped>
.post_card {
    /* border: 0px!important; */
    border-radius: 9px;
    overflow: hidden;
    margin-bottom: 14px;
}
.like_button, .line_post {
    display: flex;
    flex-direction: row;
    align-items: center;
}
.line_post {
    justify-content: space-between;
}
.card-header, .card-footer {
    background-color: rgba(0,0,0,0.01)!important;
}
</style>
