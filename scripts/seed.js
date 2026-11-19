
require('dotenv').config();

const mongoose = require('mongoose');
const Note = require('../src/models/note');

const TAGS = [
  'cloud',
  'docker',
  'nosql',
  'security',
  'devops',
  'java',
  'web'
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Đã kết nối MongoDB Atlas');

    // Xóa dữ liệu seed cũ để tránh bị trùng
    await Note.deleteMany({ owner: 'seed' });

    // Tạo 2000 ghi chú
    const docs = Array.from({ length: 2000 }, (_, i) => ({
      title: `Ghi chú mẫu ${i + 1}`,
      content: 'Dữ liệu thử nghiệm',
      tags: [
        TAGS[i % 7],
        TAGS[(i * 3) % 7]
      ],
      owner: 'seed'
    }));

    await Note.insertMany(docs);

    console.log(`Đã chèn ${docs.length} ghi chú`);
  } catch (err) {
    console.error('Lỗi:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
