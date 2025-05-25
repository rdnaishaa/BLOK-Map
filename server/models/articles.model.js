const db = require("../config/pg.database");

exports.createArticle = async (article) => {
  try {
    const res = await db.query(
      `INSERT INTO articles (
        judulArtikel, kontenArtikel, image_url, restaurant_id, spot_id
      ) VALUES ($1, $2, $3, $4, $5) 
      RETURNING *`,
      [
        article.judulArtikel,
        article.kontenArtikel,
        article.image_url,
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
    `);
    return res.rows;
  } catch (error) {
    console.error("Error getting all articles:", error);
    throw error;
  }
};

exports.getRestaurantArticleById = async (id) => {
  try {
    const res = await db.query(
      `SELECT 
        a.id,
        a.judulartikel,
        a.kontenartikel,
        a.image_url,
        a.restaurant_id,
        r.namaRestaurant,
        r.lokasi,
        r.rating,
        r.price,
        r.informasirestaurant
      FROM articles a
      INNER JOIN restaurants r ON a.restaurant_id = r.id
      WHERE a.id = $1`,
      [id]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error getting article by ID:", error);
    throw error;
  }
}

exports.getSpotArticleById = async (id) => {
  try {
    const res = await db.query(
      `SELECT 
        a.id,
        a.judulartikel,
        a.kontenartikel,
        a.image_url,
        a.spot_id,
        s.namatempat,
        s.lokasi,
        s.rating,
        s.price
      FROM articles a
      LEFT JOIN spots s ON a.spot_id = s.id
      WHERE a.id = $1`,
      [id]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error getting article by ID:", error);
    throw error;
  }
}

exports.getAllRestaurantsArticles = async () => {
  try {
    const res = await db.query(`
      SELECT 
        a.id,
        a.judulArtikel,
        a.kontenArtikel,
        a.image_url,
        a.restaurant_id,
        r.namarestaurant,
        r.lokasi,
        kr.kategori
      FROM articles a
      INNER JOIN restaurants r ON a.restaurant_id = r.id
      LEFT JOIN kategori_restaurant kr ON r.kategorirestaurant_id = kr.id
      WHERE a.restaurant_id IS NOT NULL
    `);
    return res.rows;
  } catch (error) {
    console.error("Error getting all restaurant articles:", error);
    throw error;
  }
}

exports.getAllSpotsArticles = async () => {
  try {
    const res = await db.query(`
      SELECT 
        a.id,
        a.judulArtikel,
        a.kontenArtikel,
        a.image_url,
        a.spot_id,
        s.namatempat,
        s.lokasi,
        ks.kategori
      FROM articles a
      INNER JOIN spots s ON a.spot_id = s.id
      LEFT JOIN kategori_spot ks ON s.kategorispot_id = ks.id
      WHERE a.spot_id IS NOT NULL
    `);
    return res.rows;
  } catch (error) {
    console.error("Error getting all spot articles:", error);
    throw error;
  }
}

exports.updateArticleFields = async (id, fields) => {
  try {
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    // Dynamically build the query based on provided fields
    for (const [key, value] of Object.entries(fields)) {
      updateFields.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }

    values.push(id); 

    const query = `
      UPDATE articles
      SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *`;

    const res = await db.query(query, values);

    if (res.rows.length === 0) return null; 
    return res.rows[0]; 
  } catch (error) {
    console.error("Error updating article fields:", error);
    throw error;
  }
};

exports.updateImage = async (id, image) => {
  try {
    const uploadResponse = await db.cloudinary.uploader.upload(image.path);
    const imageUrl = uploadResponse.secure_url;

    const res = await db.query(
      `UPDATE articles SET
        image_url = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *`,
      [imageUrl, id]
    );

    if (res.rows.length === 0) return null;
    return res.rows[0];
  } catch (error) {
    console.error("Error updating image:", error);
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