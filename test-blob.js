const { put } = require('@vercel/blob');

async function testUpload() {
  process.env.BLOB_READ_WRITE_TOKEN = 'vercel_blob_rw_qZ9DKTDpN31yhbCz_EzEGrOdKQedKLFet3JqW8xrZB44fua';
  process.env.BLOB_STORE_ID = 'store_qZ9DKTDpN31yhbCz';

  try {
    const buffer = Buffer.from('test file content');
    const blob = await put('test.txt', buffer, { access: 'public' });
    console.log('Upload success:', blob.url);
  } catch (error) {
    console.error('Upload failed:', error);
  }
}

testUpload();
