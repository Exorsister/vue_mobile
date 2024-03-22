<template>
    <div class="container">
  
      <div class="add-room-form">
        <h2>สร้างเลขห้องใหม่</h2>
        <button @click="generateRoomNumber" class="btn btn-success">สุ่มเลขห้อง</button>
        <input type="text" v-model="newRoomNumber" placeholder="เลขห้องใหม่ (4 หลัก)" :disabled="isGenerated">
        <button @click="confirmCreateRoom" class="btn btn-primary" :disabled="!newRoomNumber">ยืนยัน</button>
      </div>
  
  
      <button @click="showAllRooms" class="btn btn-primary">แสดงห้องทั้งหมด</button>
  
      <br>  
      <div v-if="showAllRoomsFlag">
        <h2>ตารางห้องทั้งหมด</h2>
        <table class="table table-striped table-bordered">
          <thead class="thead-dark">
            <tr>
              <th>ลำดับ</th>
              <th>เลขห้อง</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(room, index) in roomData" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ room.roomnumber }}</td>
            </tr>
          </tbody>
        </table>
      </div>
  
      
    </div>
  </template>
  
  <script>
  import firebaseConfig from '@/../firebaseConfig';
  import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
  
  firebaseConfig
  
  export default {
    name: 'RoomName',
    data() {
      return {
        roomData: [],
        showAllRoomsFlag: false,
        newRoomNumber: '',
        isGenerated: false
      }
    },
    methods: {
      async fetchRoomData() {
        try {
          const db = getFirestore();
          const querySnapshot = await getDocs(collection(db, 'room'));
          const rooms = [];
          querySnapshot.forEach((doc) => {
            rooms.push({ id: doc.id, ...doc.data() });
          });
          this.roomData = rooms;
        } catch (error) {
          console.error('Error fetching room data:', error);
        }
      },
      showAllRooms() {
        this.showAllRoomsFlag = true;
      },
      generateRoomNumber() {
        const generatedNumber = Math.floor(1000 + Math.random() * 9000);
        this.newRoomNumber = generatedNumber.toString();
        this.isGenerated = true;
      },
      async confirmCreateRoom() {
        try {
          const db = getFirestore();
          const newRoom = {
            roomnumber: this.newRoomNumber
          };
          await addDoc(collection(db, 'room'), newRoom);
          console.log('Room added successfully!');
          this.newRoomNumber = '';
          this.isGenerated = false;
          this.fetchRoomData(); // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูลห้องอัพเดท
        } catch (error) {
          console.error('Error creating new room:', error);
        }
      }
    },
    mounted() {
      this.fetchRoomData();
    }
  }
  </script>
  
  <style>
  .container {
    margin-top: 20px;
  }
  
  .room-item {
    background-color: #f7f7f7;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
  }
  
  .room-item p {
    margin: 5px 0;
  }
  
  .add-room-form {
    margin-top: 20px;
  }
  
  .add-room-form button {
    margin-right: 10px;
  }
  </style>