
require('dotenv').config();

const mongoose = require('mongoose');
const Note = require('../src/models/note');

const pick = (r) =>
  (Array.isArray(r) ? r[0] : r).executionStats;

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Đảm bảo các chỉ mục trong Schema đã được tạo
    await Note.syncIndexes();

    // Truy vấn quét toàn bộ collection
    const scan = pick(
      await Note.find({ tags: 'docker' })
        .hint({ $natural: 1 })
        .explain('executionStats')
    );

    // Truy vấn sử dụng chỉ mục
    const idx = pick(
      await Note.find({ tags: 'docker' })
        .explain('executionStats')
    );

    console.table({
      'Quét toàn bộ': {
        docsExamined: scan.totalDocsExamined,
        returned: scan.nReturned,
        ms: scan.executionTimeMillis
      },

      'Dùng chỉ mục': {
        docsExamined: idx.totalDocsExamined,
        returned: idx.nReturned,
        ms: idx.executionTimeMillis
      }
    });

  } catch (err) {
    console.error('Lỗi đo hiệu quả chỉ mục:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
