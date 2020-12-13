<template>
    <div>
        <b-card class="mb-6">
            <h4>Modification de la publication</h4>
            <hr>
            <b-alert show fade variant="danger" v-if="error"> {{ error }}</b-alert>
            <!-- Create Item Form -->
            <b-form @submit.prevent="editPost" enctype="multipart/form-data">
                <!-- Image preview -->
                <div class="mb-3" id="preview">
                    <img :src="imgPreview ? imgPreview : post.mediaUrl" />
                </div>

                <!-- Image input -->
                <label class="custom-file-upload">
                    <input 
                        type="file"
                        ref="file"
                        class="inputFile"
                        id="file-upload"
                        @change="selectFile"
                    />
                    <b-icon class="mr-1" icon="image-fill" font-scale="1.2"></b-icon> Ajouter une image
                </label>

                <!-- Text input -->
                <b-form-input
                    id="form-text"
                    placeholder="Entrer un texte"
                    v-model="text"
                    type="text"
                ></b-form-input>

                <!-- Submit Button -->
                <b-button class="float-right mt-2" type="submit" variant="primary">Modifier</b-button>
            </b-form>
        </b-card>
    </div>
</template>

<script>
    import axios from "axios"

    export default {
        data () {
            return {
                post: {},
                text: '',
                imgPreview: '',
                file: '',
                error: ''
            }
        },
        methods: {
            selectFile() {
                this.file = this.$refs.file.files[0];
                this.imgPreview = URL.createObjectURL(this.file);
            },
            async editPost() {
                const formData = new FormData();
                formData.append('file', this.file);
                formData.append('text', this.text);

                try {
                    let response = await axios.put("posts/"+this.$route.params.postId, formData);

                    this.$router.replace({
                        name: 'postsList',
                        params: { message: response.data.success}
                    })
                } catch (err) {
                    this.error = err.response.data.error
                }
            }
        },
        mounted () {
            axios.get("posts/"+this.$route.params.postId).then(response => {
                this.post = response.data;
                this.text = response.data.text;
            })
        }
    }
</script>