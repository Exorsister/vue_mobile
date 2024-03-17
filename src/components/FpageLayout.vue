<template>
    <div>
        <header>
            <div class="container">
                <div id="logout" v-if="isSignIn">
                    <button @click="handleSignOut">ออกจากระบบ</button>
                </div>
                <div id="GoogleSignin" v-else>
                    <h3>Google Signin</h3>
                    <button @click="handleSignIn">เข้าสู่ระบบ</button>
                </div>
            </div>
        </header>
        <div v-if="isSignIn">
            <h1>สวัสดี{{ userType }}: {{ user }}</h1>
            <br>
            <div id="content">
                <Student v-if="isStudent" />
                <Teacher v-else />
            </div>
            <br>
        </div>
    </div>
</template>

<script setup>
import Teacher from './Teacher.vue';
import Student from './Student.vue';
import { ref, onMounted } from 'vue';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

const auth = getAuth();
const provider = new GoogleAuthProvider();
const user = ref('');
const isSignIn = ref(false);
const isAdmin = ref(false);
const isStudent = ref(false);

const handleSignIn = () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            const userEmail = result.user.email;
            user.value = result.user.displayName;
            isSignIn.value = true;

            // Check if the user is a student
            if (userEmail.endsWith('@kkumail.com')) {
                isStudent.value = true;
            } else {
                isStudent.value = false;
            }

            // Check if the user is a teacher
            if (userEmail.endsWith('@kku.ac.th') || userEmail.endsWith('@gmail.com')) {
                isAdmin.value = true;
            } else {
                isAdmin.value = false;
            }

            localStorage.setItem('user', JSON.stringify(user.value));
            localStorage.setItem('isSignIn', JSON.stringify(isSignIn.value));
            localStorage.setItem('isAdmin', JSON.stringify(isAdmin.value));
        }).catch((error) => {
            console.log(error)
        });
};

const handleSignOut = () => {
    signOut(auth).then(() => {
        user.value = '';
        isSignIn.value = false;
        isAdmin.value = false;
        isStudent.value = false;
        // Clear authentication status from browser storage
        localStorage.removeItem('user');
        localStorage.removeItem('isSignIn');
        localStorage.removeItem('isAdmin');
    }).catch((error) => {
        console.log(error)
    });
};

onMounted(() => {
    const savedUser = localStorage.getItem('user');
    const savedIsSignIn = localStorage.getItem('isSignIn');
    const savedIsAdmin = localStorage.getItem('isAdmin');

    if (savedUser && savedIsSignIn && savedIsAdmin) {
        user.value = JSON.parse(savedUser);
        isSignIn.value = JSON.parse(savedIsSignIn);
        isAdmin.value = JSON.parse(savedIsAdmin);
    }
});
</script>

<style scoped>
/* Add your scoped styles here */
</style>