<template>
    <div>
        <header>
            
        </header>
        <div v-if="isSignIn">
            <h1 style="display: flex; justify-content: center; align-items: center; ">สวัสดี {{ userType }}: {{ user }}</h1>
            <br>
            <div id="content">
                <Student v-if="isStudent" />
                <Teacher v-else />
            </div>
            <br>
        </div>
        <div class="container">
                <div id="logout" style="display: flex; justify-content: center; align-items: center;" v-if="isSignIn">
                    <button @click="handleSignOut"  style="margin-left: 10px; border: 2px solid red; border-radius: 5px; padding: 5px 15px; background-color: red; color: white;">ออกจากระบบ</button>
                </div>
                
                <div id="GoogleSignin" v-else class="d-flex  align-items-center"
                style="display: flex; justify-content: center; align-items: center; height: 100vh; ">
                
                <img src="https://cdn.iconscout.com/icon/free/png-256/free-google-1772223-1507807.png" alt="รูปภาพ" width="50" height="50">
                    <h3 style="margin-left: 20px; ">Google Sign in</h3>
                    <button @click="handleSignIn" style="margin-left: 20px;  border: 2px solid #007bff; border-radius: 5px; padding: 5px 15px; background-color: #007bff; color: white;">เข้าสู่ระบบ</button>
                </div>
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

            localStorage.setItem('userRole', isAdmin.value ? 'admin' : 'student');
            localStorage.setItem('user', JSON.stringify(user.value));
            localStorage.setItem('isSignIn', JSON.stringify(isSignIn.value));
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
        localStorage.removeItem('userRole');
    }).catch((error) => {
        console.log(error)
    });
};

onMounted(() => {
    const savedUser = localStorage.getItem('user');
    const savedIsSignIn = localStorage.getItem('isSignIn');
    const savedUserRole = localStorage.getItem('userRole');

    if (savedUser && savedIsSignIn && savedUserRole) {
        user.value = JSON.parse(savedUser);
        isSignIn.value = JSON.parse(savedIsSignIn);
        isAdmin.value = savedUserRole === 'admin';
        isStudent.value = savedUserRole === 'student';
    }
});
</script>

<style scoped>
/* Add your scoped styles here */
</style>