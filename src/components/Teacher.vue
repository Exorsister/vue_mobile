<template>
  <div class="container">
    <!-- <div class="button-container">
      <button   @click="fetchRandomUserData" class="btn btn-primary">สุ่มเช็คชื่อ</button>

    </div> -->

    <div class="button-container">
      <button @click="Check" class="btn btn-success">สร้างห้องเพื่อเช็คชื่อ</button>
    </div>

    <div class="button-container">
      <button @click="ShowStudentData" class="btn btn-warning">แสดงรายชื่อทั้งหมด</button>
      <div v-if="studentData.length">
        <button @click="showAddForm = true" class="btn btn-success" style="margin-left: 500px;">เพิ่ม</button>
        <button @click="showAddForm = true" class="btn btn-success">ย้อนกลับ</button>
        <h2>รายการนักเรียน</h2>
        <table class="table table-striped table-bordered">
          <thead class="thead-dark">
            <tr>
              <th>รหัส</th>
              <th>ชื่อ</th>
              <th>Email</th>
              <th>Sec</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(student, index) in studentData" :key="index">
              <td>{{ student.id }}</td>
              <td>{{ student.name }}</td>
              <td>{{ student.email }}</td>
              <td>{{ student.section }}</td>
            </tr>
          </tbody>
        </table>
      </div>


    </div>

    <div v-if="checkinData.length" class="checkin-data">
      <h2>รายการการเช็คชื่อ</h2>
      <ul>
        <li v-for="(data, index) in checkinData" :key="index" class="checkin-item">
          <p><strong>StdID:</strong> {{userData.stdid }}</p>
          <p><strong>E-mail:</strong> {{userData.email }}</p>
          <p><strong>Name:</strong> {{userData.name }}</p>
          <!-- <p><strong>Class Date:</strong> {{ data.class_date }}</p>
          <p><strong>Room:</strong> {{ data.room }}</p>
          <p><strong>Subject:</strong> {{ data.subject }}</p> -->
        </li>
      </ul>
    </div>

    <div v-if="showAddForm" class="add-student-form">
  <h2>เพิ่มข้อมูลนักเรียน</h2>
  <input type="text" v-model="newStudent.id" placeholder="รหัสนักเรียน">
  <input type="text" v-model="newStudent.name" placeholder="ชื่อนักเรียน">
  <input type="email" v-model="newStudent.email" placeholder="อีเมล">
  <input type="text" v-model="newStudent.section" placeholder="Sec">
  <button @click="addStudent" class="btn btn-primary">บันทึก</button>
</div>
  </div>
</template>

<script>
import firebaseConfig from '@/../firebaseConfig';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { addDoc, serverTimestamp } from 'firebase/firestore';

firebaseConfig

export default {
  name: 'Teacher',
  data() {
    return {
      userData: null,
      checkinData: [],
      studentData: [], // เพิ่มตัวแปรนี้สำหรับเก็บข้อมูลนักเรียน
      showAddForm: false, // เพิ่มตัวแปรนี้
    newStudent: { // เพิ่มตัวแปรนี้เพื่อเก็บข้อมูลของนักเรียนที่ใหม่
      id: '',
      name: '',
      email: '',
      section: ''
    }
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
          stdID: this.students.id,
          class_date: serverTimestamp(),
          room: "SC6969",
          subject: "CP9999"
        };
        const docRef = await addDoc(collection(db, 'students'), collectorData);
        console.log('Document written with ID: ', docRef.id);
        this.collectorData = { id: docRef.id, ...collectorData };
      } catch (error) {
        console.error('Error creating new collector:', error);
      }
    },
    async CheckList() {
      try {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, 'students'));
        const documents = [];
        querySnapshot.forEach((doc) => {
          documents.push({ id: doc.id, ...doc.data() });
        });
        this.checkinData = documents;
      } catch (error) {
        console.error('Error fetching checkin data:', error);
      }
    },
    async ShowStudentData() {
      try {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, 'students'));
        const documents = [];
        querySnapshot.forEach((doc) => {
          documents.push({ id: doc.id, ...doc.data() });
        });
        this.studentData = documents;
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    },
    async addStudent() {
    try {
      const db = getFirestore();
      await addDoc(collection(db, 'students'), this.newStudent);
      console.log('Student added successfully!');
      // ล้างข้อมูลในฟอร์มหลังจากบันทึก
      this.newStudent = {
        id: '',
        name: '',
        email: '',
        section: ''
      };
      // ซ่อนฟอร์ม
      this.showAddForm = false;
      // โหลดข้อมูลนักเรียนใหม่
      this.fetchStudentData();
    } catch (error) {
      console.error('Error adding student:', error);
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

  /* CSS สำหรับตาราง */
  .table {
    width: 100%;
    max-width: 800px;
    margin: 20px auto;
    border-collapse: collapse;
  }

  .table th, .table td {
    padding: 10px;
    border: 1px solid #ddd;
    text-align: left;
  }

  .table th {
    background-color: #f2f2f2;
  }

  .table-striped tbody tr:nth-of-type(odd) {
    background-color: #f9f9f9;
  }

  /* CSS สำหรับปุ่ม */
  .btn-success {
    background-color: #28a745;
    border-color: #28a745;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
  }

  .btn-success:hover {
    background-color: #218838;
    border-color: #1e7e34;
  }

</style>