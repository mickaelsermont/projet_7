<template>
    <div>
        <b-alert show fade variant="danger" v-if="error"> {{ error }}</b-alert>
        <!-- Create Item Form -->

        <b-card>
            <h4>Ajouter une publication</h4>
            <hr>
            <b-form @submit.prevent="createMedia" enctype="multipart/form-data">
                <!-- Image preview -->
                <div class="mb-3" id="preview">
                    <img v-if="imgPreview" :src="imgPreview" />
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
                <b-button class="float-right mt-2" type="submit" variant="outline-primary">Publier</b-button>
            </b-form>

        </b-card>
    </div>
</template>

<script>
    import axios from "axios"

    export default {
        data () {
            return {
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
            async createMedia() {
                const formData = new FormData();
                formData.append('file', this.file);
                formData.append('text', this.text);

                try {
                    let response = await axios.post("posts", formData);

                    this.$router.replace({
                        name: 'postsList',
                        params: { message: response.data.success}
                    })
                    
                } catch (err) {
                    this.error = err.response.data.error
                }
            }
        }
    }
</script>

<style lang="scss">
    input[type='file']{
        position: absolute;
        margin-top: 3px;
        margin-left: 3px;
        height: 1px;
        width: 1px;
        z-index: -5;
    }
    .custom-file-upload {
        border: 1px solid #ccc;
        border-radius: 3px;
        display: inline-block;
        text-align: center;
        width: 100%;
        padding: 8px 12px;
        cursor: pointer;
    }
    .custom-file-upload:hover {
        color: #007bff;
        border-color: #007bff;
        cursor: pointer;
    }
</style>