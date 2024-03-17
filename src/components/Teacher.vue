<template>
  <div class="container">
    <div class="button-container">
      <button @click="fetchRandomUserData" class="btn btn-primary">สุ่มเช็คชื่อ</button>
    </div>

    <div v-if="userData" class="user-data">
      <p><strong>ID:</strong> {{ userData.stdID }}</p>
      <p><strong>Email:</strong> {{ userData.email }}</p>
      <p><strong>Name:</strong> {{ userData.name }}</p>
      <button @click="Check" class="btn btn-success">เช็คชื่อ</button>
    </div>

    <div class="button-container">
      <button @click="CheckList" class="btn btn-warning">แสดงรายการการเช็คชื่อ</button>
    </div>

    <div v-if="checkinData.length" class="checkin-data">
      <h2>รายการการเช็คชื่อ</h2>
      <ul>
        <li v-for="(data, index) in checkinData" :key="index" class="checkin-item">
          <p><strong>StdID:</strong> {{ data.stdID }}</p>
          <p><strong>Class Date:</strong> {{ data.class_date }}</p>
          <p><strong>Room:</strong> {{ data.room }}</p>
          <p><strong>Subject:</strong> {{ data.subject }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import firebaseConfig from '@/../firebaseConfig';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { addDoc, serverTimestamp } from 'firebase/firestore';

firebaseConfig

export default {
  name: 'HelloWorld',
  data() {
    return {
      userData: null,
      checkinData: [],
    }
  },
  methods: {
    async fetchRandomUserData() {
      try {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, 'students'));
        const documents = [];
        querySnapshot.forEach((doc) => {
          documents.push({ id: doc.id, stdID: doc.data().stdID, email: doc.data().email, name: doc.data().name });
        });
        const randomIndex = Math.floor(Math.random() * documents.length);
        this.userData = documents[randomIndex];
      } catch (error) {
        console.error('Error fetching random user data:', error);
      }
    },
    async Check() {
      try {
        if (!this.userData || !this.userData.stdID) {
          console.error('stdID is not defined');
          return;
        }
        const db = getFirestore();
        const collectorData = {
          stdID: this.userData.stdID,
          class_date: serverTimestamp(),
          room: "SC6969",
          subject: "CP9999"
        };
        const docRef = await addDoc(collection(db, 'checkin'), collectorData);
        console.log('Document written with ID: ', docRef.id);
        this.collectorData = { id: docRef.id, ...collectorData };
      } catch (error) {
        console.error('Error creating new collector:', error);
      }
    },
    async CheckList() {
      try {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, 'checkin'));
        const documents = [];
        querySnapshot.forEach((doc) => {
          documents.push({ id: doc.id, ...doc.data() });
        });
        this.checkinData = documents;
      } catch (error) {
        console.error('Error fetching checkin data:', error);
      }
    }
  }
}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.button-container {
  margin-bottom: 10px;
}

.btn {
  border: 2px solid transparent;
  border-radius: 5px;
  padding: 8px 20px;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-success {
  background-color: #45B39D;
  color: white;
}

.btn-success:hover {
  background-color: #2e856e;
}

.btn-warning {
  background-color: #FFC300;
  color: black;
}

.btn-warning:hover {
  background-color: #cc9a00;
}

.user-data {
  text-align: center;
  margin-bottom: 20px;
}

.checkin-data {
  width: 70%;
}

.checkin-item {
  background-color: #f7f7f7;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
}

.checkin-item p {
  margin: 5px 0;
}
</style>
