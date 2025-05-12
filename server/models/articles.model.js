const db = require("../config/pg.database");

exports.createArticle = async (article, image) => {
  try {
    let imageUrl = null;
    if (image) {
      const uploadResponse = await db.cloudinary.uploader.upload(image.path);
      imageUrl = uploadResponse.secure_url;
    }

    const res = await db.query(
      `INSERT INTO articles (
        judulArtikel, kontenArtikel, places_id, image_url
      ) VALUES ($1, $2, $3, $4) 
      RETURNING *`,
      [
        article.judulArtikel,
        article.kontenArtikel,
        article.places_id,
        imageUrl
      ]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error creating article:", error);
    throw error;
  }
};

exports.getAllArticles = async (query) => {
  try {
    const res = await db.query("SELECT * FROM articles ORDER BY created_at DESC");
    return res.rows;
  } catch (error) {
    console.error("Error getting all articles:", error);
    throw error;
  }
};

exports.getArticleByKategori = async (kategori) => {
  try {
    const res = await db.query(
      `SELECT a.* FROM articles a
       JOIN kategori k ON a.kategori_id = k.id
       WHERE k.nama_kategori = $1
       ORDER BY a.created_at DESC`,
      [kategori]
    );
    return res.rows;
  } catch (error) {
    console.error("Error getting articles by category name:", error);
    throw error;
  }
};

exports.updateArticle = async (id, articleData, image) => {
  try {
    let imageUrl = articleData.image_url;
    if (image) {
      const uploadResponse = await db.cloudinary.uploader.upload(image.path);
      imageUrl = uploadResponse.secure_url;
    }

    const res = await db.query(
      `UPDATE articles SET
        judulArtikel = $1,
        kontenArtikel = $2,
        image_url = $3,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *`,
      [
        articleData.judulArtikel,
        articleData.kontenArtikel,
        imageUrl,
        id
      ]
    );

    if (res.rows.length === 0) return null;
    return res.rows[0];
  } catch (error) {
    console.error("Error updating article:", error);
    throw error;
  }
};

exports.deleteArticle = async (id) => {
  try {
    const res = await db.query(
      "DELETE FROM articles WHERE id = $1 RETURNING *",
      [id]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error deleting article:", error);
    throw error;
  }
};