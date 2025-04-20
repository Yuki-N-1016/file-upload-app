// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const app = express();
// const port = 3000;

// // ストレージ設定
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');  // ファイルの保存先
//     },
//     filename: (req, file, cb) => {
//         // ファイル名をタイムスタンプ + オリジナルの拡張子に変更
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// });

// // 複数ファイルをアップロードする設定
// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 10 * 1024 * 1024 }, // 10MBのファイルサイズ制限
// }).array('file', 10); // 'file' はフロントエンドの input name 属性と一致させる

// // アップロードフォームのルート
// app.get('/', (req, res) => {
//     res.send(`
//         <h1>Hello</h1>
//         <form action="/upload" method="POST" enctype="multipart/form-data">
//             <input type="file" name="file" multiple required>
//             <button type="submit">UP</button>
//         </form>
//     `);
// });

// // 複数ファイルを受け取る POST エンドポイント
// app.post('/upload', (req, res) => {
//     // アップロードされたファイルが存在しない場合のエラーチェック
//     if (!req.files) {
//         return res.status(400).send('ファイルがアップロードされていません');
//     }

//     // アップロードされたファイル情報を表示
//     const uploadedFiles = req.files.map(file => file.originalname).join(', ');
//     res.send(`✅ 以下のファイルがアップロードされました！: ${uploadedFiles}`);
// });

// // サーバー起動
// app.listen(port, () => {
//     console.log(`🚀サーバーが http://localhost:${port} で起動しました`);
// });

const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3000;

// ストレージ設定
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// フロントHTML
app.get('/', (req, res) => {
  res.send(`
    <h2>ファイルアップロード</h2>
    <form action="/upload" method="POST" enctype="multipart/form-data">
      <input type="file" name="file" multiple required />
      <button type="submit">アップロード</button>
    </form>
  `);
});

const fs = require('fs');

// uploads フォルダがなければ作成
const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// アップロード処理
app.post('/upload', upload.array('file', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('ファイルがアップロードされていません');
  }

  const filenames = req.files.map(file => file.originalname).join(', ');
  res.send(`✅ 以下のファイルがアップロードされました: ${filenames}`);
});

app.listen(port, () => {
  console.log(`🚀サーバーが http://localhost:${port} で起動しました`);
});
