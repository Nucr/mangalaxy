// MongoDB bağlantısı için gerekli paketleri yüklemeniz gerekir: npm install mongodb
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017'; // Gerekirse burayı kendi bağlantı stringinle değiştir
const dbName = 'test'; // Kendi veritabanı adını gir

function generateSlug(title) {
  return title.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
}

async function addSlugsToManga() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('mangalar');
    const mangalar = await collection.find({ slug: { $exists: false } }).toArray();
    for (const manga of mangalar) {
      if (manga.title) {
        const slug = generateSlug(manga.title);
        await collection.updateOne({ _id: manga._id }, { $set: { slug } });
        console.log(`Slug eklendi: ${manga.title} -> ${slug}`);
      }
    }
    console.log('Slug ekleme işlemi tamamlandı.');
  } catch (err) {
    console.error('Hata:', err);
  } finally {
    await client.close();
  }
}

addSlugsToManga(); 