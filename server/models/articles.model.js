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
        judulArtikel, kontenArtikel, image_url, restaurant_id, spot_id
      ) VALUES ($1, $2, $3, $4, $5) 
      RETURNING *`,
      [
        article.judulArtikel,
        article.kontenArtikel,
        imageUrl,
        article.restaurant_id || null,
        article.spot_id || null
      ]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error creating article:", error);
    throw error;
  }
};

exports.getAllArticles = async () => {
  try {
    const res = await db.query(`
      SELECT 
        a.*,
        r.namaRestaurant,
        s.namaTempat
      FROM articles a
      LEFT JOIN restaurants r ON a.restaurant_id = r.id
      LEFT JOIN spots s ON a.spot_id = s.id
      ORDER BY a.created_at DESC
    `);
    return res.rows;
  } catch (error) {
    console.error("Error getting all articles:", error);
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
        restaurant_id = $4,
        spot_id = $5,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *`,
      [
        articleData.judulArtikel,
        articleData.kontenArtikel,
        imageUrl,
        articleData.restaurant_id || null,
        articleData.spot_id || null,
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